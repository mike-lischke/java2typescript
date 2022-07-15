/* eslint-disable @typescript-eslint/ban-ts-comment */
/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

/* eslint-disable max-classes-per-file */
/* eslint-disable no-underscore-dangle */

/* cspell: ignore a4tstool */

import path from "path";

import {
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

const convertAntlr4Runtime = async () => {
    const antlrToolOptions: IConverterConfiguration = {
        packageRoot: path.resolve(process.cwd(), "../antlr4/runtime/Java/src"),
        javaLib: path.resolve(process.cwd(), "../a4tstool/lib/java/java.ts"),
        include: [
            //"/LogManager.java",
        ],
        exclude: [
            //"DebugEventSocketProxy.java",
        ],
        output: "../a4tstool/runtime",
        options: {
            prefix: `
/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention, no-redeclare,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/restrict-plus-operands, @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering,
 no-underscore-dangle, max-len
*/

/* cspell: disable */

`,
            importResolver,
            lib: path.resolve(process.cwd(), "../a4tstool/lib"),
            convertAnnotations: false,
            sourceMappings: [
            ],
            preferArrowFunctions: true,
            autoAddBraces: true,
            addIndexFiles: true,
            suppressTSErrorsForECI: true,
        },
        /*
        debug: {
            pathForPosition: {
                //filePattern: "TreeFilter.java",
                position: {
                    row: 39,
                    column: 23,
                },
            },
        },
        */

    };

    const converter = new JavaToTypescriptConverter(antlrToolOptions);
    await converter.startConversion();
};

(async () => {
    // Generate parser files from the grammars in this folder. We use ANTLR3 jar and Java as target.
    /*const fileList = glob.sync("/Volumes/Extern/Work/projects/antlr3/tool/src/main/antlr3/org/antlr/grammar/v3/*.g");
    for await (const file of fileList) {
        await SourceGenerator.generateAntlr3Parsers(file);
    }*/

    await convertAntlr4Runtime();

})().catch((e: Error) => {
    console.error("\nError during conversion: " + e.stack);
});
