/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../java";
import { JavaObject } from "../lang/Object";

import { JavaEqualityComparator } from "../../JavaEqualityComparator";
import { HashMapEntry } from "./HashMapEntry";

/** This support class provides a view on a map's keys. It allows to modify the map for which it was created. */
export class MapValueView<K, V> extends JavaObject implements java.util.Set<V> {
    public constructor(
        private map: java.util.HashMap<K, V>,
        private comparator: JavaEqualityComparator<java.util.Map.Entry<K, V>>) {
        super();
    }

    public *[Symbol.iterator](): IterableIterator<V> {
        yield* this.toArray();
    }

    public add(_e: unknown): boolean {
        throw new java.lang.UnsupportedOperationException();
    }

    public addAll(_c: unknown): boolean {
        throw new java.lang.UnsupportedOperationException();
    }

    public clear(): void {
        this.map.clear();
    }

    public contains(o: V): boolean {
        return this.map.containsValue(o);
    }

    public containsAll(c: java.util.Collection<V>): boolean {
        for (const entry of c) {
            if (!this.map.containsValue(entry)) {
                return false;
            }
        }

        return true;
    }

    public equals(o: unknown): boolean {
        if (o === this) {
            return true;
        }

        if (!(o instanceof MapValueView)) {
            return false;
        }

        if (this.map.size !== o.map.size) {
            return false;
        }

        for (const entry of o.map as java.util.HashMap<K, V>) {
            if (!this.map.containsValue(entry.getValue()!)) {
                return false;
            }
        }

        return true;
    }

    public hashCode(): number {
        let hash = 0;
        for (const e of this.map) {
            hash += this.comparator.hashCode(e);
        }

        return hash;
    }

    public isEmpty(): boolean {
        return this.map.isEmpty();
    }

    public iterator(): java.util.Iterator<V> {
        return new java.util.ArrayListIterator<V>(this.toArray(), false);
    }

    public remove(o: V): boolean {
        const entry = new HashMapEntry(null, o);
        const candidates: Array<java.util.Map.Entry<K | null, V | null>> = [];
        for (const e of this.map) {
            if (this.comparator.equals(e, entry)) {
                candidates.push(e);
            }
        }

        for (const e of candidates) {
            this.map.remove(e.getKey());
        }

        return candidates.length > 0;
    }

    public removeAll(c: java.util.Collection<V>): boolean {
        let changed = false;
        for (const o of c) {
            changed ||= this.remove(o);
        }

        return changed;
    }

    public retainAll(c: java.util.Collection<V | null>): boolean {
        const candidates: Array<java.util.Map.Entry<K | null, V | null>> = [];
        for (const e of this.map) {
            if (!c.contains(e.getValue())) {
                candidates.push(e);
            }
        }

        for (const e of candidates) {
            this.map.remove(e.getKey());
        }

        return candidates.length > 0;
    }

    public size(): number {
        return this.map.size();
    }

    public toArray(): V[];
    public toArray<U extends V>(a: U[]): U[];
    public toArray<U extends V>(a?: U[]): V[] | U[] {
        const result: V[] = [];
        for (const e of this.map) {
            // The implicit nullability in Java creates a problem here with strict typing, which requires
            // explicit nullability. Hence we apply a non-null assertion here, knowing well that we also can
            // have null values.
            result.push(e.getValue()!);
        }

        return a ? result as U[] : result;
    }
}
