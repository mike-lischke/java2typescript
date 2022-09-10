/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, Mike Lischke
 *
 * See LICENSE file for more info.
 */

/* eslint-disable max-classes-per-file */

import {
    Symbol, BlockSymbol, FieldSymbol, MethodSymbol, ParameterSymbol, ScopedSymbol, SymbolTable, InterfaceSymbol,
    Modifier, Type, TypeKind, ReferenceKind, VariableSymbol,
} from "antlr4-c3";

import { ParserRuleContext } from "antlr4ts";
import { TerminalNode } from "antlr4ts/tree";
import {
    AnnotationTypeBodyContext, MethodDeclarationContext, BlockContext, EnumDeclarationContext,
    InterfaceDeclarationContext, AnnotationTypeDeclarationContext, ClassDeclarationContext, ExpressionContext,
    FormalParameterContext, ConstantDeclaratorContext, PackageDeclarationContext, ImportDeclarationContext,
    ConstructorDeclarationContext, ClassBodyDeclarationContext, TypeDeclarationContext, InterfaceBodyDeclarationContext,
    InterfaceMethodDeclarationContext, JavaParser, LocalVariableDeclarationContext, FieldDeclarationContext,
    EnhancedForControlContext,
    CatchClauseContext,
    EnumConstantContext,
} from "../../java/generated/JavaParser";
import { JavaParserListener } from "../../java/generated/JavaParserListener";
import { Stack } from "../../lib/java/util/Stack";

import { EnhancedTypeKind } from "../conversion/types";
import { PackageSource } from "../PackageSource";
import { PackageSourceManager } from "../PackageSourceManager";

import { JavaClassSymbol } from "./JavaClassSymbol";

export class FileSymbol extends ScopedSymbol { }
export class AnnotationSymbol extends ScopedSymbol { }
export class EnumSymbol extends ScopedSymbol { }
export class EnumConstantSymbol extends Symbol { }
export class ConstructorSymbol extends MethodSymbol { }

export class ClassBodySymbol extends ScopedSymbol { }
export class InterfaceBodySymbol extends ScopedSymbol { }

export class InitializerBlockSymbol extends ScopedSymbol {
    public isStatic: boolean;
}

export class TypeSymbol extends Symbol { }
export class PackageSymbol extends Symbol { }
export class ImportSymbol extends Symbol { }

export class JavaParseTreeWalker implements JavaParserListener {

    private static typeKindMap = new Map<string, EnhancedTypeKind>([
        ["Array", EnhancedTypeKind.Array],

        ["int", EnhancedTypeKind.Integer],
        ["Integer", EnhancedTypeKind.Integer],

        ["float", EnhancedTypeKind.Float],

        ["String", EnhancedTypeKind.String],

        ["boolean", EnhancedTypeKind.Boolean],
        ["Boolean", EnhancedTypeKind.Boolean],

        ["Map", EnhancedTypeKind.Map],
    ]);

    private symbolStack = new Stack<ScopedSymbol>();

    public constructor(private symbolTable: SymbolTable, private packageRoot: string,
        private importList: Set<PackageSource>) {
        this.symbolStack.push(symbolTable);
    }

    public exitPackageDeclaration = (ctx: PackageDeclarationContext): void => {
        const packageId = ctx.qualifiedName().text;
        this.symbolTable.addNewSymbolOfType(PackageSymbol, this.symbolStack.tos, ctx.qualifiedName().text);

        const sources = PackageSourceManager.fromPackageIdWildcard(packageId);
        sources.forEach((source) => {
            this.importList.add(source);
        });

    };

    public exitImportDeclaration = (ctx: ImportDeclarationContext): void => {
        const packageId = ctx.qualifiedName().text;
        this.symbolTable.addNewSymbolOfType(ImportSymbol, this.symbolStack.tos, packageId);

        if (ctx.MUL()) {
            const sources = PackageSourceManager.fromPackageIdWildcard(packageId);
            sources.forEach((source) => {
                this.importList.add(source);
            });
        } else {
            const source = PackageSourceManager.fromPackageId(packageId);
            this.importList.add(source);
        }

    };

    public enterBlock = (ctx: BlockContext): void => {
        this.pushNewScope(BlockSymbol, "#block#", ctx);
    };

    public exitBlock = (): void => {
        this.symbolStack.pop();
    };

    public enterClassDeclaration = (ctx: ClassDeclarationContext): void => {
        const symbol = this.pushNewScope(JavaClassSymbol, ctx.identifier().text, ctx);
        this.checkStatic(symbol);
    };

    public exitClassDeclaration = (): void => {
        this.symbolStack.pop();
    };

    public enterClassBodyDeclaration = (ctx: ClassBodyDeclarationContext): void => {
        if (ctx.block()) {
            const symbol = this.pushNewScope(InitializerBlockSymbol, "#initializer#", ctx);
            symbol.isStatic = ctx.STATIC() !== undefined;
        }
    };

    public exitClassBodyDeclaration = (): void => {
        if (this.symbolStack.tos.name === "#initializer#") {
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
        const symbol = this.pushNewScope(MethodSymbol, ctx.identifier().text, ctx);
        this.checkStatic(symbol);
    };

    public exitMethodDeclaration = (): void => {
        this.symbolStack.pop();
    };

    public enterInterfaceMethodDeclaration = (ctx: InterfaceMethodDeclarationContext): void => {
        const symbol = this.pushNewScope(MethodSymbol, ctx.interfaceCommonBodyDeclaration().identifier().text, ctx);
        this.checkStatic(symbol);
    };

    public exitInterfaceMethodDeclaration = (): void => {
        this.symbolStack.pop();
    };

    public enterConstructorDeclaration = (ctx: ConstructorDeclarationContext): void => {
        const symbol = this.pushNewScope(ConstructorSymbol, ctx.identifier().text, ctx);
        this.checkStatic(symbol);
    };

    public exitConstructorDeclaration = (): void => {
        this.symbolStack.pop();
    };

    public enterInterfaceDeclaration = (ctx: InterfaceDeclarationContext): void => {
        this.pushNewScope(InterfaceSymbol, ctx.identifier().text, ctx);
    };

    public exitInterfaceDeclaration = (): void => {
        this.symbolStack.pop();
    };

    public enterAnnotationTypeDeclaration = (ctx: AnnotationTypeDeclarationContext): void => {
        this.pushNewScope(AnnotationSymbol, ctx.identifier().text, ctx);
    };

    public exitAnnotationTypeDeclaration = (): void => {
        this.symbolStack.pop();
    };

    public enterEnumDeclaration = (ctx: EnumDeclarationContext): void => {
        this.pushNewScope(EnumSymbol, ctx.identifier().text, ctx);
    };

    public exitEnumConstant = (ctx: EnumConstantContext): void => {
        const block = this.symbolStack.tos;
        this.symbolTable.addNewSymbolOfType(EnumConstantSymbol, block, ctx.identifier().text);
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

    public enterEnhancedForControl = (ctx: EnhancedForControlContext): void => {
        const block = this.symbolStack.tos;

        if (ctx.typeType()) {
            // Explicit type.
            const type = this.generateTypeRecord(ctx.typeType().text);

            const id = ctx.variableDeclaratorId().identifier().text;
            const symbol = this.symbolTable.addNewSymbolOfType(VariableSymbol, block, id, undefined, type);
            symbol.context = ctx;
        } else {
            // Auto type.
            const id = ctx.variableDeclaratorId().identifier().text;
            const symbol = this.symbolTable.addNewSymbolOfType(VariableSymbol, block, id);
            symbol.context = ctx;
        }
    };

    public enterLocalVariableDeclaration = (ctx: LocalVariableDeclarationContext): void => {
        const block = this.symbolStack.tos;
        const type = this.generateTypeRecord(ctx.typeType().text);
        ctx.variableDeclarators().variableDeclarator().forEach((declarator) => {
            const id = declarator.variableDeclaratorId().identifier().text;
            const symbol = this.symbolTable.addNewSymbolOfType(VariableSymbol, block, id, undefined, type);
            symbol.context = declarator;
            this.checkStatic(symbol);
        });
    };

    public enterFieldDeclaration = (ctx: FieldDeclarationContext): void => {
        const block = this.symbolStack.tos;

        const type = this.generateTypeRecord(ctx.typeType().text);
        ctx.variableDeclarators().variableDeclarator().forEach((declarator) => {
            const id = declarator.variableDeclaratorId().identifier().text;
            const symbol = this.symbolTable.addNewSymbolOfType(FieldSymbol, block, id, undefined, type);
            symbol.context = declarator;
            this.checkStatic(symbol);
        });
    };

    public enterConstantDeclarator = (ctx: ConstantDeclaratorContext): void => {
        const block = this.symbolStack.tos;

        const symbol = this.symbolTable.addNewSymbolOfType(FieldSymbol, block, ctx.identifier().text);
        symbol.context = ctx;
    };

    public enterFormalParameter = (ctx: FormalParameterContext): void => {
        const block = this.symbolStack.tos;

        const type = this.generateTypeRecord(ctx.typeType().text);
        const id = ctx.variableDeclaratorId().identifier().text;
        const symbol = this.symbolTable.addNewSymbolOfType(ParameterSymbol, block, id, undefined, type);
        symbol.context = ctx;
        this.checkStatic(symbol);
    };

    public enterCatchClause = (ctx: CatchClauseContext): void => {
        const block = this.pushNewScope(BlockSymbol, "#catch#", ctx);

        const type = this.generateTypeRecord(ctx.catchType().text); // Can be a union type, but we ignore that here.
        const id = ctx.identifier().text;
        const symbol = this.symbolTable.addNewSymbolOfType(ParameterSymbol, block, id, undefined, type);
        symbol.context = ctx;
    };

    public exitCatchClause = (): void => {
        this.symbolStack.pop();
    };

    public visitTerminal = (_node: TerminalNode): void => { /**/ };

    private pushNewScope = <T extends ScopedSymbol>(t: new (...args: unknown[]) => T, name: string,
        ctx?: ParserRuleContext): T => {
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

    private generateTypeRecord = (typeText: string): Type => {
        const typeParamsCheck = typeText.match(/^[A-Z_.]+[ \t]*(<.+>)/i);
        let baseText = typeText;
        if (typeParamsCheck) {
            baseText = typeText.substring(0, typeText.length - typeParamsCheck[1].length);
        }

        const kind = JavaParseTreeWalker.typeKindMap.get(baseText) ?? EnhancedTypeKind.Unknown;

        return {
            name: typeText,
            baseTypes: [],
            kind: kind as unknown as TypeKind, // Temporary use of the cast until the type kind is updated.
            reference: ReferenceKind.Irrelevant,
        };
    };

}
