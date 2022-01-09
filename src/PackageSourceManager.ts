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
    public static customImportResolver: CustomImportResolver;
    public static sourceMappings?: Map<string, string>;
    public static javaTargetRoot = "";

    // The list of imported sources. These do not have an associated file.
    private static importedSources = new Map<string, PackageSource>();

    // The list of loaded sources. These have concrete files attached.
    private static fileSources = new Map<string, JavaFileSource>();

    public static get localSources(): JavaFileSource[] {
        return [...this.fileSources.values()];
    }

    /**
     * Looks up a package source in the internal registry, loaded from the given absolute path.
     * If it does not exist yet, a new package source instance is created from the specified file.
     *
     * @param source The absolute path to a Java file, which will be parsed.
     * @param target The absolute path to the TS file, which will be generated. Can be empty if no target file is
     *               generated (usually the imports).
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

        return packageSource;
    };

    /**
     * Uses a package ID for look up of a package source. This can be a package ID as used by imports.
     * If the ID references a file from the current package (i.e. exists under the package root), the package
     * is loaded from that file.
     *
     * Alternatively, the package ID can name some of the Java SDK packages (see knownPackages).
     *
     * These will be mapped to polyfills, which wrap the TS equivalents, so that they can be consumed without changing
     * the converted code.
     *
     * @param packageId The ID of a package to load.
     * @param packageRoot The path to the root of the package where the files are located, which will be converted.
     * @param fullImport Set for wildcard imports. The package ID specifies a subfolder to load all files from.
     *
     * @returns A list of package source instances which match the given parameters.
     */
    public static fromPackageId = (packageId: string, packageRoot: string, fullImport: boolean): PackageSource[] => {
        let sources: PackageSource[] = [];

        if (packageId.startsWith("java.")) {
            // There's only one java package source.
            if (!this.importedSources.has("java")) {
                const source = new JavaPackageSource("java", this.javaTargetRoot);
                this.importedSources.set("java", source);
                sources.push(source);
            } else {
                sources.push(this.importedSources.get("java"));
            }

            return sources;
        }

        if (fullImport) {
            // Get all files in the folder produced from the package root and the package ID and see if they are all
            // loaded already.
            const fullPath = path.join(packageRoot, packageId.replace(/\./g, "/"));
            if (fs.existsSync(fullPath)) {
                const dirEntries = fs.readdirSync(fullPath, "utf-8");
                dirEntries.forEach((entry) => {
                    if (entry.endsWith(".java")) {
                        const entryPackageId = packageId + "." + entry.substring(0, entry.length - ".java".length);
                        const result = this.fromPackageId(entryPackageId, packageRoot, false);
                        sources.push(...result);
                    }
                });
            }

            return sources;
        }

        let source = this.findSource(packageId);
        if (source) {
            return [source];
        }

        // Is it a file from the current package?
        source = this.loadFileSourceFromId(packageId, packageRoot);
        if (source) {
            return [source];
        }

        // Check the source mappings for other source folders, outside of the package we are working on.
        if (this.sourceMappings) {
            for (const [id, path] of this.sourceMappings) {
                if (packageId.startsWith(id)) {
                    source = this.loadFileSourceFromId(packageId, path);
                    if (source) {
                        return [source];
                    }
                }
            }
        }

        // Cannot automatically resolve the package. Reach out to the import resolver.
        sources = this.customImportResolver(packageId);
        if (sources.length > 0) {
            return sources;
        }

        console.warn(`\nCannot find the source for package "${packageId}". Using an empty source instead.`);

        return [this.emptySource(packageId)];
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
            this.importedSources.set(packageId, source);
        }

        return source;
    };

    /**
     * Called after all files from a package are parsed. Now class + interface references can be resolved.
     *
     * @param packageRoot The root folder of the package we are loading.
     */
    public static resolveReferences = (packageRoot: string): void => {
        this.fileSources.forEach((source) => {
            source.resolveReferences(packageRoot);
        });
    };

    /**
     * Searches all imported sources to find a specific symbol by name.
     *
     * @param name The name to search for.
     *
     * @returns The fully qualified name if a symbol with the given name was found.
     */
    public static resolveImportedType = (name: string): ISymbolInfo | undefined => {
        for (const [_, source] of this.importedSources) {
            const resolved = source.resolveType(name);
            if (resolved) {
                return resolved;
            }
        }

        return undefined;
    };

    /**
     * Searches all sources loaded from files to find a specific symbol by name.
     *
     * @param name The name to search for.
     *
     * @returns The fully qualified name if a symbol with the given name was found.
     */
    public static resolveLocalType = (name: string): ISymbolInfo | undefined => {
        for (const [_, source] of this.fileSources) {
            const resolved = source.resolveType(name);
            if (resolved) {
                return resolved;
            }
        }

        return undefined;
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
            result.push(this.importedSources.get("java"));
        } else {
            prefix = prefix + ".";
            for (const [id, source] of this.importedSources) {
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
        const source = this.findFileSource(packageId);
        if (source) {
            return source;
        }

        for (const [id, source] of this.importedSources) {
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
     * @param packageRoot The source root path to use for searching.
     *
     * @returns A package source instance if a file could be loaded, otherwise undefined.
     */
    private static loadFileSourceFromId = (packageId: string, packageRoot: string): JavaFileSource | undefined => {
        let importName = packageId.replace(/\./g, "/");

        // Walk up the file system until we find a valid Java file.
        let fullPath = "";
        while (importName !== "/" && importName !== ".") {
            fullPath = path.join(packageRoot, importName) + ".java";
            if (fs.existsSync(fullPath)) {
                return this.fromFile(fullPath, "", packageRoot);
            }

            importName = path.dirname(importName);
        }

        return undefined;
    };

}
