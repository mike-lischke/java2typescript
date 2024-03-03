#!/usr/bin/env node

/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import process from "process";
import { readFileSync, writeFileSync } from "fs";
import { glob } from "glob";

import { OptionValues, program } from "commander";

import { CharStreams, CommonTokenStream } from "antlr4ng";

import { ANTLRv4Lexer } from "../src/parser/ANTLRv4Lexer.js";
import { IConfigurationDetails, processFormattingOptions } from "./process-options.js";

import { IFormattingOptions } from "../src/types.js";
import { GrammarFormatter } from "../src/GrammarFormatter.js";

interface IAppParameters extends OptionValues {
    /** The path to a single source file or a glob pattern for multiple files. */
    pattern: string;

    /** When true, add the default ANTLR formatting option string to the grammar, before formatting it. */
    addOptions?: boolean;

    /**
     * Path to a JSON file with user-defined formatting options. If a grammar already contains formatting options,
     * they override the options from this file. If the grammar contains no options, the options from this file are
     * added to the grammar if the addOptions option is true.
     */
    config?: string;

    /** Suppress all output except errors. */
    silent?: boolean;

    /** Print additional information. */
    verbose?: boolean;
}

const matchBoolean = (value: string): boolean => {
    if (value == null) {
        return false;
    }

    const lower = value.trim().toLowerCase();

    return lower === "true" || lower === "1" || lower === "on" || lower === "yes";
};

const start = performance.now();

program
    .argument("file1, pattern2, ...", "A list of files or glob patterns for multiple files.")
    .option<boolean>("-a, --add-options [boolean]", "Insert the used ANTLR grammar formatting " +
        "options to the grammar file, if it contains no options.", matchBoolean, true)
    .option("-c, --config <path>", "Path to a JSON file containing the formatting options to use.")
    .option("-s, --silent", "Suppress all output except errors.")
    .option("-v, --verbose", "Print additional information.")
    .version("antlr-format 1.0.1")
    .parse();

const options = program.opts<IAppParameters>();

const fileList = glob.sync(program.args, { nodir: true });
if (fileList.length === 0) {
    console.error(`No grammar file found using this pattern: ${program.args.join(", ")}.\n`);

    process.exit(0);
}
fileList.sort();

const defaultOptions: IFormattingOptions = {
    reflowComments: false,
};

/**
 * Runs the grammar formatter on the given grammar file.
 * Start and stop positions are useful to format only a part of the grammar. When given the formatter returns
 * the formatted part and the new start and stop positions, which can be used to replace the original text.
 *
 * @param grammarPath The path to the grammar file.
 * @param config Options to use for formatting, both as object and string (for insertion).
 * @param start The character index in the file where formatting should start.
 * @param stop The character index in the file where formatting should stop.
 * @param addOptions If true, the default ANTLR grammar formatting options are added to the grammar file, if it
 *                   contains no options yet.
 *
 * @returns The formatted grammar and the computed start and stop indices.
 */
const formatGrammar = (grammarPath: string, config: IConfigurationDetails, start: number,
    stop: number, addOptions = true): [string, number, number] => {
    const grammar = readFileSync(grammarPath, { encoding: "utf8" });

    const lexer = new ANTLRv4Lexer(CharStreams.fromString(grammar));

    lexer.removeErrorListeners();
    const tokenStream = new CommonTokenStream(lexer);
    tokenStream.fill();
    const tokens = tokenStream.getTokens();

    // Check the first default channel token for the grammar type.
    let options: IFormattingOptions = defaultOptions;
    for (const token of tokens) {
        if (token.channel === 0) {
            const type = token.text;
            if (type === "lexer") {
                options = config.lexer;
            } else {
                options = config.main;
            }

            break;
        }
    }

    const formatter = new GrammarFormatter(tokens, addOptions);

    return formatter.formatGrammar(options, start, stop);
};

if (!options.silent) {
    console.log("\nantlr-format, processing options...");
}

const details = processFormattingOptions(options.config);

if (!options.silent) {
    console.log("\nformatting " + fileList.length + " file(s)...");
}

fileList.forEach((grammarPath) => {
    if (options.verbose) {
        console.log("  " + grammarPath);
    }
    const [text] = formatGrammar(grammarPath, details, 0, 1e10, options.addOptions);

    //const formattedGrammarPath = path.join(args[1], path.basename(grammarPath));
    const formattedGrammarPath = grammarPath;
    writeFileSync(formattedGrammarPath, text);
});

if (!options.silent) {
    console.log(`\ndone [${Math.round((performance.now() - start))} ms]\n`);
}
