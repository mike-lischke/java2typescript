/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { NotImplementedError } from "../../NotImplementedError";
import { S } from "../../templates";
import { java } from "../java";
import { JavaObject } from "../lang/Object";

export class WeakHashMap<K extends object, V> extends JavaObject implements java.util.Map<K, V> {
    // Implementation based on https://github.com/tc39/proposal-weakrefs#iterable-weakmaps.
    #backend = new WeakMap<K, { value: V, ref: WeakRef<K>; }>();
    #refSet = new Set<WeakRef<K>>();
    #finalizationGroup = new FinalizationRegistry(WeakHashMap.#cleanup);

    /** Constructs a new, empty WeakHashMap with the given initial capacity and the given load factor. */
    public constructor(initialCapacity?: number, loadFactor?: number);
    /** Constructs a new WeakHashMap with the same mappings as the specified map. */
    public constructor(m: java.util.Map<K, V>);
    public constructor(initialCapacityOrM?: number | java.util.Map<K, V>, _loadFactor?: number) {
        super();

        // Capacity and load factor are ignored.
        if (initialCapacityOrM && typeof initialCapacityOrM !== "number") {
            for (const entry of initialCapacityOrM.entrySet()) {
                this.put(entry.getKey(), entry.getValue());
            }
        }
    }

    static #cleanup = (obj: { set: Set<WeakRef<{}>>, ref: WeakRef<{}>; }) => {
        obj.set.delete(obj.ref);
    };

    public *[Symbol.iterator](): IterableIterator<[K, V]> {
        for (const ref of this.#refSet) {
            const key = ref.deref();
            if (!key) {
                continue;
            }

            const { value } = this.#backend.get(key)!;
            yield [key, value];
        }
    }

    /** Removes all of the mappings from this map. */
    public clear(): void {
        this.#backend = new WeakMap();
        this.#refSet.clear();
    }

    /**
     * Returns true if this map contains a mapping for the specified key.
     *
     * @param key tbd
     *
     * @returns tbd
     */
    public containsKey(key: K): boolean {
        return this.#backend.has(key);
    }

    /**
     * @param value The value to look up.
     *
     * @returns true if this map maps one or more keys to the specified value.
     */
    public containsValue(value: V): boolean {
        for (const [_, candidate] of this) {
            if (candidate === value) {
                return true;
            }
        }

        return false;
    }

    /** returns a Set view of the mappings contained in this map. */
    public entrySet(): java.util.Set<java.util.Map.Entry<K, V>> {
        throw new NotImplementedError();
    }

    /**
     * @param key The key for which to return the associated value.
     *
     * @returns the value to which the specified key is mapped, or null if this map contains no mapping for the key.
     */
    public get(key: K): V | null {
        const entry = this.#backend.get(key);

        return entry?.value ?? null;
    }

    /** @returns true if this map contains no key - value mappings. */
    public isEmpty(): boolean {
        return this.#refSet.size > 0;
    }

    /** Returns a Set view of the keys contained in this map. */
    public keySet(): java.util.Set<K> {
        throw new NotImplementedError();
    }

    /**
     * Associates the specified value with the specified key in this map.;
     *
     * @param key The target key.
     * @param value The value to associate with the given key.
     *
     * @returns the previous value associated with key, or null if there was no mapping for key.
     *          (A null return can also indicate that the map previously associated null with key.)
     */
    public put(key: K, value: V): V | null {
        const ref = new WeakRef(key);

        const previous = this.#backend.get(key);

        this.#backend.set(key, { value, ref });
        this.#refSet.add(ref);
        this.#finalizationGroup.register(key, { set: this.#refSet, ref }, ref);

        return previous?.value ?? null;
    }

    /**
     * Copies all of the mappings from the specified map to this map.
     *
     * @param m A map with the values to copy.
     */
    public putAll(m: java.util.Map<K, V>): void {
        for (const entry of m.entrySet()) {
            this.put(entry.getKey(), entry.getValue());
        }
    }

    /**
     * Removes the mapping for the specified key from this map if present.
     *
     * @param key The key of the mapping to remove.
     *
     * @returns the previous value associated with key, or null if there was no mapping for key.
     *          (A null return can also indicate that the map previously associated null with key.)
     */
    public remove(key: K): V | null {
        const entry = this.#backend.get(key);
        if (!entry) {
            return null;
        }

        this.#backend.delete(key);
        this.#refSet.delete(entry.ref);
        this.#finalizationGroup.unregister(entry.ref);

        return entry.value;
    }

    /** @returns the number of key - value mappings in this map. */
    public size(): number {
        return this.#refSet.size;
    }

    /** Returns a Collection view of the values contained in this map. */
    public values(): java.util.Collection<V> {
        throw new NotImplementedError();
    }

    public hashCode(): number {
        let result = 0;
        for (const entry of this.entrySet()) {
            result += entry.hashCode();
        }

        return result;
    }

    public equals(o: unknown): boolean {
        if (!(o instanceof WeakHashMap)) {
            return false;
        }

        if (this.#refSet.size !== o.#refSet.size) {
            return false;
        }

        // This class is intended primarily for use with key objects whose equals methods test for
        // object identity using the == operator.
        for (const [key, value] of this) {
            const other = o.get(key);
            if (other === undefined || other !== value) {
                return false;
            }
        }

        return true;
    }

    public toString(): java.lang.String {
        const entries: string[] = [];
        for (const [key, value] of this) {
            entries.push(`${key}=${value}`);
        }

        return S`{${entries.join(", ")}}`;
    }
}
