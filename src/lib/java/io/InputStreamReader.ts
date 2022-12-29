/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/* eslint-disable @typescript-eslint/unified-signatures */
/* eslint-disable jsdoc/require-returns */

import { StringDecoder } from "string_decoder";

import { java } from "../java";
import { Reader } from "./Reader";

export class InputStreamReader extends Reader {
    // The size of the raw buffer used to keep input data.
    private static readonly readBufferSize = 8192;

    private buffer = Buffer.alloc(InputStreamReader.readBufferSize);

    private encoding: string;
    private decoder: StringDecoder;
    private currentText = "";

    private eof = false;

    public constructor(input: java.io.InputStream, charsetName?: java.lang.String);
    public constructor(input: java.io.InputStream, cs?: java.nio.charset.Charset);
    public constructor(private input: java.io.InputStream,
        charsetNameOrCs?: java.lang.String | java.nio.charset.Charset) {
        super();

        if (!charsetNameOrCs) {
            this.encoding = java.nio.charset.Charset.defaultCharset.name();
        } else if (charsetNameOrCs instanceof java.nio.charset.Charset) {
            this.encoding = charsetNameOrCs.name();
        } else {
            this.encoding = charsetNameOrCs.valueOf();
        }

        if (Buffer.isEncoding(this.encoding)) {
            this.decoder = new StringDecoder(this.encoding);
        } else {
            throw new java.io.UnsupportedEncodingException("Invalid charset specified");
        }
    }

    /** Closes the stream and releases any system resources associated with it. */
    public close(): void {
        this.input.close();
    }

    /** Returns the name of the character encoding being used by this stream. */
    public getEncoding(): string {
        return this.encoding;
    }

    /** Reads a single character. */
    public read(): java.lang.char;
    public read(chars: Uint16Array | java.nio.CharBuffer): number;
    /** Reads characters into a portion of an array. */
    public read(chars: Uint16Array, offset: number, length: number): number;
    public read(chars?: Uint16Array | java.nio.CharBuffer, offset?: number, length?: number): java.lang.char | number {
        if (!this.ready()) {
            return -1;
        }

        if (!chars) {
            // Single character variant.
            if (this.currentText.length === 0) {
                this.currentText = this.readNextChunk();
            }

            if (this.currentText.length === 0) {
                return -1;
            }

            const c = this.currentText.codePointAt(0)!;
            this.currentText = this.currentText.substring(1);

            return c;
        }

        offset ??= 0;
        length ??= chars instanceof Uint16Array ? chars.length : chars.length();

        const end = offset + length;
        if (offset < 0 || length < 0 || end > chars.length) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        let processed = 0;
        while (length > 0) {
            if (length <= this.currentText.length) {
                for (const c of this.currentText.substring(0, length)) {
                    if (chars instanceof Uint16Array) {
                        chars[offset++] = c.codePointAt(0)! & 0xFFFF;
                    } else {
                        chars.put(offset++, c.codePointAt(0)! & 0xFFFF);
                    }
                }

                processed += length;
                length = 0;
            } else {
                // Not enough data available. Write what we have and load the next chunk.
                for (const c of this.currentText) {
                    if (chars instanceof Uint16Array) {
                        chars[offset++] = c.codePointAt(0)! & 0xFFFF;
                    } else {
                        chars.put(offset++, c.codePointAt(0)! & 0xFFFF);
                    }
                }

                processed += this.currentText.length;
                length -= this.currentText.length;

                if (this.eof) {
                    this.currentText = "";
                    break;
                }

                this.currentText = this.readNextChunk();
            }
        }

        return processed;
    }

    /** Tells whether this stream is ready to be read. */
    public ready(): boolean {
        return this.currentText.length > 0 || this.input.available() > 0;
    }

    /** Returns as many characters as can be decoded with one buffer content. */
    private readNextChunk(): string {
        const count = this.input.read(this.buffer);
        if (count === -1) {
            this.eof = true;

            return this.decoder.end();
        }

        return this.decoder.write(this.buffer.subarray(0, count));
    }
}
