/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import path from "path";

import { ParseTree } from "antlr4ts/tree";

import { Symbol, SymbolTable } from "antlr4-c3";

import { Interval } from "antlr4ts/misc/Interval";
import { CompilationUnitContext } from "../java/generated/JavaParser";
import { ISymbolInfo } from "./PackageSourceManager";

// A class to provide symbol information for a single package or source file. It allows to convert
// Java imports to JS/TS imports and to expand partial type specifiers to their fully qualified name.
export class PackageSource {
    // Available symbols from the associated file or package.
    public symbolTable?: SymbolTable;

    // A list of symbol names, which have been resolved at least once, which means they are imported into the
    // file being converted. Hence those names comprise the TS import list.
    protected importList = new Set<string>();

    public constructor(public packageId: string, public sourceFile: string, public targetFile: string) {
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
    public printParseTreeForPosition = (position: { column: number; row: number }): void => {
        // Overridden by descendants.
    };

    public getSymbolQualifier = (_context: ParseTree, _name: string): string | undefined => {
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
     * Collects all imported names. Recording is done during symbol resolution.
     *
     * @param importingFile The absolute path to the file, for which to generate the import statements.
     *
     * @returns A tuple containing a list of imported names and the relative import path.
     */
    public getImportInfo = (importingFile: string): [string[], string] => {
        if (this.importList.size > 0) {
            const names = Array.from(this.importList.values());
            let importPath: string;
            if (this.targetFile.startsWith("/") || this.targetFile.startsWith(".")) {
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
                    source: this,
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

    protected textFromInterval = (_interval: Interval): string => {
        return "";
    };
}
