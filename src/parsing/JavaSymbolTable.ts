/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { Symbol, ClassSymbol, ScopedSymbol, SymbolTable, InterfaceSymbol } from "antlr4-c3";
import { ParseTree, ParseTreeWalker } from "antlr4ts/tree";

import { ClassDeclarationContext, InterfaceDeclarationContext, TypeTypeContext } from "../../java/generated/JavaParser";
import { PackageSource } from "../PackageSource";
import { ImportSymbol } from "./ImportSymbol";
import { JavaClassSymbol } from "./JavaClassSymbol";
import { EnumSymbol, JavaParseTreeWalker } from "./JavaParseTreeWalker";

export class JavaSymbolTable extends SymbolTable {

    public constructor(private tree: ParseTree, packageRoot: string) {
        super("fileSymbolTable", { allowDuplicateSymbols: true });

        this.loadAndResolve(packageRoot);
    }

    /**
     * Determines a TS qualifier needed for the symbol with the given name. This can be `this` or a qualified
     * identifier for static field members etc.
     *
     * @param context The parse context where to start the search from.
     * @param name The name of the symbol to find.
     *
     * @returns A string containing the constructed qualifier (can be empty).
     */
    public getSymbolQualifier = (context: ParseTree, name: string): string => {
        let block = this.symbolWithContextSync(context);

        if (!block) {
            return "";
        }

        if (!(block instanceof ScopedSymbol)) {
            block = block.parent;
        }

        const symbol = block.resolveSync(name, false);
        if (!symbol) {
            return "";
        }

        if (symbol.parent instanceof ClassSymbol || symbol.parent instanceof InterfaceSymbol) {
            // Member of a class or interface. The constructed qualifier depends on whether this is from an
            // import or the local file.
            if (symbol.symbolTable === this) {
                return "this.";
            }

            const path = symbol.symbolPath.filter((symbol) => {
                return symbol instanceof ClassSymbol || symbol instanceof InterfaceSymbol
                    || symbol instanceof EnumSymbol;
            });

            return path.reverse().map((symbol) => {
                return symbol.name;
            }).join(".") + ".";
        }

        return "";
    };

    private loadAndResolve = (packageRoot: string): void => {
        // First step: collect all symbols in the given tree.
        ParseTreeWalker.DEFAULT.walk(new JavaParseTreeWalker(this, packageRoot), this.tree);

        // Second step: resolve class + interface references.
        const classSymbols = this.getNestedSymbolsOfTypeSync(JavaClassSymbol);
        const interfaceSymbols = this.getNestedSymbolsOfTypeSync(InterfaceSymbol);

        if (classSymbols.length > 0 || interfaceSymbols.length > 0) {
            const imports = this.getAllSymbolsSync(ImportSymbol, true);
            const sources: PackageSource[] = [];
            imports.forEach((symbol) => {
                sources.push(...PackageSource.fromPackageId(symbol.name, packageRoot, symbol.fullImport));
            });

            // Without imported packages there's nothing to resolve.
            if (sources.length > 0) {
                classSymbols.forEach((classSymbol) => {
                    const context = classSymbol.context as ClassDeclarationContext;
                    if (context.typeType()) {
                        this.resolveType(context.typeType(), sources, (symbol: Symbol) => {
                            if (symbol instanceof ClassSymbol) {
                                classSymbol.extends.push(symbol);
                            }
                        });
                    }

                    if (context.typeList()) {
                        // Interfaces to implement.
                        context.typeList().typeType().forEach((typeContext) => {
                            this.resolveType(typeContext, sources, (symbol: Symbol) => {
                                if (symbol instanceof ClassSymbol || symbol instanceof InterfaceSymbol) {
                                    classSymbol.implements.push(symbol);
                                }
                            });
                        });
                    }
                });

                interfaceSymbols.forEach((interfaceSymbol) => {
                    const context = interfaceSymbol.context as InterfaceDeclarationContext;
                    if (context.typeList()) {
                        // Interfaces or classes to extend.
                        context.typeList().typeType().forEach((typeContext) => {
                            this.resolveType(typeContext, sources, (symbol: Symbol) => {
                                if (symbol instanceof ClassSymbol || symbol instanceof InterfaceSymbol) {
                                    interfaceSymbol.extends.push(symbol);
                                }
                            });
                        });
                    }
                });
            }
        }
    };

    private resolveType = (context: TypeTypeContext, sources: PackageSource[], add: (symbol: Symbol) => void): void => {
        if (context.classOrInterfaceType()) {
            // Ignoring type parameters here for now.
            const parts = context.classOrInterfaceType().IDENTIFIER().map((node) => {
                return node.text;
            });
            const name = parts.join(".");

            for (const source of sources) {
                const info = source.resolveType(name);
                if (info?.symbol instanceof ClassSymbol || info?.symbol instanceof InterfaceSymbol
                    || info?.symbol instanceof EnumSymbol) {
                    add(info.symbol);

                    return;
                }
            }
        }
    };
}
