/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../java";

import { JavaEqualityComparator } from "../../JavaEqualityComparator";
import { ArrayListIterator } from "./ArrayListIterator";

/** This support class provides a view on a map's keys. It allows to modify the map for which it was created. */
export class MapKeyView<K, V> implements java.util.Set<K> {
    public constructor(
        private map: java.util.HashMap<K, V>,
        private comparator: JavaEqualityComparator<java.util.Map.Entry<K, V>>) { }

    public *[Symbol.iterator](): IterableIterator<K> {
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

    public contains(o: K): boolean {
        return this.map.containsKey(o);
    }

    public containsAll(c: java.util.Collection<K>): boolean {
        for (const entry of c) {
            if (!this.map.containsKey(entry)) {
                return false;
            }
        }

        return true;
    }

    public equals(o: unknown): boolean {
        if (o === this) {
            return true;
        }

        if (!(o instanceof MapKeyView)) {
            return false;
        }

        if (this.map.size !== o.map.size) {
            return false;
        }

        for (const entry of o.map as java.util.HashMap<K, V>) {
            if (!this.map.containsKey(entry.getKey()!)) {
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

    public iterator(): java.util.Iterator<K> {
        return new ArrayListIterator(this.toArray(), false);
    }

    public remove(o: K): boolean {
        return this.map.remove(o) !== undefined;
    }

    public removeAll(c: java.util.Collection<K>): boolean {
        let changed = false;
        for (const o of c) {
            changed ||= this.remove(o);
        }

        return changed;

    }

    public retainAll(c: java.util.Collection<K>): boolean {
        const candidates: Array<java.util.Map.Entry<K, V>> = [];
        for (const e of this.map) {
            if (!c.contains(e.getKey()!)) {
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

    public toArray(): K[];
    public toArray<U extends K>(a: Array<U | null>): Array<U | null>;
    public toArray<U extends K>(a?: Array<U | null>): Array<K | null> | Array<U | null> {
        const result: Array<K | null> = [];
        for (const e of this.map) {
            result.push(e.getKey());
        }

        return a ? result as Array<U | null> : result;
    }
}
