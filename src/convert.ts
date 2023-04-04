#!/usr/bin/env node

/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

/** This is the main entry point for the java2typescript conversion, when using NPM. */

import fs from "fs/promises";
import path from "path";

import {
    IClassResolver, IConverterConfiguration, IConverterOptions, ISourceMapping, JavaToTypescriptConverter,
} from "./conversion/JavaToTypeScript.js";
import { IMemberOrderOptions } from "./conversion/MemberOrdering.js";

const args = process.argv.slice(2);

if (args.length < 1) {
    console.log("Usage: java2ts <config-file.json>");
    process.exit(1);
}

console.log("\nConverting Java to TypeScript...");

// Load the given configuration file and create a converter configuration from it.
const configFile = args[0];
const content = await fs.readFile(configFile, { encoding: "utf-8" });
const json = JSON.parse(content);

let options: IConverterOptions | undefined;

if ("options" in json) {
    // The class resolver entries are given as objects, but we need a map.
    const rawResolver = json.options.importResolver as Object;

    let classResolver: Map<string, IClassResolver> | undefined;
    if (rawResolver) {
        classResolver = new Map<string, IClassResolver>([
            ...Object.entries(rawResolver),
        ]);
    }

    options = {
        prefix: json.options.prefix as string,
        convertAnnotations: json.options.convertAnnotations as boolean,
        lib: json.options.lib as string,
        preferArrowFunctions: json.options.preferArrowFunctions as boolean,
        autoAddBraces: json.options.autoAddBraces as boolean,
        addNullUnionType: json.options.addNullUnionType as boolean,
        suppressTypeWithInitializer: json.options.suppressTypeWithInitializer as boolean,
        wrapStringLiterals: json.options.wrapStringLiterals as boolean,
        memberOrderOptions: json.options.memberOrderOptions as IMemberOrderOptions,
        addIndexFiles: json.options.addIndexFiles as boolean,
        sourceMappings: json.options.sourceMappings as ISourceMapping[],
        // importResolver?: CustomImportResolver;
        classResolver,
    };
}

let rawReplace = json.sourceReplace as Object;
let sourceReplace: Map<RegExp, string> | undefined;

if (rawReplace) {
    const list: Array<[RegExp, string]> = Object.entries(rawReplace).map(([key, value]) => {
        return [new RegExp(key), value];
    });
    sourceReplace = new Map<RegExp, string>(list);
}

rawReplace = json.targetReplace as Object;
let targetReplace: Map<RegExp, string> | undefined;
if (rawReplace) {
    const list: Array<[RegExp, string]> = Object.entries(rawReplace).map(([key, value]) => {
        return [new RegExp(key), value];
    });
    targetReplace = new Map<RegExp, string>(list);
}

const config: IConverterConfiguration = {
    packageRoot: json.packageRoot as string,
    outputPath: json.outputPath as string,

    javaLib: json.javaLib as string,
    include: json.include as string[],
    exclude: json.exclude as string[],
    sourceReplace,
    targetReplace,
    options,
};

if (!config.packageRoot) {
    console.error("ERROR: No package root given in configuration file.");
    process.exit(1);
}

config.packageRoot = path.resolve(process.cwd(), config.packageRoot);

if (!config.outputPath) {
    console.error("ERROR: No output path given in configuration file.");
    process.exit(1);
}

config.outputPath = path.resolve(process.cwd(), config.outputPath);

const converter = new JavaToTypescriptConverter(config);
await converter.startConversion();
