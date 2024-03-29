/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import path from "path";

import { ParseTree, Interval } from "antlr4ng";

import { BaseSymbol, ScopedSymbol, SymbolTable } from "antlr4-c3";

import { CompilationUnitContext } from "../parser/generated/JavaParser.js";
import { PackageSourceManager } from "./PackageSourceManager.js";
import { ISymbolInfo } from "./conversion/types.js";

/**
 * A class to provide symbol information for a single package or source file. It allows to convert
 * Java imports to JS/TS imports and to expand partial type specifiers to their fully qualified name.
 */
export class PackageSource {
    /** Available symbols from the associated file or package. */
    public symbolTable: SymbolTable;

    /** The set of sources imported by this source. Might contain unused imports. */
    public importList = new Set<PackageSource>();

    /**
     * A list of symbol names, which have been resolved at least once, which means they are imported into the
     * file being converted. Hence those names comprise the TS import list.
     */
    protected importedSymbols = new Set<string>();

    public constructor(public packageId: string, public sourceFile: string, public targetFile: string) {
        if (packageId !== "java") {
            // In Java only java.lang is implicitly imported, but we do that for all Java classes here.
            this.importList.add(PackageSourceManager.fromPackageId("java"));
        }

        this.symbolTable = this.createSymbolTable();
    }

    public get parseTree(): CompilationUnitContext | undefined {
        return undefined;
    }

    /**
     * A debug helper to print the parse tree for a given position. Only has an effect for Java file sources.
     *
     * @param position The character position in the file.
     * @param position.column The character column.
     * @param position.row The character row (one-based).
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public printParseTreeForPosition = (position: { column: number; row: number; }): void => {
        // Overridden by descendants.
    };

    public getQualifiedSymbol = (_context: ParseTree, _name: string): ISymbolInfo | undefined => {
        return undefined;
    };

    /**
     * Returns original text from the file input, if this source is a Java file source.
     *
     * @param interval The start and stop character indices.
     *
     * @returns The original text for file sources or an empty string for pure package sources.
     */
    public getText = (interval: Interval): string => {
        return this.textFromInterval(interval);
    };

    /**
     * Used to reset the recorded list of imported symbols. This has to be done for each processor run.
     */
    public clearImportedSymbols = (): void => {
        this.importedSymbols.clear();
    };

    /**
     * Adds the given symbol name to the internal import list, to have it included in the final import info,
     * without going through the entire resolution process. This is useful for symbols that are not part of Java,
     * but still imported with a specific package (helpers for example).
     *
     * @param name The name to add.
     */
    public addImportedSymbol = (name: string): void => {
        this.importedSymbols.add(name);
    };

    /**
     * Collects all imported names. Recording is done during symbol resolution.
     *
     * @param importingFile The absolute path to the file, for which to generate the import statements.
     *
     * @returns A tuple containing a list of imported names and the relative import path.
     */
    public getImportInfo = (importingFile: string): [string[], string] => {
        if (this.targetFile && this.importedSymbols.size > 0) {
            let names: string[];
            const override = this.importOverride;
            if (override) {
                names = [override];
            } else {
                names = Array.from(this.importedSymbols.values());
            }

            let importPath: string;
            if (this.targetFile.startsWith("/") || this.targetFile.startsWith("./")) {
                importPath = path.relative(path.dirname(importingFile), path.dirname(this.targetFile));
                importPath = path.join(importPath, path.basename(this.targetFile, ".ts"));

                if (importPath[0] !== ".") {
                    importPath = "./" + importPath;
                }
            } else {
                importPath = this.targetFile;
            }

            return [names, importPath];
        }

        return [[], ""];
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
        // Touch the parse tree, to trigger a parse run of this source, if not yet done.
        void this.parseTree;

        // Locate the type with the name given by the last part, which is our deepest level.
        const parts = name.split(".");
        const symbols = this.symbolTable?.getAllNestedSymbolsSync(parts[parts.length - 1]) ?? [];
        if (symbols.length === 0) {
            return undefined;
        }

        const candidates = symbols.map((symbol) => {
            const path = symbol.symbolPath;
            path.pop(); // Remove the symbol table entry.

            return path.reverse().map((pathSymbol) => {
                return pathSymbol.name;
            });
        });

        for (let index = 0; index < candidates.length; ++index) {
            const candidate = candidates[index];
            const qualifiedName = candidate.join(".");
            if (qualifiedName.endsWith(name)) {
                this.importedSymbols.add(candidate[0]);

                return {
                    symbol: symbols[index],
                    qualifiedName,
                    source: this,
                };
            }
        }

        return undefined;
    };

    /**
     * Finds an exported type given by name. If found the name is added to the import list of this source.
     *
     * @param name The name to resolve.
     *
     * @returns The symbol for the given name, if found.
     */
    public resolveAndImport = (name: string): BaseSymbol | undefined => {
        // Touch the parse tree, to trigger a parse run of this source, if not yet done.
        void this.parseTree;

        if (this.symbolTable) {
            const parts = name.split(".");

            let part = parts.shift();
            let parent: ScopedSymbol = this.symbolTable;
            while (part) {
                const symbol = parent.resolveSync(part, true); // Only look locally.
                if (parts.length === 0 && symbol) {
                    this.importedSymbols.add(symbol.name);

                    return symbol;
                }

                if (!symbol || !(symbol instanceof ScopedSymbol)) {
                    return undefined;
                }

                parent = symbol;
                part = parts.shift();
            }
        }

        return undefined;
    };

    protected textFromInterval = (_interval: Interval): string => {
        return "";
    };

    protected createSymbolTable(): SymbolTable {
        return new SymbolTable("default", {});
    }

    /**
     * Allows derived package sources to override the import statement generation.
     *
     * @returns The value to use for all symbols used from this source. This is usually the top level namespace,
     *          if given, and should be importable from the package's target path.
     */
    protected get importOverride(): string | undefined {
        return undefined;
    }
}
