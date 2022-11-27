import { JavaToTypescriptConverter } from "../../../conversion/JavaToTypeScript";
import fs from "fs/promises";

describe("Options Tests", () => {
    it("Prefix", async () => {
        const rand = Math.random();

        const outDir = `${__dirname}/../generated`;

        const converter = new JavaToTypescriptConverter({
            packageRoot: `${__dirname}/../java-sources/org`,
            output: outDir,
            exclude: [],
            include: [],
            javaLib: `${__dirname}/../../../lib/java/java.ts`,
            options: {
                lib: `${__dirname}/../../../lib`,
                prefix: (sourcePath) => {
                    return `/*
 ${rand}
 Auto generated from ${sourcePath}
 ${new Date().toString()}
*/`;
                },
                preferArrowFunctions: true,
                convertAnnotations: false,
                autoAddBraces: true,
                addIndexFiles: true,
                suppressTSErrorsForECI: true,
            },
        });
        await converter.startConversion();

        const targetFile = await fs.readFile(`${__dirname}/../generated/java2typescript/options/OptionSpec.ts`,
            { encoding: "utf-8" });
        expect(targetFile).toContain(`/*
 ${rand}
 Auto generated from`);
    });
});
