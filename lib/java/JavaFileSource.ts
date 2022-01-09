/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import fs from "fs";

import { CharStream, CharStreams, CommonTokenStream } from "antlr4ts";

import { JavaLexer } from "../../java/generated/JavaLexer";
import { JavaParser, CompilationUnitContext } from "../../java/generated/JavaParser";

import { PackageSource } from "../../src/PackageSource";
import { JavaFileSymbolTable } from "./JavaFileSymbolTable";
import { JavaErrorListener } from "../../src/parsing/JavaErrorListener";
import { ParseTree } from "antlr4ts/tree";
import { Interval } from "antlr4ts/misc/Interval";
import { printParseTreeStack } from "../../src/Utilities";

// This interface keeps all concerned parsing parts together, to ensure they stay alive during the entire
// processing time. Symbol tables and parse trees depend on that.
interface IFileParseInfo {
    content: string;
    inputStream: CharStream;
    lexer: JavaLexer;
    tokenStream: CommonTokenStream;
    parser: JavaParser;
    tree: CompilationUnitContext;
}

// A source class for a single Java source file.
export class JavaFileSource extends PackageSource {

    // Only set if a file was parsed.
    public fileParseInfo?: IFileParseInfo;

    public constructor(packageId: string, sourceFile: string, targetFile: string, packageRoot: string) {
        super(packageId, sourceFile, targetFile);

        this.parse(packageRoot);
    }

    public get parseTree(): CompilationUnitContext | undefined {
        return this.fileParseInfo?.tree;
    }

    public getSymbolQualifier = (context: ParseTree, name: string): string => {
        return (this.symbolTable as JavaFileSymbolTable).getSymbolQualifier(context, name);
    };

    public printParseTreeForPosition = (position: { column: number; row: number }): void => {
        if (this.fileParseInfo) {
            printParseTreeStack(this.sourceFile, this.fileParseInfo.tree, this.fileParseInfo.parser.ruleNames,
                position);
        }
    };

    protected textFromInterval = (interval: Interval): string => {
        return this.fileParseInfo?.inputStream.getText(interval);
    };

    private parse = (packageRoot: string): void => {
        const content = fs.readFileSync(this.sourceFile, "utf-8");
        const inputStream = CharStreams.fromString(content);
        const lexer = new JavaLexer(inputStream);
        const tokenStream = new CommonTokenStream(lexer);
        const parser = new JavaParser(tokenStream);

        const listener = new JavaErrorListener();
        parser.addErrorListener(listener);

        const tree = parser.compilationUnit();

        if (listener.errors.length === 0) {
            this.fileParseInfo = {
                content,
                inputStream,
                lexer,
                tokenStream,
                parser,
                tree,
            };

            this.symbolTable = new JavaFileSymbolTable(tree, packageRoot);
        } else {
            throw new Error("Parsing failed for " + this.sourceFile);
        }
    };

}
