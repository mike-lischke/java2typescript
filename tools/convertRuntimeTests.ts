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

/** An empty source for JUnit test. We'll provide some helper methods instead. */
class JUnitSource extends PackageSource {
}

let annotationSource: JUnitSource;

const junitAPIs = [
    "assertEquals",
    "assertThrows",
];

const importResolver = (packageId: string): PackageSource | undefined => {
    if (packageId.startsWith("org.junit.jupiter.api")) {
        if (!annotationSource) {
            // Create the package source on demand, so we don't try to access internal stuff before the
            // package manager is fully initialized.
            annotationSource = new JUnitSource("org.junit.jupiter.api.Assertions", "",
                path.resolve(process.cwd(), "../ANTLRng/runtime-testsuite/junit.js"));

            junitAPIs.forEach((name) => {
                annotationSource.addImportedSymbol(name);
            });
        }

        return annotationSource;
    }

    return PackageSourceManager.emptySource(packageId);
};

const include: string[] = [
    //"OSType.java",
];

const convertAntlrRuntimeTests = async () => {
    const antlrToolOptions: IConverterConfiguration = {
        packageRoot: path.resolve(process.cwd(), "../antlr4/runtime-testsuite/test"),
        include,
        exclude: [],
        outputPath: "../ANTLRng/runtime-testsuite/test",
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
                { sourcePath: path.resolve(process.cwd(), "../antlr4/runtime/Java/src"), importPath: "antlr4ng" },
            ],
            useUnqualifiedTypes: true,
            libraryImports: new Map([
                [path.resolve(process.cwd(), "../ANTLRng/runtime-testsuite/decorators.js"), ["Test", "Override"]],
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

await convertAntlrRuntimeTests();
