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

/** This support class provides a view on a map's values. It allows to modify the map for which it was created. */
export class MapValueView<K, V> extends JavaObject implements java.util.Set<V> {
    public constructor(private sharedBackend: IHashMapViewBackend<K, V>) {
        super();
    }

    public *[Symbol.iterator](): IterableIterator<V> {
        yield* this.sharedBackend.backend.values();
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

    public contains(o: V): boolean {
        return this.sharedBackend.backend.includes(o);
    }

    public containsAll(c: java.util.Collection<V>): boolean {
        for (const entry of c) {
            if (!this.sharedBackend.backend.includes(entry)) {
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

        return this.sharedBackend.backend.equals(o.sharedBackend.backend);
    }

    public hashCode(): number {
        return this.sharedBackend.backend.hashCode();
    }

    public isEmpty(): boolean {
        return this.sharedBackend.backend.isEmpty();
    }

    public iterator(): java.util.Iterator<V> {
        return new JavaIterator(this.sharedBackend.backend.values());
    }

    public remove(o: V): boolean {
        const m = this.sharedBackend.backend.withMutations((map) => {
            const candidates: K[] = [];
            for (const e of map) {
                if (e[1] === o) {
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

    public removeAll(c: java.util.Collection<V>): boolean {
        const m = this.sharedBackend.backend.withMutations((map) => {
            const candidates: K[] = [];
            for (const e of map) {
                if (c.contains(e[1])) {
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

    public retainAll(c: java.util.Collection<V>): boolean {
        const m = this.sharedBackend.backend.withMutations((map) => {
            const candidates: K[] = [];
            for (const e of map) {
                if (!c.contains(e[1])) {
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

    public toArray(): V[];
    public toArray<U extends V>(a: U[]): U[];
    public toArray<U extends V>(a?: U[]): V[] | U[] {
        const result = [...this.sharedBackend.backend.values()];

        return a ? result as U[] : result;
    }
}
