/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { final } from "../../Decorators";
import { MurmurHash } from "../../MurmurHash";

import { java } from "../java";

/* eslint-disable @typescript-eslint/naming-convention */

@final
export class Integer implements java.io.Serializable, java.lang.Comparable<Integer>  {
    public static readonly MAX_VALUE = 0x7FFFFFFF;
    public static readonly MIN_VALUE = 0x80000000;
    public static readonly SIZE = 32;
    public static readonly TYPE: java.lang.Class<Integer>;

    private static byte = new Int8Array(1);
    private static short = new Int16Array(1);

    private value: number;

    // Constructs a newly allocated Integer object that represents the specified int or string value.
    public constructor(value: number | string) {
        if (typeof value === "string") {
            this.value = parseInt(value, 10);
        } else if (Number.isInteger(value)) {
            this.value = value;
        } else {
            throw new java.lang.IllegalArgumentException();
        }
    }

    /**
     * @returns The number of one-bits in the two's complement binary representation of the specified int value.
     *
     * @param i The value to examine.
     */
    public static bitCount(i: number): number {
        if (Number.isInteger(i)) {
            i = i - ((i >> 1) & 0x55555555);
            i = (i & 0x33333333) + ((i >> 2) & 0x33333333);

            return ((i + (i >> 4) & 0xF0F0F0F) * 0x1010101) >> 24;
        }

        throw new java.lang.IllegalArgumentException();
    }

    /**
     * Compares two int values numerically.
     *
     * @param x The first value to compare.
     * @param y The second value to compare.
     *
     * @returns A value < 0 if x is less than y, > 0 if x is larger than y, otherwise 0.
     */
    public static compare(x: number, y: number): number {
        if (!Number.isInteger(x) || !Number.isInteger(y)) {
            throw new java.lang.IllegalArgumentException();
        }

        return x - y;
    }

    /**
     * Decodes a String into an Integer.
     *
     * @param nm The number as string.
     *
     * @returns A new Integer with the converted value.
     */
    public static decode(nm: string): Integer {
        let n = nm.trim().toLowerCase();
        if (n.length === 0) {
            throw new java.lang.NumberFormatException();
        }

        try {
            // The function parseInt does not support octal numbers, so we have to handle that case manually.
            let sign = "";
            if (n[0] === "+" || n[0] === "-") {
                sign = n[0];
                n = n.substring(1);
            }

            let radix = 10;
            if (n[0] === "0" && n.length > 1) {
                // Octal or hexadecimal.
                n = n.substring(1);
                if (n[0] === "x") {
                    radix = 16;
                    n = n.substring(1);
                } else {
                    radix = 8;
                }
            }

            return new java.lang.Integer(parseInt(sign + n, radix));
        } catch (reason) {
            throw new java.lang.NumberFormatException(undefined, java.lang.Throwable.fromError(reason));
        }
    }

    /**
     * Determines the integer value of the system property with the specified name.
     *
     * @param nm The name of the system property to read.
     * @param val A value to be used if the property wasn't found.
     *
     * @returns The system property as Integer or the default value as Integer.
     */
    public static getInteger(nm?: string, val?: number): Integer | null {
        const p = nm && nm.length > 0 ? java.lang.System.getProperty(nm) : undefined;
        if (!p) {
            if (val === undefined) {
                return null;
            }

            return new Integer(val);
        }

        try {
            return new Integer(p);
        } catch (reason) {
            return null;
        }
    }

    /**
     * @returns an int value with at most a single one-bit, in the position of the highest-order ("leftmost") one-bit
     * in the specified int value.
     *
     * @param i The value for which the result must be determined.
     */
    public static highestOneBit(i: number): number {
        if (!Number.isInteger(i)) {
            throw new java.lang.IllegalArgumentException();
        }

        return i & (Integer.MIN_VALUE >>> this.numberOfLeadingZeros(i));
    }

    /**
     * @returns an int value with at most a single one-bit, in the position of the lowest-order ("rightmost") one-bit
     * in the specified int value.
     *
     * @param i The value for which the result must be determined.
     */
    public static lowestOneBit(i: number): number {
        if (!Number.isInteger(i)) {
            throw new java.lang.IllegalArgumentException();
        }

        return i & -i;
    }

    /**
     * @returns the number of zero bits preceding the highest-order ("leftmost") one-bit in the two's complement binary
     * representation of the specified int value.
     *
     * @param i The value for which the result must be determined.
     */
    public static numberOfLeadingZeros(i: number): number {
        if (!Number.isInteger(i)) {
            throw new java.lang.IllegalArgumentException();
        }

        if (i <= 0) {
            return i === 0 ? 32 : 0;
        }

        let n = 31;
        if (i >= 1 << 16) {
            n -= 16;
            i >>>= 16;
        }

        if (i >= 1 << 8) {
            n -= 8;
            i >>>= 8;
        }

        if (i >= 1 << 4) {
            n -= 4;
            i >>>= 4;
        }

        if (i >= 1 << 2) {
            n -= 2;
            i >>>= 2;
        }

        return n - (i >>> 1);
    }

    /**
     * @returns the number of zero bits following the lowest-order ("rightmost") one-bit in the two's complement binary
     * representation of the specified int value.
     *
     * @param i The value for which the result must be determined.
     */
    public static numberOfTrailingZeros(i: number): number {
        if (!Number.isInteger(i)) {
            throw new java.lang.IllegalArgumentException();
        }

        i = ~i & (i - 1);
        if (i <= 0) {
            return i & 32;
        }

        let n = 1;

        if (i > 1 << 16) {
            n += 16;
            i >>>= 16;
        }

        if (i > 1 << 8) {
            n += 8;
            i >>>= 8;
        }

        if (i > 1 << 4) {
            n += 4;
            i >>>= 4;
        }

        if (i > 1 << 2) {
            n += 2;
            i >>>= 2;
        }

        return n + (i >>> 1);
    }

    /**
     * @returns the value obtained by reversing the order of the bits in the two's complement binary representation of
     * the specified int value.
     *
     * @param i The value to reverse.
     */
    public static reverse(i: number): number {
        if (!Number.isInteger(i)) {
            throw new java.lang.IllegalArgumentException();
        }

        i = ((i & 0x55555555) << 1) | ((i >>> 1) & 0x55555555);
        i = ((i & 0x33333333) << 2) | ((i >>> 2) & 0x33333333);
        i = ((i & 0x0F0F0F0F) << 4) | ((i >>> 4) & 0x0F0F0F0F);
        i = (i << 24) | ((i & 0xFF00) << 8) | ((i >>> 8) & 0xFF00) | (i >>> 24);

        return i;
    }

    /**
     * @returns the value obtained by reversing the order of the bytes in the two's complement representation of the
     * specified int value.
     *
     * @param i The number to reverse.
     */
    public static reverseBytes(i: number): number {
        if (!Number.isInteger(i)) {
            throw new java.lang.IllegalArgumentException();
        }

        return (i << 24) | ((i & 0xFF00) << 8) | ((i >>> 8) & 0xFF00) | (i >>> 24);
    }

    /**
     * @returns the value obtained by rotating the two's complement binary representation of the specified int value
     * left by the specified number of bits.
     *
     * @param i The number with the bits to rotate.
     * @param distance Determines how far to rotate.
     */
    public static rotateLeft(i: number, distance: number): number {
        if (!Number.isInteger(i)) {
            throw new java.lang.IllegalArgumentException();
        }

        return (i << distance) | (i >>> -distance);
    }

    /**
     * @returns the value obtained by rotating the two's complement binary representation of the specified int value
     * right by the specified number of bits.
     *
     * @param i The number with the bits to rotate.
     * @param distance Determines how far to rotate.
     */
    public static rotateRight(i: number, distance: number): number {
        if (!Number.isInteger(i)) {
            throw new java.lang.IllegalArgumentException();
        }

        return (i >>> distance) | (i << -distance);
    }

    /**
     * @returns the signum function of the specified int value.
     *
     * @param i The value from which to get the signum.
     */
    public static signum(i: number): number {
        return i < 0 ? -1 : (i > 0) ? 1 : 0;
    }

    /**
     * @returns a string representation of the integer argument as an unsigned integer in base 2.
     *
     * @param i The number to convert.
     */
    public static toBinaryString(i: number): string {
        if (!Number.isInteger(i)) {
            throw new java.lang.IllegalArgumentException();
        }

        return i.toString(2);
    }

    /**
     * @returns a string representation of the integer argument as an unsigned integer in base 16.
     *
     * @param i The number to convert.
     */
    public static toHexString(i: number): string {
        if (!Number.isInteger(i)) {
            throw new java.lang.IllegalArgumentException();
        }

        return i.toString(16);

    }

    /**
     * @returns a string representation of the integer argument as an unsigned integer in base 8.
     *
     * @param i The number to convert.
     */
    public static toOctalString(i: number): string {
        if (!Number.isInteger(i)) {
            throw new java.lang.IllegalArgumentException();
        }

        return i.toString(8);

    }

    /**
     * @returns a string representation of the first argument in the radix specified by the second argument.
     *
     * @param i The number to convert.
     * @param radix The radix of the result string.
     */
    public static toString(i: number, radix?: number): string {
        if (!Number.isInteger(i)) {
            throw new java.lang.IllegalArgumentException();
        }

        return i.toString(radix);

    }

    /**
     * Returns an Integer object holding the value given or extracted from the specified String when parsed with the
     * radix given by the second argument.
     */
    public static valueOf(i: number): Integer;
    public static valueOf(s: string, radix?: number): Integer;
    public static valueOf(value: number | string, radix?: number): Integer {
        if (typeof value === "number") {
            return new Integer(value);
        }

        const i = parseInt(value, radix);

        return new Integer(i);
    }

    public static parseInt(s: string, radix = 10): number {
        return parseInt(s, radix);
    }

    /** @returns the value of this Integer as a byte. */
    public byteValue(): number {
        Integer.byte[0] = this.value; // Signed integer "casting".

        return Integer.byte[0];
    }

    /**
     * Compares two Integer objects numerically.
     *
     * @param anotherInteger The value to compare this instance to.
     *
     * @returns A value < 0 if this instance is smaller than the other one, > 0 if larger, and 0 if they are equal.
     */
    public compareTo(anotherInteger: Integer): number {
        return this.value - anotherInteger.value;
    }

    /** @returns the value of this Integer as a double. */
    public doubleValue(): number {
        return this.value;
    }

    /**
     * Compares this object to the specified object.
     *
     * @param obj The object to compare this instance to.
     *
     * @returns True if obj is an instance of java.lang.Integer and both represent the same numerical value,
     *          otherwise false.
     */
    public equals(obj?: unknown): boolean {
        if (obj instanceof Integer) {
            return this.value === obj.value;
        }

        return false;
    }

    /** @returns the value of this Integer as a float. */
    public floatValue(): number {
        return this.value;
    }

    /** @returns a hash code for this Integer. */
    public hashCode(): number {
        let hash = MurmurHash.initialize(11);
        hash = MurmurHash.update(hash, this.value);
        hash = MurmurHash.finish(hash, 1);

        return hash;
    }

    /** @returns the value of this Integer as an int. */
    public intValue(): number {
        return this.value;
    }

    /** @returns the value of this Integer as a long. */
    public longValue(): number {
        return this.value;
    }

    /** @returns the value of this Integer as a short. */
    public shortValue(): number {
        Integer.short[0] = this.value;

        return Integer.short[0];
    }

    // Returns a String object representing this Integer's value.
    public toString(): string {
        return this.value.toString();
    }

    private [Symbol.toPrimitive](hint: string) {
        if (hint === "number") {
            return this.value;
        } else if (hint === "string") {
            return this.toString();
        }

        return null;
    }

    static {
        // Defer initializing the TYPE field, to ensure the Class class is loaded before using it.
        setTimeout(() => {
            /* @ts-expect-error */
            Integer.TYPE = new java.lang.Class(Integer);
            Object.freeze(Integer);
        }, 0);
    }

}
