/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/* eslint-disable @typescript-eslint/unified-signatures */

import { charCodesToString, codePointsToString } from ".";
import { java } from "../java";
import { JavaObject } from "./Object";

export class String extends JavaObject
    implements java.io.Serializable, java.lang.CharSequence, java.lang.Comparable<String> {
    private value: string;

    /** Initializes a newly created String object so that it represents an empty character sequence. */
    public constructor();
    /** Constructs a new String by decoding the specified array of bytes using the platform's default charset. */
    public constructor(bytes: Uint8Array);
    /** Constructs a new String by decoding the specified array of bytes using the specified charset. */
    public constructor(bytes: Uint8Array, charset: java.nio.charset.Charset);
    /**
     * This method does not properly convert bytes into characters. As of JDK 1.1, the preferred way to do this is via
     * the String constructors that take a Charset, charset name, or that use the platform's default charset.
     * Constructs a new String by decoding the specified subarray of bytes using the platform's default charset.
     */
    public constructor(bytes: Uint8Array, offset: number, length: number);
    /** Constructs a new String by decoding the specified subarray of bytes using the specified charset. */
    public constructor(bytes: Uint8Array, offset: number, length: number, charset: java.nio.charset.Charset);
    /**
     * This method does not properly convert bytes into characters. As of JDK 1.1, the preferred way to do this is
     * via the String constructors that take a Charset, charset name, or that use the platform's default charset.
     * Constructs a new String by decoding the specified subarray of bytes using the specified charset.
     */
    public constructor(bytes: Uint8Array, offset: number, length: number, charsetName: string);
    /** Constructs a new String by decoding the specified array of bytes using the specified charset. */
    public constructor(bytes: Uint8Array, charsetName: string);
    /**
     * Allocates a new String so that it represents the sequence of characters currently contained in the character
     * array argument.
     */
    public constructor(value: Uint16Array);
    /** Allocates a new String that contains characters from a subarray of the character array argument. */
    public constructor(value: Uint16Array, offset: number, count: number);
    /** Allocates a new String that contains characters from a subarray of the Unicode code point array argument. */
    public constructor(codePoints: Uint32Array, offset: number, count: number);
    /**
     * Initializes a newly created String object so that it represents the same sequence of characters as the argument;
     * in other words, the newly created string is a copy of the argument string.
     */
    public constructor(original: string);
    /**
     * Allocates a new string that contains the sequence of characters currently contained in the string buffer
     * argument.
     */
    public constructor(buffer: java.lang.StringBuffer);
    /**
     * Allocates a new string that contains the sequence of characters currently contained in the string builder
     * argument.
     */
    public constructor(builder: java.lang.StringBuilder);
    public constructor(
        input?: Uint8Array | Uint16Array | Uint32Array | string | java.lang.StringBuilder,
        charsetOrCharsetNameOrOffset?: java.nio.charset.Charset | string | number,
        lengthOrCount?: number,
        charSetOrCharsetName?: java.nio.charset.Charset | string,
    ) {
        super();

        let offset: number | undefined;
        if (typeof charsetOrCharsetNameOrOffset === "number") {
            offset = charsetOrCharsetNameOrOffset;
        }

        if (!input) {
            this.value = "";
        } else if (typeof input === "string") {
            this.value = input.substring(offset ?? 0, lengthOrCount);
        } else if (input instanceof Uint8Array) {
            // Byte data. Decode it using either the given or the system default charset.
            let nameOrCharset: java.nio.charset.Charset | string | undefined;
            if (charSetOrCharsetName) {
                nameOrCharset = charSetOrCharsetName;
            } else if (typeof charsetOrCharsetNameOrOffset !== "number") {
                nameOrCharset = charsetOrCharsetNameOrOffset;
            }

            let charset: java.nio.charset.Charset | undefined;
            if (nameOrCharset) {
                charset = nameOrCharset instanceof java.nio.charset.Charset
                    ? nameOrCharset
                    : java.nio.charset.Charset.forName(nameOrCharset);
            }

            charset ??= java.nio.charset.Charset.defaultCharset;

            this.value = `${charset.decode(java.nio.ByteBuffer.wrap(input, offset ?? 0, lengthOrCount ?? input.length))
                .toString()}`;
        } else if (input instanceof Uint16Array) {
            this.value = charCodesToString(input.subarray(offset, lengthOrCount));
        } else if (input instanceof Uint32Array) {
            this.value = codePointsToString(input);
        } else {
            this.value = input.toString().value;
        }
    }

    public static valueOf(v: unknown): String {
        if (v instanceof Uint16Array) {
            return new java.lang.String(v);
        }

        if (v === null) {
            return new java.lang.String("null");
        }

        if (v === undefined) {
            return new java.lang.String("undefined");
        }

        return new java.lang.String(v.toString());
    }

    public charAt(index: number): java.lang.char {
        if (index < 0 || index >= this.value.length) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        return this.value.charCodeAt(index);
    }

    public codePointAt(index: number): number {
        if (index < 0 || index >= this.value.length) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        return this.value.codePointAt(index) ?? NaN;
    }

    public length(): number {
        return this.value.length;
    }

    public subSequence(start: number, end: number): java.lang.CharSequence {
        return new java.lang.String(this.value.substring(start, end));
    }

    public toString(): String {
        return this;
    }

    public compareTo(o: String): number {
        return this.value.localeCompare(o.value);
    }

    protected [Symbol.toPrimitive](_hint: string): string {
        return this.value;
    }

}
