/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { ClassSymbol, InterfaceSymbol, ScopedSymbol, SymbolTable } from "antlr4-c3";

import { PackageSource } from "../../src/PackageSource";

interface IClassHierarchyEntry {
    // Qualified name.
    name: string;
    isInterface?: true;

    extends?: string;
    implements?: string[];
}

// A package source specifically for Java imports. It handles symbol resolution for known Java SDK packages.
export class JavaPackageSource extends PackageSource {

    // Definition of the part of the Java class hierarchy, we support here.
    // The symbol table is created from this array.
    private static readonly javaClassHierarchy: IClassHierarchyEntry[] = [
        { name: "java.lang.Character" },
        { name: "java.lang.Class" },
        { name: "java.lang.Integer" },
        { name: "java.lang.StringBuilder" },
        { name: "java.lang.StringBuffer", extends: "java.lang.StringBuilder" },
        { name: "java.lang.Throwable" },
        { name: "java.lang.Exception", extends: "java.lang.Throwable" },
        { name: "java.lang.RuntimeException", extends: "java.lang.Exception" },
        { name: "java.lang.IllegalArgumentException", extends: "java.lang.RuntimeException" },

        { name: "java.lang.NumberFormatException", extends: "java.lang.IllegalArgumentException" },
        { name: "java.lang.IllegalStateException", extends: "java.lang.RuntimeException" },
        { name: "java.lang.IndexOutOfBoundsException", extends: "java.lang.RuntimeException" },
        { name: "java.lang.NoSuchElementException", extends: "java.lang.RuntimeException" },
        { name: "java.lang.NullPointerException", extends: "java.lang.RuntimeException" },
        { name: "java.lang.UnsupportedOperationException", extends: "java.lang.RuntimeException" },

        { name: "java.lang.Error", extends: "java.lang.Throwable" },
        { name: "java.lang.LinkageError", extends: "java.lang.Error" },
        { name: "java.lang.IncompatibleClassChangeError", extends: "java.lang.LinkageError" },
        { name: "java.lang.NoSuchMethodError", extends: "java.lang.IncompatibleClassChangeError" },
        { name: "java.lang.VirtualMachineError", extends: "java.lang.Error" },
        { name: "java.lang.OutOfMemoryError", extends: "java.lang.VirtualMachineError" },
        { name: "java.lang.System" },

        { name: "java.lang.Cloneable", isInterface: true },
        { name: "java.lang.Appendable", isInterface: true },
        { name: "java.lang.Comparable", isInterface: true },
        { name: "java.lang.Readable", isInterface: true },
        { name: "java.lang.StackTraceElement" },

        { name: "java.io.Closeable", isInterface: true },
        { name: "java.io.AutoCloseable", isInterface: true },
        { name: "java.io.Flushable", isInterface: true },

        { name: "java.io.File" },
        { name: "java.io.InputStream", implements: ["java.io.Closable"] },
        { name: "java.io.OutputStream", implements: ["java.io.Closable", "java.io.AutoClosable", "java.io.Flushable"] },
        { name: "java.io.FileOutputStream", extends: "java.io.OutputStream" },
        { name: "java.io.FilterOutputStream", extends: "java.io.OutputStream" },
        { name: "java.io.BufferedOutputStream", extends: "java.io.FilteredOutputStream" },
        { name: "java.io.PrintStream", extends: "java.io.FilteredOutputStream" },
        { name: "java.io.Reader", implements: ["java.lang.Readable", "java.io.Closeable", "java.io.AutoCloseable"] },
        { name: "java.io.BufferedReader", extends: "java.io.Reader" },
        { name: "java.io.InputStreamReader", extends: "java.io.Reader" },
        { name: "java.io.FileReader", extends: "java.io.InputStreamReader" },

        { name: "java.io.IOException", extends: "java.lang.Exception" },
        { name: "java.io.FileNotFoundException", extends: "java.lang.IOException" },
        { name: "java.io.UnsupportedEncodingException", extends: "java.lang.IOException" },

        { name: "java.nio.Buffer" },
        { name: "java.nio.CharBuffer", extends: "java.nio.Buffer" },
        { name: "java.nio.ByteBuffer", extends: "java.nio.Buffer" },
        { name: "java.nio.InvalidMarkException", extends: "java.lang.IllegalStateException" },
        { name: "java.nio.BufferOverflowException", extends: "java.lang.RuntimeException" },
        { name: "java.nio.BufferUnderflowException", extends: "java.lang.RuntimeException" },
        { name: "java.nio.ReadOnlyBufferException", extends: "java.lang.RuntimeException" },

        { name: "java.nio.charset.Charset", implements: ["java.lang.Comparable"] },
        { name: "java.nio.charset.StandardCharsets" },

        { name: "java.util.Collection", isInterface: true },
        { name: "java.util.Collections" },
        { name: "java.util.List", isInterface: true, implements: ["java.util.Collection"] },
        { name: "java.util.ArrayList", implements: ["java.util.List"] },
        { name: "java.util.ListIterator", isInterface: true },
        { name: "java.util.ArrayListIterator", implements: ["java.util.ListIterator"] },
        { name: "java.util.Arrays" },
        { name: "java.util.HashMap" },
        { name: "java.util.LinkedHashMap", extends: "java.util.HashMap" },
        { name: "java.util.Stack" },
        { name: "java.util.Comparator" },
        { name: "java.util.Locale", implements: ["java.lang.Cloneable", "java.lang.Serializable"] },

        { name: "java.util.regex.Pattern" },
        { name: "java.util.regex.MatchResult", isInterface: true },
        { name: "java.util.regex.Matcher", implements: ["java.util.regex.MatchResult"] },
    ];

    public constructor(packageId: string, targetFile: string) {
        super(packageId, "", targetFile);

        this.createSymbolTable();
    }

    private createSymbolTable = (): void => {
        this.symbolTable = new SymbolTable("Java", { allowDuplicateSymbols: false });

        // Start by adding all supported namespaces.
        this.symbolTable.addNewNamespaceFromPathSync(this.symbolTable, "java.lang", ".");
        this.symbolTable.addNewNamespaceFromPathSync(this.symbolTable, "java.io", ".");
        this.symbolTable.addNewNamespaceFromPathSync(this.symbolTable, "java.nio", ".");
        this.symbolTable.addNewNamespaceFromPathSync(this.symbolTable, "java.util.regex", ".");

        // Now all classes and interfaces.
        JavaPackageSource.javaClassHierarchy.forEach((entry) => {
            const extendsList = [];
            const implementsList = [];

            if (entry.extends) {
                extendsList.push(this.symbolTable.symbolFromPath(entry.extends));
            }

            entry.implements?.forEach((name) => {
                implementsList.push(this.symbolTable.symbolFromPath(name));
            });

            const parts = entry.name.split(".");
            const name = parts.pop();
            const parent = this.symbolTable.symbolFromPath(parts.join(".")) as ScopedSymbol;
            if (entry.isInterface) {
                this.symbolTable.addNewSymbolOfType(InterfaceSymbol, parent, name, extendsList, implementsList);
            } else {
                this.symbolTable.addNewSymbolOfType(ClassSymbol, parent, name, extendsList, implementsList);
            }
        });
    };

}
