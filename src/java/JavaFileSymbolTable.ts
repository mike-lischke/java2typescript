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
    ClassDeclarationContext, CreatorContext, EnumDeclarationContext, ExpressionContext, InterfaceDeclarationContext,
    TypeTypeContext,
} from "../../java/generated/JavaParser";
import { ISymbolInfo } from "../conversion/types";
import { PackageSource } from "../PackageSource";
import { JavaClassSymbol } from "../parsing/JavaClassSymbol";
import {
    ClassCreatorSymbol,
    ConstructorSymbol, EnumSymbol, InitializerBlockSymbol, JavaParseTreeWalker, PackageSymbol,
} from "../parsing/JavaParseTreeWalker";

export class JavaFileSymbolTable extends SymbolTable {

    private referencesResolved = false;
    private objectSymbol: ClassSymbol | undefined;

    public constructor(private source: PackageSource, packageRoot: string, private importList: Set<PackageSource>) {
        super("fileSymbolTable", { allowDuplicateSymbols: true });

        const [java] = [...this.importList];
        if (java && java.packageId === "java") {
            this.objectSymbol = java.resolveType("java.lang.Object")?.symbol as ClassSymbol;
        }

        if (source.parseTree) {
            ParseTreeWalker.DEFAULT.walk(new JavaParseTreeWalker(this, packageRoot, importList), source.parseTree);
        }
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
        let run: ParseTree | undefined = context;
        if (!block) {
            // The given context is not one of the key contexts we used in the symbol table.
            // Walk the parent chain up to see if we can find an expression or member context and continue from there.
            while (run) {
                if (run instanceof ExpressionContext || run instanceof ClassDeclarationContext) {
                    break;
                }
                run = run.parent;
            }

            if (!run) {
                return undefined;
            }

            block = this.symbolWithContextSync(run);
            if (!block) {
                return undefined;
            }
        }

        if (!(block instanceof ScopedSymbol)) {
            block = block.parent;
        }

        if (!block) {
            return undefined;
        }

        const symbol = run instanceof ClassDeclarationContext
            ? block.resolveSync(name, false)
            : block.parent?.resolveSync(name, false);

        if (!symbol) {
            // Could be a class creator. Get the class symbol and try to resolve again.
            if (block.parent?.parent instanceof InitializerBlockSymbol) {
                const creator = block.parent?.parent.parent;
                if (creator instanceof ClassCreatorSymbol) {
                    // We are assuming here that the symbol is part of the class expression,
                    // as it couldn't be resolved via normal lookup in the file.
                    return {
                        symbol: undefined,
                        qualifiedName: "this." + name,
                    };
                }
            }

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
                const creator = context.creator();
                if (creator && creator.createdName().identifier().length > 0) {
                    const creatorName = creator.createdName().identifier(0).text;
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
                } else if (context.primary()?.CLASS()) {
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
                if (this.needOuterScope(block)) {
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
            // Enums do not extend nor implement anything (except the implicit derivation from `Enum`, which is
            // handled elsewhere).
            if (!(classSymbol instanceof EnumDeclarationContext)) {
                const candidate = classSymbol.context?.parent?.parent?.parent;
                if (candidate instanceof CreatorContext) {
                    // Anonymous inner class creation.
                    const type = candidate.createdName().identifier(0).text;
                    this.resolveTypeName(type, (symbol: Symbol) => {
                        if (symbol instanceof ClassSymbol) {
                            classSymbol.extends.push(symbol);
                        }
                    });
                } else if (classSymbol.context instanceof ClassDeclarationContext) {
                    const typeType = classSymbol.context.typeType();
                    if (typeType) { // Implies EXTENDS() is assigned.
                        if (classSymbol.parent instanceof JavaFileSymbolTable) {
                            // A symbol imported from another package.
                            this.resolveFromImports(typeType, (symbol: Symbol) => {
                                if (symbol instanceof ClassSymbol) {
                                    classSymbol.extends.push(symbol);
                                }
                            });
                        } else {
                            // A symbol defined in the same file.
                            this.resolveLocally(typeType, (symbol: Symbol) => {
                                if (symbol instanceof ClassSymbol) {
                                    classSymbol.extends.push(symbol);
                                }
                            });
                        }
                    } else if (this.objectSymbol) {
                        // Make the implicit derivation from java.lang.Object explicit.
                        classSymbol.extends.push(this.objectSymbol);
                    }

                    if (classSymbol.context.IMPLEMENTS()) {
                        // Interfaces to implement.
                        classSymbol.context.typeList(0).typeType().forEach((typeContext) => {
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
                context.typeList()?.typeType().forEach((typeContext) => {
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
            const parts = context.classOrInterfaceType()?.identifier().map((node) => {
                return node.text;
            });
            const name = parts?.join(".") ?? "";

            const packageSymbols = this.source.symbolTable.getAllSymbolsSync(PackageSymbol);
            if (packageSymbols.length === 1) {
                for (const source of this.importList) {
                    if (source.packageId === "java") {
                        const info = source.resolveType(name);
                        if (info && info.symbol) {
                            add(info.symbol);

                            break;
                        }
                    } else if (source.packageId.endsWith("." + name)) {
                        const resolved = source.resolveAndImport(name);
                        if (resolved) {
                            add(resolved);
                        }

                        break;
                    }
                }
            }

        }
    };

    private resolveLocally = (context: TypeTypeContext, add: (symbol: Symbol) => void): void => {
        if (context.classOrInterfaceType()) {
            const parts = context.classOrInterfaceType()?.identifier().map((node) => {
                return node.text;
            }) ?? [];

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

    private needOuterScope = (scope: Symbol): boolean => {
        // Find the directly owning class.
        let run: Symbol | undefined = scope;
        while (run) {
            if (run instanceof ClassSymbol || run instanceof InterfaceSymbol) {
                // Is the found class symbol static? If not then we need the outer scope.
                if (run.modifiers.has(Modifier.Static)) {
                    return false;
                }

                break;
            }
            run = run.parent;
        }

        return run?.parent instanceof ClassSymbol || run?.parent instanceof InterfaceSymbol;
    };
}
