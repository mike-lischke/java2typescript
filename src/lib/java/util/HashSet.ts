/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java } from "../java";
import { JavaObject } from "../lang/Object";

import { Set } from "immutable";
import { JavaIterator } from "../../JavaIterator";

export class HashSet<T> extends JavaObject implements java.lang.Cloneable<HashSet<T>>, java.io.Serializable,
    java.util.Collection<T>, java.util.Set<T> {

    private backend: Set<T> = Set<T>([]);

    public constructor(c?: java.util.Collection<T>);
    public constructor(initialCapacity: number, loadFactor?: number);
    public constructor(cOrInitialCapacity?: java.util.Collection<T> | number, _loadFactor?: number) {
        super();

        // The load factor is ignored in this implementation.
        if (cOrInitialCapacity && typeof cOrInitialCapacity !== "number") {
            this.addAll(cOrInitialCapacity);
        }
    }

    public *[Symbol.iterator](): IterableIterator<T> {
        yield* this.backend[Symbol.iterator]();
    }

    public hashCode(): number {
        return this.backend.hashCode();
    }

    public equals(o: unknown): boolean {
        if (!(o instanceof HashSet)) {
            return false;
        }

        return this.backend.equals(o.backend);
    }

    /**
     * Adds the specified element to this set if it is not already present.
     *
     * @param t The value to add.
     *
     * @returns True if the value was actually added (i.e. wasn't member of this set yet), otherwise false.
     */
    public add(t: T): boolean {
        const set = this.backend.add(t);
        if (set !== this.backend) {
            this.backend = set;

            return true;
        }

        return false;
    }

    /** @returns the number of elements in this set (its cardinality). */
    public size(): number {
        return this.backend.count();
    }

    /** @returns true if this set contains no elements. */
    public isEmpty(): boolean {
        return this.backend.isEmpty();
    }

    /** @returns an iterator over the elements in this set. */
    public iterator(): java.util.Iterator<T> {
        return new JavaIterator(this.backend[Symbol.iterator]());
    }

    /**
     * @param o The value to check.
     *
     * @returns true if this set contains the specified element.
     */
    public contains(o: T): boolean {
        return this.backend.has(o);
    }

    /** @returns an array containing all of the elements in this collection. */
    public toArray(): T[];
    public toArray<U extends T>(a: U[]): U[];
    public toArray<U extends T>(a?: U[]): T[] | U[] {
        if (a === undefined) {
            return this.backend.toArray();
        } else {
            return this.backend.toArray() as U[];
        }
    }

    /**
     * Removes the specified element from this set if it is present.
     *
     * @param obj The value to remove.
     *
     * @returns True if the value was part of this set (i.e. the set has been changed by this call), otherwise false.
     */
    public remove(obj: T): boolean {
        if (obj === undefined) {
            return false;
        }

        const s = this.backend.delete(obj);
        if (this.backend !== s) {
            this.backend = s;

            return true;
        }

        return false;
    }

    /**
     * @param collection The values to check.
     *
     * @returns true if this collection contains all of the elements in the specified collection.
     */
    public containsAll(collection: java.util.Collection<T>): boolean {
        if (collection instanceof HashSet) {
            let allFound = true;
            collection.backend.forEach((value) => {
                if (!this.backend.contains(value as T)) {
                    allFound = false;

                    return false;
                }

                return true;
            });

            return allFound;
        } else {
            for (const o of collection) {
                if (!this.contains(o)) {
                    return false;
                }
            }
        }

        return true;
    }

    public addAll(c: java.util.Collection<T>): boolean {
        const s = this.backend.withMutations((set) => {
            if (c instanceof HashSet) {
                c.backend.forEach((value) => {
                    set.add(value as T);
                });
            } else {
                for (const o of c) {
                    set.add(o);
                }
            }
        });

        if (s !== this.backend) {
            this.backend = s;

            return true;
        }

        return false;
    }

    /**
     * Retains only the elements in this collection that are contained in the specified collection (optional operation).
     *
     * @param c The collection with the elements to retain.
     *
     * @returns True if this set was changed by this method, otherwise false.
     */
    public retainAll(c: java.util.Collection<T>): boolean {
        const s = this.backend.intersect(c);
        if (s !== this.backend) {
            this.backend = s;

            return true;
        }

        return false;
    }

    /**
     * Removes from this set all of its elements that are contained in the specified collection (optional operation).
     *
     * @param c The collection with the elements to remove.
     *
     * @returns True if this set was changed by this method, otherwise false.
     */
    public removeAll(c: java.util.Collection<T>): boolean {
        const s = this.backend.withMutations((set) => {
            for (const o of c) {
                set.delete(o);
            }
        });

        if (this.backend !== s) {
            this.backend = s;

            return true;
        }

        return false;
    }

    /** Removes all of the elements from this set. */
    public clear(): void {
        this.backend = this.backend.clear();
    }

    /** @returns a shallow copy of this HashSet instance: the elements themselves are not cloned. */
    public clone(): HashSet<T> {
        const result = new HashSet<T>(this);

        return result;
    }

    public toString(): java.lang.String {
        if (this.size() === 0) {
            return new java.lang.String("{}");
        }

        const buf = new java.lang.StringBuilder();
        buf.append("{");
        let first = true;
        this.backend.forEach((value) => {
            if (first) {
                first = false;
            } else {
                buf.append(", ");
            }

            buf.append(JSON.stringify(value));
        });
        buf.append("}");

        return buf.toString();
    }
}
