/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/* eslint-disable @typescript-eslint/unified-signatures */

import { java } from "../java";
import { Buffer } from "./Buffer";

import { NotImplementedError } from "../../NotImplementedError";
import { MurmurHash } from "../../MurmurHash";
import { char } from "../lang";

export class CharBuffer extends Buffer<Uint16Array> implements java.lang.Appendable, java.lang.CharSequence,
    java.lang.Comparable<CharBuffer>, java.lang.Readable {
    private buffer: Uint16Array;

    private readOnly = false;
    private readonly byteOrder: java.nio.ByteOrder;

    private constructor(capacity: number);
    private constructor(buffer: Uint16Array, offset?: number, length?: number);
    private constructor(csq: java.lang.CharSequence, offset?: number, length?: number);
    private constructor(s: string, offset?: number, length?: number);
    private constructor(capacityOrBufferOrCsqOrS: number | Uint16Array | string | java.lang.CharSequence,
        offset?: number, length?: number) {
        super();
        this.byteOrder = java.nio.ByteOrder.byteOrder;

        const start = offset ?? 0;

        if (typeof capacityOrBufferOrCsqOrS === "number") {
            this.buffer = new Uint16Array(capacityOrBufferOrCsqOrS).fill(0);
            this.currentCapacity = capacityOrBufferOrCsqOrS;
            this.currentLimit = capacityOrBufferOrCsqOrS;
        } else if (typeof capacityOrBufferOrCsqOrS === "string") {
            const codePoints: number[] = [];
            for (const value of capacityOrBufferOrCsqOrS) { // To correctly iterate UTF-16 surrogate pairs.
                codePoints.push(value.charCodeAt(0));
            }

            const end = start + (length ?? capacityOrBufferOrCsqOrS.length);

            this.buffer = Uint16Array.from(codePoints.slice(start, end));
            this.currentCapacity = capacityOrBufferOrCsqOrS.length;
            this.currentLimit = end;
            this.currentPosition = start;
        } else if (capacityOrBufferOrCsqOrS instanceof Uint16Array) {
            const end = start + (length ?? capacityOrBufferOrCsqOrS.length);

            this.buffer = capacityOrBufferOrCsqOrS;
            this.currentCapacity = capacityOrBufferOrCsqOrS.length;
            this.currentLimit = end;
            this.currentPosition = start;
        } else {
            const end = start + (length ?? capacityOrBufferOrCsqOrS.length());

            this.buffer = new Uint16Array(end);
            const array: char[] = [];
            for (let i = start; i < end; ++i) {
                array.push(capacityOrBufferOrCsqOrS.charAt(i)!);
            }
            this.buffer.set(array);
            this.currentCapacity = end;
            this.currentLimit = end;
            this.currentPosition = 0;
        }
    }

    /**
     * Allocates a new char buffer.
     *
     * @param capacity The new buffer capacity.
     *
     * @returns The allocated char buffer.
     */
    public static allocate(capacity: number): CharBuffer {
        return new CharBuffer(capacity);
    }

    /** Wraps a char array into a buffer. */
    public static wrap(s: string): CharBuffer;
    /** Wraps a char array into a buffer. */
    public static wrap(s: string, offset: number, length: number): CharBuffer;
    /** Wraps a character sequence into a buffer. */
    public static wrap(csq: java.lang.CharSequence): CharBuffer;
    /** Wraps a character sequence into a buffer. */
    public static wrap(csq: java.lang.CharSequence, start: number, end: number): CharBuffer;
    public static wrap(sOrCsq: string | java.lang.CharSequence, offsetOrStart?: number,
        lengthOrEnd?: number): CharBuffer {
        if (typeof sOrCsq === "string") {
            if (offsetOrStart !== undefined && lengthOrEnd !== undefined) {
                if (offsetOrStart < 0 || offsetOrStart > sOrCsq.length || lengthOrEnd < 0
                    || lengthOrEnd > sOrCsq.length - offsetOrStart) {
                    throw new java.lang.IndexOutOfBoundsException();
                }
            }

            return new CharBuffer(sOrCsq, offsetOrStart, lengthOrEnd);
        } else {
            if (offsetOrStart !== undefined && lengthOrEnd !== undefined) {
                if (offsetOrStart < 0 || offsetOrStart > sOrCsq.length() || lengthOrEnd < offsetOrStart
                    || lengthOrEnd > sOrCsq.length()) {
                    throw new java.lang.IndexOutOfBoundsException();
                }
            }

            const buffer = new CharBuffer(sOrCsq, offsetOrStart, lengthOrEnd);
            buffer.readOnly = true;
            buffer.currentPosition = offsetOrStart ?? 0;
            buffer.currentLimit = lengthOrEnd ?? sOrCsq.length();

            return buffer;
        }
    }

    /** Appends the specified char to this buffer(optional operation). */
    public append(c: char): this;
    /** Appends the specified character sequence to this buffer(optional operation). */
    public append(csq: java.lang.CharSequence): this;
    /** Appends a subsequence of the specified character sequence to this buffer(optional operation). */
    public append(csq: java.lang.CharSequence, start: number, end: number): this;
    public append(cOrCsq: char | java.lang.CharSequence, start?: number, end?: number): this {
        if (this.readOnly) {
            throw new java.nio.ReadOnlyBufferException();
        }

        if (typeof cOrCsq === "number") {
            if (this.position === this.limit) {
                throw new java.nio.BufferOverflowException();
            }

            this.buffer[this.position++] = cOrCsq;
        } else {
            start ??= 0;
            end ??= cOrCsq.length();
            if (start < 0 || end < 0 || start > end || end > cOrCsq.length()) {
                throw new java.lang.IndexOutOfBoundsException();
            }

            if (this.position + cOrCsq.length() >= this.limit) {
                throw new java.nio.BufferOverflowException();
            }

            const array: char[] = [];
            for (let i = start; i < end; ++i) {
                array.push(cOrCsq.charAt(i)!);
            }

            this.buffer.set(array, this.currentPosition);
            this.currentPosition += end - start;
        }

        return this;
    }

    /** @returns the char array that backs this buffer (optional operation). */
    public array(): Uint16Array {
        return this.buffer;
    }

    /**
     * @returns the offset within this buffer's backing array of the first element of the buffer (optional operation).
     */
    public arrayOffset(): number {
        return 0;
    }

    /**
     * Creates a new, read - only char buffer that shares this buffer's content.
     *
     * @returns The new buffer.
     */
    public asReadOnlyBuffer(): CharBuffer {
        const buffer = new CharBuffer(this.buffer);
        buffer.readOnly = true;

        return buffer;
    }

    /**
     * Reads the character at the given index relative to the current position.
     *
     * @param index The char index.
     *
     * @returns The code point at this position.
     */
    public charAt(index: number): char | undefined {
        return this.buffer.at(index);
    }

    /**
     * Compacts this buffer(optional operation).
     *
     * @returns This buffer.
     */
    public compact(): this {
        if (this.position > 0) {
            this.buffer.copyWithin(0, this.currentPosition, this.currentLimit);
            this.currentPosition = this.currentLimit - this.currentPosition;
            this.currentLimit = this.currentCapacity;
            this.currentMark = -1;
        }

        return this;
    }

    /**
     * Compares this buffer to another.
     *
     * @param that The other buffer.
     *
     * @returns < 0 if this buffer is less than the given buffer, 0 for equality and > 0 if larger.
     */
    public compareTo(that: CharBuffer): number {
        return this.buffer.toString().localeCompare(that.toString());
    }

    /**
     * Creates a new char buffer that shares this buffer's content.
     *
     * @returns The new buffer.
     */
    public duplicate(): CharBuffer {
        const buffer = new CharBuffer(this.buffer);
        buffer.readOnly = this.readOnly;
        buffer.currentCapacity = this.currentCapacity;
        buffer.currentPosition = this.currentPosition;
        buffer.currentLimit = this.currentLimit;
        buffer.currentMark = this.currentMark;

        return buffer;
    }

    /**
     * Tells whether or not this buffer is equal to another object.
     *
     * @param ob The object to compare to.
     *
     * @returns True if the the other buffer is equal to this one.
     */
    public equals(ob: unknown): boolean {
        if (ob instanceof CharBuffer) {
            return this === ob || this.buffer.toString() === ob.toString();
        }

        return false;
    }

    public get(): char;
    public get(dst: char[]): this;
    public get(dst: char[], offset: number, length: number): this;
    public get(index: number): char;
    public get(dstOrIndex?: char[] | number, offset?: number, length?: number): char | this {
        if (dstOrIndex === undefined) {
            if (this.currentPosition >= this.currentLimit) {
                throw new java.nio.BufferUnderflowException();
            }

            return this.buffer[this.currentPosition++];
        } else if (typeof dstOrIndex === "number") {
            if (dstOrIndex >= this.currentLimit) {
                throw new java.lang.IndexOutOfBoundsException();
            }

            return this.buffer[dstOrIndex];
        } else {
            offset ??= 0;
            length ??= dstOrIndex.length;

            if (offset + length >= this.currentLimit) {
                throw new java.nio.BufferUnderflowException();
            }

            dstOrIndex.splice(offset, length,
                ...this.buffer.slice(this.currentPosition, this.currentPosition + length));

            this.currentPosition += length;

            return this;
        }
    }

    public isReadOnly(): boolean {
        return this.readOnly;
    }

    /**
     * Tells whether or not this buffer is backed by an accessible char array.
     *
     * @returns True.
     */
    public hasArray(): boolean {
        return true;
    }

    /** @returns the current hash code of this buffer. */
    public hashCode(): number {
        let hash = MurmurHash.initialize();
        hash = MurmurHash.update(hash, this.buffer.subarray(this.currentPosition, this.currentLimit));
        hash = MurmurHash.finish(hash, this.currentLimit - this.currentPosition);

        return hash;
    }

    /**
     * Tells whether or not this char buffer is direct.
     *
     * @returns False.
     */
    public isDirect(): boolean {
        return false;
    }

    /** @returns the length of this character buffer. */
    public length(): number {
        return this.buffer.length;
    }

    /** @returns this buffer's byte order. */
    public order(): java.nio.ByteOrder {
        return this.byteOrder;
    }

    /** Writes data to this buffer */
    public put(c: char): this;
    public put(src: Uint16Array): this;
    public put(src: Uint16Array, offset: number, length: number): this;
    public put(src: CharBuffer): this;
    public put(index: number, c: char): this;
    public put(src: string): this;
    public put(src: string, start: number, end: number): this;
    public put(cOrSrcOrIndex: char | Uint16Array | CharBuffer | number | string,
        offsetOrCOrStart?: number | char, lengthOrEnd?: number): this {

        if (this.readOnly) {
            throw new java.nio.ReadOnlyBufferException();
        }

        if (typeof cOrSrcOrIndex === "number" && offsetOrCOrStart === undefined) {
            // A single code point, relative.
            if (this.position === this.limit) {
                throw new java.nio.BufferOverflowException();
            }

            this.buffer[this.position++] = cOrSrcOrIndex;
        } else if (typeof cOrSrcOrIndex === "number" && offsetOrCOrStart !== undefined) {
            // A single code point absolute.
            if (cOrSrcOrIndex < 0 || cOrSrcOrIndex >= this.currentLimit) {
                throw new java.lang.IndexOutOfBoundsException();
            }
            this.buffer[cOrSrcOrIndex] = offsetOrCOrStart;
        } else if (cOrSrcOrIndex instanceof Uint16Array) {
            // A code point sequence.
            const offset = offsetOrCOrStart ?? 0;
            const length = lengthOrEnd ?? cOrSrcOrIndex.length;

            if (offset < 0 || offset + length > cOrSrcOrIndex.length) {
                throw new java.lang.IndexOutOfBoundsException();
            }

            if (length > this.remaining()) {
                throw new java.nio.BufferOverflowException();
            }

            this.buffer.set(cOrSrcOrIndex.subarray(offset, offset + length), this.currentPosition);
            this.currentPosition += length;
        } else if (cOrSrcOrIndex instanceof CharBuffer) {
            const length = cOrSrcOrIndex.remaining();
            if (this.currentPosition + length > this.currentLimit) {
                throw new java.nio.BufferOverflowException();
            }

            if (cOrSrcOrIndex === this) {
                throw new java.lang.IllegalArgumentException();
            }

            this.buffer.set(cOrSrcOrIndex.buffer.slice(cOrSrcOrIndex.currentPosition, cOrSrcOrIndex.currentLimit),
                this.currentPosition);

            this.currentPosition += length;
        } else {
            // A string.
            const src = cOrSrcOrIndex as string;
            const offset = offsetOrCOrStart ?? 0;
            const end = lengthOrEnd ?? src.length;
            if (this.currentPosition + end > this.currentLimit) {
                throw new java.nio.BufferOverflowException();
            }

            if (offset < 0 || offset > src.length) {
                throw new java.lang.IndexOutOfBoundsException();
            }

            for (let i = offset; i < end; ++i) {
                this.buffer[this.currentPosition++] = src.charCodeAt(i);
            }
        }

        return this;
    }

    /**
     * Attempts to read characters into the specified character buffer.
     *
     * @param target The buffer to write the content to.
     *
     * @returns The number of characters added to the buffer, or -1 if this source of characters is at its end.
     */
    public read(target: CharBuffer): number {
        if (target.readOnly) {
            throw new java.nio.ReadOnlyBufferException();
        }

        const length = Math.min(this.remaining(), target.remaining());
        const result = length === target.remaining() ? -1 : length;
        target.buffer.set(this.buffer.slice(this.currentPosition, this.currentPosition + length),
            target.currentPosition);
        target.currentPosition += length;

        return result;
    }

    /** Creates a new char buffer whose content is a shared subsequence of this buffer's content. */
    public slice(): CharBuffer {
        throw new NotImplementedError();
    }

    /**
     * Creates a new character buffer that represents the specified subsequence of this buffer, relative to
     * the current position.
     *
     * @param start tbd
     * @param end tbd
     *
     * @returns The new char buffer.
     */
    public subSequence(start: number, end: number): CharBuffer {
        if (start < 0 || start > this.remaining() || end < start || end > this.remaining()) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        const buffer = new CharBuffer(this.buffer, this.currentPosition + start, this.currentPosition + end);
        buffer.readOnly = this.readOnly;

        return buffer;
    }

    /** @returns a string containing the characters in this buffer. */
    public toString(): string {
        return String.fromCharCode(...this.buffer.subarray(this.currentPosition, this.currentLimit));
    }

}
