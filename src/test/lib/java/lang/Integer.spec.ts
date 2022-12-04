/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../../../../lib/java/java";

describe("java.lang.Integer Tests", () => {
    it("Base", () => {
        const i = new java.lang.Integer(0);
        expect(i.equals(new java.lang.Integer(0))).toBe(true);
        expect(i.equals(new java.lang.Integer("0"))).toBe(true);
        expect(i.equals(new java.lang.Integer(1))).toBe(false);

        expect(java.lang.Integer.MAX_VALUE).toBe(2147483647);
        expect(java.lang.Integer.MIN_VALUE).toBe(-2147483648);

        expect(() => { new java.lang.Integer(1.2); }).toThrowError();
    });

    it("bitCount", () => {
        expect(java.lang.Integer.bitCount(0)).toBe(0);
        expect(java.lang.Integer.bitCount(-1)).toBe(32);
        expect(java.lang.Integer.bitCount(6)).toBe(2);
        expect(java.lang.Integer.bitCount(1025)).toBe(2);

        expect(() => { java.lang.Integer.bitCount(1.2); }).toThrowError();
    });

    it("compare", () => {
        expect(java.lang.Integer.compare(1, 1)).toBe(0);
        expect(java.lang.Integer.compare(1, 2)).toBeLessThan(0);
        expect(java.lang.Integer.compare(1e10, 2)).toBeGreaterThan(0);
        expect(() => { java.lang.Integer.compare(1.2, 1); }).toThrowError();
        expect(() => { java.lang.Integer.compare(1, 1.10); }).toThrowError();
        expect(() => { java.lang.Integer.compare(1.2, 1.5); }).toThrowError();
    });

    it("decode", () => {
        expect(() => { java.lang.Integer.decode(""); }).toThrowError();
        expect(() => { java.lang.Integer.decode(" .  \n"); }).toThrowError();

        expect(() => { java.lang.Integer.decode("abc"); }).toThrowError();

        expect(java.lang.Integer.decode("0").intValue()).toBe(0);
        expect(java.lang.Integer.decode("00000").intValue()).toBe(0);
        expect(java.lang.Integer.decode("123").intValue()).toBe(123);
        expect(java.lang.Integer.decode("0123").intValue()).toBe(83);
        expect(java.lang.Integer.decode("0x123").intValue()).toBe(291);

        expect(java.lang.Integer.decode("-0").intValue()).toBe(-0);
        expect(java.lang.Integer.decode("-00000").intValue()).toBe(-0);
        expect(java.lang.Integer.decode("-123").intValue()).toBe(-123);
        expect(java.lang.Integer.decode("-0123").intValue()).toBe(-83);
        expect(java.lang.Integer.decode("-0x123").intValue()).toBe(-291);
    });

    it("getInteger", (done) => {
        setImmediate(() => {
            // Need to delay execution one run loop, as system properties loading is delayed as well.
            expect(java.lang.Integer.getInteger("")).toBeNull();
            expect(java.lang.Integer.getInteger("Lorem Ipsum")).toBeNull();
            expect(java.lang.Integer.getInteger("Lorem Ipsum", 11)?.intValue()).toBe(11);
            expect(java.lang.Integer.getInteger("java.version", 17)?.intValue()).toBe(11);
            expect(java.lang.Integer.getInteger("java. version", 17)?.intValue()).toBe(17);

            done();
        });
    });

    it("reverse", () => {
        expect(() => { java.lang.Integer.reverse(123.456); }).toThrowError();

        expect(java.lang.Integer.reverse(0)).toBe(0);
        expect(java.lang.Integer.reverse(86)).toBe(1778384896);
        expect(java.lang.Integer.reverse(0x1)).toBe(-2147483648);
        expect(java.lang.Integer.reverse(0x70000000)).toBe(14);
        expect(java.lang.Integer.reverse(-2)).toBe(2147483647);
        expect(java.lang.Integer.reverse(0x34343434)).toBe(0x2C2C2C2C);
    });

    it("numberOfLeadingZeros", () => {
        expect(() => { java.lang.Integer.numberOfLeadingZeros(123.456); }).toThrowError();

        expect(java.lang.Integer.numberOfLeadingZeros(0)).toBe(32);
        expect(java.lang.Integer.numberOfLeadingZeros(-10)).toBe(0);
        expect(java.lang.Integer.numberOfLeadingZeros(0x7FFFFFFF)).toBe(1);
    });

    it("numberOfTrailingZeros", () => {
        expect(() => { java.lang.Integer.numberOfTrailingZeros(123.456); }).toThrowError();

        expect(java.lang.Integer.numberOfTrailingZeros(0)).toBe(32);
        expect(java.lang.Integer.numberOfTrailingZeros(-10)).toBe(1);
        expect(java.lang.Integer.numberOfTrailingZeros(0x7FFFFFF0)).toBe(4);
        expect(java.lang.Integer.numberOfTrailingZeros(0x8888)).toBe(3);
        expect(java.lang.Integer.numberOfTrailingZeros(0x56)).toBe(1);

        expect(java.lang.Integer.numberOfTrailingZeros(0x4)).toBe(2);
        expect(java.lang.Integer.numberOfTrailingZeros(0x40)).toBe(6);
        expect(java.lang.Integer.numberOfTrailingZeros(0x400)).toBe(10);
        expect(java.lang.Integer.numberOfTrailingZeros(0x4000)).toBe(14);
        expect(java.lang.Integer.numberOfTrailingZeros(0x40000)).toBe(18);
    });

    it("highestOneBit", () => {
        expect(() => { java.lang.Integer.highestOneBit(123.456); }).toThrowError();

        expect(java.lang.Integer.highestOneBit(0)).toBe(0);
        expect(java.lang.Integer.highestOneBit(86)).toBe(64);
        expect(java.lang.Integer.highestOneBit(-1)).toBe(-2147483648);
        expect(java.lang.Integer.highestOneBit(16532164)).toBe(8388608);
    });

    it("lowestOneBit", () => {
        expect(() => { java.lang.Integer.lowestOneBit(123.456); }).toThrowError();

        expect(java.lang.Integer.lowestOneBit(0)).toBe(0);
        expect(java.lang.Integer.lowestOneBit(86)).toBe(2);
        expect(java.lang.Integer.lowestOneBit(-1)).toBe(1);
        expect(java.lang.Integer.lowestOneBit(16532164)).toBe(4);
    });

    it("reverseBytes", () => {
        expect(() => { java.lang.Integer.reverseBytes(123.456); }).toThrowError();

        expect(java.lang.Integer.reverseBytes(0)).toBe(0);
        expect(java.lang.Integer.reverseBytes(86)).toBe(1442840576);
        expect(java.lang.Integer.reverseBytes(0x1)).toBe(16777216);
        expect(java.lang.Integer.reverseBytes(0x70000000)).toBe(112);
        expect(java.lang.Integer.reverseBytes(-2)).toBe(-16777217);
        expect(java.lang.Integer.reverseBytes(0x34343434)).toBe(0x34343434);
    });

    it("rotateLeft", () => {
        expect(() => { java.lang.Integer.rotateLeft(123.456, 3); }).toThrowError();

        expect(java.lang.Integer.rotateLeft(0, 0)).toBe(0);
        expect(java.lang.Integer.rotateLeft(86, 0)).toBe(86);
        expect(java.lang.Integer.rotateLeft(86, -2)).toBe(-2147483627);
        expect(java.lang.Integer.rotateLeft(86, 10)).toBe(88064);
        expect(java.lang.Integer.rotateLeft(86, 30)).toBe(-2147483627);
        expect(java.lang.Integer.rotateLeft(86, 100)).toBe(1376);
    });

    it("rotateRight", () => {
        expect(() => { java.lang.Integer.rotateRight(123.456, 3); }).toThrowError();

        expect(java.lang.Integer.rotateRight(0, 0)).toBe(0);
        expect(java.lang.Integer.rotateRight(86, 0)).toBe(86);
        expect(java.lang.Integer.rotateRight(86, -2)).toBe(344);
        expect(java.lang.Integer.rotateRight(86, 10)).toBe(360710144);
        expect(java.lang.Integer.rotateRight(86, 30)).toBe(344);
        expect(java.lang.Integer.rotateRight(86, 100)).toBe(1610612741);
    });

    it("signum", () => {
        expect(java.lang.Integer.signum(NaN)).toBe(0);
        expect(java.lang.Integer.signum(0)).toBe(0);
        expect(java.lang.Integer.signum(-123)).toBe(-1);
        expect(java.lang.Integer.signum(86)).toBe(1);
        expect(java.lang.Integer.signum(Number.MIN_SAFE_INTEGER)).toBe(-1);
        expect(java.lang.Integer.signum(Number.MAX_SAFE_INTEGER)).toBe(1);
    });

    it("To string", () => {
        expect(() => { java.lang.Integer.toString(123.456, 3); }).toThrowError();
        expect(() => { java.lang.Integer.toString(NaN, 3); }).toThrowError();

        expect(java.lang.Integer.toString(1234)).toBe("1234");
        expect(java.lang.Integer.toString(77)).toBe("77");
        expect(java.lang.Integer.toString(77, 2)).toBe("1001101");
        expect(java.lang.Integer.toString(77, 3)).toBe("2212");
        expect(java.lang.Integer.toString(77, 8)).toBe("115");
        expect(java.lang.Integer.toString(77, 16)).toBe("4d");

        expect(() => { java.lang.Integer.toBinaryString(123.456); }).toThrowError();
        expect(java.lang.Integer.toBinaryString(77)).toBe("1001101");

        expect(() => { java.lang.Integer.toOctalString(123.456); }).toThrowError();
        expect(java.lang.Integer.toOctalString(77)).toBe("115");

        expect(() => { java.lang.Integer.toHexString(123.456); }).toThrowError();
        expect(java.lang.Integer.toHexString(77)).toBe("4d");

        const i = new java.lang.Integer(77);
        expect(`${i.toString()}`).toBe("77");
    });

    it("Parsing numbers", () => {
        let i = java.lang.Integer.valueOf(88);
        expect(i).toBeInstanceOf(java.lang.Integer);
        expect(i.intValue()).toBe(88);

        i = java.lang.Integer.valueOf("88");
        expect(i).toBeInstanceOf(java.lang.Integer);
        expect(i.intValue()).toBe(88);

        i = java.lang.Integer.valueOf("88", 10);
        expect(i).toBeInstanceOf(java.lang.Integer);
        expect(i.intValue()).toBe(88);

        expect(() => { java.lang.Integer.valueOf("88", 2); }).toThrowError();
        i = java.lang.Integer.valueOf("12332", 5);
        expect(i).toBeInstanceOf(java.lang.Integer);
        expect(i.intValue()).toBe(967);

        expect(java.lang.Integer.parseInt("88")).toBe(88);
        expect(java.lang.Integer.parseInt("0", 10)).toBe(0);
        expect(java.lang.Integer.parseInt("473", 10)).toBe(473);
        expect(java.lang.Integer.parseInt("+42", 10)).toBe(42);
        expect(java.lang.Integer.parseInt("-0", 10)).toBe(-0);
        expect(java.lang.Integer.parseInt("-FF", 16)).toBe(-255);
        expect(java.lang.Integer.parseInt("1100110", 2)).toBe(102);
        expect(java.lang.Integer.parseInt("2147483647", 10)).toBe(2147483647);
        expect(java.lang.Integer.parseInt("-2147483648", 10)).toBe(-2147483648);
        expect(() => { java.lang.Integer.parseInt("2147483648", 10); }).toThrowError(java.lang.NumberFormatException);
        expect(() => { java.lang.Integer.parseInt("99", 8); }).toThrowError(java.lang.NumberFormatException);
        expect(() => { java.lang.Integer.parseInt("Kona", 10); }).toThrowError(java.lang.NumberFormatException);
        expect(java.lang.Integer.parseInt("Kona", 27)).toBe(411787);
    });

    it("Miscellaneous", () => {
        expect(new java.lang.Integer(88).byteValue()).toBe(88);
        expect(new java.lang.Integer(8888).byteValue()).toBe(-72);
        expect(new java.lang.Integer(-88).byteValue()).toBe(-88);
        expect(new java.lang.Integer(-8888).byteValue()).toBe(72);

        expect(new java.lang.Integer(88).shortValue()).toBe(88);
        expect(new java.lang.Integer(8888).shortValue()).toBe(8888);
        expect(new java.lang.Integer(-88).shortValue()).toBe(-88);
        expect(new java.lang.Integer(-8888).shortValue()).toBe(-8888);

        expect(new java.lang.Integer(88).intValue()).toBe(88);
        expect(new java.lang.Integer(8888).intValue()).toBe(8888);
        expect(new java.lang.Integer(-88).intValue()).toBe(-88);
        expect(new java.lang.Integer(-8888).intValue()).toBe(-8888);

        expect(new java.lang.Integer(88).longValue()).toBe(88);
        expect(new java.lang.Integer(8888).longValue()).toBe(8888);
        expect(new java.lang.Integer(-88).longValue()).toBe(-88);
        expect(new java.lang.Integer(-8888).longValue()).toBe(-8888);

        expect(new java.lang.Integer(88).floatValue()).toBe(88);
        expect(new java.lang.Integer(8888).floatValue()).toBe(8888);
        expect(new java.lang.Integer(-88).floatValue()).toBe(-88);
        expect(new java.lang.Integer(-8888).floatValue()).toBe(-8888);

        expect(new java.lang.Integer(88).doubleValue()).toBe(88);
        expect(new java.lang.Integer(8888).doubleValue()).toBe(8888);
        expect(new java.lang.Integer(-88).doubleValue()).toBe(-88);
        expect(new java.lang.Integer(-8888).doubleValue()).toBe(-8888);

        const i1 = new java.lang.Integer(123);
        const i2 = new java.lang.Integer(123);
        const i3 = new java.lang.Integer(-123);

        expect(i1.compareTo(i2)).toBe(0);
        expect(i1.compareTo(i3)).toBeGreaterThan(0);
        expect(i1.compareTo(i1)).toBe(0);
        expect(i3.compareTo(i2)).toBeLessThan(0);
        expect(i2.compareTo(i3)).toBeGreaterThan(0);

        const c = i1.getClass();
        expect(c.isInstance(i2)).toBe(true);
        expect(c.getName()).toBe("Integer");

        // Unboxing/explicit coercion.
        expect(3 - +i1).toBe(-120);
        expect("3" + String(i1)).toBe("3123");
    });
});
