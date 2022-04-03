/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { ClassSymbol, InterfaceSymbol, ScopedSymbol, SymbolTable } from "antlr4-c3";

import { PackageSource } from "../../src/PackageSource";

// A package source specifically for Java imports. It handles symbol resolution for known Java SDK packages.
export class JavaPackageSource extends PackageSource {

    // Base classes for many exceptions.
    private throwable: ClassSymbol;
    private exception: ClassSymbol;

    public constructor(packageId: string, targetFile: string) {
        super(packageId, "", targetFile);

        this.createSymbolTable();
    }

    private createSymbolTable = (): void => {
        this.symbolTable = new SymbolTable("Java", { allowDuplicateSymbols: false });

        this.createLangEntries(this.symbolTable);
        this.createIoEntries(this.symbolTable);
        this.createUtilEntries(this.symbolTable);
    };

    private createLangEntries = (parent: ScopedSymbol): void => {
        const lang = this.symbolTable.addNewNamespaceFromPathSync(parent, "java.lang", ".");

        this.symbolTable.addNewSymbolOfType(ClassSymbol, lang, "Character", [], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, lang, "Class", [], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, lang, "Integer", [], []);
        const stringBuilder = this.symbolTable.addNewSymbolOfType(ClassSymbol, lang, "StringBuilder", [], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, lang, "StringBuffer", [stringBuilder], []);

        this.throwable = this.symbolTable.addNewSymbolOfType(ClassSymbol, lang, "Throwable", [], []);
        this.exception = this.symbolTable.addNewSymbolOfType(ClassSymbol, lang, "Exception", [this.throwable], []);
        const runtimeException = this.symbolTable.addNewSymbolOfType(ClassSymbol, lang, "RuntimeException",
            [this.exception], []);
        const illegalArgumentException = this.symbolTable.addNewSymbolOfType(ClassSymbol, lang,
            "IllegalArgumentException", [runtimeException], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, lang, "NumberFormatException", [illegalArgumentException], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, lang, "IllegalStateException", [runtimeException], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, lang, "IndexOutOfBoundsException", [runtimeException], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, lang, "NoSuchElementException", [runtimeException], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, lang, "NullPointerException", [runtimeException], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, lang, "UnsupportedOperationException", [runtimeException], []);

        const error = this.symbolTable.addNewSymbolOfType(ClassSymbol, lang, "Error", [this.throwable], []);
        const linkageError = this.symbolTable.addNewSymbolOfType(ClassSymbol, lang, "LinkageError", [error], []);
        const incompatibleClassChangeError = this.symbolTable.addNewSymbolOfType(ClassSymbol, lang,
            "IncompatibleClassChangeError", [linkageError], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, lang, "NoSuchMethodError", [incompatibleClassChangeError], []);

        this.symbolTable.addNewSymbolOfType(ClassSymbol, lang, "Cloneable", [], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, lang, "System", [], []);
    };

    private createIoEntries = (parent: ScopedSymbol): void => {
        const io = this.symbolTable.addNewNamespaceFromPathSync(parent, "java.io", ".");

        this.symbolTable.addNewSymbolOfType(ClassSymbol, io, "File", [], []);
        const outputStream = this.symbolTable.addNewSymbolOfType(ClassSymbol, io, "OutputStream", [], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, io, "FileOutputStream", [outputStream], []);
        const filterOutputStream = this.symbolTable.addNewSymbolOfType(ClassSymbol, io, "FilterOutputStream",
            [outputStream], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, io, "BufferedOutputStream", [filterOutputStream], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, io, "PrintStream", [filterOutputStream], []);

        const ioException = this.symbolTable.addNewSymbolOfType(ClassSymbol, io, "IOException", [this.exception], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, io, "FileNotFoundException", [ioException], []);
    };

    private createUtilEntries = (parent: ScopedSymbol): void => {
        const util = this.symbolTable.addNewNamespaceFromPathSync(parent, "java.util", ".");

        const collection = this.symbolTable.addNewSymbolOfType(InterfaceSymbol, util, "Collection", [], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, util, "Collections", [], []);
        const list = this.symbolTable.addNewSymbolOfType(InterfaceSymbol, util, "List", [], [collection]);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, util, "ArrayList", [], [list]);

        // Support classes.
        const listIterator = this.symbolTable.addNewSymbolOfType(InterfaceSymbol, util, "ListIterator", [], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, util, "ArrayListIterator", [], [listIterator]);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, util, "Arrays", [], []);

        const hashMap = this.symbolTable.addNewSymbolOfType(ClassSymbol, util, "HashMap", [], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, util, "LinkedHashMap", [hashMap], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, util, "Stack", [], []);

        this.createRegexEntries(util);
    };

    private createRegexEntries = (parent: ScopedSymbol): void => {
        const regex = this.symbolTable.addNewNamespaceFromPathSync(parent, "regex", ".");

        this.symbolTable.addNewSymbolOfType(ClassSymbol, regex, "Pattern", [], []);
        const matchResult = this.symbolTable.addNewSymbolOfType(ClassSymbol, regex, "MatchResult", [], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, regex, "Matcher", [], [matchResult]);
    };
}
