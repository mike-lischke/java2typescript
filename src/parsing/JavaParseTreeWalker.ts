/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, Mike Lischke
 *
 * See LICENSE file for more info.
 */

/* eslint-disable max-classes-per-file */

import {
    Symbol, BlockSymbol, FieldSymbol, MethodSymbol, ParameterSymbol, ScopedSymbol, SymbolTable, InterfaceSymbol,
} from "antlr4-c3";
import { ParserRuleContext } from "antlr4ts";
import { TerminalNode } from "antlr4ts/tree";
import {
    AnnotationTypeBodyContext, MethodDeclarationContext, GenericMethodDeclarationContext, BlockContext,
    EnumDeclarationContext, InterfaceDeclarationContext, AnnotationTypeDeclarationContext, ClassDeclarationContext,
    VariableDeclaratorsContext, ExpressionContext, FormalParameterContext, ConstantDeclaratorContext,
    PackageDeclarationContext, ImportDeclarationContext,
} from "../../java/generated/JavaParser";
import { JavaParserListener } from "../../java/generated/JavaParserListener";

import { Stack } from "../../lib/ContainerSupport";

import { ImportSymbol } from "./ImportSymbol";
import { JavaClassSymbol } from "./JavaClassSymbol";

export class FileSymbol extends ScopedSymbol {}
export class AnnotationSymbol extends ScopedSymbol {}
export class EnumSymbol extends ScopedSymbol {}

export class PackageSymbol extends Symbol {
    public constructor(name: string) {
        super(name);
    }
}

export class JavaParseTreeWalker implements JavaParserListener {

    private symbolStack: Stack<ScopedSymbol> = new Stack();

    public constructor(private symbolTable: SymbolTable, private packageRoot: string) {
        this.pushNewScope(FileSymbol, "file");
    }

    public exitPackageDeclaration = (ctx: PackageDeclarationContext): void => {
        this.symbolTable.addNewSymbolOfType(PackageSymbol, undefined, ctx.qualifiedName().text);
    };

    public exitImportDeclaration = (ctx: ImportDeclarationContext): void => {
        const text = ctx.qualifiedName().text;
        this.symbolTable.addNewSymbolOfType(ImportSymbol, undefined, text, this.packageRoot, ctx.DOT() !== undefined);
    };

    public enterBlock = (ctx: BlockContext): void => {
        this.pushNewScope(BlockSymbol, "block", ctx);
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

    public enterAnnotationTypeBody = (ctx: AnnotationTypeBodyContext): void => {
        this.pushNewScope(AnnotationSymbol, "annotationTypeBody", ctx);
    };

    public exitAnnotationTypeBody = (): void => {
        this.symbolStack.pop();
    };

    public enterMethodDeclaration = (ctx: MethodDeclarationContext): void => {
        this.pushNewScope(MethodSymbol, ctx.IDENTIFIER().text, ctx);
    };

    public exitMethodDeclaration = (): void => {
        this.symbolStack.pop();
    };

    public enterGenericMethodDeclaration = (ctx: GenericMethodDeclarationContext): void => {
        this.pushNewScope(MethodSymbol, ctx.methodDeclaration().IDENTIFIER().text, ctx);
    };

    public exitGenericMethodDeclaration = (): void => {
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
        this.pushNewScope(BlockSymbol, "expression", ctx);
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

    public visitTerminal = (_node: TerminalNode): void => { /**/ };

    private pushNewScope = <T extends ScopedSymbol>(t: new (...args: unknown[]) => T, name: string,
        ctx?: ParserRuleContext): void => {
        const parent = this.symbolStack.length === 0 ? undefined : this.symbolStack.tos;

        const symbol = this.symbolTable.addNewSymbolOfType(t, parent, name, [], []);
        symbol.context = ctx;

        this.symbolStack.push(symbol);
    };
}
