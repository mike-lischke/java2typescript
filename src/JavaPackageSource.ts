/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import * as fs from "fs";
import { fileURLToPath } from "node:url";

import {
    FieldSymbol, MethodSymbol, ScopedSymbol, SymbolTable, Modifier, ClassSymbol, InterfaceSymbol,
} from "antlr4-c3";

import { PackageSource } from "./PackageSource.js";
import { JavaClassSymbol } from "./parsing/JavaClassSymbol.js";
import { ConstructorSymbol, EnumSymbol, JavaInterfaceSymbol } from "./parsing/JavaParseTreeWalker.js";

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

    /** A string containing all the type parameters if this type is generic. */
    typeParameters?: string;
}

/** A package source specifically for Java imports. It handles symbol resolution for known Java SDK packages. */
export class JavaPackageSource extends PackageSource {

    /**
     * Creates the complete symbol the java.base module, which includes all java.* packages and some javax.* packages.
     *
     * @returns The created symbol table.
     */
    protected override createSymbolTable(): SymbolTable {
        const symbolTable = new SymbolTable("Java", { allowDuplicateSymbols: true });

        const dataPath = fileURLToPath(new URL("../data/", import.meta.url));
        const dataFiles = fs.readdirSync(dataPath);

        // First read the definition files one by one and add their types to the symbol table.
        // Leave their dependencies unresolved for now.
        const addedSymbols = new Map<ScopedSymbol, ITypeRecord>();
        dataFiles.forEach((dataFile) => {
            const namespace = dataFile.substring(0, dataFile.length - 5);
            symbolTable.addNewNamespaceFromPathSync(symbolTable, namespace, ".");

            const content = fs.readFileSync(`${dataPath}/${dataFile}`, "utf8");
            const data = JSON.parse(content) as ITypeRecord[];

            // Sort records by their name part counts. This ensures that the parent types are always
            // added before their children.
            const records = data.sort((a, b) => {
                const aParts = a.name.split(".");
                const bParts = b.name.split(".");
                if (aParts.length < bParts.length) {
                    return -1;
                } else if (aParts.length > bParts.length) {
                    return 1;
                }

                return 0;
            });

            records.forEach((record) => {
                const parts = record.name.split(".");
                const name = parts.pop();
                const parent = symbolTable.symbolFromPath(parts.join(".")) as ScopedSymbol;
                if (parent === undefined) {
                    throw new Error(`Parent symbol not found: ${record.name}`);
                }

                let newSymbol: ScopedSymbol | undefined;
                switch (record.type) {
                    case "class": {
                        const symbol = symbolTable.addNewSymbolOfType(JavaClassSymbol, parent, name!, [], []);
                        if (record.typeParameters !== undefined) {
                            symbol.typeParameters = record.typeParameters;
                        }

                        newSymbol = symbol;
                        break;
                    }

                    case "interface": {
                        const symbol = symbolTable.addNewSymbolOfType(JavaInterfaceSymbol, parent, name!, []);

                        // All registered interfaces are implemented as native interfaces.
                        symbol.isTypescriptCompatible = true;
                        if (record.typeParameters !== undefined) {
                            symbol.typeParameters = record.typeParameters;
                        }

                        newSymbol = symbol;
                        break;
                    }

                    case "enum": {
                        newSymbol = symbolTable.addNewSymbolOfType(EnumSymbol, parent, name!, [], []);
                        break;
                    }

                    case "annotation": {
                        break;
                    }

                    default: {
                        throw new Error(`Unknown type: ${record.type}`);
                    }
                }

                record.members.forEach((member) => {
                    switch (member.type) {
                        case "field": {
                            const s = symbolTable.addNewSymbolOfType(FieldSymbol, newSymbol, member.name,
                                undefined);
                            if (member.modifiers.includes("static")) {
                                s.modifiers.add(Modifier.Static);
                            }

                            break;
                        }

                        case "method": {
                            const s = symbolTable.addNewSymbolOfType(MethodSymbol, newSymbol, member.name);
                            if (member.modifiers.includes("static")) {
                                s.modifiers.add(Modifier.Static);
                            }

                            break;
                        }

                        case "constructor": {
                            symbolTable.addNewSymbolOfType(ConstructorSymbol, newSymbol, member.name);
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

                if (newSymbol !== undefined) {
                    addedSymbols.set(newSymbol, record);
                }
            });
        });

        // Now resolve the dependencies of the added symbols.
        addedSymbols.forEach((record, symbol) => {
            if (symbol instanceof ClassSymbol || symbol instanceof InterfaceSymbol) {
                record.extends.forEach((extName) => {
                    const s = symbolTable.symbolFromPath(extName);
                    if (s === undefined) {
                        throw new Error(`Symbol not found: ${extName}`);
                    }

                    if (!(s instanceof ClassSymbol) && !(symbol instanceof InterfaceSymbol)) {
                        throw new Error(`Symbol must be a class or interface: ${extName}`);
                    }

                    if (symbol instanceof ClassSymbol) {
                        symbol.extends.push(s as ClassSymbol);
                    } else {
                        symbol.extends.push(s as InterfaceSymbol);
                    }
                });

                if (symbol instanceof ClassSymbol) {
                    record.implements.forEach((implName) => {
                        const s = symbolTable.symbolFromPath(implName);
                        if (s === undefined) {
                            throw new Error(`Symbol not found: ${implName}`);
                        }

                        if (!(s instanceof InterfaceSymbol)) {
                            throw new Error(`Symbol must be an interface: ${implName}`);
                        }

                        symbol.implements.push(s);
                    });
                }
            }
        });

        return symbolTable;
    }
}
