/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import {
    Symbol, ClassSymbol, ScopedSymbol, SymbolTable, InterfaceSymbol, ParameterSymbol, Modifier, NamespaceSymbol,
} from "antlr4-c3";
import { ParseTree, ParseTreeWalker } from "antlr4ts/tree";

import {
    ClassDeclarationContext, CreatorContext, ExpressionContext, InterfaceDeclarationContext, TypeTypeContext,
} from "../../java/generated/JavaParser";
import { ISymbolInfo } from "../conversion/types";
import { PackageSource } from "../PackageSource";
import { JavaClassSymbol } from "../parsing/JavaClassSymbol";
import {
    ConstructorSymbol, EnumSymbol, JavaParseTreeWalker, PackageSymbol,
} from "../parsing/JavaParseTreeWalker";

export class JavaFileSymbolTable extends SymbolTable {

    private referencesResolved = false;

    public constructor(private source: PackageSource, packageRoot: string, private importList: Set<PackageSource>) {
        super("fileSymbolTable", { allowDuplicateSymbols: true });

        ParseTreeWalker.DEFAULT.walk(new JavaParseTreeWalker(this, packageRoot, importList), source.parseTree);
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
                if (!context || context instanceof ExpressionContext
                    || context instanceof ClassDeclarationContext
                ) {
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

        const symbol = context instanceof ClassDeclarationContext
            ? block.resolveSync(name, false)
            : block.parent.resolveSync(name, false);
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
            // Top level classes, classes in namespaces (usually imported classes) and static declarations
            // require a full qualifier.
            if (symbol.parent instanceof JavaFileSymbolTable || symbol.parent instanceof NamespaceSymbol
                || symbol.modifiers.has(Modifier.Static)) {
                const path = symbol.symbolPath;
                path.pop(); // Remove the symbol table entry.

                const qualifiedName = path.reverse().map((pathSymbol) => {
                    return pathSymbol.name;
                }).join(".");

                return {
                    symbol,
                    qualifiedName,
                };
            }

            // Otherwise this is a non-static nested type and we have to apply special qualifiers,
            // depending on certain conditions.
            // Non-static local class types either use `this` or the outer class as qualifier, depending on the
            // context in which they are used.
            if (context instanceof ClassDeclarationContext) {
                // The class is used as base class for inheritance.
                return {
                    symbol,
                    qualifiedName: "this." + name,
                };
            }

            if (context instanceof ExpressionContext) {
                // Classes in expressions can be used either as types or constructor functions.
                // In the first form we need the fully qualified name, otherwise the name of the (generated)
                // constructor function in the owning class (requiring the "this" prefix).
                // The tests here all check for the use as constructor function.
                if (context.creator() && context.creator().createdName().identifier().length > 0) {
                    const creatorName = context.creator().createdName().identifier(0).text;
                    if (creatorName === name) {
                        // The class is used to create a new instance of it.
                        return {
                            symbol,
                            qualifiedName: "this." + name,
                        };
                    }
                } else if (context.INSTANCEOF()) {
                    // The class is used for a type check.
                    return {
                        symbol,
                        qualifiedName: "this." + name,
                    };
                } else if (context.primary() && context.primary().CLASS()) {
                    // The class is used to get a Class instance of it.
                    return {
                        symbol,
                        qualifiedName: "this." + name,
                    };
                }
            }

            return {
                symbol,
                qualifiedName: symbol.name,
            };
        } else if (symbol.parent instanceof ClassSymbol || symbol.parent instanceof InterfaceSymbol) {
            // Member of a class or interface.
            if (symbol.modifiers.has(Modifier.Static)) {
                return {
                    symbol,
                    qualifiedName: symbol.parent.name + "." + name,
                };

            } else {
                // At this point we know it's a non-static member of the class we are in. However in nested classes
                // we cannot directly access such a member from the outer class. Instead we have to use the special
                // `$outer` parameter, which is generated for such scenarios.
                if (this.needOuterScope(block, symbol)) {
                    return {
                        symbol,
                        qualifiedName: "$outer." + name,
                    };
                } else {
                    return {
                        symbol,
                        qualifiedName: "this." + name,
                    };
                }
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
            this.resolveClassSymbols(classSymbols);
            this.resolveInterfaceSymbols(interfaceSymbols);
        }
    };

    private resolveClassSymbols = (symbols: JavaClassSymbol[]): void => {
        symbols.forEach((classSymbol) => {
            let candidate = classSymbol.context.parent.parent.parent;
            if (candidate instanceof CreatorContext) {
                // Anonymous inner class. Have to walk up quite a bit to get the base class name.
                const type = candidate.createdName().identifier(0).text;
                this.resolveTypeName(type, (symbol: Symbol) => {
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
                    if (candidate.typeType()) { // Implies EXTENDS() is assigned.
                        if (classSymbol.parent instanceof JavaFileSymbolTable) {
                            // A symbol imported from another package.
                            this.resolveFromImports(candidate.typeType(), (symbol: Symbol) => {
                                if (symbol instanceof ClassSymbol) {
                                    classSymbol.extends.push(symbol);
                                }
                            });
                        } else {
                            // A symbol defined in the same file.
                            this.resolveLocally(candidate.typeType(), (symbol: Symbol) => {
                                if (symbol instanceof ClassSymbol) {
                                    classSymbol.extends.push(symbol);
                                }
                            });
                        }
                    }

                    if (candidate.IMPLEMENTS()) {
                        // Interfaces to implement.
                        candidate.typeList(0).typeType().forEach((typeContext) => {
                            this.resolveFromImports(typeContext, (symbol: Symbol) => {
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

    private resolveInterfaceSymbols = (symbols: InterfaceSymbol[]): void => {
        symbols.forEach((interfaceSymbol) => {
            const context = interfaceSymbol.context as InterfaceDeclarationContext;
            if (context.typeList()) {
                // Interfaces or classes to extend.
                context.typeList().typeType().forEach((typeContext) => {
                    this.resolveFromImports(typeContext, (symbol: Symbol) => {
                        if (symbol instanceof ClassSymbol || symbol instanceof InterfaceSymbol) {
                            interfaceSymbol.extends.push(symbol);
                        }
                    });
                });
            }
        });
    };

    private resolveFromImports = (context: TypeTypeContext, add: (symbol: Symbol) => void): void => {
        if (context.classOrInterfaceType()) {
            const parts = context.classOrInterfaceType().identifier().map((node) => {
                return node.text;
            });
            const name = parts.join(".");

            const packageSymbols = this.source.symbolTable.getAllSymbolsSync(PackageSymbol);
            if (packageSymbols.length === 1) {
                const importName = packageSymbols[0].name + "." + name;
                for (const source of this.importList) {
                    if (source.packageId === "java") {
                        const info = source.resolveType(name);
                        if (info) {
                            add(info.symbol);

                            break;
                        }
                    } else if (source.packageId === importName) {
                        add(source.resolveAndImport(name));

                        break;
                    }
                }
            }

        }
    };

    private resolveLocally = (context: TypeTypeContext, add: (symbol: Symbol) => void): void => {
        if (context.classOrInterfaceType()) {
            const parts = context.classOrInterfaceType().identifier().map((node) => {
                return node.text;
            });

            // eslint-disable-next-line @typescript-eslint/no-this-alias
            let current: ScopedSymbol = this;
            while (true) {
                const name = parts.shift();
                if (!name) {
                    break;
                }

                const candidate = current.resolveSync(name, true);
                if (!candidate || !(current instanceof ScopedSymbol)) {
                    break;
                }

                current = candidate as ScopedSymbol;
            }

            if (current && current !== this) {
                add(current);
            }
        }
    };

    private resolveTypeName = (name: string, add: (symbol: Symbol) => void): void => {
        for (const source of this.importList) {
            const info = source.resolveType(name);
            if (info?.symbol instanceof ClassSymbol || info?.symbol instanceof InterfaceSymbol
                || info?.symbol instanceof EnumSymbol) {
                add(info.symbol);

                return;
            }
        }
    };

    private needOuterScope = (scope: Symbol, symbol: Symbol): boolean => {
        // Find the directly owning class.
        while (scope) {
            if (scope instanceof ClassSymbol || scope instanceof InterfaceSymbol) {
                // Does the found scope own the given symbol or is it one of the base classes?
                if (symbol.parent === scope || (scope.extends.length > 0 && symbol.parent === scope.extends[0])) {
                    return false;
                }

                break;
            }
            scope = scope.parent;
        }

        return scope.parent instanceof ClassSymbol || scope.parent instanceof InterfaceSymbol;
    };
}
