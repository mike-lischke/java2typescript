/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import glob from "glob";
import path from "path";

import { FileProcessor } from "./FileProcessor";
import { CustomImportResolver, PackageSource } from "../PackageSource";

export interface IConverterOptions {
    prefix?: string; // Anything to go before the first code line (e.g. linter settings).

    // If true then Java annotations are converted to Typescript decorators.
    convertAnnotations?: boolean;

    // A folder path for additional TS source files required to polyfill Java classes or which implement support code.
    lib?: string;

    // If true, functions/methods use the arrow syntax.
    preferArrowFunctions?: boolean;

    // If true no type is added for variables/members that have an explicit initialization (from which the type
    // can be derived).
    ignoreExplicitTypeForInitializers?: boolean;

    // A mapping of a 3rd party package which is available in source form. Maps root package IDs (without any type
    // name) to a source path, which is then used as package root for that package.
    sourceMappings?: Map<string, string>;

    // A map that contains symbol source instances for each imported package in a Java file.
    // It maps from a package id, e.g. "java.lang" to a symbol source that can deliver imports for polyfills
    // that provide the necessary functionality (e.g. via node modules or plain JS APIs).
    importResolver: CustomImportResolver;
}

// Options used for debugging the transformation process.
export interface IDebugOptions {
    // Specifies a position in a file whose name matches filePattern. The parse tree located covering this position
    // is searched after parsing and the entire parse tree path from the root up to this tree is printed to the console.
    pathForPosition?: {
        filePattern: string | RegExp;
        position: {
            row: number;    // One-based line number
            column: number;
        };
    };
}

export interface IConverterConfiguration {
    /**
     * The root folder of the package to convert. Only files in the file tree are automatically resolved
     * when importing symbols.
     * Package imports from outside (inclusive standard Java packages) need an explicit source resolver
     * (@see options.importResolver).
     *
     * Note: Only Java files are actually transformed.
     */
    packageRoot: string;

    /**
     * An optional filter for files found in the package. Only files matching this pattern are actually processed
     * and output generated.
     *
     * Note: All Java files in the package have to be loaded once to get their package names.
     *       However, they are only parsed if something is actually imported from them, saving so some parsing time.
     */
    filter?: string | RegExp;

    /**
     * The root folder for generated files. Relative paths are kept (like in the source tree).
     */
    output: string;

    /**
     * Options for the conversion process.
     */
    options: IConverterOptions;

    /**
     * Additional options for debugging the conversion process.
     */
    debug?: IDebugOptions;
}

export class JavaToTypescriptConverter {
    public constructor(private configuration: IConverterConfiguration) {
        PackageSource.customImportResolver = configuration.options.importResolver;
        PackageSource.sourceMappings = configuration.options.sourceMappings;
    }

    public startConversion(): void {
        const fileList = glob.sync(this.configuration.packageRoot + "/**/*.java");
        if (fileList.length === 0) {
            console.error("The specified pattern/path does not return any file");

            return;
        }

        fileList.forEach((entry) => {
            if (entry.endsWith(".java") && entry.match(this.configuration.filter)) {
                const relativeSource = path.relative(this.configuration.packageRoot, entry);

                const tsName = relativeSource.substring(0, relativeSource.length - 4) + "ts";
                const target = this.configuration.output + "/" + tsName;

                const processor = new FileProcessor(this.configuration);
                processor.convertFile(entry, target);
            }
        });
    }
}
