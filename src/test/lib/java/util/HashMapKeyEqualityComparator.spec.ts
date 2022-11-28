/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { HashMapEntry } from "../../../../lib/java/util/HashMapEntry";
import { HashMapKeyEqualityComparator } from "../../../../lib/java/util/HashMapKeyEqualityComparator";
import { MurmurHash } from "../../../../lib/MurmurHash";
import { IEquatable } from "../../../../lib/types";

class KeyEntry implements IEquatable {
    public a: string;
    public b: boolean;
    public c: null;

    public constructor(aa: string, bb: boolean, cc: null) {
        this.a = aa;
        this.b = bb;
        this.c = cc;
    }

    public hashCode(): number {
        return MurmurHash.valueHash(this.a) + MurmurHash.valueHash(this.b) + MurmurHash.valueHash(this.c);
    }

    public equals(other: unknown): boolean {
        if (other === this) {
            return true;
        }

        if (!(other instanceof KeyEntry)) {
            return false;
        }

        return this.hashCode() === other.hashCode();
    }
}

describe("HashMapKeyEqualityComparator Tests", () => {
    it("Base", () => {
        const comparator = new HashMapKeyEqualityComparator<string, number>();

        const entry1 = new HashMapEntry("lorem ipsum", 42);
        const entry2 = new HashMapEntry("lorem ipsum", 41);
        const entry3 = new HashMapEntry("lorem ipsum dolor sit", 42);

        expect(comparator.hashCode(entry1)).toBe(1857850741);
        expect(comparator.equals(entry1, entry2)).toBeTruthy();
        expect(comparator.equals(entry1, entry3)).toBeFalsy();
    });

    it("Object values", () => {
        // IEquatable objects.
        const comparator1 = new HashMapKeyEqualityComparator<KeyEntry, string>();

        const entry11 = new HashMapEntry(new KeyEntry("Dolor Sit", true, null), "Lorem Ipsum");
        const entry21 = new HashMapEntry(new KeyEntry("Dolor Sit", false, null), "Lorem Ipsum");
        const entry31 = new HashMapEntry(new KeyEntry("Dolour Sit", true, null), "Lorem Ipsum Dolor");
        const entry41 = new HashMapEntry(new KeyEntry("Dolor Sit", true, null), "Lorem Ipsum dolor");

        expect(comparator1.hashCode(entry11)).toBe(218103542);
        expect(comparator1.equals(entry11, entry21)).toBeFalsy();
        expect(comparator1.equals(entry11, entry31)).toBeFalsy();
        expect(comparator1.equals(entry11, entry31)).toBeFalsy();
        expect(comparator1.equals(entry11, entry41)).toBeTruthy();

        // Standard TS objects.
        const comparator2 = new HashMapKeyEqualityComparator<{ a: string; b: boolean; c: null; }, string>();

        const entry12 = new HashMapEntry({ a: "Dolor Sit", b: true, c: null }, "Lorem Ipsum");
        const entry22 = new HashMapEntry({ a: "Dolor Sit", b: false, c: null }, "Lorem Ipsum");
        const entry32 = new HashMapEntry({ a: "Dolour Sit", b: true, c: null }, "Lorem Ipsum");
        const entry42 = new HashMapEntry({ a: "Dolor Sit", b: true, c: null }, "Lorem Ipsum");

        expect(comparator2.hashCode(entry12)).toBe(-2059725032);

        // Cannot be true without support of IEquatable.
        expect(comparator2.equals(entry12, entry21)).toBeFalsy();
        expect(comparator2.equals(entry22, entry31)).toBeFalsy();
        expect(comparator2.equals(entry32, entry31)).toBeFalsy();
        expect(comparator2.equals(entry42, entry41)).toBeFalsy();

    });

    it("Array values", () => {
        const comparator = new HashMapKeyEqualityComparator<number[], string>();

        const entry1 = new HashMapEntry([1, 2, 3], "Lorem Ipsum");
        const entry2 = new HashMapEntry([1, 2, 4], "Lorem Ipsum");
        const entry3 = new HashMapEntry([1, 2, 3, 4], "Lorem Ipsum");
        const entry4 = new HashMapEntry([] as number[], "Lorem Ipsum");
        const entry7 = new HashMapEntry([] as number[], "Lorem Ipsum");

        const a = [1, 3, 5, 7];
        const entry5 = new HashMapEntry(a, "Lorem Ipsum");
        const entry6 = new HashMapEntry(a, "Lorem Ipsum");

        expect(comparator.hashCode(entry1)).toBe(886849534);
        expect(comparator.equals(entry1, entry2)).toBeFalsy();
        expect(comparator.equals(entry1, entry3)).toBeFalsy();
        expect(comparator.equals(entry1, entry3)).toBeFalsy();
        expect(comparator.equals(entry1, entry4)).toBeFalsy();
        expect(comparator.equals(entry5, entry6)).toBeTruthy();
        expect(comparator.equals(entry4, entry7)).toBeTruthy();
    });
});
