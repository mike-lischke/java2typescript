/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { Symbol, ClassSymbol, ScopedSymbol, SymbolTable, InterfaceSymbol, ParameterSymbol, Modifier } from "antlr4-c3";
import { ParseTree, ParseTreeWalker } from "antlr4ts/tree";

import {
    ClassDeclarationContext, CreatorContext, ExpressionContext, InterfaceDeclarationContext, MemberDeclarationContext,
    TypeTypeContext,
} from "../../java/generated/JavaParser";
import { ISymbolInfo } from "../../src/conversion/types";
import { PackageSource } from "../../src/PackageSource";
import { JavaClassSymbol } from "../../src/parsing/JavaClassSymbol";
import { ConstructorSymbol, EnumSymbol, JavaParseTreeWalker } from "../../src/parsing/JavaParseTreeWalker";

export class JavaFileSymbolTable extends SymbolTable {

    private referencesResolved = false;

    public constructor(private tree: ParseTree, packageRoot: string, private importList: Set<PackageSource>) {
        super("fileSymbolTable", { allowDuplicateSymbols: true });

        ParseTreeWalker.DEFAULT.walk(new JavaParseTreeWalker(this, packageRoot, importList), this.tree);
    }

    /**
     * Converts a given symbol name to its fully qualified form, if it can be found.
     *
     * @param context The parse context where to start the search from.
     * @param name The name of the symbol to find.
     *
     * @returns A string containing the constructed qualifier. If no symbol could be found then undefined is returned.
     */
    public getQualifiedSymbol = (context: ParseTree, name: string): ISymbolInfo | undefined => {
        this.resolveReferences();

        let block = this.symbolWithContextSync(context);
        if (!block) {
            // The given context is not one of the key contexts we used in the symbol table.
            // Walk the parent chain up to see if we can find an expression or member context and continue from there.
            while (true) {
                context = context.parent;
                if (!context || context instanceof ExpressionContext || context instanceof MemberDeclarationContext) {
                    break;
                }
            }

            if (!context) {
                return undefined;
            }

            block = this.symbolWithContextSync(context);
            if (!block) {
                return undefined;
            }
        }

        if (!(block instanceof ScopedSymbol)) {
            block = block.parent;
        }

        const symbol = block.parent.resolveSync(name, false);
        if (!symbol) {
            return undefined;
        }

        if (symbol instanceof ParameterSymbol || symbol instanceof ConstructorSymbol) {
            return {
                symbol,
                qualifiedName: name,
            };
        }

        // Is the symbol itself a class or interface?
        if (symbol instanceof ClassSymbol || symbol instanceof InterfaceSymbol) {
            // If so this is a nested type and we have to fully qualify it.
            return {
                symbol,
                qualifiedName: symbol.qualifiedName(),
            };
        } else if (symbol.parent instanceof ClassSymbol || symbol.parent instanceof InterfaceSymbol) {
            // Member of a class or interface.
            if (symbol.modifiers.has(Modifier.Static)) {
                return {
                    symbol,
                    qualifiedName: symbol.parent.name + "." + name,
                };

            } else {
                return {
                    symbol,
                    qualifiedName: "this." + name,
                };
            }
        }

        return {
            symbol,
            qualifiedName: name,
        };
    };

    /**
     * Called when inheritance information might be necessary.
     * Here we search inherited and implemented classes/interfaces and store references to their symbols.
     */
    public resolveReferences = (): void => {
        if (this.referencesResolved) {
            return;
        }

        this.referencesResolved = true;

        const classSymbols = this.getNestedSymbolsOfTypeSync(JavaClassSymbol);
        const interfaceSymbols = this.getNestedSymbolsOfTypeSync(InterfaceSymbol);

        if (this.importList.size > 0 && (classSymbols.length > 0 || interfaceSymbols.length > 0)) {
            this.resolveClassSymbols(classSymbols, this.importList);
            this.resolveInterfaceSymbols(interfaceSymbols, this.importList);
        }
    };

    private resolveClassSymbols = (symbols: JavaClassSymbol[], sources: Set<PackageSource>): void => {
        symbols.forEach((classSymbol) => {
            let candidate = classSymbol.context.parent.parent.parent;
            if (candidate instanceof CreatorContext) {
                // Anonymous inner class. Have to walk up quite a bit to get the base class name.
                const type = candidate.createdName().identifier(0).text;
                this.resolveTypeName(type, sources, (symbol: Symbol) => {
                    if (symbol instanceof ClassSymbol) {
                        classSymbol.extends.push(symbol);
                    }
                });
            } else {
                if (classSymbol.context instanceof ClassDeclarationContext) {
                    candidate = classSymbol.context;
                } else {
                    candidate = classSymbol.context.parent.parent;
                }

                if (candidate instanceof ClassDeclarationContext) {
                    if (candidate.typeType()) {
                        this.resolveType(candidate.typeType(), sources, (symbol: Symbol) => {
                            if (symbol instanceof ClassSymbol) {
                                classSymbol.extends.push(symbol);
                            }
                        });
                    }

                    if (candidate.IMPLEMENTS()) {
                        // Interfaces to implement.
                        candidate.typeList(0).typeType().forEach((typeContext) => {
                            this.resolveType(typeContext, sources, (symbol: Symbol) => {
                                if (symbol instanceof ClassSymbol || symbol instanceof InterfaceSymbol) {
                                    classSymbol.implements.push(symbol);
                                }
                            });
                        });
                    }
                }
            }
        });
    };

    private resolveInterfaceSymbols = (symbols: InterfaceSymbol[], sources: Set<PackageSource>): void => {
        symbols.forEach((interfaceSymbol) => {
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
    };

    private resolveType = (context: TypeTypeContext, sources: Set<PackageSource>,
        add: (symbol: Symbol) => void): void => {
        if (context.classOrInterfaceType()) {
            // Ignoring type parameters here for now.
            const parts = context.classOrInterfaceType().identifier().map((node) => {
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

    private resolveTypeName = (name: string, sources: Set<PackageSource>, add: (symbol: Symbol) => void): void => {
        for (const source of sources) {
            const info = source.resolveType(name);
            if (info?.symbol instanceof ClassSymbol || info?.symbol instanceof InterfaceSymbol
                || info?.symbol instanceof EnumSymbol) {
                add(info.symbol);

                return;
            }
        }
    };
}
