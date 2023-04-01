#!/usr/bin/env node

/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

/** This is the main entry point for the java2typescript conversion, when using NPM. */

import fs from "fs/promises";
import path from "path";

import { IConverterConfiguration, JavaToTypescriptConverter } from "./conversion/JavaToTypeScript.js";

const args = process.argv.slice(2);

if (args.length < 1) {
    console.log("Usage: java2ts <config-file.json>");
    process.exit(1);
}

console.log("\nConverting Java to TypeScript...");

// Load the given configuration file and create a converter configuration from it.
const configFile = args[0];
const content = await fs.readFile(configFile, { encoding: "utf-8" });
const config = JSON.parse(content) as IConverterConfiguration;
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
