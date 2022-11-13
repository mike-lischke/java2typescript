/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../../lib/java/java";
import { HashMapEntry } from "../../lib/java/util/HashMapEntry";

// A test class which is not a HashMap but implements the Map interface.
class Test<K, V> implements java.util.Map<K, V> {
    public clear(): void { /**/ }
    public containsKey(_key: K): boolean { return true; }
    public containsValue(_value: V): boolean { return true; }
    public entrySet(): java.util.Set<java.util.Map.Entry<K | null, V | null>> {
        const set = new java.util.HashSet<HashMapEntry<K | null, V | null>>();
        set.add(new HashMapEntry(null, null));

        return set;
    }
    public equals(_o: unknown): boolean { return false; }
    public get(_key: K): V | null { return null; }
    public hashCode(): number { return 0; }
    public isEmpty(): boolean { return false; }
    public keySet(): java.util.Set<K> { return new java.util.HashSet<K>(); }
    public put(_key: K, value: V): V { return value; }
    public putAll(_m: java.util.Map<K, V>): void { return; }
    public remove(_key: K): V | null { return null; }
    public size(): number { return 0; }
    public values(): java.util.Collection<V> { return new java.util.HashSet<V>(); }
}

describe("HashMap Tests", () => {
    it("Basic Map Operations", () => {
        const m = new java.util.HashMap<string, number>();
        expect(m.size()).toBe(0);
        expect(m.isEmpty()).toBeTruthy();
        expect(m.containsKey("")).toBeFalsy();
        expect(m.containsKey("mike")).toBeFalsy();

        expect(m.put("mike", 42)).toBeNull();
        expect(m.get("mike")).toBe(42);

        expect(m.isEmpty()).toBeFalsy();

        expect(m.containsKey("mike")).toBeTruthy();
        expect(m.put("mike", 43)).toBe(42);
        expect(m.get("mike")).toBe(43);

        expect(m.put("mike2", 41)).toBeNull();
        expect(m.size()).toBe(2);

        expect(m.remove("mike3")).toBeNull();
        expect(m.size()).toBe(2);
        expect(m.remove("mike")).toBe(43);
        expect(m.size()).toBe(1);

        m.clear();
        expect(m.size()).toBe(0);
        expect(m.isEmpty()).toBeTruthy();
    });

    it("Hash Code and Equality", () => {
        const m = new java.util.HashMap<string | null, string | null>(200);
        expect(m.size()).toBe(0);
        m.put("", null);
        expect(m.get("")).toBeNull();
        expect(m.get(null)).toBeNull();

        m.put("▤▦▧", "squares");
        m.put("♩♪♫♬", "music notes");
        m.put("abcdefghijklmnopqrstuvwxyz", "latin alphabet");
        m.put("ᬠᬣᬦᬪᬫᬬᬭ", "balinese");
        m.put("1234567890", "numbers");
        expect(m.hashCode()).toBe(-4985564304);

        m.put("Accentuate the positive", "");
        expect(m.hashCode()).toBe(-5970872073);

        const m2 = new java.util.HashMap(m);
        expect(m2.hashCode()).toBe(-5970872073);
        expect(m.equals(m2)).toBeTruthy();

        const m3 = m2.clone();
        expect(m.equals(m3)).toBeTruthy();

        m2.put("Some", "more");
        expect(m.equals(m2)).toBeFalsy();

        expect(m.equals(Math)).toBeFalsy();
    });

    it("Load Test", () => {
        const m = new java.util.HashMap<number, number>(20000);
        for (let i = 0; i < 100000; ++i) {
            m.put(i, 2 * i);
        }

        expect(m.size()).toBe(100000);
        expect(m.hashCode()).toBe(-575131339318);

        const test = new Test<number, number>();
        expect(m.equals(test)).toBeFalsy();
        m.putAll(test);
    });

    it("Iteration and Search", () => {
        const m = new java.util.HashMap<number, number>();
        m.put(10000, 1);
        m.put(10, 1);
        m.put(100000, 1);

        const keys: number[] = [];
        for (const e of m) {
            keys.push(e.getKey()!);
        }

        // Insertion order is not maintained!
        expect(keys).not.toEqual([10000, 10, 1000000]);

        // Instead entries are inserted (and enumerated) based on their bucket position (which in turn depends on the
        // key's hash code).
        expect(keys).toEqual([10000, 100000, 10]);

        expect(m.containsValue(1)).toBeTruthy();
        expect(m.containsValue(10)).toBeFalsy();
    });

    it("Sub Lists", () => {
        const m = new java.util.HashMap<string, unknown>();
        m.put("lorem", 1);
        m.put("ipsum", null);
        m.put("dolor", true);
        m.put("sit", 1);
        m.put("amet", null);

        const entries = m.entrySet();
        expect(entries.size()).toBe(5);

        const keys = m.keySet();
        expect(keys.size()).toBe(5);
        expect(keys.contains("ipsum")).toBeTruthy();
        expect(keys.contains("mike")).toBeFalsy();

        const values = m.values();
        expect(values.size()).toBe(5);
        expect(values.contains(null)).toBeTruthy();

        values.remove(null);
        expect(values.size()).toBe(3);
        expect(m.size()).toBe(3);
        expect(values.contains(null)).toBeFalsy();

        expect(() => { values.add(1); }).toThrowError(java.lang.UnsupportedOperationException);
        expect(() => { values.addAll(values); }).toThrowError(java.lang.UnsupportedOperationException);

        m.put("xyz", "abc");
        expect(values.size()).toBe(4);
        expect(keys.size()).toBe(4);
        expect(entries.size()).toBe(4);
        expect(m.size()).toBe(4);

        const setList1 = [...entries];
        const setList2 = entries.toArray();
        const setList3 = entries.toArray(new Array<HashMapEntry<string, unknown>>());
        expect(setList1).toEqual(setList2);
        expect(setList1).toEqual(setList3);

        const valuesList1 = [...values];
        const valuesList2 = values.toArray();
        const valuesList3 = values.toArray(new Array<HashMapEntry<string, unknown>>());
        expect(valuesList1).toEqual(valuesList2);
        expect(valuesList1).toEqual(valuesList3);

        values.clear();
        expect(m.size()).toBe(0);
        expect(values.size()).toBe(0);
        expect(entries.size()).toBe(0);
        expect(keys.size()).toBe(0);
    });
});
