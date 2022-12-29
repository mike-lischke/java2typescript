/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { S } from "../../templates";
import { MurmurHash } from "../../MurmurHash";

import { java } from "../java";
import { JavaObject } from "./Object";

/* eslint-disable @typescript-eslint/naming-convention */

export class Long extends JavaObject implements java.io.Serializable, java.lang.Comparable<Long>  {
    public static readonly MAX_VALUE = 0x7FFFFFFFFFFFFFFFn;
    public static readonly MIN_VALUE = -0x8000000000000000n;
    public static readonly SIZE = 64;
    public static readonly TYPE: java.lang.Class<Long>;

    private value: bigint;

    /**
     * Constructs a newly allocated Long object that represents the specified int or string value.
     *
     * @param value A primitive type to wrap in this instance.
     */
    public constructor(value: bigint | number | string | java.lang.String) {
        super();

        if (value instanceof java.lang.String) {
            this.value = BigInt(`${value}`);
        } else {
            this.value = BigInt(value);
        }
    }

    /**
     * @returns The number of one-bits in the two's complement binary representation of the specified bigint value.
     *
     * @param i The value to examine.
     */
    public static bitCount(i: bigint): number {
        i = i - ((i >> 1n) & 0x5555555555555555n);
        i = (i & 0x3333333333333333n) + ((i >> 2n) & 0x3333333333333333n);
        i = (i + (i >> 4n)) & 0x0f0f0f0f0f0f0f0fn;
        i = i + (i >> 8n);
        i = i + (i >> 16n);
        i = i + (i >> 32n);

        return Number(i & 0x7Fn);

    }

    /**
     * Compares two int values numerically.
     *
     * @param x The first value to compare.
     * @param y The second value to compare.
     *
     * @returns A value < 0 if x is less than y, > 0 if x is larger than y, otherwise 0.
     */
    public static compare(x: bigint, y: bigint): number {
        return Number(x - y);
    }

    /**
     * Decodes a String into a Long.
     *
     * @param nm The number as string.
     *
     * @returns A new Long with the converted value.
     */
    public static decode(nm: string): Long {
        const n = nm.trim().toLowerCase();
        if (n.length === 0) {
            throw new java.lang.NumberFormatException();
        }

        try {
            // The function parseInt does not support octal numbers, so we have to handle that case manually.
            let sign = "";
            let start = 0;
            if (n[0] === "+" || n[0] === "-") {
                sign = n[0];
                ++start;
            }

            let radix = 10;
            if (n.length > start + 1) {
                if (n[0] === "#") {
                    ++start;
                    radix = 16;
                } else if (n[start] === "0") {
                    ++start;
                    if (n[start] === "x") {
                        radix = 16;
                        ++start;
                    } else {
                        radix = 8;
                    }
                }
            }

            return new Long(parseInt(sign + n.substring(start), radix));
        } catch (reason) {
            throw new java.lang.NumberFormatException(undefined, java.lang.Throwable.fromError(reason));
        }
    }

    /**
     * Determines the long value of the system property with the specified name.
     *
     * @param nm The name of the system property to read.
     * @param val A value to be used if the property wasn't found.
     *
     * @returns The system property as Integer or the default value as Long.
     */
    public static getLong(nm?: java.lang.String, val?: number): Long | null {
        const p = nm && nm.length() > 0 ? java.lang.System.getProperty(nm) : undefined;
        if (!p) {
            if (val === undefined) {
                return null;
            }

            return new Long(val);
        }

        try {
            return new Long(p);
        } catch (reason) {
            return null;
        }
    }

    /**
     * @returns a bigint value with at most a single one-bit, in the position of the highest-order ("leftmost") one-bit
     * in the specified bigint value.
     *
     * @param i The value for which the result must be determined.
     */
    public static highestOneBit(i: bigint): bigint {
        return 1n << BigInt(63 - this.numberOfLeadingZeros(i));
    }

    /**
     * @returns a bigint value with at most a single one-bit, in the position of the lowest-order ("rightmost") one-bit
     * in the specified int value.
     *
     * @param i The value for which the result must be determined.
     */
    public static lowestOneBit(i: bigint): bigint {
        return i & -i;
    }

    /**
     * @returns the number of zero bits preceding the highest-order ("leftmost") one-bit in the two's complement binary
     * representation of the specified int value.
     *
     * @param i The value for which the result must be determined.
     */
    public static numberOfLeadingZeros(i: bigint): number {
        const x = Number((i >> 32n) & 0xFFFFFFFFn);

        return x === 0 ? 32 + java.lang.Integer.numberOfLeadingZeros(Number(i))
            : java.lang.Integer.numberOfLeadingZeros(x);
    }

    /**
     * @returns the number of zero bits following the lowest-order ("rightmost") one-bit in the two's complement binary
     * representation of the specified int value.
     *
     * @param i The value for which the result must be determined.
     */
    public static numberOfTrailingZeros(i: bigint): number {
        i = ~i & (i - 1n);
        if (i <= 0) {
            return Number(i & 64n);
        }

        let n = 1n;

        if (i > (1n << 32n)) {
            n += 16n;
            i >>= 16n;
        }

        if (i > 1 << 16) {
            n += 16n;
            i >>= 16n;
        }

        if (i > 1 << 8) {
            n += 8n;
            i >>= 8n;
        }

        if (i > 1 << 4) {
            n += 4n;
            i >>= 4n;
        }

        if (i > 1 << 2) {
            n += 2n;
            i >>= 2n;
        }

        return Number(n + (i >> 1n));
    }

    /**
     * @returns the value obtained by reversing the order of the bits in the two's complement binary representation of
     * the specified int value.
     *
     * @param i The value to reverse.
     */
    public static reverse(i: bigint): bigint {
        i = ((i & 0x5555555555555555n) << 1n) | ((i >> 1n) & 0x5555555555555555n);
        i = ((i & 0x3333333333333333n) << 2n) | ((i >> 2n) & 0x3333333333333333n);
        i = ((i & 0x0F0F0F0F0F0F0F0Fn) << 4n) | ((i >> 4n) & 0x0F0F0F0F0F0F0F0Fn);

        return this.reverseBytes(i);
    }

    /**
     * @returns the value obtained by reversing the order of the bytes in the two's complement representation of the
     * specified int value.
     *
     * @param i The number to reverse.
     */
    public static reverseBytes(i: bigint): bigint {
        // Note: bigint does not support an unsigned right shift, so we have first to shift and then mask out
        //       any sign bits on the left.
        i = ((i >> 32n) & 0xFFFFFFFFn) | ((i & 0xFFFFFFFFn) << 32n);
        i = ((i >> 16n) & 0x0000FFFF0000FFFFn) | ((i & 0x0000FFFF0000FFFFn) << 16n);
        i = ((i >> 8n) & 0x00FF00FF00FF00FFn) | ((i & 0x00FF00FF00FF00FFn) << 8n);

        return i;
    }

    /**
     * @returns the value obtained by rotating the two's complement binary representation of the specified bigint value
     * left by the specified number of bits.
     *
     * @param i The number with the bits to rotate.
     * @param distance Determines how far to rotate.
     */
    public static rotateLeft(i: bigint, distance: number): bigint {
        if (distance < 0) {
            return this.rotateRight(i, -distance);
        }

        const high = (i >> 32n) & 0xFFFFFFFFn;
        let low = i & 0xFFFFFFFFn;
        let bits = BigInt(distance & 0x3F); // At most 63 bits to shift.
        if (bits === 32n) {
            return (low << 32n) | high;
        }

        let newHigh;
        if (bits > 32) {
            bits -= 32n;
            newHigh = ((low << bits) & 0xFFFFFFFFn) | ((high >> (32n - bits)) & 0xFFFFFFFFn);
            low = (high << bits) | ((low >> (32n - bits)) & 0xFFFFFFFFn);
        } else {
            newHigh = ((high << bits) & 0xFFFFFFFFn) | ((low >> (32n - bits)) & 0xFFFFFFFFn);
            low = (low << bits) | ((high >> (32n - bits)) & 0xFFFFFFFFn);
        }

        return BigInt((newHigh << 32n) | low);
    }

    /**
     * @returns the value obtained by rotating the two's complement binary representation of the specified bigint value
     * right by the specified number of bits.
     *
     * @param i The number with the bits to rotate.
     * @param distance Determines how far to rotate.
     */
    public static rotateRight(i: bigint, distance: number): bigint {
        if (distance < 0) {
            return this.rotateLeft(i, -distance);
        }

        const high = (i >> 32n) & 0xFFFFFFFFn;
        let low = i & 0xFFFFFFFFn;
        let bits = BigInt(distance & 0x3F); // At most 63 bits to shift.
        if (bits === 32n) {
            return (low << 32n) | high;
        }

        let newHigh;
        if (bits > 32) {
            bits -= 32n;
            newHigh = ((high << (32n - bits)) & 0xFFFFFFFFn) | ((low >> bits) & 0xFFFFFFFFn);
            low = (low << (32n - bits)) | ((high >> bits) & 0xFFFFFFFFn);
        } else {
            newHigh = ((low << (32n - bits)) & 0xFFFFFFFFn) | ((high >> bits) & 0xFFFFFFFFn);
            low = (high << (32n - bits)) | ((low >> bits) & 0xFFFFFFFFn);
        }

        return BigInt((newHigh << 32n) | low);
    }

    /**
     * @returns the signum function of the specified int value.
     *
     * @param i The value from which to get the signum.
     */
    public static signum(i: bigint): number {
        return i < 0 ? -1 : (i > 0) ? 1 : 0;
    }

    /**
     * @returns a string representation of the integer argument as an unsigned integer in base 2.
     *
     * @param i The number to convert.
     */
    public static toBinaryString(i: bigint): java.lang.String {
        return new java.lang.String(i.toString(2));
    }

    /**
     * @returns a string representation of the integer argument as an unsigned integer in base 16.
     *
     * @param i The number to convert.
     */
    public static toHexString(i: bigint): java.lang.String {
        return new java.lang.String(i.toString(16));

    }

    /**
     * @returns a string representation of the integer argument as an unsigned integer in base 8.
     *
     * @param i The number to convert.
     */
    public static toOctalString(i: bigint): java.lang.String {
        return new java.lang.String(i.toString(8));

    }

    /**
     * @returns a string representation of the first argument in the radix specified by the second argument.
     *
     * @param i The number to convert.
     * @param radix The radix of the result string.
     */
    public static toString(i: bigint, radix?: number): java.lang.String {
        return new java.lang.String(i.toString(radix));

    }

    /**
     * Returns an Integer object holding the value given or extracted from the specified String when parsed with the
     * radix given by the second argument.
     */
    public static valueOf(i: bigint): Long;
    public static valueOf(s: string | java.lang.String, radix?: number): Long;
    public static valueOf(value: bigint | string | java.lang.String, radix?: number): Long {
        if (typeof value === "bigint") {
            return new Long(value);
        }

        return this.parseLong(value, radix);
    }

    /**
     * Parses the string argument as a signed decimal long.
     * Note: under the hood this method parses the string as number, because BigInt (as used for the `long` Java type)
     * does not support radixes other than 10. This limits the possible values here.
     *
     * @param s The string to parse.
     * @param radix A radix for the string.
     *
     * @returns a new java.lang.Long with the number value from the string.
     */
    public static parseLong(s: string | java.lang.String, radix = 10): Long {
        const value = parseInt(`${s}`, radix);
        if (isNaN(value) || value > Long.MAX_VALUE || value < Long.MIN_VALUE) {
            throw new java.lang.NumberFormatException();
        }

        return new Long(parseInt(`${s}`, radix));
    }

    /** @returns the value of this Integer as a byte. */
    public byteValue(): number {
        return Number(BigInt.asIntN(8, this.value));
    }

    /**
     * Compares two Integer objects numerically.
     *
     * @param anotherLong The value to compare this instance to.
     *
     * @returns A value < 0 if this instance is smaller than the other one, > 0 if larger, and 0 if they are equal.
     */
    public compareTo(anotherLong: Long): number {
        return Number(this.value - anotherLong.value);
    }

    /** @returns the value of this Integer as a double. */
    public doubleValue(): number {
        return Number(this.value);
    }

    /**
     * Compares this object to the specified object.
     *
     * @param obj The object to compare this instance to.
     *
     * @returns True if obj is an instance of java.lang.Integer and both represent the same numerical value,
     *          otherwise false.
     */
    public equals(obj?: java.lang.Object): boolean {
        if (obj instanceof Long) {
            return this.value === obj.value;
        }

        return false;
    }

    /** @returns the value of this Integer as a float. */
    public floatValue(): number {
        return Number(this.value);
    }

    /** @returns a hash code for this Long. */
    public hashCode(): number {
        let hash = MurmurHash.initialize(11);
        hash = MurmurHash.update(hash, Number((this.value & 0xFFFFFFFF00000000n) >> 32n));
        hash = MurmurHash.update(hash, Number(this.value & 0xFFFFFFFFn));
        hash = MurmurHash.finish(hash, 2);

        return hash;
    }

    /** @returns the value of this Integer as an int. */
    public intValue(): number {
        return Number(BigInt.asIntN(32, this.value));
    }

    /** @returns the value of this Integer as a long. */
    public longValue(): bigint {
        return this.value;
    }

    /** @returns the value of this Integer as a short. */
    public shortValue(): number {
        return Number(BigInt.asIntN(16, this.value));
    }

    // Returns a String object representing this Integer's value.
    public toString(): java.lang.String {
        return S`${this.value}`;
    }

    public valueOf(): bigint {
        return this.value;
    }

    protected [Symbol.toPrimitive](hint: string): bigint | string {
        if (hint === "string") {
            return this.value.toString();
        }

        return this.value;
    }

    static {
        // Defer initializing the TYPE field, to ensure the Class class is loaded before using it.
        setTimeout(() => {
            /* @ts-expect-error */
            Long.TYPE = java.lang.Class.fromConstructor(Long);
            Object.freeze(Long);
        }, 0);
    }

}
