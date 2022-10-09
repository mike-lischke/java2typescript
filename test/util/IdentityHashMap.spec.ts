/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/* eslint-disable no-new-wrappers */

import { java } from "../../lib/java/java";
import { NotImplementedError } from "../../lib/NotImplementedError";

describe("HashMap Tests", () => {
    it("Basic Map Operations", () => {
        const m = new java.util.IdentityHashMap<string, number>();

        expect(m.size()).toBe(0);
        expect(m.isEmpty()).toBeTruthy();
        expect(m.containsKey("")).toBeFalsy();
        expect(m.containsKey("Lorem Ipsum")).toBeFalsy();

        expect(m.put("Lorem Ipsum", 42)).toBe(undefined);
        expect(m.get("Lorem Ipsum")).toBe(42);

        expect(m.isEmpty()).toBeFalsy();

        expect(m.containsKey("Lorem Ipsum")).toBeTruthy();
        expect(m.put("Lorem Ipsum", 43)).toBe(42);
        expect(m.get("Lorem Ipsum")).toBe(43);

        expect(m.put("mike2", 41)).toBe(undefined);
        expect(m.size()).toBe(2);

        expect(m.remove("mike3")).toBe(undefined);
        expect(m.size()).toBe(2);
        expect(m.remove("Lorem Ipsum")).toBe(43);
        expect(m.size()).toBe(1);

        m.clear();
        expect(m.size()).toBe(0);
        expect(m.isEmpty()).toBeTruthy();
    });

    it("Reference and Value Equality", () => {
        const m = new java.util.IdentityHashMap<String, number | object>();

        // String literals are automatically converted to the same string object, if they are equal. That's why we
        // have to use explicit String object construction, to avoid this coercion.

        const s = new String("Lorem Ipsum");
        m.put(s, 1);
        m.put(new String("Lorem Ipsum"), 2);

        // Strings are special. The same string
        expect(m.size()).toBe(2);

        expect(m.containsKey("Lorem Ipsum")).toBeFalsy();
        expect(m.containsKey(new String("Lorem Ipsum"))).toBeFalsy();
        expect(m.containsKey(s)).toBeTruthy();

        expect(m.get(s)).toBeTruthy();

        expect(m.containsValue(2)).toBeTruthy();

        m.put("a", {});
        m.put("b", { x: 1, y: 2 });
        expect(m.containsValue({})).toBeFalsy();
        expect(m.containsValue({ x: 1, y: 2 })).toBeFalsy();

        const o = { x: 1, y: 2 };
        m.put("Lorem Ipsum", o);
        expect(m.containsValue({ x: 1, y: 2 })).toBeFalsy();
        expect(m.containsValue(o)).toBeTruthy();

        const clone = m.clone();
        expect(clone.containsValue({ x: 1, y: 2 })).toBeFalsy();
        expect(clone.containsValue(o)).toBeTruthy();
    });

    it("Map Hash Code and Equality", () => {
        const m1 = new java.util.IdentityHashMap<number, number>();
        const m2 = new java.util.IdentityHashMap<number, number>();

        expect(m1.equals(m2)).toBeTruthy();
        expect(m1.hashCode()).toBe(m2.hashCode());

        m2.put(1, 2);
        expect(m1.equals(m2)).toBeFalsy();
        expect(m1.equals(1)).toBeFalsy();
        m1.put(2, 2);
        expect(m1.equals(m2)).toBeFalsy();

        expect(m1.hashCode()).toBe(1674625697);
        expect(m2.hashCode()).toBe(-661407244);

        m1.put(1, 2);
        expect(m1.equals(m2)).toBeFalsy();
        m1.remove(2);
        expect(m1.equals(m2)).toBeTruthy();

        m1.put(null, 3);
        m2.put(3, null);
        expect(m1.hashCode()).not.toBe(m2.hashCode());

        // Store entries from another map, but not IdentityHashMap in the test maps.
        const m3 = new java.util.HashMap<number, number>();
        m3.put(5, 5);
        m1.putAll(m3);

        expect(m1.size()).toBe(3);
        expect(m1.containsKey(5)).toBeTruthy();
    });

    it("Sub Lists", () => {
        // Sub list are currently not supported.
        const m = new java.util.IdentityHashMap<String, number | object>();

        expect(() => { m.values(); }).toThrowError(NotImplementedError);
        expect(() => { m.keySet(); }).toThrowError(NotImplementedError);
        expect(() => { m.entrySet(); }).toThrowError(NotImplementedError);
    });
});
