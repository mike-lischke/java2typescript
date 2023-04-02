/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import fs from "fs";

import { CharStream, CharStreams, CommonTokenStream } from "antlr4ts";

import { JavaLexer } from "../parser/generated/JavaLexer.js";
import { JavaParser, CompilationUnitContext } from "../parser/generated/JavaParser.js";

import { PackageSource } from "./PackageSource.js";
import { JavaFileSymbolTable } from "./JavaFileSymbolTable.js";
import { JavaErrorListener } from "./parsing/JavaErrorListener.js";
import { ParseTree } from "antlr4ts/tree/index.js";
import { Interval } from "antlr4ts/misc/";
import { printParseTreeStack } from "./utilities.js";
import { ISymbolInfo } from "./conversion/types.js";

/**
 * This interface keeps all concerned parsing parts together, to ensure they stay alive during the entire
 * processing time. Symbol tables and parse trees depend on that.
 */
interface IFileParseInfo {
    content: string;
    inputStream: CharStream;
    lexer: JavaLexer;
    tokenStream: CommonTokenStream;
    parser: JavaParser;
    tree: CompilationUnitContext;
}

/** A source class for a single Java source file. */
export class JavaFileSource extends PackageSource {

    /** Only set if a file was parsed. */
    public fileParseInfo?: IFileParseInfo;

    public constructor(packageId: string, sourceFile: string, targetFile: string, private packageRoot: string,
        private replacements?: Map<RegExp, string>) {
        super(packageId, sourceFile, targetFile);
    }

    public override get parseTree(): CompilationUnitContext | undefined {
        if (!this.fileParseInfo) {
            this.parse();
        }

        return this.fileParseInfo?.tree;
    }

    public override getQualifiedSymbol = (context: ParseTree, name: string): ISymbolInfo | undefined => {
        return (this.symbolTable as JavaFileSymbolTable).getQualifiedSymbol(context, name);
    };

    public override printParseTreeForPosition = (position: { column: number; row: number; }): void => {
        if (this.fileParseInfo) {
            printParseTreeStack(this.sourceFile, this.fileParseInfo.tree, this.fileParseInfo.parser.ruleNames,
                position);
        }
    };

    protected override textFromInterval = (interval: Interval): string => {
        return this.fileParseInfo?.inputStream.getText(interval) ?? "";
    };

    private parse = (): void => {
        if (!fs.existsSync(this.sourceFile)) {
            console.warn(`\nFile ${this.sourceFile} does not exist.`);

            return;
        }

        let content = fs.readFileSync(this.sourceFile, "utf-8");
        this.replacements?.forEach((value, pattern) => {
            content = content.replace(pattern, value);
        });

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

            this.symbolTable = new JavaFileSymbolTable(this, this.packageRoot, this.importList);
            this.importList.delete(this);
        } else {
            throw new Error("Parsing failed for " + this.sourceFile);
        }
    };

}
