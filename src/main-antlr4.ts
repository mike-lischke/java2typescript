/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2023, Mike Lischke
 *
 * See LICENSE file for more info.
 */

/* cspell: ignore a4tstool */

import path from "path";

import {
    IClassResolver,
    IConverterConfiguration, JavaToTypescriptConverter,
} from "./conversion/JavaToTypeScript";
import { PackageSource } from "./PackageSource";
import { PackageSourceManager } from "./PackageSourceManager";

// Only packages required for ANTLR4.
const knownSDKPackages: string[] = [
    "javax",

    /** cspell: ignore abego, treelayout */
    "org.abego.treelayout",

    "com.ibm.icu.lang.UCharacter",
    "com.ibm.icu.lang.UCharacterCategory",
    "com.ibm.icu.lang.UProperty",
    "com.ibm.icu.lang.UScript",
    "com.ibm.icu.text.UnicodeSet",
    "com.ibm.icu.util.RangeValueIterator",

    "org.stringtemplate.v4.compiler.GroupLexer",
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
    ["MurmurHash", {
        importPath: "jree",
    }],
    ["SourceDataType", {
        importPath: "jree",
    }],
]);

const convertAntlr4Runtime = async () => {
    const antlrToolOptions: IConverterConfiguration = {
        packageRoot: path.resolve(process.cwd(), "../antlr4/runtime/Java/src"),
        include: [
            "/ParseTreePatternMatcher.java",
        ],
        exclude: [
            "AbstractEqualityComparator.java",
            "NotNull.java",
            //"misc/TestRig.java",
            "MurmurHash.java",
        ],
        output: "../a4tstool/runtime",
        options: {
            /*
            prefix: `
/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention, no-redeclare,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/restrict-plus-operands, @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering,
 no-underscore-dangle, max-len
*/

            /* cspell: disable /

            `,
            */
            importResolver,
            classResolver,
            lib: path.resolve(process.cwd(), "../a4tstool/lib"),
            convertAnnotations: false,
            sourceMappings: [
            ],
            preferArrowFunctions: true,
            autoAddBraces: true,
            addIndexFiles: true,
            suppressTSErrorsForECI: true,
        },
        sourceReplace: new Map([
            [/\n\s+\* {@inheritDoc}/g, ""],
            [/\* @return /g, "* @returns "],
            [/\* @since[^\n*]*/g, "*"],
            [/{@code true}/g, "`true`"],
        ]),

        debug: {
            pathForPosition: {
                position: {
                    row: 378,
                    column: 17,
                },
            },
        },

    };

    const converter = new JavaToTypescriptConverter(antlrToolOptions);
    await converter.startConversion();
};

(async () => {
    await convertAntlr4Runtime();
})().catch((e: Error) => {
    console.error("\nError during conversion: " + (e.stack ?? ""));
});
