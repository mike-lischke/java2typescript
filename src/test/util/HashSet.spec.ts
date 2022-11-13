/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../../lib/java/java";
import { ArrayList, HashSet } from "../../lib/java/util";
import { IEquatable } from "../../lib/types";

// Object which does not conform to IEquatable.
interface ITest1 {
    a: number;
    b: string;
}

class Test implements IEquatable {
    public constructor(public a: number, public b: string) { }

    public hashCode(): number {
        return this.a;
    }

    public equals(o: unknown): boolean {
        if (this === o) {
            return true;
        }

        if (!(o instanceof Test)) {
            return false;
        }

        return this.a === o.a && this.b === o.b;
    }
}

describe("HashSet Tests", () => {
    const getBucketSize = (set: java.util.HashSet<unknown>): number => {
        // @ts-expect-error because of accessing an private field.
        return set.buckets.length;
    };

    it("Set Creation", () => {
        const set1 = new java.util.HashSet<string>();

        expect(getBucketSize(set1)).toBe(16);
        expect(set1.size()).toBe(0);

        const set2 = new java.util.HashSet<number>(22);

        expect(getBucketSize(set2)).toBe(32);
        expect(set2.size()).toBe(0);

        const set3 = new java.util.HashSet<number>(1);
        expect(getBucketSize(set3)).toBe(1);
        expect(set3.size()).toBe(0);

        // This addition will expand the set 4 times (with default load factor).
        for (let i = 0; i < 10; ++i) {
            set3.add(i);
        }
        expect(getBucketSize(set3)).toBe(16);

        const set4 = new java.util.HashSet<number>(1, 0.25);
        expect(getBucketSize(set4)).toBe(1);
        expect(set4.size()).toBe(0);

        // This addition will expand the set 6 times (with load factor 0.25).
        for (let i = 0; i < 10; ++i) {
            set4.add(i);
        }
        expect(getBucketSize(set4)).toBe(64);

        const set5 = set4.clone(); // Uses set4 as constructor parameter for set5.
        expect(set5.size()).toBe(10);
    });

    it("Set Manipulation", () => {
        const set1 = new java.util.HashSet<ITest1>();
        set1.add({ a: 1, b: "1" });
        set1.add({ a: 1, b: "1" });
        set1.add({ a: 2, b: "2" });

        // Only the first entry is added as we used an object which does not support IEquatable, so the same
        // hash code is generated for all 3 objects.
        expect(set1.size()).toBe(1);

        const set2 = new java.util.HashSet<Test | null>();
        set2.add(new Test(1, "1"));
        set2.add(new Test(1, "1"));
        set2.add(new Test(2, "2"));

        // The Test class supports IEquatable so 2 values are added.
        expect(set2.size()).toBe(2);

        let entry1 = set2.find(new Test(1, "2"));
        expect(entry1).toBeNull();
        entry1 = set2.find(new Test(1, "1"));
        expect(entry1).not.toBeNull();
        expect(entry1!.a).toBe(1);
        expect(entry1!.b).toBe("1");

        expect(set2.find(null)).toBeNull();
        expect(set2.find(new Test(3, "2"))).toBeNull();

        set2.remove(new Test(1, "4"));
        expect(set2.size()).toBe(2);
        set2.remove(new Test(1, "1"));
        expect(set2.size()).toBe(1);
        set2.remove(new Test(14, "4"));
        expect(set2.size()).toBe(1);
        expect(set2.find(new Test(2, ""))).toBeNull();

        const set3 = new java.util.HashSet<Test>();
        set3.add(new Test(1, "1"));
        set3.add(new Test(2, "2"));
        set3.add(new Test(3, "3"));

        set3.retainAll(set2);
        expect(set2.size()).toBe(1);
        expect(set2.find(new Test(2, "2"))).not.toBeNull();

        const set4 = new java.util.HashSet<Test | null>();
        set4.add(new Test(1, "1"));
        set4.add(new Test(2, "2"));
        set4.add(new Test(3, "3"));

        set4.removeAll(set2);
        expect(set4.size()).toBe(2);
        expect(set4.find(new Test(2, "2"))).toBeNull();

        set4.clear();
        expect(set4.size()).toBe(0);
        expect(set4.isEmpty()).toBeTruthy();
        expect(set3.isEmpty()).toBeFalsy();
    });

    it("Set Equality", () => {
        const set1 = new java.util.HashSet<ITest1>();
        set1.add({ a: 13, b: "13" });

        expect(set1.equals(set1)).toBeTruthy();
        expect(set1.equals(13)).toBeFalsy();

        const set2 = new java.util.HashSet<ITest1>();
        set2.add({ a: 1, b: "1" });
        set2.add({ a: 7, b: "2" });
        set2.add({ a: 13, b: "3" });

        // Also here: only the default hash can be computed for all entries so they are all equal and hence
        // the sets are equal.
        expect(set1.equals(set2)).toBeTruthy();
        expect(set1.hashCode()).toBe(set2.hashCode());

        const set3 = new java.util.HashSet<Test>();
        set3.add(new Test(1, "1"));
        set3.add(new Test(7, "2"));
        set3.add(new Test(13, "3"));

        const set4 = new java.util.HashSet<Test>();
        set4.add(new Test(1, "1"));
        set4.add(new Test(7, "7"));
        set4.add(new Test(13, "3"));

        expect(set3.equals(set4)).toBe(false);

        set3.remove(new Test(7, "2"));
        set3.add(new Test(7, "7"));
        expect(set3.equals(set4)).toBe(true);

        set3.add(new Test(17, "17"));
        expect(set3.equals(set4)).toBeFalsy();

        set4.add(new Test(19, "19"));
        expect(set3.equals(set4)).toBeFalsy();

        const list = new ArrayList<Test>();
        list.add(new Test(1, "1"));
        list.add(new Test(7, "7"));
        list.add(new Test(13, "3"));
        expect(set3.containsAll(list)).toBeTruthy();
    });

    it("Set Conversion", () => {
        const set = new java.util.HashSet<Test>();
        set.add(new Test(1, "1"));
        set.add(new Test(7, "7"));
        set.add(new Test(13, "13"));

        const a1 = set.toArray();
        expect(a1.length).toBe(3);
        expect(a1[1].hashCode()).toBe(new Test(7, "7").hashCode());

        // This test is rather useless in Typescript, but allows to specify a type (in the array parameter) that
        // should be returned from the toArray method. A simple cast would do the trick too.
        const a2 = set.toArray([new Test(33, "33"), new Test(44, "44")]);
        expect(a2.length).toBe(3);
        expect(a1[1].hashCode()).toBe(new Test(7, "7").hashCode());

        expect(set.toString()).toBe("{{\"a\":1,\"b\":\"1\"}, {\"a\":7,\"b\":\"7\"}, {\"a\":13,\"b\":\"13\"}}");
        expect(new HashSet().toString()).toBe("{}");
    });
});
