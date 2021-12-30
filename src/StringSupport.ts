/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, Mike Lischke
 *
 * See LICENSE file for more info.
 */

/* eslint-disable max-classes-per-file, @typescript-eslint/no-namespace, no-redeclare,
                  @typescript-eslint/naming-convention,
*/

import printf from "printf";

// A partial implementation of the Java Character class.

export class Character {
    public static isISOControl = (c: string): boolean => {
        return false;
    };

    public static isDigit(s: string): boolean {
        if (s.length !== 1) {
            return false;
        }

        return s.match(/0-9/).length > 0;
    }

    public static toString(s: string): string {
        return s;
    }

    public static toUpperCase(s: string): string {
        return s.toUpperCase();
    }

}

export namespace Character {
    export class UnicodeBlock {
        public static readonly BASIC_LATIN = 1;

        public static of = (c: string): number => {
            return 0;
        };

    }
}

export class Integer {
    public static parseInt(s: string, radix = 10): number {
        return parseInt(s, radix);
    }
}

export class StringBuilder {
    private data: Uint8Array = new Uint8Array();
    private encoder = new TextEncoder();

    public constructor(text?: string) {
        if (text) {
            this.append(text);
        }
    }

    public get buffer(): Uint8Array {
        return this.data;
    }

    public get text(): string {
        const decoder = new TextDecoder();

        return decoder.decode(this.data);
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

    public prepend(newContent: string | StringBuilder): this {
        const bytes = newContent instanceof StringBuilder ? newContent.data : this.encoder.encode(newContent);
        const newData = new Uint8Array(bytes.length + this.data.length);
        newData.set(bytes);
        newData.set(this.data, bytes.length);
        this.data = newData;

        return this;
    }

    public append(...newContent: Array<string | StringBuilder>): this {
        const list: Uint8Array[] = [];
        let size = 0;
        newContent.forEach((entry) => {
            const bytes = entry instanceof StringBuilder ? entry.data : this.encoder.encode(entry);
            size += bytes.length;
            list.push(bytes);
        });

        const newData = new Uint8Array(size + this.data.length);
        newData.set(this.data);

        let offset = this.data.length;
        list.forEach((bytes) => {
            newData.set(bytes, offset);
            offset += bytes.length;
        });
        this.data = newData;

        return this;
    }

    public appendLine(text: string): this {
        this.append(text + "\n");

        return this;
    }

    public appendCodePoint(c: number): this {
        this.append(String.fromCodePoint(c));

        return this;
    }
}

