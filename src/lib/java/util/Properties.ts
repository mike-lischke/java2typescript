/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../java";
import { HashMap } from "./HashMap";

import { NotImplementedError } from "../../NotImplementedError";
import { S } from "../../templates";

export class Properties extends HashMap<java.lang.String, java.lang.String> {
    public constructor(private defaults?: Properties) {
        super();
    }

    /**
     * Searches for the property with the specified key in this property list.
     *
     * @param key The key to search for.
     * @param defaultValue A value to be returned when the key cannot be found.
     *
     * @returns the found value or the default value.
     */
    public getProperty(key: java.lang.String): java.lang.String | null;
    public getProperty(key: java.lang.String, defaultValue: java.lang.String): java.lang.String;
    public getProperty(key: java.lang.String, defaultValue?: java.lang.String): java.lang.String | null {
        let result = this.get(key);
        if (!result && this.defaults) {
            result = this.defaults.get(key);
        }

        if (!result && defaultValue) {
            return defaultValue;
        }

        return result;
    }

    /**
     * Prints this property list out to the specified output stream.
     *
     * @param out The stream to which to write the output.
     */
    public list(out: java.io.PrintStream): void {
        out.print(this.toString());
    }

    /**
     * Reads a property list (key and element pairs) from the input stream.
     *
     * @param input The source to read the properties from.
     */
    public load(input: java.io.InputStream | java.io.Reader): void {
        let text = "";
        if (input instanceof java.io.InputStream) {
            const buffer = new Uint8Array(input.available());
            input.read(buffer);

            // Convert all escape sequences to their code point.
            const builder = new java.lang.StringBuilder();
            let offset = 0;
            while (offset < buffer.length) {
                let codePoint = buffer.at(offset++)!;
                if (codePoint === 0x5C) { // backslash
                    // Escaped character - ignore that and get the next value.
                    codePoint = buffer.at(offset++)!;
                    if (codePoint === 0x75) { // Letter "u".
                        // Found a unicode sequence. Must consist of exactly 4 values.
                        if (buffer.length - offset < 4) {
                            throw new java.lang.IllegalArgumentException();
                        }

                        let code = "";
                        for (let i = 0; i < 4; ++i) {
                            code += String.fromCodePoint(buffer.at(offset++)!);
                        }
                        codePoint = Number.parseInt(code, 16);
                    }
                }

                builder.append(codePoint);
            }
            text = `${builder.toString()}`;
        } else {
            const buffer = new Uint16Array(10000);
            const builder = new java.lang.StringBuilder();

            let count = 0;
            while ((count = input.read(buffer)) > 0) {
                builder.append(buffer, 0, count);
            }
            text = `${builder.toString()}`;
        }

        // Normalize line breaks.
        text = text.replaceAll(/\r\n?/g, "\n");
        let start = 0;
        let run = 0;

        const ws = " \t\f\n";
        const separator = ws + "=:";
        const commentStart = "#!";

        // Go for each key/value pair.
        while (start < text.length) {
            // Start by skipping leading whitespaces, empty and comment lines.
            while (run < text.length) {
                while (run < text.length && ws.includes(text.charAt(run))) {
                    ++run;
                }

                // Skip the rest of the line if the current char is a comment char.
                if (commentStart.includes(text.charAt(run))) {
                    while (run < text.length && text.charAt(run) !== "\n") {
                        ++run;
                    }
                } else {
                    break;
                }
            }

            start = run;
            if (start === text.length) {
                break;
            }

            let currentKey = "";
            let currentValue = "";

            // This is the start of the key. Find the first whitespace, "=" or ":", which end the key.
            // Resolve any escape sequence on the way.
            while (run < text.length) {
                if (separator.includes(text.charAt(run))) {
                    // Found the end of the key. Add the remaining substring to the key string and leave the loop.
                    if (run > start) {
                        currentKey += text.substring(start, run);
                        start = run;
                    }

                    break;
                }

                if (text.charAt(run) === "\\") {
                    // Found an escape char. Add the key part we scanned so far to the key string,
                    // skip the escape char and check if it escaped a line break.
                    currentKey += text.substring(start, run++);

                    // Set the start of the next key part to the escaped char and continue with the next one.
                    start = run;
                    if (run < text.length) {
                        ++run;

                        if (text.at(start) === "\n") {
                            // If a line break was escaped then skip that too.
                            ++start;
                        }
                    }
                } else {
                    ++run;
                }
            }

            // Scan forward to find a character which is not a separator.
            while (run < text.length && separator.includes(text.charAt(run))) {
                if (text.charAt(run++) === "\n") {
                    break;
                }
            }

            if (text.charAt(run++) === "\n") {
                // Found a line break, which ends the entire key/value pair (with an empty value).
                this.put(S`${currentKey}`, S`${currentValue}`);
            } else {
                // From here everything until an unescaped line break belongs to the value.
                while (run < text.length) {
                    if (text.charAt(run) === "\\") {
                        currentValue += text.substring(start, run++);
                        start = run;
                        if (run < text.length) {
                            ++run;
                            if (text.charAt(start) === "\n") {
                                ++start;
                            }
                        }
                    } else if (text.charAt(run) === "\n") {
                        // Done with the value.
                        currentValue += text.substring(start, run++);

                        break;
                    }
                }

                this.put(S`${currentKey}`, S`${currentValue}`);
            }

            start = run;
        }
    }

    /**
     * Loads all of the properties represented by the XML document on the specified input stream into this
     * properties table.
     *
     * @param _input tbd
     */
    public loadFromXML(_input: java.io.InputStream): void {
        throw new NotImplementedError();
    }

    /**
     * @returns an enumeration of all the keys in this property list, including distinct keys in the default property
     * list if a key of the same name has not already been found from the main properties list.
     */
    public propertyNames(): java.util.Iterator<java.lang.String> {
        return this.keySet().iterator();
    }

    // deprecated
    public save(_out: java.io.OutputStream, _comments: string): void {
        throw new NotImplementedError();
    }

    /**
     * This method does not throw an IOException if an I/O error occurs while saving the property list.
     * The preferred way to save a properties list is via the store(OutputStream out, String comments) method or
     * the storeToXML(OutputStream os, String comment) method.
     *
     * @param key The key of the value to set.
     * @param value The value to use.
     *
     * @returns The previous value that was set at the given key.
     */
    public setProperty(key: java.lang.String, value: java.lang.String): java.lang.String | null {
        return this.put(key, value);
    }

    /**
     * Writes this property list (key and element pairs) in this Properties table to the output stream in a format
     * suitable for loading into a Properties table using the load(InputStream) method.
     *
     * @param out The stream to write to.
     * @param comments Comments to write as first to the output stream.
     */
    public store(out: java.io.OutputStream | java.io.Writer, comments?: java.lang.String): void {
        const lineSeparator = java.lang.System.lineSeparator().valueOf();

        if (comments) {
            // Convert all kinds of line breaks to the system line separator and make sure every line
            // starts with either # or !.
            const parts = comments.valueOf().split(/(\n|\r\n?)/);
            for (let i = 0; i < parts.length; ++i) {
                if (parts[i].length === 0 || parts[i] !== "!" || parts[i] !== "#") {
                    parts[i] = "#" + parts[i];
                }
            }

            this.writeString(out, S`# ${parts.join(lineSeparator)}${lineSeparator}`);
        }

        this.writeString(out, S`# ${new Date().toISOString()}${lineSeparator}`);

        for (const entry of this) {
            // Escape all space characters and some other special characters in the key string.
            let key = entry[0].valueOf().replaceAll(/ /g, "\\ ");
            key = key.replaceAll(/[#!=]/g, "\\$&");

            // Escape only leading space characters and the same special characters in the value string.
            const value = entry[1].valueOf();
            let trimmed = value.trimStart();
            if (value.length !== trimmed.length) {
                trimmed = "\\ ".repeat(value.length - trimmed.length) + trimmed;
            }
            trimmed = trimmed.replaceAll(/[#!=]/g, "\\$&");

            this.writeString(out, S`${key}=${trimmed}${lineSeparator}`);
        }

        out.flush();
    }

    /**
     * Emits an XML document representing all of the properties contained in this table.
     *
     * @param _os tbd
     * @param _comment tbd
     * @param _encoding tbd
     */
    public storeToXML(_os: java.io.OutputStream, _comment: java.lang.String, _encoding?: java.lang.String): void {
        throw new NotImplementedError();
    }

    /**
     * @returns a set of keys in this property list where the key and its corresponding value are strings, including
     * distinct keys in the default property list if a key of the same name has not already been found from the main
     * properties list.
     */
    public stringPropertyNames(): java.util.Set<java.lang.String> {
        const result = new java.util.HashSet<java.lang.String>(this.size());

        if (this.defaults) {
            for (const [key] of this.defaults) {
                result.add(key);
            }
        }

        for (const [key] of this) {
            result.add(key);
        }

        return result;
    }

    /**
     * Writes a string to the given output stream. If that stream is not encoding aware then the text is first
     * converted to Latin1, with every character beyond the Latin1 being converted to a unicode character escape
     * sequence using the `\uxxxx` pattern.
     *
     * @param out The target channel to write.
     * @param text The text to write.
     */
    private writeString(out: java.io.OutputStream | java.io.Writer, text: java.lang.String) {
        if (out instanceof java.io.OutputStream) {
            const buffer = new Uint8Array(text.length() * 6); // Maximum possible target length.
            let offset = 0;
            for (const c of text.valueOf()) {
                const codePoint = c.codePointAt(0)!;
                if (codePoint < 0x20 || codePoint > 0x7E) {
                    buffer.set([0x5C, 0x75]);
                    offset += 2;

                    let hex = codePoint.toString(16);
                    hex = "0".repeat(4 - hex.length) + hex;
                    for (const c2 of hex) {
                        buffer.set([c2.codePointAt(0)!], offset++);
                    }
                } else {
                    buffer.set([codePoint], offset++);
                }
            }
            out.write(buffer, 0, offset);
        } else {
            out.write(text);
        }

    }
}
