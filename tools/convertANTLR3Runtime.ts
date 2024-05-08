/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

/* eslint-disable max-classes-per-file */

// cspell:ignore Compiletime, Interp

import * as path from "path";

import { PackageSourceManager } from "../src/PackageSourceManager.js";
import { IConverterConfiguration, JavaToTypescriptConverter } from "../src/conversion/JavaToTypeScript.js";
import { PackageSource } from "../src/PackageSource.js";

/** Member sorting identifiers as used in the project's eslint configuration. */
const memberOrderOptions = {
    default: [
        "public-static-field",
        "protected-static-field",
        "private-static-field",
        "public-instance-field",
        "protected-instance-field",
        "private-instance-field",
        "public-abstract-field",
        "protected-abstract-field",
        "public-field",
        "protected-field",
        "private-field",
        "static-field",
        "instance-field",
        "abstract-field",
        "decorated-field",
        "field",
        "public-constructor",
        "protected-constructor",
        "private-constructor",
        "constructor",
        "public-static-method",
        "protected-static-method",
        "private-static-method",
        "public-method",
        "protected-method",
        "private-method",
        "public-abstract-method",
        "protected-abstract-method",
    ],
};

const importResolver = (packageId: string): PackageSource | undefined => {
    if (packageId.startsWith("org.antlr.runtime")) {
        // ANTLRv3 runtime. Use ANTLRv4 instead.
        return new PackageSource("org.antlr.runtime", "", "antlr4ng");
    }

    return PackageSourceManager.emptySource(packageId);
};

const include: string[] = [
    //"ErrorBufferAllErrors.java",
];

const classResolver = new Map([
    ["String", { alias: "string", importPath: "" }],
    ["Object", { alias: "unknown", importPath: "" }],
    ["ArrayList", { alias: "Array", importPath: "" }],
    ["Locale", { alias: "Intl.Locale", importPath: "" }],
    ["Map", { alias: "Map", importPath: "" }],
    ["HashMap", { alias: "Map", importPath: "" }],
    ["Integer", { alias: "number", importPath: "" }],
    ["RuntimeException", { alias: "Error", importPath: "" }],
    ["NoSuchMethodError", { alias: "Error", importPath: "" }],
]);

const convertANTLR4JavaRuntime = async () => {
    const antlrToolOptions: IConverterConfiguration = {
        javaLib: "",
        packageRoot: path.resolve(process.cwd(), "../antlr3/runtime/Java/src/main/java/org"),
        include,
        exclude: [],
        outputPath: "../antlr3ts-temp/",
        options: {
            prefix:
                `/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// cspell: disable

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */`,
            importResolver,
            convertAnnotations: false,
            preferArrowFunctions: false,
            autoAddBraces: true,
            addIndexFiles: false,
            addNullUnionType: false,
            suppressTypeWithInitializer: true,
            wrapStringLiterals: false,
            memberOrderOptions,
            sourceMappings: [
            ],
            useUnqualifiedTypes: true,
            classResolver,
            importExtension: ".js",
            convertNumberPrimitiveTypes: true,
        },
        sourceReplace: new Map([
        ]),
        debug: {
            pathForPosition: {
                filePattern: "XXX",
                position: {
                    row: 49,
                    column: 5,
                },
            },
        },

    };

    const converter = new JavaToTypescriptConverter(antlrToolOptions);
    await converter.startConversion();
};

await convertANTLR4JavaRuntime();
