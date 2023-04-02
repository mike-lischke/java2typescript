/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { JavaFileSource } from "./JavaFileSource.js";
import { JavaPackageSource } from "./JavaPackageSource.js";
import { PackageSource } from "./PackageSource.js";

/** This is the hook for the application to provide custom package sources for symbol resolution. */
export type CustomImportResolver = (packageId: string) => PackageSource | undefined;

/** A class to hold package sources for use by the conversion process. */
export class PackageSourceManager {
    // A mapper function which can return a package source for a package ID.
    // Such a package source is usually not loaded from a file, but contains a symbol table constructed by
    // other means (e.g. hard coded values).
    private static customImportResolver?: CustomImportResolver;

    // A special path holding the JDK polyfills.
    private static javaTargetRoot: string;

    // The list of all known package sources.
    private static sources = new Map<string, PackageSource>();

    public static configure = (javaTargetRoot?: string, customImportResolver?: CustomImportResolver): void => {
        this.customImportResolver = customImportResolver;
        this.javaTargetRoot = javaTargetRoot ?? "jree";

        // All JRE sources are always known.
        const source = new JavaPackageSource("java", "", this.javaTargetRoot);
        this.sources.set("java", source);
    };

    /**
     * Looks up a package source in the internal registry, loaded from the given absolute path.
     * If it doesn't exist yet, it's created from the specified file.
     *
     * @param source The absolute path to a Java file, which can be loaded and parse. This file must exist or an error
     *               is raised.
     * @param target The absolute path to the TS file, which will be generated. Can be empty if no target file is
     *               generated or may contain a reference to some other source like a node module.
     * @param packageRoot The path to the root of the package where the given file is in. Used to resolve
     *                    relative file paths for imports.
     * @param replacements Patterns for string replacements in the source file, before it is parsed.
     *
     * @returns A package source instance. An error is thrown if the source could not be read.
     */
    public static fromFile = (source: string, target: string, packageRoot: string,
        replacements?: Map<RegExp, string>): PackageSource => {
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

        let packageSource = this.findSource(packageId);
        if (packageSource) {
            return packageSource;
        }

        packageSource = new JavaFileSource(packageId, source, target, packageRoot, replacements);
        this.sources.set(packageId, packageSource);

        return packageSource;
    };

    /**
     * Uses a package ID for look up of a package source. This must be a complete package ID as used by imports.
     * Wildcard imports are handled in `fromPackageIdWildcard`.
     *
     * All packages should be created upfront before invoking any of the package lookup methods. Exceptions are
     * sources created from the custom import resolver.
     *
     * As a last resort an empty package source is created for IDs that are not know to the manager.
     *
     * @param packageId The ID of a package to load.
     *
     * @returns A package source instance which matches the given ID.
     */
    public static fromPackageId = (packageId: string): PackageSource => {
        // Has the given package already been loaded?
        const source = this.findSource(packageId);
        if (source) {
            return source;
        }

        // No package with that ID registered yet. Reach out to the import resolver.
        if (this.customImportResolver) {
            const source = this.customImportResolver(packageId);
            if (source) {
                this.sources.set(source.packageId, source);

                return source;
            }
        }

        console.warn(`\nCannot find the source for package "${packageId}". Using an empty source instead.`);

        return this.emptySource(packageId);

    };

    /**
     * Returns a list of package sources for all files in the given package.
     *
     * @param packageId The ID of a package to get all sources for.
     *
     * @returns A list of package source instances which match the given parameters.
     */
    public static fromPackageIdWildcard = (packageId: string): PackageSource[] => {
        const sources: PackageSource[] = [];
        this.sources.forEach((value, key) => {
            if (key.startsWith(packageId)) {
                const rest = key.substring(packageId.length);
                if (rest.lastIndexOf(".") === 0) {
                    sources.push(value);
                }
            }
        });

        return sources;
    };

    /**
     * Creates and registers an empty package source for the given ID. Such a source has no symbol table
     * and hence cannot contribute to symbol resolutions.
     * If there's already a package source (empty or not) for the given ID, that will be returned instead of
     * creating a new package source.
     *
     * @param packageId The package ID to use.
     *
     * @returns A package source for that ID.
     */
    public static emptySource = (packageId: string): PackageSource => {
        let source = this.findSource(packageId);
        if (!source) {
            source = new PackageSource(packageId, "", "");
            this.sources.set(packageId, source);
        }

        return source;
    };

    /**
     * Removes all imported symbols from all known package sources.
     * Used at each process run to remove imported symbols from a previous run.
     */
    public static clearImportedSymbols = (): void => {
        this.sources.forEach((source) => {
            source.clearImportedSymbols();
        });
    };

    /**
     * Takes a full package ID and returns a package source for it, if one exists.
     *
     * @param packageId The package ID as used in a Java import statement (no wildcard).
     *
     * @returns The found package source or undefined, if none could be found.
     */
    private static findSource = (packageId: string): PackageSource | undefined => {
        for (const [id, source] of this.sources) {
            if (packageId === id || packageId.startsWith(id + ".")) {
                return source;
            }
        }

        return undefined;
    };

}
