/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { Symbol, FieldSymbol, MethodSymbol, ScopedSymbol, SymbolTable, Modifier } from "antlr4-c3";

import { PackageSource } from "./PackageSource";
import { JavaClassSymbol } from "./parsing/JavaClassSymbol";
import { JavaInterfaceSymbol } from "./parsing/JavaParseTreeWalker";

interface IClassHierarchyEntry {
    // Qualified name.
    name: string;
    isInterface?: true;

    extends?: string;
    implements?: string[];
    staticMethods?: string[];
    methods?: string[];
    fields?: string[];
}

// A package source specifically for Java imports. It handles symbol resolution for known Java SDK packages.
export class JavaPackageSource extends PackageSource {

    // Definition of the part of the Java class hierarchy we support here.
    // The symbol table is created from this array.
    private static readonly javaClassHierarchy: IClassHierarchyEntry[] = [
        {
            name: "java.lang.Object", methods: [
                "class", "equals", "getClass", "hashCode", "notify", "notifyAll", "toString", "wait", "clone",
            ],
        },
        { name: "java.lang.Enum", extends: "java.lang.Object" },
        { name: "java.lang.Character", extends: "java.lang.Object" },
        { name: "java.lang.Class", extends: "java.lang.Object" },
        { name: "java.lang.Number", extends: "java.lang.Object" },
        { name: "java.lang.Integer", extends: "java.lang.Number" },
        { name: "java.lang.Long", extends: "java.lang.Number" },
        { name: "java.lang.Boolean", extends: "java.lang.Object" },
        { name: "java.lang.StringBuilder", extends: "java.lang.Object" },
        { name: "java.lang.StringBuffer", extends: "java.lang.StringBuilder" },
        {
            name: "java.lang.Throwable", extends: "java.lang.Object", methods: [
                "addSuppressed", "fillInStackTrace", "getCause", "getLocalizedMessage", "getMessage", "getStackTrace",
                "getSuppressed", "initCause", "printStackTrace", "setStackTrace", "toString",
            ],
        },
        { name: "java.lang.Exception", extends: "java.lang.Throwable" },
        { name: "java.lang.RuntimeException", extends: "java.lang.Exception" },
        { name: "java.lang.IllegalArgumentException", extends: "java.lang.RuntimeException" },

        { name: "java.lang.NumberFormatException", extends: "java.lang.IllegalArgumentException" },
        { name: "java.lang.IllegalStateException", extends: "java.lang.RuntimeException" },
        { name: "java.lang.IndexOutOfBoundsException", extends: "java.lang.RuntimeException" },
        { name: "java.lang.NoSuchElementException", extends: "java.lang.RuntimeException" },
        { name: "java.lang.NullPointerException", extends: "java.lang.RuntimeException" },
        { name: "java.lang.UnsupportedOperationException", extends: "java.lang.RuntimeException" },
        { name: "java.lang.NegativeArraySizeException", extends: "java.lang.RuntimeException" },

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
        { name: "java.io.Serializable", isInterface: true },
        { name: "java.lang.CharSequence", isInterface: true },
        {
            name: "java.lang.String", extends: "java.lang.Object", implements: [
                "java.io.Serializable", "java.lang.CharSequence", "java.lang.Comparable",
            ],
        },
        { name: "java.lang.StackTraceElement", extends: "java.lang.Object" },

        { name: "java.io.Closeable", isInterface: true },
        { name: "java.io.AutoCloseable", isInterface: true },
        { name: "java.io.Flushable", isInterface: true },

        { name: "java.io.File", extends: "java.lang.Object" },
        { name: "java.io.InputStream", extends: "java.lang.Object", implements: ["java.io.Closeable"] },
        {
            name: "java.io.OutputStream", extends: "java.lang.Object",
            implements: ["java.io.Closeable", "java.io.AutoCloseable", "java.io.Flushable"],
        },
        { name: "java.io.FileInputStream", extends: "java.io.InputStream", implements: ["java.io.AutoCloseable"] },
        { name: "java.io.FileOutputStream", extends: "java.io.OutputStream" },
        { name: "java.io.FilterOutputStream", extends: "java.io.OutputStream" },
        { name: "java.io.BufferedOutputStream", extends: "java.io.FilterOutputStream" },
        { name: "java.io.PrintStream", extends: "java.io.FilterOutputStream" },
        {
            name: "java.io.Reader", extends: "java.lang.Object",
            implements: ["java.lang.Readable", "java.io.Closeable", "java.io.AutoCloseable"],
        },
        {
            name: "java.io.Writer",
            extends: "java.lang.Object",
            implements: [
                "java.io.Closeable", "java.io.Flushable", "java.lang.Appendable", "java.io.AutoCloseable",
            ],
        },
        { name: "java.io.BufferedReader", extends: "java.io.Reader" },
        { name: "java.io.InputStreamReader", extends: "java.io.Reader" },
        { name: "java.io.FileReader", extends: "java.io.InputStreamReader" },
        { name: "java.io.BufferedWriter", extends: "java.io.Writer" },
        { name: "java.io.OutputStreamWriter", extends: "java.io.Writer" },
        { name: "java.io.FileWriter", extends: "java.io.OutputStreamWriter" },

        { name: "java.io.IOException", extends: "java.lang.Exception" },
        { name: "java.io.FileNotFoundException", extends: "java.io.IOException" },
        { name: "java.io.UnsupportedEncodingException", extends: "java.io.IOException" },
        { name: "java.io.ObjectStreamException", extends: "java.io.IOException" },
        { name: "java.io.InvalidClassException", extends: "java.io.ObjectStreamException" },

        { name: "java.nio.Buffer", extends: "java.lang.Object" },
        { name: "java.nio.CharBuffer", extends: "java.nio.Buffer" },
        { name: "java.nio.ByteBuffer", extends: "java.nio.Buffer" },
        { name: "java.nio.IntBuffer", extends: "java.nio.Buffer" },
        { name: "java.nio.ByteOrder", extends: "java.lang.Object" },
        { name: "java.nio.InvalidMarkException", extends: "java.lang.IllegalStateException" },
        { name: "java.nio.BufferOverflowException", extends: "java.lang.RuntimeException" },
        { name: "java.nio.BufferUnderflowException", extends: "java.lang.RuntimeException" },
        { name: "java.nio.ReadOnlyBufferException", extends: "java.lang.RuntimeException" },

        { name: "java.nio.charset.Charset", extends: "java.lang.Object", implements: ["java.lang.Comparable"] },
        { name: "java.nio.charset.StandardCharsets", extends: "java.lang.Object" },

        { name: "java.util.Collection", isInterface: true },
        { name: "java.util.Collections", extends: "java.lang.Object" },
        { name: "java.util.List", isInterface: true, implements: ["java.util.Collection"] },
        { name: "java.util.ArrayList", extends: "java.lang.Object", implements: ["java.util.List"] },
        { name: "java.util.ListIterator", isInterface: true },
        { name: "java.util.ArrayListIterator", extends: "java.lang.Object", implements: ["java.util.ListIterator"] },
        { name: "java.util.Arrays", extends: "java.lang.Object" },
        {
            name: "java.util.Map", isInterface: true, methods: [
                "clear", "containsKey", "containsValue", "entrySet", "equals", "get", "hashCode", "isEmpty", "keySet",
                "put", "putAll", "remove", "size", "values",
            ],
        },
        {
            name: "java.util.Set", isInterface: true, methods: [
                "add", "addAll", "clear", "contains", "containsAll", "equals", "hashCode", "isEmpty", "iterator",
                "remove", "removeAll", "retainAll", "size", "toArray",
            ],
        },
        {
            name: "java.util.BitSet", extends: "java.lang.Object",
            implements: ["java.io.Serializable", "java.lang.Cloneable"],
        },
        { name: "java.util.Properties", extends: "java.util.Map" },
        { name: "java.util.Objects", extends: "java.lang.Object" },
        { name: "java.util.HashMap", extends: "java.lang.Object", implements: ["java.util.Map"] },
        { name: "java.util.HashSet", extends: "java.lang.Object", implements: ["java.util.Set"] },
        { name: "java.util.LinkedHashMap", extends: "java.util.HashMap" },
        { name: "java.util.LinkedHashSet", extends: "java.util.HashSet" },
        { name: "java.util.IdentityHashMap", extends: "java.lang.Object", implements: ["java.util.Map"] },
        { name: "java.util.WeakHashMap", extends: "java.lang.Object", implements: ["java.util.Map"] },
        { name: "java.util.Stack", extends: "java.lang.Object" },
        { name: "java.util.Comparator", isInterface: true },
        { name: "java.util.Iterator", isInterface: true },
        { name: "java.util.Queue", isInterface: true, extends: "java.util.Collection" },
        { name: "java.util.Deque", isInterface: true, extends: "java.util.Queue" },
        {
            name: "java.util.Locale", extends: "java.lang.Object",
            implements: ["java.lang.Cloneable", "java.io.Serializable"],
        },
        {
            name: "java.util.LinkedList", extends: "java.lang.Object", implements: ["java.io.Serializable",
                "java.lang.Cloneable", "java.util.Deque", "java.util.List"],
        },
        {
            name: "java.util.Date", extends: "java.lang.Object",
            implements: ["java.io.Serializable", "java.lang.Cloneable", "java.lang.Comparable"],
            staticMethods: ["UTC", "from", "parse"],
            methods: ["after", "before", "getDate", "getDay", "getHours", "getMinutes", "getMonth", "getSeconds",
                "getTime", "getTimezoneOffset", "getYear", "setDate", "setHours", "setMinutes", "setMonth",
                "setSeconds", "setTime", "setYear", "toGMTString", "toLocalString"],
        },

        { name: "java.util.regex.Pattern", extends: "java.lang.Object" },
        { name: "java.util.regex.MatchResult", isInterface: true },
        { name: "java.util.regex.Matcher", extends: "java.lang.Object", implements: ["java.util.regex.MatchResult"] },
        { name: "java.util.concurrent.CancellationException", extends: "java.lang.IllegalStateException" },
        {
            name: "java.util.concurrent.CopyOnWriteArrayList", extends: "java.lang.Object", methods: [
                "add", "addAll", "addAllAbsent", "addIfAbsent", "clear", "clone", "contains", "containsAll", "equals",
                "forEach", "get", "hashCode", "indexOf", "isEmpty", "iterator", "lastIndexOf", "listIterator",
                "remove", "removeAll", "removeIf", "replaceAll", "retainAll", "set", "size", "sort", "spliterator",
                "subList", "toArray", "toString",
            ],
        },
        { name: "java.util.Calendar", extends: "java.lang.Object" },
        { name: "java.util.Calendar.Builder", extends: "java.lang.Object" },
        {
            name: "java.util.TimeZone", extends: "java.lang.Object", methods: [
                "getAvailableIDs", "getDisplayName",
            ],
        },

        { name: "java.text.CharacterIterator", extends: "java.lang.Cloneable", isInterface: true },
        { name: "java.text.AttributedCharacterIterator", extends: "java.text.CharacterIterator", isInterface: true },
        {
            name: "java.text.AttributedCharacterIterator.Attribute", extends: "java.lang.Object",
            implements: ["java.io.Serializable"],
            methods: ["getName", "readResolve"],
        },
        { name: "java.text.Format", extends: "java.lang.Object" },
        { name: "java.text.Format.Field", extends: "java.text.AttributedCharacterIterator.Attribute" },
        {
            name: "java.text.ParsePosition", extends: "java.lang.Object", methods: [
                "getErrorIndex", "getIndex", "setErrorIndex", "setIndex",
            ],
        },
        { name: "java.text.DateFormat", extends: "java.text.Format" },
        { name: "java.text.DateFormat.Field", extends: "java.text.Format.Field" },
        {
            name: "java.text.SimpleDateFormat", extends: "java.text.DateFormat",
            methods: ["applyPattern", "format", "get2DigitYearStart", "getDateFormatSymbols",
                "parse", "set2DigitYearStart", "setDateFormatSymbols", "toLocalizedPattern", "toPattern",
            ],
        },
        { name: "java.text.DecimalFormatSymbols", extends: "java.lang.Object" },

        { name: "java.time.Instant", extends: "java.lang.Object" },
    ];

    protected createSymbolTable(): SymbolTable {
        const symbolTable = new SymbolTable("Java", { allowDuplicateSymbols: false });

        // Start by adding all supported namespaces.
        symbolTable.addNewNamespaceFromPathSync(symbolTable, "java.lang", ".");
        symbolTable.addNewNamespaceFromPathSync(symbolTable, "java.io", ".");
        symbolTable.addNewNamespaceFromPathSync(symbolTable, "java.nio", ".");
        symbolTable.addNewNamespaceFromPathSync(symbolTable, "java.nio.charset", ".");
        symbolTable.addNewNamespaceFromPathSync(symbolTable, "java.util.regex", ".");
        symbolTable.addNewNamespaceFromPathSync(symbolTable, "java.util.concurrent", ".");
        symbolTable.addNewNamespaceFromPathSync(symbolTable, "java.text", ".");
        symbolTable.addNewNamespaceFromPathSync(symbolTable, "java.time", ".");

        // Now all classes and interfaces.
        JavaPackageSource.javaClassHierarchy.forEach((entry) => {
            const extendsList = [];
            const implementsList: Symbol[] = [];

            if (entry.extends) {
                const symbol = symbolTable.symbolFromPath(entry.extends);
                if (!symbol) {
                    throw new Error(`Cannot find class: ${entry.extends}`);
                }
                extendsList.push(symbol);
            }

            entry.implements?.forEach((name) => {
                const symbol = symbolTable.symbolFromPath(name);
                if (!symbol) {
                    throw new Error(`Cannot find interface: ${name}`);
                }
                implementsList.push(symbol);
            });

            const parts = entry.name.split(".");
            const name = parts.pop();
            const parent = symbolTable.symbolFromPath(parts.join(".")) as ScopedSymbol;

            let mainSymbol: ScopedSymbol;
            if (entry.isInterface) {
                const symbol = symbolTable.addNewSymbolOfType(JavaInterfaceSymbol, parent, name, extendsList,
                    implementsList);

                // All registered interfaces are implemented as native interfaces.
                symbol.isTypescriptCompatible = true;
                mainSymbol = symbol;
            } else {
                mainSymbol = symbolTable.addNewSymbolOfType(JavaClassSymbol, parent, name, extendsList,
                    implementsList);
            }

            entry.fields?.forEach((field) => {
                symbolTable.addNewSymbolOfType(FieldSymbol, mainSymbol, field);
            });

            entry.methods?.forEach((method) => {
                symbolTable.addNewSymbolOfType(MethodSymbol, mainSymbol, method);
            });

            entry.staticMethods?.forEach((method) => {
                const s = symbolTable.addNewSymbolOfType(MethodSymbol, mainSymbol, method);
                s.modifiers.add(Modifier.Static);
            });
        });

        return symbolTable;
    }

}
