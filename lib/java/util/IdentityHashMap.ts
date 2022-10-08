/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../java";

import { MurmurHash } from "../../MurmurHash";
import { NotImplementedError } from "../../NotImplementedError";

export class IdentityHashMap<K, V> implements java.lang.Cloneable<IdentityHashMap<K, V>>, java.io.Serializable,
    java.util.Map<K, V> {

    private backingStore: Map<K, V>;

    public constructor(expectedMaxSize?: number);
    public constructor(map: java.util.Map<K, V>);
    public constructor(expectedMaxSizeOrMap?: number | java.util.Map<K, V>) {
        this.backingStore = new Map<K, V>();
        if (expectedMaxSizeOrMap && typeof expectedMaxSizeOrMap !== "number") {
            if (expectedMaxSizeOrMap) {
                this.putAll(expectedMaxSizeOrMap);
            }
        }

        // Ignore the max expected size.
    }

    public clear(): void {
        this.backingStore.clear();
    }

    public clone(): IdentityHashMap<K, V> {
        return new IdentityHashMap<K, V>(this);
    }

    public containsKey(key: K): boolean {
        return this.backingStore.has(key);
    }

    public containsValue(value: V): boolean {
        const valueHash = MurmurHash.valueHash(value);
        for (const e of this.backingStore) {
            if (MurmurHash.valueHash(e[0]) === valueHash) {
                return true;
            }
        }

        return false;
    }

    public entrySet(): java.util.Set<java.util.Map.Entry<K, V>> {
        throw new NotImplementedError();
    }

    public get(key: K): V | undefined {
        return this.backingStore.get(key);
    }

    public isEmpty(): boolean {
        return this.backingStore.size === 0;
    }

    public keySet(): java.util.Set<K> {
        throw new NotImplementedError();
    }

    public put(key: K, value: V): V | undefined {
        const result = this.backingStore.get(key);
        this.backingStore.set(key, value);

        return result;
    }

    public putAll(map: java.util.Map<K, V>): void {
        if (map instanceof IdentityHashMap) {
            this.backingStore.forEach((value, key) => {
                this.backingStore.set(key, value);
            });
        } else {
            const entries = map.entrySet();
            for (const entry of entries) {
                this.backingStore.set(entry.getKey(), entry.getValue());
            }
        }
    }

    public remove(key: K): V | undefined {
        const result = this.backingStore.get(key);
        this.backingStore.delete(key);

        return result;
    }

    public size(): number {
        return this.backingStore.size;
    }

    public hashCode(): number {
        let sum = 0;
        for (const entry of this.backingStore) {
            sum += (entry[0] === null ? 0 : MurmurHash.valueHash(entry[0]))
                ^ (entry[1] === null ? 0 : MurmurHash.valueHash([1]));
        }

        return sum;
    }

    public equals(o: unknown): boolean {
        if (!(o instanceof IdentityHashMap<K, V>)) {
            return false;
        }

        if (this.backingStore.size !== o.backingStore.size) {
            return false;
        }

        for (const entry of o.backingStore as Map<K, V>) {
            const value = this.backingStore.get(entry[0]);
            if (value === undefined || value !== entry[1]) {
                return false;
            }
        }

        return true;
    }

    public values(): java.util.Collection<V> {
        const result = new java.util.ArrayList<V>();

        for (const value of this.backingStore.values()) {
            result.add(value);
        }

        return result;
    }
}
