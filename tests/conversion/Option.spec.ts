/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import * as fs from "fs/promises";
import * as path from "path";

import { JavaToTypescriptConverter } from "../../src/conversion/JavaToTypeScript.js";

describe("Options Tests", () => {
    const testDir = path.join(process.cwd(), "tests");
    const dataDir = path.join(testDir, "test-data");
    const targetDir = path.join(testDir, "conversion", "generated");

    afterAll(async () => {
        await fs.rm(targetDir, { recursive: true, force: true });
    });

    it("Prefix", async () => {
        const rand = Math.random();

        const converter = new JavaToTypescriptConverter({
            packageRoot: path.join(dataDir, "java-sources", "org"),
            outputPath: targetDir,
            exclude: [],
            include: [],
            options: {
                prefix: (sourcePath) => {
                    return `/**\n * ${rand}\n * Auto generated from ${sourcePath}\n * ${new Date().toString()} */`;
                },
                preferArrowFunctions: true,
                convertAnnotations: false,
                autoAddBraces: true,
                addIndexFiles: true,
            },
        });
        await converter.startConversion();

        const targetFileName = path.join(targetDir, "java2typescript", "options", "OptionSpec.ts");
        const targetFile = await fs.readFile(targetFileName, { encoding: "utf-8" });
        expect(targetFile).toContain(`/**\n * ${rand}\n * Auto generated from`);
    });
});
