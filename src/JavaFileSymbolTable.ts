/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

/* eslint-disable no-underscore-dangle */

import { ParseTree, ParseTreeWalker } from "antlr4ts/tree/index.js";
import {
    SymbolTable, ClassSymbol, ScopedSymbol, ParameterSymbol, InterfaceSymbol, NamespaceSymbol, Modifier, BaseSymbol,
    TypedSymbol,
} from "antlr4-c3";

import {
    ClassDeclarationContext, ClassOrInterfaceTypeContext, CreatorContext, EnumDeclarationContext, ExpressionContext,
    InterfaceDeclarationContext, StatementContext, SwitchLabelContext, TypeTypeContext,
} from "../parser/generated/JavaParser.js";
import { ISymbolInfo } from "./conversion/types.js";
import { PackageSource } from "./PackageSource.js";
import { JavaClassSymbol } from "./parsing/JavaClassSymbol.js";
import {
    ClassCreatorSymbol, ConstructorSymbol, InitializerBlockSymbol, JavaParseTreeWalker,
} from "./parsing/JavaParseTreeWalker.js";
import { ParserRuleContext } from "antlr4ts";

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
     * @param context The parse context containing the reference to the symbol to look up.
     * @param name The name of the symbol to find.
     *
     * @returns A record with details about the found symbol. If no symbol could be found then undefined is returned.
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
            block = block.parent as ScopedSymbol;
        }

        if (!block) {
            return undefined;
        }

        if (run.parent instanceof SwitchLabelContext) {
            // Switch statements need special handling to look up where an identifier comes from.
            return this.resolveSwitchLabel(run.parent);
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

            // Otherwise this is a non-static nested type (aka. inner type) and we have to apply special qualifiers,
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

            if (context instanceof ClassOrInterfaceTypeContext && run instanceof ClassDeclarationContext) {
                // A local type used in a field declaration or parameter.
                // A type declaration is generated for that in the side-car namespace of the generated file.
                return {
                    symbol,
                    qualifiedName: `${run.identifier().text}.${name}`,
                };
            }

            return {
                symbol,
                qualifiedName: symbol.name,
            };
        } else if (symbol.parent instanceof ClassSymbol || symbol.parent instanceof ClassCreatorSymbol
            || symbol.parent instanceof InterfaceSymbol) {
            // Member of a class or interface.
            if (symbol.modifiers.has(Modifier.Static)) {
                const parentName = this.getClassParentName(block, symbol.parent);

                return {
                    symbol,
                    qualifiedName: parentName + "." + name,
                };

            } else {
                // At this point we know it's a non-static member of the class we are in. However in nested classes
                // we cannot directly access such a member from the outer class. Instead we have to use the special
                // `$outer` parameter, which is generated for such scenarios.
                if (this.needOuterScope(block, symbol.parent)) {
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

        // The lists are sorted with outer symbols first, so they can be resolved via imports and
        // inner classes can be resolved via the outer class (or also from imports if necessary).
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
                    const symbol = this.resolveInheritedType(type);
                    if (symbol instanceof ClassSymbol) {
                        classSymbol.extends.push(symbol);
                    }
                } else if (classSymbol.context instanceof ClassDeclarationContext) {
                    const typeType = classSymbol.context.typeType();
                    if (typeType) { // Implies EXTENDS() is assigned.
                        const symbol = this.resolveInheritedType(typeType);
                        if (symbol instanceof ClassSymbol) {
                            classSymbol.extends.push(symbol);
                        }
                    } else if (this.objectSymbol) {
                        // Make the implicit derivation from java.lang.Object explicit.
                        classSymbol.extends.push(this.objectSymbol);
                    }

                    if (classSymbol.context.IMPLEMENTS()) {
                        // Interfaces to implement.
                        classSymbol.context.typeList(0).typeType().forEach((typeContext) => {
                            const symbol = this.resolveInheritedType(typeContext);
                            if (symbol instanceof ClassSymbol) {
                                classSymbol.extends.push(symbol);
                            }
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
                    const symbol = this.resolveInheritedType(typeContext);
                    if (symbol instanceof ClassSymbol || symbol instanceof InterfaceSymbol) {
                        interfaceSymbol.extends.push(symbol);
                    }
                });
            }
        });
    };

    private resolveFromImports = (name: string): BaseSymbol | undefined => {
        for (const source of this.importList) {
            if (source.packageId === "java") {
                const info = source.resolveType(name);
                if (info && info.symbol) {
                    return info.symbol;
                }
            } else if (name.startsWith(source.packageId) || source.packageId.endsWith("." + name)) {
                const resolved = source.resolveAndImport(name);
                if (resolved) {
                    return resolved;
                }

                break;
            }
        }

        return undefined;
    };

    /**
     * Tries to resolve a type which is used as base type for a class or interface. This requires to check an eventual
     * outer class first (iteratively), and then to check the imports.
     *
     * @param contextOrTypeName The context of the type to resolve.
     *
     * @returns The resolved symbol, or `undefined` if no symbol could be resolved.
     */
    private resolveInheritedType = (contextOrTypeName: TypeTypeContext | string): BaseSymbol | undefined => {
        let typeName: string;
        if (typeof contextOrTypeName === "string") {
            typeName = contextOrTypeName;
        } else {
            const parts = contextOrTypeName.classOrInterfaceType()?.identifier().map((node) => {
                return node.text;
            }) ?? [];

            // If the type is fully qualified, we resolve it from the imported packages.
            typeName = parts?.join(".") ?? "";
            if (parts.length > 1) {
                return this.resolveFromImports(typeName);
            }

            // Otherwise resolve iteratively from the current scope.
            let current: ParserRuleContext | undefined = contextOrTypeName;
            while (current) {
                const owner = this.getWrappingClass(current);
                if (!owner) {
                    break;
                }

                const symbol = owner.resolveSync(typeName, false);
                if (symbol) {
                    return symbol;
                }

                current = owner.context as ParserRuleContext;
            }
        }

        // Reached the top of the scope tree or no context was given. Try to resolve from the imported packages.
        return this.resolveFromImports(typeName);
    };

    private getWrappingClass = (context: ParserRuleContext): ClassSymbol | undefined => {
        let run: ParserRuleContext | undefined = context.parent;
        while (run) {
            if (run instanceof ClassDeclarationContext) {
                const name = run.identifier().text;
                const symbol = this.resolveSync(name, true);
                if (symbol instanceof ClassSymbol) {
                    return symbol;
                }
            }

            run = run.parent;
        }

        return undefined;
    };

    /**
     * Determines if the given scope needs to be resolved in the outer scope.
     *
     * @param scope The scope to walk up from until a class, interface or enum is found.
     * @param owningClass The class that owns a specific symbol that is accessed from the given scope.
     *
     * @returns Returns true if we can reach the owning class from the given scope, otherwise false.
     */
    private needOuterScope = (scope: BaseSymbol, owningClass: BaseSymbol): boolean => {
        // Find the class/interface/enum that contains the scope.
        let run: BaseSymbol | undefined = scope;
        while (run) {
            if (run instanceof ClassSymbol || run instanceof ClassCreatorSymbol || run instanceof InterfaceSymbol) {
                // Is the found class (expression)/interface symbol the same as the owning class?
                if (run === owningClass) {
                    return false;
                }

                // Is the owning class a base class of the found class?
                if (!(run instanceof ClassCreatorSymbol) && run.extends.includes(owningClass as ClassSymbol)) {
                    return false;
                }

                break;
            }
            run = run.parent;
        }

        return true;
    };

    /**
     * Determines if the given scope needs to be resolved in the outer scope.
     *
     * @param scope The scope to walk up from until a class, interface or enum is found.
     * @param owningClass The class that owns a specific symbol that is accessed from the given scope.
     *
     * @returns Returns true if we can reach the owning class from the given scope, otherwise false.
     */
    private getClassParentName = (scope: BaseSymbol, owningClass: BaseSymbol): string => {
        // Find the class/interface/enum that contains the scope.
        let run: BaseSymbol | undefined = scope;
        while (run) {
            if (run instanceof ClassSymbol || run instanceof ClassCreatorSymbol || run instanceof InterfaceSymbol) {
                // Is the found class (expression)/interface symbol the same as the owning class?
                if (run === owningClass) {
                    return run.name;
                }

                // Is the owning class a base class of the found class?
                if (!(run instanceof ClassCreatorSymbol) && run.extends.includes(owningClass as ClassSymbol)) {
                    return run.name;
                }

                break;
            }
            run = run.parent;
        }

        return owningClass.name;
    };

    /**
     * Tries to resolve a switch case label. For this we have to walk up to check the switch expression to see
     * if that is a symbol we can resolve. If that's possible, take the symbol's type as reference to resolve
     * the case label.
     *
     * @param context The context of the switch label.
     *
     * @returns The symbol info for the label or undefined if it cannot be resolved here.
     */
    private resolveSwitchLabel = (context: SwitchLabelContext): ISymbolInfo | undefined => {
        const identifierContext = context._constantExpression?.primary()?.identifier();
        if (identifierContext) {
            // Only single identifiers can be resolved.
            const statementContext = context.parent?.parent as StatementContext;
            const switchExpression = statementContext?.parExpression();
            if (switchExpression) {
                const valueContext = switchExpression.expression().primary()?.identifier();
                if (valueContext) {
                    const info = this.getQualifiedSymbol(statementContext, valueContext.text);
                    if (info && info.symbol instanceof TypedSymbol && info.symbol.type) {
                        const typeInfo = this.getQualifiedSymbol(statementContext, info.symbol.type.name);
                        if (typeInfo && typeInfo.symbol) {
                            const symbol = typeInfo.symbol.resolveSync(identifierContext.text);
                            if (symbol) {
                                return {
                                    symbol,
                                    qualifiedName: `${typeInfo.qualifiedName}.${symbol.name}`,
                                };
                            }
                        }
                    }
                }
            }
        }

        return undefined;
    };

}
