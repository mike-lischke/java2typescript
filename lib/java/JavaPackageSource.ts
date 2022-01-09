/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { ClassSymbol, InterfaceSymbol, ScopedSymbol, SymbolTable } from "antlr4-c3";

import { PackageSource } from "../../src/PackageSource";
import { FileSymbol } from "../../src/parsing/JavaParseTreeWalker";

// A package source specifically for Java imports. It handles all package imports from Java.
export class JavaPackageSource extends PackageSource {

    public constructor(packageId: string, targetFile: string) {
        super(packageId, "", targetFile);

        this.createSymbolTable();
    }

    private createSymbolTable = (): void => {
        this.symbolTable = new SymbolTable("Java", { allowDuplicateSymbols: false });
        const file = this.symbolTable.addNewSymbolOfType(FileSymbol, undefined, "file");

        this.createLangEntries(file);
        this.createIoEntries(file);
        this.createUtilEntries(file);
    };

    private createLangEntries = (parent: ScopedSymbol): void => {
        const lang = this.symbolTable.addNewNamespaceFromPathSync(parent, "java.lang", ".");

        this.symbolTable.addNewSymbolOfType(ClassSymbol, lang, "Character", [], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, lang, "Class", [], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, lang, "IllegalArgumentException", [], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, lang, "IndexOutOfBoundsException", [], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, lang, "Integer", [], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, lang, "NoSuchElementException", [], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, lang, "NumberFormatException", [], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, lang, "StringBuilder", [], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, lang, "StringBuffer", [], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, lang, "IllegalStateException", [], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, lang, "IOException", [], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, lang, "Exception", [], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, lang, "Cloneable", [], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, lang, "System", [], []);
    };

    private createIoEntries = (parent: ScopedSymbol): void => {
        const io = this.symbolTable.addNewNamespaceFromPathSync(parent, "java.io", ".");

        this.symbolTable.addNewSymbolOfType(ClassSymbol, io, "File", [], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, io, "InputStreamReader", [], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, io, "FileInputStream", [], []);

    };

    private createUtilEntries = (parent: ScopedSymbol): void => {
        const io = this.symbolTable.addNewNamespaceFromPathSync(parent, "java.util", ".");

        this.symbolTable.addNewSymbolOfType(ClassSymbol, io, "ArrayList", [], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, io, "ArrayListIterator", [], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, io, "Arrays", [], []);
        this.symbolTable.addNewSymbolOfType(InterfaceSymbol, io, "Collection", [], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, io, "LinkedHashMap", [], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, io, "List", [], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, io, "ListIterator", [], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, io, "Stack", [], []);
    };
}
