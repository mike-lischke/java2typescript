/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

/**
 * This tool can be used to fetch the Java API definitions from the JDK docs and
 * generate JSON files for them. The JSON files are then used by the JavaPackageSource to
 * create the java.base symbol table from.
 *
 * It relies on a specific HTML page layout and hence can break if the JDK docs change.
 */

import { JSDOM } from "jsdom";
import * as fs from "fs";

const docsBaseUrl = "https://docs.oracle.com/en/java/javase/11/docs/api/";

const packageRecords = new Map<string, ITypeRecord[]>();

type MemberType = "method" | "field" | "constructor" | "class" | "interface" | "enum" | "annotation";
type MainType = "class" | "interface" | "enum" | "annotation";
type Modifier =
    "public" | "protected" | "private" | "static" | "final" | "abstract" | "default" | "synchronized"
    | "native" | "strictfp";

interface IMemberRecord {
    name: string;
    modifiers: Modifier[];
    type: MemberType;
}

interface ITypeRecord {
    name: string;
    type: MainType;
    modifiers: Modifier[];
    extends: string[]; // Must be a list for interfaces.
    implements: string[];
    members: IMemberRecord[];
    typeParameters?: string;
}

/**
 * Fetches the given URL and returns the response as text.
 *
 * @param url The URL to fetch.
 *
 * @returns The text of the page.
 */
const getPage = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }

    return response.text();
};

const zeroWidthSpaceRegEx = /[\u200B-\u200D\uFEFF]/g;

/**
 * Removes the parameter list and type arguments from a type name.
 *
 * @param name The name to process.
 *
 * @returns The processed name.
 */
const isolateName = (name: string) => {
    let index = name.indexOf("(");
    if (index >= 0) {
        name = name.substring(0, index);
    }

    index = name.indexOf("<");
    if (index >= 0) {
        return name.substring(0, index);
    }

    return name.trim().replaceAll(zeroWidthSpaceRegEx, "");
};

/**
 * Scans the given text for angle brackets and counts how many open pairs remain unclosed. This can return
 * a negative value if there are more closing brackets than open ones.
 *
 * @param text The text to scan.
 *
 * @returns The number of unclosed open brackets.
 */
const countOpenAngle = (text: string) => {
    let count = 0;
    for (const char of text) {
        if (char === "<") {
            ++count;
        } else if (char === ">") {
            ++count;
        }
    }

    return count;
};

/**
 * Process a section of the doc page. A section can be a list of methods, fields etc.
 *
 * @param section The element containing the section.
 * @param record The current record to add the members to.
 * @param type The type of the members in the section.
 */
const processSection = (section: HTMLElement, record: ITypeRecord, type: MemberType) => {
    const rows = section.querySelectorAll("tbody > tr")!;
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const codeParts = row.querySelectorAll("code")!;
        const text = codeParts[0].textContent!;
        const modifiers: Modifier[] = [];
        if (text.startsWith("static")) {
            modifiers.push("static");
        }

        const name = isolateName(codeParts[1].textContent!);

        record.members.push({
            name,
            modifiers,
            type,
        });
    }
};

/**
 * Loads the page for a specific type and extracts the information from it.
 *
 * @param url The URL of the type page.
 * @param base The package name of the type.
 */
const processType = async (url: string, base: string) => {
    const page = await getPage(docsBaseUrl + url);
    const parser = new DOMParser();
    const doc = parser.parseFromString(page, "text/html");

    const record: ITypeRecord = {
        name: "",
        type: "class",
        modifiers: [],
        extends: [],
        implements: [],
        members: [],
    };

    // Read name and language type of the type.
    const title = doc.querySelector("body > main > div > h2")!.textContent!;
    const parts = title.split(" ");
    record.name = base + "." + isolateName(parts[1]);

    const logLine = "Processing " + record.name + " ...";
    const spaceCount = logLine.length < 80 ? 80 - logLine.length : 100;
    process.stdout.write("\r" + logLine + " ".repeat(spaceCount));
    record.type = parts[0].toLowerCase() as MainType;

    const inheritance = doc.querySelector("body > main > .contentContainer > .description > .blockList > li > pre")!;
    const type = inheritance.firstChild!.textContent!;
    const typeList = new Set(type.split(" "));
    if (typeList.has("interface")) {
        record.type = "interface";
    } else if (typeList.has("enum")) {
        record.type = "enum";
    }

    if (typeList.has("abstract")) {
        record.modifiers.push("abstract");
    }

    if (inheritance.childNodes.length > 1) {
        let currentList = "";
        let typeParamNesting = 0;
        for (let i = 1; i < inheritance.childNodes.length; i++) {
            const item = inheritance.childNodes[i];
            if (item.nodeType === 3) { // Node.TEXT_NODE
                const text = item.textContent!.trim();
                switch (text) {
                    case "extends": {
                        currentList = "extends";
                        break;
                    }

                    case "implements": {
                        currentList = "implements";
                        break;
                    }

                    default: {
                        typeParamNesting += countOpenAngle(text);

                        break;
                    }
                }
            } else if (typeParamNesting === 0) {
                if (currentList === "extends") {
                    const anchor = item as HTMLAnchorElement;
                    const title = anchor.getAttribute("title")!;
                    const titleParts = title.split(" ");
                    const name = anchor.textContent!;
                    record.extends.push(isolateName(titleParts[titleParts.length - 1] + "." + name));
                } else if (currentList === "implements") {
                    const anchor = item as HTMLAnchorElement;
                    const title = anchor.getAttribute("title")!;
                    const titleParts = title.split(" ");
                    const name = anchor.textContent!;
                    record.implements.push(titleParts[titleParts.length - 1] + "." + name);
                } else {
                    const span = item as HTMLSpanElement;
                    const text = span.textContent?.trim();
                    if (text) {
                        const openingAngle = text.indexOf("<");
                        if (openingAngle >= 0) {
                            const closingAngle = text.lastIndexOf(">");
                            record.typeParameters = text.substring(openingAngle, closingAngle + 1);
                        }
                    }
                }
            }
        }

        if (record.extends.length === 0 && record.type !== "interface" && record.name !== "java.lang.Object") {
            record.extends = ["java.lang.Object"];
        }
    }

    // Get the members.
    const summary = doc.querySelector("body > main > .contentContainer > .summary");
    if (summary) {
        const sections = summary.querySelectorAll("section");
        if (sections.length > 0) {
            for (const section of sections) {
                const sectionTitle = section.querySelector("h3")!.textContent!;
                switch (sectionTitle) {
                    case "Nested Class Summary": {
                        processSection(section, record, "class");

                        break;
                    }

                    case "Nested Interface Summary": {
                        processSection(section, record, "interface");
                        break;
                    }

                    case "Nested Enum Summary": {
                        processSection(section, record, "enum");
                        break;
                    }

                    case "Nested Annotation Type Summary": {
                        processSection(section, record, "annotation");
                        break;
                    }

                    case "Field Summary": {
                        processSection(section, record, "field");
                        break;
                    }

                    case "Method Summary": {
                        processSection(section, record, "method");
                        break;
                    }

                    default:
                        break;
                }
            }
        }
    }

    const records = packageRecords.get(base);
    if (records) {
        records.push(record);
    } else {
        packageRecords.set(base, [record]);
    }
};

/**
 * Connects to the Java docs and fetches certain APIs
 *
 * @param filter A list of package names to fetch. Can be empty to fetch the entire java.base package.
 */
const fetchJavaApis = async (filter: string[]) => {
    if (filter.length === 0) {
        filter = [
            "java.io",
            "java.lang",
            "java.math",
            "java.net",
            "java.nio",
            "java.security",
            "java.text",
            "java.time",
            "java.util",
            "javax.crypto",
            "javax.net",
            "javax.security",
        ];
    }

    const page = await getPage(docsBaseUrl + "allclasses.html");
    const parser = new DOMParser();
    const doc = parser.parseFromString(page, "text/html");

    const list = doc.querySelector("body > main > ul") as HTMLUListElement;
    const items = list.querySelectorAll("li > a");

    for (const item of items) {
        const name = item.getAttribute("title")!;
        const packageName = name.substring(name.lastIndexOf(" ") + 1);

        const result = filter.find((entry) => {
            return packageName.startsWith(entry);
        });

        if (result !== undefined) {
            await processType(item.getAttribute("href")!, packageName);
        }
    }
};

/**
 * Takes the collection information and writes it to JSON files, whose names are the package names.
 */
const convertToJson = () => {
    console.log("\n\n ➜ Writing JSON files ...");

    if (fs.existsSync("data")) {
        fs.rmSync("data", { recursive: true });
    }

    fs.mkdirSync("data");
    let count = 0;
    for (const [name, records] of packageRecords) {
        count += records.length;
        fs.writeFileSync(`data/${name}.json`, JSON.stringify(records, null, 4));
    }

    console.log(`\nWrote ${count} records to ${packageRecords.size} files`);
};

global.DOMParser = new JSDOM().window.DOMParser;

const list = process.argv.slice(2);

if (list.length === 0) {
    console.log("\nConverting all java.base (java.* and certain javax) packages\n");
} else {
    console.log(`\nConverting the following packages: ${list.join(", ")}\n`);
}

await fetchJavaApis(list);
convertToJson();

console.log("\nDone\n");
