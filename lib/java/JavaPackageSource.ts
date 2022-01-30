/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { ClassSymbol, InterfaceSymbol, MethodSymbol, ScopedSymbol, SymbolTable } from "antlr4-c3";

import { PackageSource } from "../../src/PackageSource";
import { FileSymbol } from "../../src/parsing/JavaParseTreeWalker";

// A package source specifically for Java imports. It handles symbol resolution for known Java SDK packages.
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
        this.symbolTable.addNewSymbolOfType(ClassSymbol, lang, "UnsupportedOperationException", [], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, lang, "IOException", [], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, lang, "NullPointerException", [], []);
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
        const util = this.symbolTable.addNewNamespaceFromPathSync(parent, "java.util", ".");

        // These types are actually not used by default, but converted into straight JS arrays.
        this.symbolTable.addNewSymbolOfType(ClassSymbol, util, "ArrayList", [], []);
        this.symbolTable.addNewSymbolOfType(InterfaceSymbol, util, "Collection", [], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, util, "List", [], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, util, "Collections", [], []);

        // Support classes.
        this.symbolTable.addNewSymbolOfType(ClassSymbol, util, "ArrayListIterator", [], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, util, "Arrays", [], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, util, "LinkedHashMap", [], []);

        const hashMap = this.symbolTable.addNewSymbolOfType(ClassSymbol, util, "HashMap", [], []);
        this.symbolTable.addNewSymbolOfType(MethodSymbol, hashMap, "put");
        this.symbolTable.addNewSymbolOfType(ClassSymbol, util, "ListIterator", [], []);
        this.symbolTable.addNewSymbolOfType(ClassSymbol, util, "Stack", [], []);
    };
}
