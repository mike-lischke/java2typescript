/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../../../../lib/java/java";
import { JavaObject } from "../../../../lib/java/lang/Object";

// Object which does not conform to IEquatable.
interface ITest1 {
    a: number;
    b: string;
}

class Test extends JavaObject {
    public constructor(public a: number, public b: string) {
        super();
    }

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
    it("Set Creation", () => {
        const set1 = new java.util.HashSet<string>();
        expect(set1.size()).toBe(0);

        const set2 = new java.util.HashSet<number>();
        for (let i = 0; i < 10; ++i) {
            set2.add(i);
        }

        const set3 = set2.clone(); // Uses set4 as constructor parameter for set5.
        expect(set3.size()).toBe(10);

        const set4 = set1.clone();
        expect(set4.size()).toBe(0);
    });

    it("Set Manipulation", () => {
        const set1 = new java.util.HashSet<ITest1>();
        set1.add({ a: 1, b: "1" });
        set1.add({ a: 1, b: "1" });
        set1.add({ a: 2, b: "2" });

        // All 3 objects are added as they are considered different, even though 2 have the same members,
        // as they do not conform to the ValueObject interface.
        expect(set1.size()).toBe(3);

        const set2 = new java.util.HashSet<Test>();
        set2.add(new Test(1, "1"));
        set2.add(new Test(1, "1"));
        set2.add(new Test(2, "2"));

        // The Test class implements ValueObject so only 2 values are added.
        expect(set2.size()).toBe(2);

        // Object equality in action.
        expect(set2.contains(new Test(1, "2"))).toBe(false);
        expect(set2.contains(new Test(1, "1"))).toBe(true);
        expect(set2.contains(new Test(2, ""))).toBe(false);

        set2.remove(new Test(1, "4"));
        expect(set2.size()).toBe(2);
        set2.remove(new Test(1, "1"));
        expect(set2.size()).toBe(1);
        set2.remove(new Test(14, "4"));
        expect(set2.size()).toBe(1);
        expect(set2.contains(new Test(1, "1"))).toBe(false);

        const set3 = new java.util.HashSet<Test>();
        set3.add(new Test(1, "1"));
        set3.add(new Test(2, "2"));
        set3.add(new Test(3, "3"));

        set3.retainAll(set2);
        expect(set2.size()).toBe(1);
        expect(set2.contains(new Test(2, "2"))).toBe(true);

        const set4 = new java.util.HashSet<Test | null>();
        set4.add(new Test(1, "1"));
        set4.add(new Test(2, "2"));
        set4.add(new Test(3, "3"));

        set4.removeAll(set2);
        expect(set4.size()).toBe(2);
        expect(set4.contains(new Test(2, "2"))).toBe(false);

        set4.clear();
        expect(set4.size()).toBe(0);
        expect(set4.isEmpty()).toBeTruthy();
        expect(set3.isEmpty()).toBeFalsy();
    });

    it("Set Equality", () => {
        const set1 = new java.util.HashSet<ITest1>();
        set1.add({ a: 13, b: "13" });

        expect(set1.equals(set1)).toBe(true);
        expect(set1.equals(13)).toBeFalsy();

        const set2 = new java.util.HashSet<ITest1>();
        set2.add({ a: 1, b: "1" });
        set2.add({ a: 7, b: "2" });
        set2.add({ a: 13, b: "3" });

        expect(set1.equals(set2)).toBe(false);
        expect(set1.hashCode()).not.toBe(set2.hashCode());

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

        const list = new java.util.ArrayList<Test>();
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

        expect(`${set.toString()}`).toBe("{{\"a\":1,\"b\":\"1\"}, {\"a\":7,\"b\":\"7\"}, {\"a\":13,\"b\":\"13\"}}");
        expect(`${new java.util.HashSet().toString()}`).toBe("{}");
    });
});
