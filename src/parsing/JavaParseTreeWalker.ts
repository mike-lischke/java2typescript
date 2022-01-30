/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, Mike Lischke
 *
 * See LICENSE file for more info.
 */

/* eslint-disable max-classes-per-file */

import {
    Symbol, BlockSymbol, FieldSymbol, MethodSymbol, ParameterSymbol, ScopedSymbol, SymbolTable, InterfaceSymbol,
    Modifier,
} from "antlr4-c3";

import { ParserRuleContext } from "antlr4ts";
import { TerminalNode } from "antlr4ts/tree";
import {
    AnnotationTypeBodyContext, MethodDeclarationContext, GenericMethodDeclarationContext, BlockContext,
    EnumDeclarationContext, InterfaceDeclarationContext, AnnotationTypeDeclarationContext, ClassDeclarationContext,
    VariableDeclaratorsContext, ExpressionContext, FormalParameterContext, ConstantDeclaratorContext,
    PackageDeclarationContext, ImportDeclarationContext, GenericConstructorDeclarationContext,
    ConstructorDeclarationContext, ClassBodyDeclarationContext, TypeDeclarationContext, InterfaceBodyDeclarationContext,
    InterfaceMethodDeclarationContext, JavaParser,
} from "../../java/generated/JavaParser";
import { JavaParserListener } from "../../java/generated/JavaParserListener";

import { java } from "../../lib/java/java";

import { ImportSymbol } from "./ImportSymbol";
import { JavaClassSymbol } from "./JavaClassSymbol";

export class FileSymbol extends ScopedSymbol { }
export class AnnotationSymbol extends ScopedSymbol { }
export class EnumSymbol extends ScopedSymbol { }
export class ConstructorSymbol extends MethodSymbol { }

export class ClassBodySymbol extends ScopedSymbol { }
export class InterfaceBodySymbol extends ScopedSymbol { }

export class TypeSymbol extends Symbol { }

export class PackageSymbol extends ImportSymbol { }

export class JavaParseTreeWalker implements JavaParserListener {

    private symbolStack: java.util.Stack<ScopedSymbol> = new java.util.Stack();

    public constructor(private symbolTable: SymbolTable, private packageRoot: string) {
        this.pushNewScope(FileSymbol, "#file#");
    }

    public exitPackageDeclaration = (ctx: PackageDeclarationContext): void => {
        // Implicitly import all files from the folder indicated by the package ID.
        this.symbolTable.addNewSymbolOfType(PackageSymbol, this.symbolStack.tos, ctx.qualifiedName().text,
            this.packageRoot, true);
    };

    public exitImportDeclaration = (ctx: ImportDeclarationContext): void => {
        const text = ctx.qualifiedName().text;
        this.symbolTable.addNewSymbolOfType(ImportSymbol, this.symbolStack.tos, text,
            this.packageRoot, ctx.DOT() !== undefined);
    };

    public enterBlock = (ctx: BlockContext): void => {
        this.pushNewScope(BlockSymbol, "#block#", ctx);
    };

    public exitBlock = (): void => {
        this.symbolStack.pop();
    };

    public enterClassDeclaration = (ctx: ClassDeclarationContext): void => {
        this.pushNewScope(JavaClassSymbol, ctx.IDENTIFIER().text, ctx);
    };

    public exitClassDeclaration = (): void => {
        this.symbolStack.pop();
    };

    public enterClassBodyDeclaration = (ctx: ClassBodyDeclarationContext): void => {
        if (ctx.block() && !ctx.STATIC()) {
            // This is an anonymous inner class.
            this.pushNewScope(JavaClassSymbol, "#anonymous#", ctx);
        }
    };

    public exitClassBodyDeclaration = (): void => {
        if (this.symbolStack.tos.name === "#anonymous#") {
            this.symbolStack.pop();
        }
    };

    public enterAnnotationTypeBody = (ctx: AnnotationTypeBodyContext): void => {
        this.pushNewScope(AnnotationSymbol, "#annotationTypeBody#", ctx);
    };

    public exitAnnotationTypeBody = (): void => {
        this.symbolStack.pop();
    };

    public enterMethodDeclaration = (ctx: MethodDeclarationContext): void => {
        const symbol = this.pushNewScope(MethodSymbol, ctx.IDENTIFIER().text, ctx);
        this.checkStatic(symbol);
    };

    public exitMethodDeclaration = (): void => {
        this.symbolStack.pop();
    };

    public enterGenericMethodDeclaration = (ctx: GenericMethodDeclarationContext): void => {
        const symbol = this.pushNewScope(MethodSymbol, ctx.methodDeclaration().IDENTIFIER().text, ctx);
        this.checkStatic(symbol);
    };

    public exitGenericMethodDeclaration = (): void => {
        this.symbolStack.pop();
    };

    public enterConstructorDeclaration = (ctx: ConstructorDeclarationContext): void => {
        const symbol = this.pushNewScope(ConstructorSymbol, ctx.IDENTIFIER().text, ctx);
        this.checkStatic(symbol);
    };

    public exitConstructorDeclaration = (): void => {
        this.symbolStack.pop();
    };

    public enterGenericConstructorDeclaration = (ctx: GenericConstructorDeclarationContext): void => {
        this.pushNewScope(MethodSymbol, ctx.constructorDeclaration().IDENTIFIER().text, ctx);
    };

    public exitGenericConstructorDeclaration = (): void => {
        this.symbolStack.pop();
    };

    public enterInterfaceDeclaration = (ctx: InterfaceDeclarationContext): void => {
        this.pushNewScope(InterfaceSymbol, ctx.IDENTIFIER().text, ctx);
    };

    public exitInterfaceDeclaration = (): void => {
        this.symbolStack.pop();
    };

    public enterAnnotationTypeDeclaration = (ctx: AnnotationTypeDeclarationContext): void => {
        this.pushNewScope(AnnotationSymbol, ctx.IDENTIFIER().text, ctx);
    };

    public exitAnnotationTypeDeclaration = (): void => {
        this.symbolStack.pop();
    };

    public enterEnumDeclaration = (ctx: EnumDeclarationContext): void => {
        this.pushNewScope(EnumSymbol, ctx.IDENTIFIER().text, ctx);
    };

    public exitEnumDeclaration = (): void => {
        this.symbolStack.pop();
    };

    public enterExpression = (ctx: ExpressionContext): void => {
        // Pushing an own symbol for an expression gives us an anchor point for symbol search also with
        // references to higher scopes.
        this.pushNewScope(BlockSymbol, "#expression#", ctx);
    };

    public exitExpression = (): void => {
        this.symbolStack.pop();
    };

    public enterVariableDeclarators = (ctx: VariableDeclaratorsContext): void => {
        const block = this.symbolStack.tos;

        ctx.variableDeclarator().forEach((declarator) => {
            const symbol = this.symbolTable.addNewSymbolOfType(FieldSymbol, block,
                declarator.variableDeclaratorId().IDENTIFIER().text);
            symbol.context = declarator;
            this.checkStatic(symbol);
        });

    };

    public enterConstantDeclarator = (ctx: ConstantDeclaratorContext): void => {
        const block = this.symbolStack.tos;

        const symbol = this.symbolTable.addNewSymbolOfType(FieldSymbol, block, ctx.IDENTIFIER().text);
        symbol.context = ctx;
    };

    public enterFormalParameter = (ctx: FormalParameterContext): void => {
        const block = this.symbolStack.tos;

        const symbol = this.symbolTable.addNewSymbolOfType(ParameterSymbol, block,
            ctx.variableDeclaratorId().IDENTIFIER().text);
        symbol.context = ctx;
    };

    /*public enterClassOrInterfaceType = (ctx: ClassOrInterfaceTypeContext): void => {
        const block = this.symbolStack.tos;

        const symbol = this.symbolTable.addNewSymbolOfType(TypeSymbol, block, ctx.text);
        symbol.context = ctx;
    };*/

    public visitTerminal = (_node: TerminalNode): void => { /**/ };

    private pushNewScope = <T extends ScopedSymbol>(t: new (...args: unknown[]) => T, name: string,
        ctx?: ParserRuleContext): Symbol => {
        const parent = this.symbolStack.length === 0 ? undefined : this.symbolStack.tos;

        const symbol = this.symbolTable.addNewSymbolOfType(t, parent, name, [], []);
        symbol.context = ctx;

        this.symbolStack.push(symbol);

        return symbol;
    };

    /**
     * Checks if the symbol is static and marks it as such, if that's the case.
     *
     * @param symbol The symbol to check.
     */
    private checkStatic = (symbol: Symbol): void => {
        let found = false;
        let run = symbol.context as ParserRuleContext;
        while (run && !found) {
            switch (run.ruleIndex) {
                case JavaParser.RULE_typeDeclaration: {
                    (run as TypeDeclarationContext).classOrInterfaceModifier().forEach((modifier) => {
                        if (modifier.STATIC()) {
                            symbol.modifiers.add(Modifier.Static);
                        }
                    });

                    found = true;
                    break;
                }

                case JavaParser.RULE_classBodyDeclaration: {
                    (run as ClassBodyDeclarationContext).modifier().forEach((modifier) => {
                        if (modifier.classOrInterfaceModifier() && modifier.classOrInterfaceModifier().STATIC()) {
                            symbol.modifiers.add(Modifier.Static);
                        }
                    });

                    found = true;
                    break;
                }

                case JavaParser.RULE_interfaceBodyDeclaration: {
                    (run as InterfaceBodyDeclarationContext).modifier().forEach((modifier) => {
                        if (modifier.classOrInterfaceModifier() && modifier.classOrInterfaceModifier().STATIC()) {
                            symbol.modifiers.add(Modifier.Static);
                        }
                    });

                    found = true;
                    break;
                }

                case JavaParser.RULE_interfaceMethodDeclaration: {
                    (run as InterfaceMethodDeclarationContext).interfaceMethodModifier().forEach((modifier) => {
                        if (modifier.STATIC()) {
                            symbol.modifiers.add(Modifier.Static);
                        }
                    });

                    found = true;
                    break;
                }

                default: {
                    run = run.parent;
                    break;
                }
            }
        }
    };
}
