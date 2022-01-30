/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { Symbol, ClassSymbol, ScopedSymbol, SymbolTable, InterfaceSymbol, ParameterSymbol, Modifier } from "antlr4-c3";
import { ParseTree, ParseTreeWalker } from "antlr4ts/tree";

import {
    ClassDeclarationContext, CreatorContext, InterfaceDeclarationContext, TypeTypeContext,
} from "../../java/generated/JavaParser";
import { PackageSource } from "../../src/PackageSource";
import { ImportSymbol } from "../../src/parsing/ImportSymbol";
import { JavaClassSymbol } from "../../src/parsing/JavaClassSymbol";
import { EnumSymbol, JavaParseTreeWalker } from "../../src/parsing/JavaParseTreeWalker";

export class JavaFileSymbolTable extends SymbolTable {

    private referencesResolved = false;

    public constructor(private packageId: string, private tree: ParseTree, packageRoot: string) {
        super("fileSymbolTable", { allowDuplicateSymbols: true });

        ParseTreeWalker.DEFAULT.walk(new JavaParseTreeWalker(this, packageRoot), this.tree);

    }

    /**
     * Determines a TS qualifier needed for the symbol with the given name. This can be `this` or a qualified
     * identifier for static field members etc.
     *
     * @param context The parse context where to start the search from.
     * @param name The name of the symbol to find.
     *
     * @returns A string containing the constructed qualifier. If no symbol could be found then undefined is returned.
     */
    public getSymbolQualifier = (context: ParseTree, name: string): string | undefined => {
        if (!this.referencesResolved) {
            this.resolveReferences();
        }

        let block = this.symbolWithContextSync(context);

        if (!block) {
            return undefined;
        }

        if (!(block instanceof ScopedSymbol)) {
            block = block.parent;
        }

        const symbol = block.parent.resolveSync(name, false);
        if (!symbol) {
            return undefined;
        }

        if (symbol instanceof ParameterSymbol) {
            return "";
        }

        if (symbol.parent instanceof ClassSymbol || symbol.parent instanceof InterfaceSymbol) {
            // Member of a class or interface.
            if (symbol.modifiers.has(Modifier.Static)) {
                return symbol.parent.name + ".";
            } else {
                return "this.";
            }
        }

        return "";
    };

    /**
     * Called after the symbol table content was built, which also loads imported packages.
     * Now class + interface references can be resolved.
     */
    private resolveReferences = (): void => {
        this.referencesResolved = true;

        const classSymbols = this.getNestedSymbolsOfTypeSync(JavaClassSymbol);
        const interfaceSymbols = this.getNestedSymbolsOfTypeSync(InterfaceSymbol);
        const importSymbols = this.getNestedSymbolsOfTypeSync(ImportSymbol);

        if (importSymbols.length > 0 && (classSymbols.length > 0 || interfaceSymbols.length > 0)) {
            const sources: Set<PackageSource> = new Set();
            importSymbols.forEach((symbol) => {
                symbol.importedSources.forEach((source) => {
                    sources.add(source);
                });
            });

            if (sources.size > 0) {
                this.resolveClassSymbols(classSymbols, sources);
                this.resolveInterfaceSymbols(interfaceSymbols, sources);
            }
        }
    };

    private resolveClassSymbols = (symbols: JavaClassSymbol[], sources: Set<PackageSource>): void => {
        symbols.forEach((classSymbol) => {
            let candidate = classSymbol.context.parent.parent.parent;
            if (candidate instanceof CreatorContext) {
                // Anonymous inner class. Have to walk up quite a bit to get the base class name.
                const type = candidate.createdName().IDENTIFIER(0).text;
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

                    if (candidate.typeList()) {
                        // Interfaces to implement.
                        candidate.typeList().typeType().forEach((typeContext) => {
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
