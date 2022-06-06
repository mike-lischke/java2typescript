/* eslint-disable @typescript-eslint/ban-ts-comment */
/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

/* eslint-disable max-classes-per-file */
/* eslint-disable no-underscore-dangle */

import {
    IClassResolver, IConverterConfiguration, JavaToTypescriptConverter,
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

const convertST3 = async () => {
    const antlrToolOptions: IConverterConfiguration = {
        packageRoot: "/Volumes/Extern/Work/projects/stringtemplate3/src",
        //filter: "ActionSplitterListener.java",
        output: "stringtemplate3",
        options: {
            prefix: `
/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention, no-redeclare,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering, max-len
*/

/* cspell: disable */

`,

            importResolver,
            lib: "lib",
            convertAnnotations: false,

            preferArrowFunctions: true,
            autoAddBraces: true,
        },
        /*debug: {
            pathForPosition: {
                filePattern: "Utils.java",
                position: {
                    row: 64,
                    column: 27,
                },
            },
        },*/

    };

    const converter = new JavaToTypescriptConverter(antlrToolOptions);
    await converter.startConversion();
};

/**
 * This function takes the generated parser Java files and converts them to TS:
 */
const convertAntlr3Parsers = async () => {
    const antlrToolOptions: IConverterConfiguration = {
        packageRoot: "/Volumes/Extern/Work/projects/java2ts/antlr3/generated",
        include: [
            "ActionAnalysis.java",
            "ActionTranslator.java",
            "ANTLRLexer.java",
            "ANTLRParser.java",
            "ANTLRTreePrinter.java",
            "AssignTokenTypesWalker.java",
            "CodeGenTreeWalker.java",
        ],
        output: "antlr3/parsers",
        options: {
            prefix: `
/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention, no-redeclare,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering, max-len
*/

/* cspell: disable */

`,
            lib: "lib",
            convertAnnotations: false,
            preferArrowFunctions: false,
            autoAddBraces: true,
            sourceMappings: [
                {
                    sourcePath: "/Volumes/Extern/Work/projects/antlr3/runtime/Java/src/main/java",
                    importPath: "./antlr3",
                },
                {
                    sourcePath: "./antlr3/generated",
                    importPath: "./antlr3/parsers",
                },
            ],
            classResolver: new Map<string, IClassResolver>([
            ]),
        },
        /*debug: {
            pathForPosition: {
                filePattern: "Utils.java",
                position: {
                    row: 64,
                    column: 27,
                },
            },
        },*/

    };

    const converter = new JavaToTypescriptConverter(antlrToolOptions);
    await converter.startConversion();
};

const convertAntlr3Runtime = async () => {
    const antlrToolOptions: IConverterConfiguration = {
        packageRoot: "/Volumes/Extern/Work/projects/antlr3/runtime/Java/src/main/java",
        include: [
            "/TreeFilter.java",
        ],
        exclude: [
            "DebugEventSocketProxy.java",
        ],
        output: "antlr3/runtime",
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
            lib: "lib",
            convertAnnotations: false,

            sourceMappings: [
            ],
            preferArrowFunctions: false,
            autoAddBraces: true,
            addIndexFiles: true,
        },
        debug: {
            pathForPosition: {
                filePattern: "TreeFilter.java",
                position: {
                    row: 57,
                    column: 11,
                },
            },
        },

    };

    const converter = new JavaToTypescriptConverter(antlrToolOptions);
    await converter.startConversion();
};

/**
 * Converts generated parts of the ANTLR3 tool. To generate these files you have to trigger a build in ANTLR4.
 */
const convertGeneratedAntlr3Files = async () => {
    const antlrToolOptions: IConverterConfiguration = {
        packageRoot: "/Volumes/Extern/Work/projects/antlr4/tool/target/generated-sources/antlr3",
        include: [
            //"SourceGenTriggers.java",
        ],
        exclude: [
            "UnicodeData.java",
        ],
        output: "antlr3/tool",
        options: {
            prefix: `
/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention, no-redeclare,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering, max-len
*/

/* cspell: disable */

`,
            importResolver,
            lib: "lib",
            convertAnnotations: false,

            sourceMappings: [
                {
                    sourcePath: "/Volumes/Extern/Work/projects/antlr4/runtime/Java/src",
                    importPath: "antlr4ts",
                },
                {
                    sourcePath: "/Volumes/Extern/Work/projects/antlr4/tool/src",
                    importPath: "./antlr4/tool/org/antlr/v4",
                },
                {
                    sourcePath: "/Volumes/Extern/Work/projects/antlr3/runtime/Java/src/main/java",
                    importPath: "./antlr3/runtime",
                },
                {
                    sourcePath: "/Volumes/Extern/Work/projects/stringtemplate4/src",
                    importPath: "./stringtemplate4",
                },
            ],
            preferArrowFunctions: true,
            autoAddBraces: true,
            addIndexFiles: true,
        },
        debug: {
            pathForPosition: {
                filePattern: "SourceGenTriggers.java",
                position: {
                    row: 154,
                    column: 53,
                },
            },
        },

    };

    const converter = new JavaToTypescriptConverter(antlrToolOptions);
    await converter.startConversion();
};

const convertAntlr4Runtime = async () => {
    const antlrToolOptions: IConverterConfiguration = {
        packageRoot: "/Volumes/Extern/Work/projects/antlr4/runtime/Java/src",
        include: [
            //"/PredictionContext.java",
            "/RuleContext.java",
        ],
        exclude: [
            //"DebugEventSocketProxy.java",
        ],
        output: "antlr4/runtime",
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
            lib: "lib",
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
                    row: 501,
                    column: 16,
                },
            },
        },*/

    };

    const converter = new JavaToTypescriptConverter(antlrToolOptions);
    await converter.startConversion();
};

const convertAntlr4Tool = async () => {
    const antlrToolOptions: IConverterConfiguration = {
        packageRoot: "/Volumes/Extern/Work/projects/antlr4/tool/src",
        include: [
        ],
        output: "antlr4/tool",
        options: {
            prefix: `
/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention, no-redeclare,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering, max-len
*/

/* cspell: disable */

`,
            lib: "lib",
            convertAnnotations: false,
            preferArrowFunctions: false,
            autoAddBraces: true,
            addIndexFiles: true,
            sourceMappings: [
                {
                    sourcePath: "/Volumes/Extern/Work/projects/antlr4/runtime/Java/src",
                    importPath: "antlr4ts",
                },
                {
                    sourcePath: "/Volumes/Extern/Work/projects/antlr3/runtime/Java/src/main/java",
                    importPath: "./antlr3",
                },
            ],
            importResolver,
            classResolver: new Map<string, IClassResolver>([
                ["BitSet", { importPath: "antlr4ts/misc" }],
            ]),
        },
        /*debug: {
            pathForPosition: {
                filePattern: "Utils.java",
                position: {
                    row: 64,
                    column: 27,
                },
            },
        },*/

    };

    const converter = new JavaToTypescriptConverter(antlrToolOptions);
    await converter.startConversion();
};

(async () => {
    //await convertAntlr4Runtime();

    // Generate parser files from the grammars in this folder. We use ANTLR3 jar and Java as target.
    /*const fileList = glob.sync("/Volumes/Extern/Work/projects/antlr3/tool/src/main/antlr3/org/antlr/grammar/v3/*.g");
    for await (const file of fileList) {
        await SourceGenerator.generateAntlr3Parsers(file);
    }*/

    //await convertAntlr3Runtime();
    await convertAntlr4Runtime();

    //await convertGeneratedAntlr3Files();

    // Finally the v4 tool.
    //await convertAntlr4Tool();
})().catch((e: Error) => {
    console.error("\nError during conversion: " + e.stack);
});
