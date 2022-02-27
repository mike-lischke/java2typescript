/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import printf from "printf";

export class StringBuilder {
    private data: Uint8Array = new Uint8Array();
    private encoder = new TextEncoder();

    public constructor(text?: string | StringBuilder) {
        if (text) {
            this.append(text);
        }
    }

    public get text(): string {
        const decoder = new TextDecoder();

        return decoder.decode(this.data);
    }

    public get buffer(): Uint8Array {
        return this.data;
    }

    /**
     * A fill-in for Java's `String.format` function.
     *
     * @param format A string with a format specification (see also printf).
     * @param args A number of arguments used for formatting the string.
     *
     * @returns A formatted string.
     */
    public static format(format: string, ...args: unknown[]): string {
        return printf(format, args);
    }

    public clear(): this {
        this.data = new Uint8Array();

        return this;
    }

    /**
     * Inserts the new content at the beginning of the existing content.
     *
     * @param newContent The content to insert.
     *
     * @returns Itself for method chaining.
     */
    public prepend(...newContent: Array<string | String | StringBuilder | number | bigint>): this {
        this.addData(false, ...newContent);

        return this;
    }

    public append(...newContent: Array<string | String | StringBuilder | number | bigint>): this {
        this.addData(true, ...newContent);

        return this;
    }

    public appendLine(text: string): this {
        this.append(text, "\n");

        return this;
    }

    public appendCodePoint(c: number): this {
        this.append(String.fromCodePoint(c));

        return this;
    }

    public get length(): number {
        return this.data.length;
    }

    private addData(append: boolean, ...newContent: Array<string | String | StringBuilder | number | bigint>): void {
        const list: Uint8Array[] = [];
        let size = 0;
        newContent.forEach((entry) => {
            const bytes = entry instanceof StringBuilder ? entry.data : this.encoder.encode(entry.toString());
            size += bytes.length;
            list.push(bytes);
        });

        const newData = new Uint8Array(size + this.data.length);
        if (append) {
            newData.set(this.data);
        }

        let offset = append ? this.data.length : 0;
        list.forEach((bytes) => {
            newData.set(bytes, offset);
            offset += bytes.length;
        });

        if (!append) {
            newData.set(this.data, offset);
        }

        this.data = newData;
    }

}

