/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { JavaIterator } from "../../JavaIterator";

import { java } from "../java";
import { JavaObject } from "../lang/Object";
import { IHashMapViewBackend } from "./HashMap";

/** This support class provides a view on a map's keys. It allows to modify the map for which it was created. */
export class MapKeyView<K, V> extends JavaObject implements java.util.Set<K> {
    public constructor(private sharedBackend: IHashMapViewBackend<K, V>) {
        super();
    }

    public *[Symbol.iterator](): IterableIterator<K> {
        yield* this.sharedBackend.backend.keys();
    }

    public add(_e: unknown): boolean {
        throw new java.lang.UnsupportedOperationException();
    }

    public addAll(_c: unknown): boolean {
        throw new java.lang.UnsupportedOperationException();
    }

    public clear(): void {
        this.sharedBackend.backend = this.sharedBackend.backend.clear();
    }

    public contains(o: K): boolean {
        return this.sharedBackend.backend.has(o);
    }

    public containsAll(c: java.util.Collection<K>): boolean {
        for (const entry of c) {
            if (!this.sharedBackend.backend.has(entry)) {
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

        return this.sharedBackend.backend.equals(o.sharedBackend.backend);
    }

    public hashCode(): number {
        return this.sharedBackend.backend.hashCode();
    }

    public isEmpty(): boolean {
        return this.sharedBackend.backend.isEmpty();
    }

    public iterator(): java.util.Iterator<K> {
        return new JavaIterator(this.sharedBackend.backend.keys());
    }

    public remove(o: K): boolean {
        const m = this.sharedBackend.backend.remove(o);
        if (m !== this.sharedBackend.backend) {
            this.sharedBackend.backend = m;

            return true;
        }

        return false;
    }

    public removeAll(c: java.util.Collection<K>): boolean {
        const m = this.sharedBackend.backend.deleteAll(c);

        if (m !== this.sharedBackend.backend) {
            this.sharedBackend.backend = m;

            return true;
        }

        return false;
    }

    public retainAll(c: java.util.Collection<K>): boolean {
        const m = this.sharedBackend.backend.withMutations((map) => {
            const candidates: K[] = [];
            for (const e of map) {
                if (!c.contains(e[0])) {
                    candidates.push(e[0]);
                }
            }

            for (const k of candidates) {
                map.remove(k);
            }
        });

        if (m !== this.sharedBackend.backend) {
            this.sharedBackend.backend = m;

            return true;
        }

        return false;
    }

    public size(): number {
        return this.sharedBackend.backend.count();
    }

    public toArray(): K[];
    public toArray<U extends K>(a: U[]): U[];
    public toArray<U extends K>(a?: U[]): K[] | U[] {
        const result = [...this.sharedBackend.backend.keys()];

        return a ? result as U[] : result;
    }
}
