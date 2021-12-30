/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import fs from "fs";
import path from "path";

import { CharStream, CharStreams, CommonTokenStream } from "antlr4ts";
import { ParseTree } from "antlr4ts/tree";

import { Symbol } from "antlr4-c3";

import { JavaSymbolTable } from "./parsing/JavaSymbolTable";
import { JavaErrorListener } from "./parsing/JavaErrorListener";

import { JavaLexer } from "../java/generated/JavaLexer";
import { CompilationUnitContext, JavaParser } from "../java/generated/JavaParser";

export interface ISymbolInfo {
    symbol: Symbol;
    qualifiedName: string;
}

// This interface keeps all concerned parsing parts together, to ensure they stay alive during the entire
// processing time. Symbol tables and parse trees depend on that.
export interface IFileParseInfo {
    content: string;
    inputStream: CharStream;
    lexer: JavaLexer;
    tokenStream: CommonTokenStream;
    parser: JavaParser;
    tree: CompilationUnitContext;
}

// This is the hook for the application to provide custom package sources for symbol resolution.
export type CustomImportResolver = (packageId: string) => PackageSource[];

// A class to provide symbol information for a single package or source file. It allows to convert
// Java imports to JS/TS imports and to expand partial type specifiers to their fully qualified name.
export class PackageSource {
    public static customImportResolver: CustomImportResolver;
    public static sourceMappings?: Map<string, string>;

    // The list of loaded package/file sources.
    private static sources = new Map<string, PackageSource>();

    private static knownPackages = new Set<string>([
        "java.io",
        "java.lang.refs",
        "java.math",
        "java.text",
        "java.time.format",
        "java.time",
        "java.util.regex",
        "java.utils",
    ]);

    // Only set if a file was parsed.
    public fileParseInfo?: IFileParseInfo;

    // Available symbols from the associated file or package.
    public symbolTable?: JavaSymbolTable;

    // The name of a node module or a file name from which to import symbols.
    protected source = "";

    // A list of symbol names, which have been resolved at least once, which means they are imported into the
    // file being converted. Hence those names comprise the TS import list.
    protected importList = new Set<string>();

    /**
     * Creates a new instance for the given Java package ID. The package ID may end in wild card, which causes
     * all symbols to be loaded from the package. Otherwise only the specified type is loaded and all others are
     * ignore (and are hence not available for symbol resolution).
     *
     * @param packageName The name of a node module or file.
     */
    private constructor(public readonly packageName: string) {
        PackageSource.sources.set(packageName, this);
    }

    /**
     * Looks up a package source in the internal registry, loaded from the given absolute path.
     * If it does not exist yet, a new package source instance is created from the specified file.
     *
     * @param fullPath The absolute path to a Java file, which will be parsed.
     * @param packageRoot The path to the root of the package where the given file is in. Used to resolve
     *                    relative file paths for imports.
     *
     * @returns A package source instance. An error is thrown if the source could not be read.
     */
    public static fromFile = (fullPath: string, packageRoot: string): PackageSource => {
        // Construct a package name for lookup from the given paths.
        if (!fullPath.startsWith(packageRoot)) {
            throw new Error("The full path must specify a file within the given package root.");
        }

        if (!fullPath.endsWith(".java")) {
            throw new Error("Only Java files can be processed.");
        }

        const subPath = fullPath.substring(packageRoot.length, fullPath.length - ".java".length);
        const lastPart = path.basename(subPath);
        const packageId = subPath.replace(/\//g, ".") + lastPart;

        const source = PackageSource.findSource(packageId);
        if (source) {
            // Already loaded.
            return source;
        }

        const content = fs.readFileSync(fullPath, "utf-8");
        const inputStream = CharStreams.fromString(content);
        const lexer = new JavaLexer(inputStream);
        const tokenStream = new CommonTokenStream(lexer);
        const parser = new JavaParser(tokenStream);

        const listener = new JavaErrorListener();
        parser.addErrorListener(listener);

        const tree = parser.compilationUnit();

        if (listener.errors.length === 0) {
            const info: IFileParseInfo = {
                content,
                inputStream,
                lexer,
                tokenStream,
                parser,
                tree,
            };


            const source = new PackageSource(packageId);
            source.source = fullPath;
            source.fileParseInfo = info;
            source.symbolTable = new JavaSymbolTable(tree, packageRoot);

            return source;

        } else {
            throw new Error("Parsing failed for " + fullPath);
        }
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

        if (fullImport) {
            // Get all files in the folder produced from the package root and the package ID and see if they are all
            // loaded already.
            const fullPath = path.join(packageRoot, packageId.replace(/\./g, "/"));
            if (!fs.existsSync(fullPath)) {
                return sources;
            }

            const dirEntries = fs.readdirSync(fullPath, "utf-8");
            dirEntries.forEach((entry) => {
                if (entry.endsWith(".java")) {
                    const entryPackageId = packageId + "." + entry.substring(0, entry.length - ".java".length);
                    const result = this.fromPackageId(entryPackageId, packageRoot, false);
                    sources.push(...result);
                }
            });

            return sources;
        }

        let source = PackageSource.findSource(packageId);
        if (source) {
            return [source];
        }

        // Is it a file from the current package?
        source = this.loadSourceFromId(packageId, packageRoot);
        if (source) {
            return [source];
        }

        // Check the source mappings for other source folders, outside of the package we are working on.
        if (PackageSource.sourceMappings) {
            for (const [id, path] of PackageSource.sourceMappings) {
                if (packageId.startsWith(id)) {
                    source = this.loadSourceFromId(packageId, path);
                    if (source) {
                        return [source];
                    }
                }
            }
        }

        // Cannot automatically resolve the package. Reach out to the import resolver.
        sources = PackageSource.customImportResolver(packageId);
        if (sources.length > 0) {
            return sources;
        }

        console.warn(`\nCannot find the source for package "${packageId}". Using an empty source instead.`);

        return [new PackageSource(packageId)];
    };

    /**
     * Searches all loaded resources to find a specific symbol by name.
     *
     * @param name The name to search for.
     *
     * @returns The fully qualified name if a symbol with the given name was found.
     */
    public static resolveType = (name: string): ISymbolInfo | undefined => {
        for (const [_, source] of PackageSource.sources) {
            const resolved = source.resolveType(name);
            if (resolved) {
                return resolved;
            }
        }

        return undefined;
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
        for (const [id, source] of PackageSource.sources) {
            if (packageId.startsWith(id)) {
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
    private static loadSourceFromId = (packageId: string, packageRoot: string): PackageSource | undefined => {
        let importName = packageId.replace(/\./g, "/");

        // Walk up the file system until we find a valid Java file.
        let fullPath = "";
        while (importName !== "/" && importName !== ".") {
            fullPath = path.join(packageRoot, importName) + ".java";
            if (fs.existsSync(fullPath)) {
                return PackageSource.fromFile(fullPath, packageRoot);
            }

            importName = path.dirname(importName);
        }

        return undefined;
    };

    /**
     * Constructs all import statements from the recorded symbols. Recording is done during symbol resolution.
     *
     * @param base The path to the file for which to generated the import statement.
     *
     * @returns A list of complete import statements.
     */
    public generateImportStatements = (base: string): string[] => {
        const result: string[] = [];

        if (this.importList.size > 0) {
            const names = Array.from(this.importList.values());
            let importPath = path.relative(path.dirname(base), path.dirname(this.source));
            if (importPath.length === 0 || importPath[0] !== ".") {
                importPath += "./" + importPath;
            }
            importPath += path.basename(this.source, ".java");

            result.push(`import { ${names.join(", ")} } from "${importPath}";`);
        }

        return result;
    };

    /**
     * Checks if the given name refers to a type that is known. For nested types (e.g. Class1.Class2.Interface1) it
     * is enough to only specify a part of the entire type chain and the method will return the full chain.
     * A partial specification allows to omit one or more leading type specifiers (e.g. using only Class2.Interface1 or
     * even just Interface1).
     *
     * If a type could be resolved then it's root type (e.g. Class1) is recorded for later import statement creation.
     *
     * @param name The (partial) type name to resolve.
     *
     * @returns The symbol for the given name, if found. Otherwise nothing is returned.
     */
    public resolveType = (name: string): ISymbolInfo | undefined => {
        // Locate the type with the name given by the last part, which is our deepest level.
        const parts = name.split(".");
        const symbols = this.symbolTable?.getAllNestedSymbolsSync(parts[parts.length - 1]) ?? [];
        if (symbols.length === 0) {
            return undefined;
        }

        const candidates = symbols.map((symbol) => {
            // There are 2 top level nodes (the symbol table itself and the file scope).
            const path = symbol.symbolPath;
            path.pop();
            path.pop();

            return path.reverse().map((pathSymbol) => {
                return pathSymbol.name;
            });
        });

        for (let index = 0; index < candidates.length; ++index) {
            const candidate = candidates[index];
            const qualifiedName = candidate.join(".");
            if (qualifiedName.endsWith(name)) {
                this.importList.add(candidate[0]);

                return {
                    symbol: symbols[index],
                    qualifiedName,
                };
            }
        }

        return undefined;
    };

    /**
     * Resolves a name to the associated member symbol represented in this package source.
     * Resolving a name to a symbol means to look up a symbol that can be referenced from a specific point in the
     * source. So we need a parse tree context as reference point.
     *
     * @param name The name of the symbol to find. Can be a qualified identifier.
     * @param context The context to start from.
     *
     * @returns The symbol when found, otherwise undefined.
     */
    public resolveMember = (name: string, context: ParseTree): Symbol | undefined => {
        const base = this.symbolTable?.symbolWithContextSync(context);
        if (!base) {
            return undefined;
        }

        return base.resolveSync(name);
    };

}
