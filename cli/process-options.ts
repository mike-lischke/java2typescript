/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

// @ts-ignore, because when setting node module resolution to Node16, tsc raises an error for the import assertion.
import configSchema from "./config-schema.json" assert { type: "json" };

// eslint-disable-next-line @typescript-eslint/naming-convention
import Ajv, { ErrorObject } from "ajv";
import betterAjvErrors from "@readme/better-ajv-errors";

import { existsSync, readFileSync } from "fs";

//import { convertToComment } from "../src/GrammarFormatter.js";
//import { IConfiguration, IFormattingOptions } from "../src/types.js";

/*export interface IConfigurationDetails {
    main: IFormattingOptions;
    mainText: string;
    lexer: IFormattingOptions;
    lexerText: string;
};*/

/**
 * Processes the options specified by the user and adds inline options in the grammar file (if enabled).
 *
 * @param configPath The path to the configuration file.
 *
 * @returns A tuple with the main and lexer options, formatted as single line comments, ready to be inserted
 *          into grammars.
 */
/*
export const processFormattingOptions = (configPath?: string): IConfigurationDetails => {
    let mainOptions: IFormattingOptions = {};
    let lexerOptions: IFormattingOptions = {};

    if (configPath && existsSync(configPath)) {
        const content = readFileSync(configPath, { encoding: "utf-8" });
        const config = JSON.parse(content) as IConfiguration;

        // Validate the configuration file using our schema.
        const ajv = new Ajv.default({ allErrors: true, verbose: true });
        const validate = ajv.compile(configSchema);
        const valid = validate(config);
        if (!valid) {
            console.log(`\nFound config validation errors in ${configPath}\n`);

            // @ts-expect-error, because the type definition export is wrong.
            const error = betterAjvErrors(configSchema, config, validate.errors as ErrorObject[], {
                json: content,
            });
            console.log(error + "\n");

            process.exit(1);
        }

        mainOptions = config.main;
        lexerOptions = config.lexer ?? mainOptions;

        return {
            main: mainOptions,
            mainText: convertToComment(mainOptions),
            lexer: lexerOptions,
            lexerText: convertToComment(lexerOptions),
        };
    }

    return { main: {}, mainText: "", lexer: {}, lexerText: "" };
};
 */
