/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import fs from "fs";
import path from "path";

import { Symbol } from "antlr4-c3";

import { JavaFileSource } from "../lib/java/JavaFileSource";
import { PackageSource } from "./PackageSource";
import { JavaPackageSource } from "../lib/java/JavaPackageSource";
import { ISourceMapping } from "./conversion/JavaToTypeScript";

export interface ISymbolInfo {
    symbol: Symbol;
    qualifiedName: string;
    source: PackageSource;
}

// This is the hook for the application to provide custom package sources for symbol resolution.
export type CustomImportResolver = (packageId: string) => PackageSource[];

// A class to provide symbol information for a single package or source file. It allows to convert
// Java imports to JS/TS imports and to expand partial type specifiers to their fully qualified name.
export class PackageSourceManager {
    private static customImportResolver: CustomImportResolver;
    private static sourceMappings: Map<string, ISourceMapping>;
    private static javaTargetRoot: string;

    // The list of sources, loaded from files.
    private static fileSources = new Map<string, JavaFileSource>();

    // The list of sources generated from other references (like hard coded symbol tables).
    private static mappedSources = new Map<string, PackageSource>();

    public static configure = (
        customImportResolver: CustomImportResolver,
        sourceMappings: Map<string, ISourceMapping>,
        javaTargetRoot: string): void => {

        this.customImportResolver = customImportResolver;
        this.sourceMappings = sourceMappings;
        this.javaTargetRoot = javaTargetRoot;

        // java.lang is imported by default in Java.
        if (!sourceMappings.has("java.lang.*")) {
            const source = new JavaPackageSource("java", this.javaTargetRoot);
            this.mappedSources.set("java", source);
        }
    };

    /**
     * Looks up a package source in the internal registry, loaded from the given absolute path.
     * If it doesn't exist yet create it from the specified file.
     *
     * @param source The absolute path to a Java file, which will be parsed.
     * @param target The absolute path to the TS file, which will be generated. Can be empty if no target file is
     *               generated or contain a reference to some other source.
     * @param packageRoot The path to the root of the package where the given file is in. Used to resolve
     *                    relative file paths for imports.
     *
     * @returns A package source instance. An error is thrown if the source could not be read.
     */
    public static fromFile = (source: string, target: string, packageRoot: string): JavaFileSource => {
        // Construct a package name for lookup from the given paths.
        if (!source.startsWith(packageRoot)) {
            throw new Error("The full path must specify a file within the given package root.");
        }

        if (!source.endsWith(".java")) {
            throw new Error("Only Java files can be processed.");
        }

        let subPath = source.substring(packageRoot.length, source.length - ".java".length);
        if (subPath.length > 0 && subPath[0] === "/") {
            subPath = subPath.substring(1);
        }
        const packageId = subPath.replace(/\//g, ".");

        let packageSource = this.findFileSource(packageId);
        if (packageSource) {
            // Already loaded.
            return packageSource;
        }

        packageSource = new JavaFileSource(packageId, source, target, packageRoot);
        this.fileSources.set(packageId, packageSource);

        // Touch the parse tree of the new source to make it run the parser.
        void packageSource.parseTree;

        return packageSource;
    };

    /**
     * Uses a package ID for look up of a package source. This can be a package ID as used by imports.
     * If the ID references a file from the current package (i.e. exists under the package root), the package
     * is loaded from that file.
     *
     * Alternatively, the mapping from package IDs to source folders is scanned to find files outside of the
     * package root. Also these are loaded from the found files.
     *
     * If these two steps do not lead to a valid file on disk, the import resolver is consulted to provide a
     * custom package source. This source must be provided from outside and may contain a symbol table
     * with symbols from any origin (hard coded, loaded from data file etc.), to allow resolving symbols.
     * Such an external source can provide symbols for more than a single file, while usually each file gets an
     * individual package source instance. The typical use case is 3rd party node modules, which provide an
     * alternative implementation for specific Java code.
     *
     * If also that did not lead to a package source then a generic source is created, without a symbol table, and
     * a warning is printed, helping so the user to find packages that still need valid package sources.
     *
     * @param packageId The ID of a package to load.
     * @param packageRoot The path to the root of the package where the files are located, which will be converted.
     * @param fullImport Set for wildcard imports. The package ID specifies a subfolder to load all files from.
     *
     * @returns A list of package source instances which match the given parameters.
     */
    public static fromPackageId = (packageId: string, packageRoot: string, fullImport: boolean): PackageSource[] => {
        const parts = packageId.split(".");
        if (parts.length < 2) {
            return [];
        }

        // Has the given package already been loaded?
        let source = this.findSource(packageId);
        if (source) {
            return [source];
        }

        let actualRoot = packageRoot;
        let target = "";

        // Check the source mappings for source overrides or folders outside of the current package.
        for (const [id, { sourcePath, importPath }] of this.sourceMappings) {
            const mappingParts = id.split(".");
            if (this.packageIdMatches(parts, mappingParts)) {
                actualRoot = sourcePath;
                target = importPath;
                break;
            }
        }

        if (fullImport) {
            // Get all files in the folder produced from the package root and the package ID and see if they are all
            // loaded already.
            const fullPath = path.join(actualRoot, ...parts);
            if (fs.existsSync(fullPath)) {
                const sources: PackageSource[] = [];
                const dirEntries = fs.readdirSync(fullPath, "utf-8");
                dirEntries.forEach((entry) => {
                    if (entry.endsWith(".java")) {
                        const entryPackageId = packageId + "." + entry.substring(0, entry.length - ".java".length);
                        const result = this.fromPackageId(entryPackageId, actualRoot, false);
                        sources.push(...result);
                    }
                });

                return sources;
            }

            console.warn(`\nThe path "${fullPath}" does not exist. Using an empty source instead.`);

            return [this.emptySource(packageId)];
        } else {
            // Is it a package loaded from a file?
            source = this.loadFileSourceFromId(packageId, target, actualRoot);
            if (source) {
                return [source];
            }

            // Cannot automatically resolve the package. Reach out to the import resolver.
            if (this.customImportResolver) {
                const sources = this.customImportResolver(packageId);
                if (sources.length > 0) {
                    sources.forEach((source) => {
                        this.mappedSources.set(source.packageId, source);
                    });

                    return sources;
                }
            }

            console.warn(`\nCannot find the source for package "${packageId}". Using an empty source instead.`);

            return [this.emptySource(packageId)];
        }
    };

    /**
     * Searches for an existing package with the given ID. If found that source is returned. Otherwise
     * a new empty source is created and returned.
     *
     * @param packageId The package ID to search for.
     *
     * @returns A package source for that ID.
     */
    public static emptySource = (packageId: string): PackageSource => {
        let source = this.findSource(packageId);
        if (!source) {
            source = new PackageSource(packageId, "", "");
            this.mappedSources.set(packageId, source);
        }

        return source;
    };

    /**
     * Collects all package source that match the given package prefix.
     *
     * @param prefix The prefix to match. Must not end in a dot, as a dot is automatically appended.
     *
     * @returns The list of found sources.
     */
    public static sourcesMatching = (prefix: string): PackageSource[] => {
        const result: PackageSource[] = [];

        result.push(...this.localSourcesMatching(prefix));

        if (prefix.startsWith("java.")) {
            result.push(this.mappedSources.get("java"));
        } else {
            prefix = prefix + ".";
            for (const [id, source] of this.mappedSources) {
                if (id.startsWith(prefix)) {
                    result.push(source);
                }
            }
        }

        return result;
    };

    /**
     * Collects all package source loaded from a file that match the given package prefix.
     *
     * @param prefix The prefix to match. Must not end in a dot, as a dot is automatically appended.
     *
     * @returns The list of found sources.
     */
    public static localSourcesMatching = (prefix: string): PackageSource[] => {
        const result: PackageSource[] = [];

        prefix = prefix + ".";
        for (const [id, source] of this.fileSources) {
            if (id.startsWith(prefix)) {
                result.push(source);
            }
        }

        return result;
    };

    /**
     * Takes a package ID (optionally including type references but never a wildcard) and returns a symbol source for
     * it, if one was already loaded.
     *
     * @param packageId The package ID as used in a Java import statement.
     *
     * @returns The found symbol source or undefined, if none could be found.
     */
    private static findSource = (packageId: string): PackageSource | undefined => {
        // Handle Java imports separately.
        if (packageId.startsWith("java.")) {
            // There's only one java package source.
            return this.mappedSources.get("java");
        }

        const source = this.findFileSource(packageId);
        if (source) {
            return source;
        }

        for (const [id, source] of this.mappedSources) {
            if (packageId === id || packageId.startsWith(id + ".")) {
                return source;
            }
        }

        return undefined;
    };

    /**
     * Same as findSource, but only for file sources.
     *
     * @param packageId The package ID as used in a Java import statement.
     *
     * @returns The found symbol source or undefined, if none could be found.
     */
    private static findFileSource = (packageId: string): JavaFileSource | undefined => {
        for (const [id, source] of this.fileSources) {
            if (packageId === id || packageId.startsWith(id + ".")) {
                return source;
            }
        }

        return undefined;
    };

    /**
     * Tries to find a source file, given by the package ID, in the given path.
     *
     * @param packageId The package ID specifying the file to load.
     * @param targetFile The file from which types can be imported.
     * @param packageRoot The source root path to use for searching.
     *
     * @returns A package source instance if a file could be loaded, otherwise undefined.
     */
    private static loadFileSourceFromId = (packageId: string, targetFile: string,
        packageRoot: string): JavaFileSource | undefined => {
        let importName = packageId.replace(/\./g, "/");

        // Walk up the file system until we find a valid Java file.
        let fullPath = "";
        while (importName !== "/" && importName !== ".") {
            fullPath = path.join(packageRoot, importName) + ".java";
            if (fs.existsSync(fullPath)) {
                return this.fromFile(fullPath, targetFile, packageRoot);
            }

            importName = path.dirname(importName);
        }

        return undefined;
    };

    /**
     * Determines if the given id can be matched by the pattern, which may end with a wildcard.
     *
     * @param id The ID parts to check.
     * @param pattern The pattern parts to match against.
     *
     * @returns true if the id matches the pattern.
     */
    private static packageIdMatches = (id: string[], pattern: string[]): boolean => {
        // The ID can never be smaller than the pattern.
        if (id.length < pattern.length) {
            return false;
        }

        let index = 0;
        while (index < pattern.length) {
            if (pattern[index] !== id[index] && pattern[index] !== "*") {
                return false;
            }

            ++index;
        }

        return true;
    };
}
