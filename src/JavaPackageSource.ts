/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import * as fs from "fs";
import { Symbol, FieldSymbol, MethodSymbol, ScopedSymbol, SymbolTable, Modifier } from "antlr4-c3";

import { PackageSource } from "./PackageSource";
import { JavaClassSymbol } from "./parsing/JavaClassSymbol";
import { ConstructorSymbol, EnumSymbol, JavaInterfaceSymbol } from "./parsing/JavaParseTreeWalker";

/** Member type strings as used in the package json files. */
type MemberType = "method" | "field" | "constructor" | "class" | "interface" | "enum" | "annotation";

/** Main type strings as used in the package json files. */
type MainType = "class" | "interface" | "enum" | "annotation";

/** A record for a member of a type. */
interface IMemberRecord {
    name: string;
    modifiers: string[];
    type: MemberType;
}

/** This is the type of which the package json files consist. Each file contains an array of these. */
interface ITypeRecord {
    /** The fully qualified name of the type. */
    name: string;

    /** The type of the type. */
    type: MainType;

    /** The modifiers of the type (like abstract or static). */
    modifiers: string[];

    /** The fully qualified names of the types this type extends. Must be a list for interfaces. */
    extends: string[];

    /** The fully qualified names of the types this type implements. */
    implements: string[];

    /** The members of the type (fields, methods and nested types). */
    members: IMemberRecord[];
}

/** A package source specifically for Java imports. It handles symbol resolution for known Java SDK packages. */
export class JavaPackageSource extends PackageSource {

    /**
     * Creates the complete symbol the java.base module, which includes all java.* packages and some javax.* packages.
     *
     * @returns The created symbol table.
     */
    protected createSymbolTable(): SymbolTable {
        const symbolTable = new SymbolTable("Java", { allowDuplicateSymbols: false });

        const dataFiles = fs.readdirSync("data").sort((a, b) => {
            if (a.length < b.length) {
                return -1;
            } else if (a.length > b.length) {
                return 1;
            }

            return a.localeCompare(b);
        });

        let records: ITypeRecord[] = [];
        let pending: ITypeRecord[] = [];

        // First read all records into memory to allow sorting them in their dependency order.
        dataFiles.forEach((dataFile) => {
            const namespace = dataFile.substring(0, dataFile.length - 5);
            symbolTable.addNewNamespaceFromPathSync(symbolTable, namespace, ".");

            const content = fs.readFileSync(`data/${dataFile}`, "utf8");
            const data = JSON.parse(content) as ITypeRecord[];
            pending.push(...data);
        });

        let lastPendingCount = 0;
        do {
            lastPendingCount = pending.length;
            records = pending;
            pending = [];
            while (records.length > 0) {
                const next = records.shift();
                if (next !== undefined) {
                    const extendsList: Symbol[] = [];
                    const implementsList: Symbol[] = [];

                    let ok = next.extends.every((name) => {
                        const s = symbolTable.symbolFromPath(name);
                        if (s === undefined) {
                            return false;
                        }

                        extendsList.push(s);

                        return true;
                    });
                    ok &&= next.implements.every((name) => {
                        const s = symbolTable.symbolFromPath(name);
                        if (s === undefined) {
                            return false;
                        }

                        implementsList.push(s);

                        return true;
                    });

                    if (!ok) {
                        pending.push(next);
                        continue;
                    }

                    const parts = next.name.split(".");
                    const name = parts.pop();
                    const parent = symbolTable.symbolFromPath(parts.join(".")) as ScopedSymbol;
                    if (parent === undefined) {
                        // For nested types whose parent is not yet available.
                        pending.push(next);
                        continue;
                    }

                    let mainSymbol: ScopedSymbol;
                    switch (next.type) {
                        case "class": {
                            mainSymbol = symbolTable.addNewSymbolOfType(JavaClassSymbol, parent, name, extendsList,
                                implementsList);
                            break;
                        }

                        case "interface": {
                            const symbol = symbolTable.addNewSymbolOfType(JavaInterfaceSymbol, parent, name,
                                extendsList, implementsList);

                            // All registered interfaces are implemented as native interfaces.
                            symbol.isTypescriptCompatible = true;
                            mainSymbol = symbol;
                            break;
                        }

                        case "enum": {
                            mainSymbol = symbolTable.addNewSymbolOfType(EnumSymbol, parent, name, extendsList,
                                implementsList);
                            break;
                        }

                        case "annotation": {
                            break;
                        }

                        default: {
                            throw new Error(`Unknown type: ${next.type}`);
                        }
                    }

                    next.members.forEach((member) => {
                        switch (member.type) {
                            case "field": {
                                const s = symbolTable.addNewSymbolOfType(FieldSymbol, mainSymbol, member);
                                if (member.modifiers.includes("static")) {
                                    s.modifiers.add(Modifier.Static);
                                }

                                break;
                            }

                            case "method": {
                                const s = symbolTable.addNewSymbolOfType(MethodSymbol, mainSymbol, member);
                                if (member.modifiers.includes("static")) {
                                    s.modifiers.add(Modifier.Static);
                                }

                                break;
                            }

                            case "constructor": {
                                symbolTable.addNewSymbolOfType(ConstructorSymbol, mainSymbol, member);
                                break;
                            }

                            case "enum":
                            case "annotation":
                            case "class":
                            case "interface": {
                                // Nested types are ignored for now.
                                break;
                            }

                            default: {
                                throw new Error(`Unknown member type: ${member.type}`);
                            }
                        }
                    });
                }
            }

        } while (lastPendingCount !== pending.length);

        if (pending.length > 0) {
            throw new Error(`Cannot resolve types: ${pending.map((r) => { return r.name; }).join(", ")}`);
        }

        return symbolTable;
    }
}
