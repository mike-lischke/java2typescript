/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import glob from "glob";

import {
    IClassResolver, IConverterConfiguration, ISourceMapping, JavaToTypescriptConverter,
} from "./conversion/JavaToTypeScript";
import { PackageSource } from "./PackageSource";
import { PackageSourceManager } from "./PackageSourceManager";
import { SourceGenerator } from "./SourceGenerator";

// Only packages required for ANTLR4.
const knownSDKPackages: string[] = [
    "javax",

    "org.abego.treelayout",

    "com.ibm.icu.lang.UCharacter",
    "com.ibm.icu.lang.UCharacterCategory",
    "com.ibm.icu.lang.UProperty",
    "com.ibm.icu.lang.UScript",
    "com.ibm.icu.text.UnicodeSet",
    "com.ibm.icu.util.RangeValueIterator",

    "org.stringtemplate.v4.compiler.GroupLexer",
];

// Files which are generated from grammar or string template files.
const generatedPackages: string[] = [
    "org.antlr.v4.parse.ActionSplitter",
    "org.antlr.v4.parse.ANTLRLexer",
    "org.antlr.v4.parse.ANTLRParser",
    "org.antlr.v4.parse.ATNBuilder",
    "org.antlr.v4.parse.BlockSetTransformer",
    "org.antlr.v4.parse.GrammarTreeVisitor",
    "org.antlr.v4.parse.LeftRecursiveRuleWalker",

    "org.antlr.v4.unicode.UnicodeData",

    "org.stringtemplate.v4.compiler.GroupLexer",

];

const importResolver = (packageId: string): PackageSource[] => {
    const result: PackageSource[] = [];

    if (packageId.startsWith("antlr.")) {
        // A reference to the ANTLR3 runtime.
        result.push(PackageSourceManager.emptySource("antlr"));
    }

    knownSDKPackages.forEach((value) => {
        if (packageId.startsWith(value)) {
            result.push(PackageSourceManager.emptySource(value));
        }
    });

    generatedPackages.forEach((value) => {
        if (packageId.startsWith(value)) {
            result.push(PackageSourceManager.emptySource(value));
        }
    });

    return result;
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

            // ANTLR4 is still based on older versions of itself and StringTemplate.
            sourceMappings: new Map<string, ISourceMapping>([
            ]),
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
            ignoreExplicitTypeForInitializers: true,
            sourceMappings: new Map<string, ISourceMapping>([
                [
                    "org.antlr.runtime",
                    {
                        sourcePath: "/Volumes/Extern/Work/projects/antlr3/runtime/Java/src/main/java",
                        importPath: "./antlr3",
                    },
                ],
                [
                    "org.antlr.grammar.v3",
                    {
                        sourcePath: "./antlr3/generated",
                        importPath: "./antlr3/parsers",
                    },
                ],
            ]),
            //importResolver,
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
            //"Stats.java",
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
 @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering, max-len
*/

/* cspell: disable */

`,

            importResolver,
            lib: "lib",
            convertAnnotations: false,

            // ANTLR4 is still based on older versions of itself and StringTemplate.
            sourceMappings: new Map<string, ISourceMapping>([
            ]),
            preferArrowFunctions: false,
            autoAddBraces: true,
            ignoreExplicitTypeForInitializers: true,
            addIndexFiles: true,
        },
        /*debug: {
            pathForPosition: {
                filePattern: "Stats.java",
                position: {
                    row: 145,
                    column: 11,
                },
            },
        },*/

    };

    const converter = new JavaToTypescriptConverter(antlrToolOptions);
    await converter.startConversion();
};

/**
 * Converts parts of the ANTLR3 tool (only those used in ANTLR4).
 * Requires the types from the ANTLR3 and ANTLR4 runtimes, plus ST4.
 * Note: we use here the generated Java files, which are created by a Maven build run of the ANTLR4 tool. This means
 * there must have been at least one such run to have these files available (see also the path below).
 */
const convertAntlr3Files = async () => {
    const antlrToolOptions: IConverterConfiguration = {
        packageRoot: "/Volumes/Extern/Work/projects/antlr4/tool/target/generated-sources/antlr3",
        include: [
            "SourceGenTriggers.java",
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

            sourceMappings: new Map<string, ISourceMapping>([
                [
                    "org.antlr.v4.runtime", {
                        sourcePath: "/Volumes/Extern/Work/projects/antlr4/runtime/Java/src",
                        importPath: "antlr4ts",
                    },
                ],
                [
                    "org.antlr.v4", {
                        sourcePath: "/Volumes/Extern/Work/projects/antlr4/tool/src",
                        importPath: "./antlr4/tool/org/antlr/v4",
                    },
                ],
                [
                    "org.antlr.runtime", {
                        sourcePath: "/Volumes/Extern/Work/projects/antlr3/runtime/Java/src/main/java",
                        importPath: "./antlr3/runtime",
                    },
                ],
                [
                    "org.stringtemplate.v4", {
                        sourcePath: "/Volumes/Extern/Work/projects/stringtemplate4/src",
                        importPath: "./stringtemplate4",
                    },
                ],
            ]),
            preferArrowFunctions: true,
            autoAddBraces: true,
            ignoreExplicitTypeForInitializers: true,
            addIndexFiles: true,
        },
        debug: {
            pathForPosition: {
                filePattern: "SourceGenTriggers.java",
                position: {
                    row: 22,
                    column: 44,
                },
            },
        },

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
            ignoreExplicitTypeForInitializers: true,
            addIndexFiles: true,
            sourceMappings: new Map<string, ISourceMapping>([
                [
                    "org.antlr.v4.runtime", {
                        sourcePath: "/Volumes/Extern/Work/projects/antlr4/runtime/Java/src",
                        importPath: "antlr4ts",
                    },
                ],
                [
                    "org.antlr.runtime", {
                        sourcePath: "/Volumes/Extern/Work/projects/antlr3/runtime/Java/src/main/java",
                        importPath: "./antlr3",
                    },
                ],
                /*[
                    "org.stringtemplate.v4",
                    {
                        sourcePath: "/Volumes/Extern/Work/projects/stringtemplate4/src",
                        importPath: "stringtemplate4",
                    },
                ],*/
            ]),
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

    await convertAntlr3Files();

    // Finally the v4 tool.
    //await convertAntlr4Tool();
})().catch((e) => {
    console.error("Error during conversion: " + String(e));
});
