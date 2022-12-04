/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../java";
import { JavaObject } from "./Object";

type SourceDataType =
    boolean | number | string | bigint | StringBuilder | Uint16Array | java.lang.CharSequence | java.lang.Object |
    java.lang.StringBuffer;

type SourceData = SourceDataType[];

export class StringBuilder extends JavaObject implements java.lang.CharSequence, java.lang.Appendable {
    private static readonly surrogateOffset = 0x10000 - (0xD800 << 10) - 0xDC00;

    private data: Uint16Array;

    // The used length in data (which might be larger, due to removed parts).
    private currentLength = 0;

    public constructor(capacity?: number);
    public constructor(content: string | java.lang.CharSequence);
    public constructor(capacityOrContent?: number | string | java.lang.CharSequence) {
        super();

        if (typeof capacityOrContent === "number") {
            if (capacityOrContent < 0) {
                throw new java.lang.NegativeArraySizeException();
            }

            this.data = new Uint16Array(capacityOrContent);
        } else {
            this.data = new Uint16Array();
            if (capacityOrContent !== undefined) {
                this.append(capacityOrContent);
            }
        }
    }

    /** Appends the string representation of the given value to the sequence. */
    public append(value: SourceDataType): this;
    /** Appends the string representation of the sub char array argument to this sequence. */
    public append(str: Uint16Array, offset: number, len: number): this;
    /** Appends a subsequence of the specified CharSequence to this sequence. */
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    public append(s: java.lang.CharSequence, start: number, end: number): this;
    public append(valueOrStrOrS: SourceDataType, offsetOrStart?: number, lenOrEnd?: number): this {
        if (valueOrStrOrS instanceof Uint16Array || Array.isArray(valueOrStrOrS)
            || this.isCharSequence(valueOrStrOrS)) {
            this.insertListData(this.currentLength, valueOrStrOrS, offsetOrStart, lenOrEnd);
        } else {
            this.insertData(this.currentLength, valueOrStrOrS);
        }

        return this;
    }

    /**
     * Appends the string representation of the codePoint argument to this sequence.
     *
     * @param c The character to add.
     *
     * @returns this.
     */
    public appendCodePoint(c: number): this {
        this.append(String.fromCodePoint(c));

        return this;
    }

    /** @returns the current capacity. */
    public capacity(): number {
        return this.data.length;
    }

    /**
     * @returns the char value in this sequence at the specified index.
     *
     * @param index The index of the value to be returned.
     */
    public charAt(index: number): java.lang.char {
        if (index < 0 || index >= this.currentLength) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        return this.data.at(index)!;
    }

    /**
     * Not part of the official Java API for `StringBuffer` but something that should exist.
     * Resets the content of this buffer to empty.
     *
     * @returns this
     */
    public clear(): this {
        this.data = new Uint16Array();
        this.currentLength = 0;

        return this;
    }

    /**
     * @returns the 21 bit Unicode code point at the specified index.
     *
     * @param index The position of the requested code point.
     */
    public codePointAt(index: number): number {
        if (index < 0 || index >= this.currentLength) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        const code = this.data.at(index)!;
        if (code >= 0xD800 && code <= 0xDBFF) {
            // Got a high surrogate value. See if there's a low one and compute the actual code point from that.
            if (index === this.data.length) {
                // Not enough data. Return just the high surrogate.
                return code;
            }

            const lowSurrogate = this.data[index + 1];
            if (lowSurrogate < 0xDC00 || lowSurrogate > 0xDFFF) {
                // Invalid low surrogate.
                return code;
            }

            return (code << 10) + lowSurrogate + StringBuilder.surrogateOffset;
        }

        return code;
    }

    /**
     * @returns the 21 bit Unicode code point before the specified index.
     *
     * @param index The position of the requested code point.
     */
    public codePointBefore(index: number): number {
        if (index < 1 || index >= this.currentLength) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        const code = this.data.at(index - 1)!;
        if (code >= 0xDC00 && code <= 0xDFFF) {
            // Found a low surrogate. Can we create a full code point from that?
            if (index - 2 >= 0) {
                const highSurrogate = this.data.at(index - 2)!;
                if (highSurrogate >= 0xD800 && highSurrogate <= 0xDBFF) {
                    return (highSurrogate << 10) + code + StringBuilder.surrogateOffset;
                }
            }
        }

        return code;
    }

    /**
     * @returns the number of Unicode code points in the specified text range of this sequence.
     *
     * @param beginIndex the index to the first char of the text range.
     * @param endIndex the index after the last char of the text range.
     */
    public codePointCount(beginIndex: number, endIndex: number): number {
        if (beginIndex < 0 || beginIndex >= this.currentLength) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        if (endIndex < 0 || endIndex >= this.currentLength) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        if (beginIndex > endIndex) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        let count = 0;
        let index = beginIndex;
        while (index < endIndex) {
            let code = this.data.at(index++)!;
            ++count;

            if (code >= 0xD800 && code <= 0xDBFF && index < endIndex) {
                code = this.data.at(index)!;
                if (code >= 0xDC00 && code <= 0xDFFF) {
                    // Full surrogate pair, jump over the low surrogate.
                    ++index;
                }
            }
        }

        return count;
    }

    /**
     * Removes the characters in a substring of this sequence.
     *
     * @param start The beginning index, inclusive.
     * @param end The ending index, exclusive.
     *
     * @returns this.
     */
    public delete(start: number, end: number): this {
        if (start < 0 || start >= this.currentLength) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        if (end < 0 || end > this.currentLength) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        if (start > end) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        this.data.copyWithin(start, end);
        this.currentLength -= end - start;

        return this;
    }

    /**
     * Removes the char at the specified position in this sequence.
     *
     * @param index tbd
     *
     * @returns this
     */
    public deleteCharAt(index: number): this {
        this.delete(index, index + 1);

        return this;
    }

    /**
     * Ensures that the capacity is at least equal to the specified minimum.
     *
     * @param minimumCapacity The required capacity.
     */
    public ensureCapacity(minimumCapacity: number): void {
        if (minimumCapacity > this.data.length) {
            const newData = new Uint16Array(minimumCapacity);
            newData.set(this.data);
            this.data = newData;

            // The current length doesn't change.
        }
    }

    /**
     * Characters are copied from this sequence into the destination character array dst.
     *
     * @param srcBegin tbd
     * @param srcEnd tbd
     * @param dst tbd
     * @param dstBegin tbd
     */
    public getChars(srcBegin: number, srcEnd: number, dst: Uint16Array, dstBegin: number): void {
        if (srcBegin < 0 || dstBegin < 0) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        if (srcBegin > srcEnd || srcEnd > this.currentLength) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        if (dstBegin + srcEnd - srcBegin > dst.length) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        dst.set(this.data.subarray(srcBegin, srcEnd), dstBegin);
    }

    /**
     * @returns the index within this string of the first occurrence of the specified substring,
     * starting at the specified index.
     *
     * @param str tbd
     * @param fromIndex tbd
     */
    public indexOf(str: string, fromIndex?: number): number {
        const text = this.toString();

        return `${text}`.indexOf(str, fromIndex);
    }

    /** Inserts the string representation of the given value to the sequence. */
    public insert(index: number, value: SourceDataType): this;
    /** Appends the string representation of the sub char array argument to this sequence. */
    public insert(index: number, str: Uint16Array, offset: number, len: number): this;
    /** Appends the string representation of the sub char array argument to this sequence. */
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    public insert(index: number, s: java.lang.CharSequence, start: number, end: number): this;
    public insert(index: number, valueOrStrOrS: SourceDataType | Uint16Array | java.lang.CharSequence,
        offsetOrStart?: number, lenOrEnd?: number): this {
        if (valueOrStrOrS instanceof Uint16Array || Array.isArray(valueOrStrOrS)
            || this.isCharSequence(valueOrStrOrS)) {
            this.insertListData(index, valueOrStrOrS, offsetOrStart, lenOrEnd);
        } else {
            this.insertData(index, valueOrStrOrS);
        }

        return this;
    }

    /**
     * @returns the index within this string of the last occurrence of the specified substring.
     *
     * @param str tbd
     * @param fromIndex tbd
     */
    public lastIndexOf(str: string, fromIndex?: number): number {
        const text = this.toString();

        return `${text}`.lastIndexOf(str, fromIndex);
    }

    /** @returns the length (character count). */
    public length(): number {
        return this.currentLength;
    }

    /**
     * @returns the index within this sequence that is offset from the given index by codePointOffset code points.
     *
     * @param index the index to be offset.
     * @param codePointOffset the offset in code points
     */
    public offsetByCodePoints(index: number, codePointOffset: number): number {
        if (index < 0 || index >= this.currentLength) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        if (codePointOffset >= 0) {
            let offset: number;
            for (offset = 0; index < this.currentLength && offset < codePointOffset; ++offset) {
                if (this.isHighSurrogate(this.data.at(index++)) && index < this.currentLength &&
                    this.isLowSurrogate(this.data.at(index))) {
                    ++index;
                }
            }

            if (offset < codePointOffset) {
                throw new java.lang.IndexOutOfBoundsException();
            }
        } else {
            let offset: number;
            for (offset = codePointOffset; index > 0 && offset < 0; ++offset) {
                if (this.isLowSurrogate(this.data.at(--index)) && index > 0 &&
                    this.isHighSurrogate(this.data.at(index - 1))) {
                    --index;
                }
            }
            if (offset < 0) {
                throw new java.lang.IndexOutOfBoundsException();
            }
        }

        return index;
    }

    /**
     * Replaces the characters in a substring of this sequence with characters in the specified String.
     *
     * @param start tbd
     * @param end tbd
     * @param str tbd
     *
     * @returns this
     */
    public replace(start: number, end: number, str: string): this {
        this.delete(start, end);
        this.insertData(start, str);

        return this;
    }

    /**
     * Causes this character sequence to be replaced by the reverse of the sequence.
     *
     * @returns this
     */
    public reverse(): this {
        this.data.reverse();

        return this;
    }

    /**
     * The character at the specified index is set to ch.
     *
     * @param index tbd
     * @param ch tbd
     */
    public setCharAt(index: number, ch: java.lang.char): void {
        if (index < 0 || index >= this.currentLength) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        this.data.set([ch & 0xFFFF], index);
    }

    /**
     * Sets the length of the character sequence.
     *
     * @param newLength The new length.
     */
    public setLength(newLength: number): void {
        if (newLength === this.currentLength) {
            return;
        }

        if (newLength < this.currentLength) {
            this.currentLength = newLength;
        } else if (newLength > this.currentLength && newLength < this.data.length) {
            // No need to copy anything if we still have enough room.
            this.currentLength = newLength;
        } else {
            // New length is larger than the current data size. Create a new array and copy the existing content.
            // Any further entry is initialized to zero.
            const newData = new Uint16Array(newLength).fill(0);
            this.currentLength = newLength;
            newData.set(this.data, 0);

            this.data = newData;
        }
    }

    /**
     * @returns a new character sequence that is a subsequence of this sequence.
     *
     * @param start tbd
     * @param end tbd
     */
    public subSequence(start: number, end: number): java.lang.CharSequence {
        const buffer = java.nio.CharBuffer.wrap("");
        buffer.put(this.data, start, end);

        return buffer;
    }

    /**
     * @returns a new String that contains a subsequence of characters currently contained in this sequence.
     *
     * @param start tbd
     * @param end tbd
     */
    public substring(start: number, end?: number): String {
        end ??= this.currentLength;
        if (start < 0 || end >= this.currentLength) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        return String.fromCharCode(...this.data.subarray(start, end));
    }

    /** @returns a string representing of the data in this sequence. */
    public toString(): java.lang.String {
        return new java.lang.String(String.fromCharCode(...this.data.subarray(0, this.currentLength)));
    }

    public array(): Uint16Array {
        return this.data.subarray(0, this.currentLength);
    }

    /** Attempts to reduce storage used for the character sequence. */
    public trimToSize(): void {
        if (this.currentLength < this.data.length) {
            const newData = new Uint16Array(this.currentLength);
            newData.set(this.data.subarray(0, this.currentLength), 0);

            this.data = newData;
        }
    }

    private insertData(position: number, ...newContent: SourceData): void {
        const list: Uint16Array[] = [];
        let additionalSize = 0;
        newContent.forEach((entry) => {
            if (entry instanceof StringBuilder) {
                if (entry.currentLength > 0) {
                    list.push(entry.data.subarray(0, entry.currentLength));
                    additionalSize += entry.currentLength;
                }
            } else if (typeof entry === "string") {
                if (entry.length > 0) {
                    const chars: java.lang.char[] = [];

                    for (let i = 0; i < entry.length; ++i) {
                        chars.push(entry.charCodeAt(i));
                    }

                    const array = Uint16Array.from(chars);
                    additionalSize += array.length;
                    list.push(array);
                }
            } else {
                const text = `${entry.toString()}`;
                if (text.length > 0) {
                    const chars: java.lang.char[] = [];

                    for (let i = 0; i < text.length; ++i) {
                        chars.push(text.charCodeAt(i));
                    }

                    const array = Uint16Array.from(chars);
                    additionalSize += array.length;
                    list.push(array);
                }
            }
        });

        const requiredSize = this.currentLength + additionalSize;
        if (requiredSize <= this.data.length) {
            // No need to re-allocate. There's still room for the new data.
            if (position < this.currentLength) {
                this.data.copyWithin(position + additionalSize, position, this.currentLength);
            }

            list.forEach((data) => {
                this.data.set(data, position);
                position += data.length;
            });

            this.currentLength = requiredSize;
        } else {
            // Reallocate at least by half of the current buffer size.
            const newData = new Uint16Array(Math.max(requiredSize, this.data.length * 1.5));
            if (position > 0) {
                // Copy what's before the target position.
                newData.set(this.data.subarray(0, position), 0);
            }

            // Add the new data.
            let offset = position;
            list.forEach((data) => {
                newData.set(data, offset);
                offset += data.length;
            });

            if (position < this.currentLength) {
                // Copy the rest from the original data.
                newData.set(this.data.subarray(position, this.currentLength), offset);
            }

            this.data = newData;
            this.currentLength = requiredSize;
        }
    }

    /**
     * A special version of the insertData method, which deals specifically with char arrays and sequences.
     *
     * @param position The position where to add the new content.
     * @param data The content to add.
     * @param start Optional start position in the source list.
     * @param end Optional end position in the source list.
     */
    private insertListData(position: number, data: number[] | Uint16Array | java.lang.CharSequence, start?: number,
        end?: number): void {
        let array: Uint16Array;
        let additionalSize: number;

        if (data instanceof Uint16Array) {
            array = start === undefined ? data : data.slice(start, end);
            additionalSize = data.length;
        } else if (Array.isArray(data)) {
            if (start) {
                array = Uint16Array.from(data.slice(start, end));
            } else {
                array = Uint16Array.from(data);
            }
            additionalSize = data.length;
        } else {
            start ??= 0;
            end ??= data.length();

            additionalSize = end - start;
            array = new Uint16Array(additionalSize);
            for (let i = start; i < end; ++i) {
                array[i] = data.charAt(i)!;
            }
        }

        const requiredSize = this.currentLength + additionalSize;
        if (requiredSize <= this.data.length) {
            // No need to re-allocate. There's still room for the new data.
            if (position < this.currentLength) {
                this.data.copyWithin(additionalSize, position, this.currentLength);
            }

            this.data.set(array, position);
            this.currentLength = requiredSize;
        } else {
            const newData = new Uint16Array(Math.max(requiredSize, this.data.length * 1.5));
            if (position > 0) {
                // Copy what's before the target position.
                newData.set(this.data.subarray(0, position), 0);
            }

            // Add the new data.
            newData.set(array, position);

            if (position < this.currentLength) {
                // Copy the rest from the original data.
                newData.set(this.data.subarray(position, this.currentLength), position + additionalSize);
            }

            this.data = newData;
            this.currentLength = requiredSize;
        }
    }

    private isCharSequence(candidate: unknown): candidate is java.lang.CharSequence {
        if (candidate instanceof StringBuilder) {
            // A StringBuilder is also a char sequence, but we use an optimized path for it.
            return false;
        }

        return (candidate as java.lang.CharSequence).subSequence !== undefined;
    }

    private isHighSurrogate(code?: number): boolean {
        return code !== undefined && code >= 0xD800 && code <= 0xDBFF;
    }

    private isLowSurrogate(code?: number): boolean {
        return code !== undefined && code >= 0xDC00 && code <= 0xDFFF;
    }
}

