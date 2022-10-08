/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { HashMapEntry } from "../../lib/java/util/HashMapEntry";
import { HashMapValueEqualityComparator } from "../../lib/java/util/HashMapValueEqualityComparator";
import { MurmurHash } from "../../lib/MurmurHash";
import { IEquatable } from "../../lib/types";

class ValueEntry implements IEquatable {
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

        if (!(other instanceof ValueEntry)) {
            return false;
        }

        // Using value equality here. We could also just have compared the hash values instead.
        return this.a === other.a && this.b === other.b && this.c === other.c;
    }
}

describe("HashMapValueEqualityComparator Tests", () => {
    it("Base", () => {
        const comparator = new HashMapValueEqualityComparator<string, number>();

        const entry1 = new HashMapEntry("lorem ipsum", 42);
        const entry2 = new HashMapEntry("lorem ipsum", 41);
        const entry3 = new HashMapEntry("lorem ipsum dolor sit", 42);

        expect(comparator.hashCode(entry1)).toBe(-1134849565);
        expect(comparator.equals(entry1, entry2)).toBeFalsy();
        expect(comparator.equals(entry1, entry3)).toBeTruthy();
    });

    it("Object values", () => {
        // IEquatable objects.
        const comparator1 = new HashMapValueEqualityComparator<string, ValueEntry>();

        const entry11 = new HashMapEntry("Lorem Ipsum", new ValueEntry("Dolor Sit", true, null));
        const entry21 = new HashMapEntry("Lorem Ipsum", new ValueEntry("Dolor Sit", false, null));
        const entry31 = new HashMapEntry("Lorem Ipsum", new ValueEntry("Dolour Sit", true, null));
        const entry41 = new HashMapEntry("Lorem Ipsum", new ValueEntry("Dolor Sit", true, null));

        expect(comparator1.hashCode(entry11)).toBe(3903705957);
        expect(comparator1.equals(entry11, entry21)).toBeFalsy();
        expect(comparator1.equals(entry11, entry31)).toBeFalsy();
        expect(comparator1.equals(entry11, entry31)).toBeFalsy();
        expect(comparator1.equals(entry11, entry41)).toBeTruthy();

        // Standard TS objects.
        const comparator2 = new HashMapValueEqualityComparator<string, { a: string; b: boolean; c: null }>();

        const entry12 = new HashMapEntry("Lorem Ipsum", { a: "Dolor Sit", b: true, c: null });
        const entry22 = new HashMapEntry("Lorem Ipsum", { a: "Dolor Sit", b: false, c: null });
        const entry32 = new HashMapEntry("Lorem Ipsum", { a: "Dolour Sit", b: true, c: null });
        const entry42 = new HashMapEntry("Lorem Ipsum", { a: "Dolor Sit", b: true, c: null });

        expect(comparator2.hashCode(entry12)).toBe(593689054);

        // Cannot be true without support of IEquatable.
        expect(comparator2.equals(entry12, entry21)).toBeFalsy();
        expect(comparator2.equals(entry22, entry31)).toBeFalsy();
        expect(comparator2.equals(entry32, entry31)).toBeFalsy();
        expect(comparator2.equals(entry42, entry41)).toBeFalsy();

    });

    it("Array values", () => {
        const comparator = new HashMapValueEqualityComparator<string, number[]>();

        const entry1 = new HashMapEntry("Lorem Ipsum", [1, 2, 3]);
        const entry2 = new HashMapEntry("Lorem Ipsum", [1, 2, 4]);
        const entry3 = new HashMapEntry("Lorem Ipsum", [1, 2, 3, 4]);
        const entry4 = new HashMapEntry("Lorem Ipsum", [] as number[]);
        const entry7 = new HashMapEntry("Lorem Ipsum", [] as number[]);

        const a = [1, 3, 5, 7];
        const entry5 = new HashMapEntry("Lorem Ipsum", a);
        const entry6 = new HashMapEntry("Lorem Ipsum", a);

        expect(comparator.hashCode(entry1)).toBe(593689054);
        expect(comparator.equals(entry1, entry2)).toBeFalsy();
        expect(comparator.equals(entry1, entry3)).toBeFalsy();
        expect(comparator.equals(entry1, entry3)).toBeFalsy();
        expect(comparator.equals(entry1, entry4)).toBeFalsy();
        expect(comparator.equals(entry5, entry6)).toBeTruthy();
        expect(comparator.equals(entry4, entry7)).toBeTruthy();
    });
});
