/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Map } from "immutable";

import { java } from "../java";
import { JavaObject } from "../lang/Object";
import { MapEntryView } from "./MapEntryView";

import { MapKeyView } from "./MapKeyView";
import { MapValueView } from "./MapValueView";

/**
 * This interface provides shared access to the backend of a HashMap instance for all currently active key, value
 * and entry views. This way each of them sees updates of the backend and can update it as well.
 * I wish we had friend classes, which would make this unnecessary.
 */
export interface IHashMapViewBackend<K, V> {
    backend: Map<K, V>;
}

export class HashMap<K, V> extends JavaObject implements java.lang.Cloneable<HashMap<K, V>>, java.io.Serializable,
    java.util.Map<K, V> {

    private sharedBackend: IHashMapViewBackend<K, V> = {
        backend: Map<K, V>(),
    };

    public constructor(initialCapacity?: number, loadFactor?: number);
    public constructor(map: java.util.Map<K, V>);
    public constructor(initialCapacityOrMap?: number | java.util.Map<K, V>, _loadFactor?: number) {
        super();

        // Initial capacity and load factor are ignored in this implementation.
        if (initialCapacityOrMap && typeof initialCapacityOrMap !== "number") {
            this.putAll(initialCapacityOrMap);
        }
    }

    public *[Symbol.iterator](): IterableIterator<[K, V]> {
        yield* this.sharedBackend.backend[Symbol.iterator]();
    }

    /** Removes all of the mappings from this map. */
    public clear(): void {
        this.sharedBackend.backend = this.sharedBackend.backend.clear();
    }

    /** @returns a shallow copy of this HashMap instance: the keys and values themselves are not cloned. */
    public clone(): HashMap<K, V> {
        return new HashMap<K, V>(this);
    }

    /**
     * @param key The key to look up.
     *
     * @returns true if this map contains a mapping for the specified key.
     */
    public containsKey(key: K): boolean {
        return this.sharedBackend.backend.has(key);
    }

    /**
     * @param value The value to look up.
     *
     * @returns true if this map maps one or more keys to the specified value.
     */
    public containsValue(value: V): boolean {
        return this.sharedBackend.backend.includes(value);
    }

    /** @returns a Set view of the mappings contained in this map. */
    public entrySet(): java.util.Set<java.util.Map.Entry<K, V>> {
        return new MapEntryView(this.sharedBackend);
    }

    /**
     * @param key The key for which to return the associated value.
     *
     * @returns the value to which the specified key is mapped, or null if this map contains no mapping for the key.
     */
    public get(key: K): V | null {
        return this.sharedBackend.backend.get(key) ?? null;
    }

    /** @returns true if this map contains no key-value mappings. */
    public isEmpty(): boolean {
        return this.sharedBackend.backend.isEmpty();
    }

    /** @returns a Set view of the keys contained in this map. */
    public keySet(): java.util.Set<K> {
        return new MapKeyView<K, V>(this.sharedBackend);
    }

    /**
     * Associates the specified value with the specified key in this map.
     *
     * @param key The target key.
     * @param value The value to associate with the given key.
     *
     * @returns the previous value associated with key, or null if there was no mapping for key.
     *          (A null return can also indicate that the map previously associated null with key.)
     */
    public put(key: K, value: V): V | null {
        const previous = this.sharedBackend.backend.get(key);
        const m = this.sharedBackend.backend.set(key, value);
        if (this.sharedBackend.backend !== m) {
            this.sharedBackend.backend = m;
        }

        return previous ?? null;
    }

    /**
     * Copies all of the mappings from the specified map to this map.
     *
     * @param map A map with the values to copy.
     */
    public putAll(map: java.util.Map<K, V>): void {
        const m = this.sharedBackend.backend.withMutations((mutable) => {
            for (const entry of map.entrySet()) {
                mutable.set(entry.getKey(), entry.getValue());
            }
        });

        this.sharedBackend.backend = m;
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
        const previous = this.sharedBackend.backend.get(key);
        this.sharedBackend.backend = this.sharedBackend.backend.delete(key);

        return previous ?? null;
    }

    public size(): number {
        return this.sharedBackend.backend.count();
    }

    public hashCode(): number {
        return this.sharedBackend.backend.hashCode();
    }

    public equals(o: java.lang.Object): boolean {
        if (!(o instanceof HashMap)) {
            return false;
        }

        return this.sharedBackend.backend.equals(o.sharedBackend.backend);
    }

    public values(): java.util.Collection<V> {
        return new MapValueView(this.sharedBackend);
    }
}
