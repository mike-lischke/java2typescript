/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

/* eslint-disable max-classes-per-file */

import * as path from "path";

import { PackageSourceManager } from "../src/PackageSourceManager.js";
import { IConverterConfiguration, JavaToTypescriptConverter } from "../src/conversion/JavaToTypeScript.js";
import { PackageSource } from "../src/PackageSource.js";

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

const importResolver = (packageId: string): PackageSource | undefined => {
    if (packageId.startsWith("org.antlr.runtime")) {
        // ANTLRv3 runtime. Use ANTLRv4 instead.
        return new PackageSource("org.antlr.runtime", "", "antlr4ng");
    }

    return PackageSourceManager.emptySource(packageId);
};

const include: string[] = [
];

const convertANTLR4Tool = async () => {
    const antlrToolOptions: IConverterConfiguration = {
        packageRoot: path.resolve(process.cwd(), "../antlr4/tool/src"),
        include,
        exclude: [],
        outputPath: "../ANTLRng/tool/src",
        options: {
            importResolver,
            convertAnnotations: true,
            preferArrowFunctions: false,
            autoAddBraces: true,
            addIndexFiles: false,
            addNullUnionType: false,
            suppressTypeWithInitializer: true,
            wrapStringLiterals: false,
            memberOrderOptions,
            sourceMappings: [
                //{ sourcePath: path.resolve(process.cwd(), "../antlr4/runtime/Java/src"), importPath: "antlr4ng" },
            ],
            useUnqualifiedTypes: true,
            libraryImports: new Map([
                //[path.resolve(process.cwd(), "../ANTLRng/runtime-testsuite/decorators.js"), ["Test", "Override"]],
            ]),
            importExtension: ".js",
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

await convertANTLR4Tool();
