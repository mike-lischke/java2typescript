/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

/* cspell: ignore a4tstool */

import path from "path";

import {
    IClassResolver, IConverterConfiguration, JavaToTypescriptConverter,
} from "../src/conversion/JavaToTypeScript";
import { PackageSource } from "../src/PackageSource";
import { PackageSourceManager } from "../src/PackageSourceManager";

/** Member sorting identifiers as used in the project's eslint configuration. */
const memberOrderOptions = {
    default: [
        "signature",
        "public-static-field",
        "protected-static-field",
        "private-static-field",
        "public-decorated-field",
        "protected-decorated-field",
        "private-decorated-field",
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
        "public-decorated-method",
        "protected-decorated-method",
        "private-decorated-method",
        "public-instance-method",
        "protected-instance-method",
        "private-instance-method",
        "public-abstract-method",
        "protected-abstract-method",
    ],
};

const knownSDKPackages: string[] = [
];

const importResolver = (packageId: string): PackageSource | undefined => {
    knownSDKPackages.forEach((value) => {
        if (packageId === value) {
            return PackageSourceManager.emptySource(value);
        }
    });

    return undefined;
};

const classResolver = new Map<string, IClassResolver>([
]);

const convertJDKLangTests = async () => {
    const antlrToolOptions: IConverterConfiguration = {
        packageRoot: path.resolve(process.cwd(), "../jdk/test/jdk/java/lang"),
        javaLib: "../../../../../../src",
        include: [
            "ImplicitStringConcatShapes.java",
        ],
        exclude: [
            "AssertionError",
            "ClassLoader",
            "InheritableThreadLocal",
            "IntegralPrimitiveToString.java",
            "ModuleLayer",
            "ModuleTests",
            "Package",
            "PrimitiveSumMinMaxTest.java",
            "ProcessBuilder",
            "ProcessHandle",
            "Runtime",
            "RuntimePermission",
            "SecurityManager",
            "StackWalker",
            "StrictMath",
            "System",
            "Thread",
            "ThreadGroup",
            "ThreadLocal",
            "WeakPairMap",
            "annotation",
            "instrument",
            "invoke",
            "management",
            "module",
            "ref",
            "reflect",
        ],
        outputPath: "../jree/tests/jdk/java/lang",
        options: {
            importResolver,
            classResolver,
            convertAnnotations: false,
            sourceMappings: [
            ],
            preferArrowFunctions: true,
            autoAddBraces: true,
            addIndexFiles: false,
            addNullUnionType: false,
            suppressTypeWithInitializer: true,
            wrapStringLiterals: false,
            memberOrderOptions,
            prefix: `
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable max-len */
/* cspell: disable */
/* eslint-disable jsdoc/check-tag-names */
`,
        },
        sourceReplace: new Map([
        ]),

        debug: {
            pathForPosition: {
                filePattern: "XXX",
                position: {
                    row: 120,
                    column: 58,
                },
            },
        },

    };

    const converter = new JavaToTypescriptConverter(antlrToolOptions);
    await converter.startConversion();
};

await convertJDKLangTests();
