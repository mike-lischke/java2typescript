/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import glob from "glob";
import path from "path";

import { FileProcessor } from "./FileProcessor";
import { CustomImportResolver, PackageSourceManager } from "../PackageSourceManager";

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

    // If true the processor will automatically add braces in IF/ELSE statements, if they are missing.
    autoAddBraces?: boolean;

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
        filePattern?: string | RegExp;
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
     * An optional inclusion filter for files found in the package. Only files matching this pattern are actually
     * processed and output generated. However, non-Java files are ignore, even if they are included here.
     *
     * Note: All Java files in the package have to be loaded once to get their symbols.
     *       However, they are only parsed if something is actually imported from them, saving so some parsing time.
     */
    include?: Array<string | RegExp>;

    /**
     * Files to exclude from the conversion process.
     */
    exclude?: Array<string | RegExp>;

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
        PackageSourceManager.customImportResolver = configuration.options.importResolver;
        PackageSourceManager.sourceMappings = configuration.options.sourceMappings;
        PackageSourceManager.javaTargetRoot = path.resolve(process.cwd(), "./lib/java/java.ts");

        configuration.options.lib = path.join(process.cwd(), configuration.options.lib ?? "");
    }

    public async startConversion(): Promise<void> {
        const fileList = glob.sync(this.configuration.packageRoot + "/**/*.java");
        if (fileList.length === 0) {
            console.error("The specified pattern/path does not return any file");

            return;
        }

        console.log(`\nParsing ${fileList.length} java files...`);

        const currentDir = process.cwd();

        // Load all files from the given package, for internal references.
        const packageFiles: FileProcessor[] = [];

        // Only the files in this list are also converted.
        const toConvert: FileProcessor[] = [];

        fileList.forEach((entry) => {
            const relativeSource = path.relative(this.configuration.packageRoot, entry);

            const tsName = relativeSource.substring(0, relativeSource.length - 4) + "ts";
            const target = this.configuration.output + "/" + tsName;

            const processor = new FileProcessor(entry, path.join(currentDir, target), this.configuration);

            packageFiles.push(processor);

            // Is this file explicitly excluded?
            let canInclude = true;
            if (this.configuration.exclude) {
                for (const filter of this.configuration.exclude) {
                    if (entry.match(filter)) {
                        canInclude = false;
                        break;
                    }
                }
            }

            // Does the file match the include filter.
            if (canInclude) {
                if (this.configuration.include && this.configuration.include.length > 0) {
                    for (const filter of this.configuration.include) {
                        if (entry.match(filter)) {
                            toConvert.push(processor);
                            break;
                        }
                    }
                } else {
                    toConvert.push(processor);
                }
            }
        });

        console.log("\nResolving package references...");
        PackageSourceManager.resolveReferences(this.configuration.packageRoot);

        console.log(`\nConverting ${toConvert.length} files...`);

        for await (const processor of toConvert) {
            await processor.convertFile();
        }

        console.log("\nConversion finished");
    }
}
