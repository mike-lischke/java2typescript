/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { Symbol, ClassSymbol, ScopedSymbol, SymbolTable, InterfaceSymbol, ParameterSymbol, Modifier } from "antlr4-c3";
import { ParseTree, ParseTreeWalker } from "antlr4ts/tree";

import { ClassDeclarationContext, InterfaceDeclarationContext, TypeTypeContext } from "../../java/generated/JavaParser";
import { PackageSource } from "../../src/PackageSource";
import { PackageSourceManager } from "../../src/PackageSourceManager";
import { ImportSymbol } from "../../src/parsing/ImportSymbol";
import { JavaClassSymbol } from "../../src/parsing/JavaClassSymbol";
import { EnumSymbol, JavaParseTreeWalker } from "../../src/parsing/JavaParseTreeWalker";

export class JavaFileSymbolTable extends SymbolTable {

    public constructor(private tree: ParseTree, packageRoot: string) {
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
        if (!symbol || symbol instanceof ParameterSymbol) {
            return "";
        }

        if (symbol.parent instanceof ClassSymbol || symbol.parent instanceof InterfaceSymbol) {
            // Member of a class or interface. The constructed qualifier depends on whether this is from an
            // import or the local file.
            if (symbol.symbolTable === this) {
                if (symbol.modifiers.has(Modifier.Static)) {
                    return symbol.parent.name + ".";
                } else {
                    return "this.";
                }
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

    /**
     * Called after all files from a package are parsed. Now class + interface references can be resolved.
     *
     * @param packageRoot The root folder of the package we are loading.
     */
    public resolveReferences = (packageRoot: string): void => {
        const classSymbols = this.getNestedSymbolsOfTypeSync(JavaClassSymbol);
        const interfaceSymbols = this.getNestedSymbolsOfTypeSync(InterfaceSymbol);

        if (classSymbols.length > 0 || interfaceSymbols.length > 0) {
            // First try to resolve the symbols from package local files.
            const localSources = PackageSourceManager.localSources;
            this.resolveClassSymbols(classSymbols, localSources);
            this.resolveInterfaceSymbols(interfaceSymbols, localSources);

            const imports = this.getAllSymbolsSync(ImportSymbol, true);
            const sources: PackageSource[] = [];
            imports.forEach((symbol) => {
                sources.push(...PackageSourceManager.fromPackageId(symbol.name, packageRoot, symbol.fullImport));
            });

            if (sources.length > 0) {
                this.resolveClassSymbols(classSymbols, sources);
                this.resolveInterfaceSymbols(interfaceSymbols, sources);
            }
        }
    };

    private resolveClassSymbols = (symbols: JavaClassSymbol[], sources: PackageSource[]): void => {
        symbols.forEach((classSymbol) => {
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
    };

    private resolveInterfaceSymbols = (symbols: InterfaceSymbol[], sources: PackageSource[]): void => {
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
