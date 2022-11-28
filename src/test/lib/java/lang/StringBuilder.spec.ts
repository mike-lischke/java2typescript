/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../../../../lib/java/java";

export { };

describe("Tests", () => {
    it("Construction", () => {
        expect(new java.lang.StringBuilder().length() === 0);
        expect(() => { new java.lang.StringBuilder(-10); }).toThrowError(java.lang.NegativeArraySizeException);
        expect(new java.lang.StringBuilder(100).capacity() === 100);

        const s = new java.lang.String("Lorem Ipsum");
        const b = new java.lang.StringBuilder(s);
        expect(b.capacity()).toBe(s.length());
        expect(`${b.toString()}`).toEqual("Lorem Ipsum");
    });

    it("Appending content", () => {
        const b = new java.lang.StringBuilder();
        b.append("Lorem Ipsum Dolor Sit Amet"); // TS string
        expect(`${b.toString()}`).toBe("Lorem Ipsum Dolor Sit Amet");

        const s = new java.lang.String("Another string");
        const b2 = new java.lang.StringBuilder("String Builder");
        const i = new java.lang.Integer(456);

        expect(b.append("-")).toBe(b);
        b.append(s);    // Java string
        b.append("-");
        b.append(true); // boolean
        b.append("-");
        b.append(123);  // TS number

        b.append("-");
        b.append(b2);   // Other StringBuilder
        b.append("-");
        b.append(b2.array()); // Uint16Array
        b.append("-");
        b.append(i);   // JavaObject

        expect(`${b.toString()}`).toBe("Lorem Ipsum Dolor Sit Amet-Another string-true-123-String Builder-String " +
            "Builder-456");

        b.clear();
        b.append("TRIPLE INTEGRAL = ");
        b.appendCodePoint(0x222D); // BMP code point.
        expect(`${b.toString()}`).toBe("TRIPLE INTEGRAL = ∭");

        b.appendCodePoint(0x1F600); // Extended code point (internally held as surrogate pair).
        expect(`${b.toString()}`).toBe("TRIPLE INTEGRAL = ∭😀");
    });

    it("Inserting content", () => {
        const b = new java.lang.StringBuilder();
        b.append("12345");

        const s = new java.lang.String("Another string");
        const b2 = new java.lang.StringBuilder("String Builder");
        b2.ensureCapacity(1000);

        const i = new java.lang.Integer(456);

        expect(b.insert(4, "-")).toBe(b);
        expect(`${b.toString()}`).toBe("1234-5");
        b.insert(4, s);    // Java string
        expect(`${b.toString()}`).toBe("1234Another string-5");

        b.insert(3, "-");
        expect(`${b.toString()}`).toBe("123-4Another string-5");
        b.insert(3, true); // boolean
        expect(`${b.toString()}`).toBe("123true-4Another string-5");

        b.insert(2, "\n");
        b.insert(2, 123);  // TS number
        b.insert(2, "");
        expect(`${b.toString()}`).toBe("12123\n3true-4Another string-5");

        b.insert(1, "-");
        b.insert(1, b2);   // Other StringBuilder
        expect(`${b.toString()}`).toBe("1String Builder-2123\n3true-4Another string-5");

        b.insert(0, "-");
        b.insert(0, b2.array()); // Uint16Array
        expect(`${b.toString()}`).toBe("String Builder-1String Builder-2123\n3true-4Another string-5");

        b.ensureCapacity(10000);
        b.insert(b.length(), "-");
        b.insert(b.length(), i);   // JavaObject

        expect(`${b.toString()}`).toBe("String Builder-1String Builder-2123\n3true-4Another string-5-456");
    });
});
