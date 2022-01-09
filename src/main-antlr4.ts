/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { IConverterConfiguration, JavaToTypescriptConverter } from "./conversion/JavaToTypeScript";
import { PackageSource } from "./PackageSource";
import { PackageSourceManager } from "./PackageSourceManager";

export { };

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

    "org.antlr.stringtemplate.language.AngleBracketTemplateLexer",

    "org.stringtemplate.v4.compiler.GroupParser",

    "org.antlr.v4.unicode.UnicodeData",
];

const importResolver = (packageId: string): PackageSource[] => {
    const result: PackageSource[] = [];

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

    if (packageId.startsWith("antlr.")) {
        // A reference to the ANTLR3 runtime.
        result.push(PackageSourceManager.emptySource("antlr"));
    }

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
            sourceMappings: new Map<string, string>([
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

const convertAntlr3Runtime = async () => {
    const antlrToolOptions: IConverterConfiguration = {
        packageRoot: "/Volumes/Extern/Work/projects/antlr3/runtime/Java/src/main/java",
        include: [
            //"BitSet.java",
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
            sourceMappings: new Map<string, string>([
                ["org.antlr.runtime", "/Volumes/Extern/Work/projects/antlr3/runtime/Java/src/main/java"],

                ["org.antlr.stringtemplate", "/Volumes/Extern/Work/projects/stringtemplate3/src"],
                ["org.stringtemplate", "/Volumes/Extern/Work/projects/stringtemplate3/src"],
            ]),
            preferArrowFunctions: false,
            autoAddBraces: true,
        },
        debug: {
            pathForPosition: {
                filePattern: "IntStream.java",
                position: {
                    row: 34,
                    column: 2,
                },
            },
        },

    };

    const converter = new JavaToTypescriptConverter(antlrToolOptions);
    await converter.startConversion();
};

const convertAntlr3Tool = async () => {
    const antlrToolOptions: IConverterConfiguration = {
        packageRoot: "/Volumes/Extern/Work/projects/antlr3/tool/src",
        //filter: "ActionSplitterListener.java",
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

            importResolver,
            lib: "lib",
            convertAnnotations: false,

            // ANTLR4 is still based on older versions of itself and StringTemplate.
            sourceMappings: new Map<string, string>([
                ["org.antlr.runtime", "/Volumes/Extern/Work/projects/antlr3/runtime/Java/src/main/java"],
                ["org.antlr.v4.runtime", "/Volumes/Extern/Work/projects/antlr4/runtime/Java/src/"],

                ["org.antlr.stringtemplate", "/Volumes/Extern/Work/projects/stringtemplate3/src"],
                ["org.stringtemplate", "/Volumes/Extern/Work/projects/stringtemplate3/src"],

                ["org.antlr.stringtemplate.v4", "/Volumes/Extern/Work/projects/stringtemplate4/src"],
                ["org.stringtemplate.v4", "/Volumes/Extern/Work/projects/stringtemplate4/src"],
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

const convertAntlr4Tool = async () => {
    const antlrToolOptions: IConverterConfiguration = {
        packageRoot: "/Volumes/Extern/Work/projects/antlr4/tool/src",
        //filter: "ActionSplitterListener.java",
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

            importResolver,
            lib: "lib",
            convertAnnotations: false,

            // ANTLR4 is still based on older versions of itself and StringTemplate.
            sourceMappings: new Map<string, string>([
                ["org.antlr.runtime", "/Volumes/Extern/Work/projects/antlr3/runtime/Java/src/main/java"],
                ["org.antlr.v4.runtime", "/Volumes/Extern/Work/projects/antlr4/runtime/Java/src/"],

                ["org.antlr.stringtemplate", "/Volumes/Extern/Work/projects/stringtemplate3/src"],
                ["org.stringtemplate", "/Volumes/Extern/Work/projects/stringtemplate3/src"],

                ["org.antlr.stringtemplate.v4", "/Volumes/Extern/Work/projects/stringtemplate4/src"],
                ["org.stringtemplate.v4", "/Volumes/Extern/Work/projects/stringtemplate4/src"],
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

// For a full conversion we need multiple steps.

// 1. Generate stringtemplate 3 files that need a generation.
//await SourceGenerator.generateST3Files("");

// 2. Convert stringtemplate 3 sources.
//convertST3();

// 3. Generate ANTLR3 files that need generation.

// 4. Convert ANTLR3 sources.
//convertAntlr3Runtime();

// 4. Convert ANTLR3 sources.
//convertAntlr3Tool();

// 5. Generate stringtemplate 4 files that need a generation.

// 6. Convert stringtemplate 4 sources.

// 7. Generate ANTLR4 files that need generation.

// 8. Convert ANTLR4 sources.
//convertAntlr4Tool();

(async () => {
    await convertAntlr3Runtime();
})().catch((e) => {
    console.error("Error during conversion: " + String(e));
});
