/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns */

import { java } from "../java";

import { DefaultJavaEqualityComparator } from "../../DefaultJavaEqualityComparator";
import { MurmurHash } from "../../MurmurHash";
import { JavaEqualityComparator } from "../../JavaEqualityComparator";
import { ArrayListIterator } from "./ArrayListIterator";

/**
 * This implementation was taken from the ANTLR4 Array2DHashSet implementation and adjusted to fulfill the
 * more general Java HashSet implementation (supporting null as valid value).
 */
export class HashSet<T> implements java.lang.Cloneable<HashSet<T>>, java.io.Serializable, java.util.Collection<T>,
    java.util.Set<T> {

    public static readonly initialCapacity = 16; // Must be a power of 2.
    public static readonly defaultLoadFactor = 0.75;

    protected comparator: JavaEqualityComparator<T> = DefaultJavaEqualityComparator.instance;

    // How many elements in set.
    private n = 0;

    private buckets: Array<Array<T | undefined>>;

    // When to expand.
    private threshold: number;
    private loadFactor: number;

    public constructor(c?: java.util.Collection<T>);
    public constructor(initialCapacity: number, loadFactor?: number);
    public constructor(cOrInitialCapacity?: java.util.Collection<T> | number, loadFactor?: number) {
        let initialCapacity = HashSet.initialCapacity;

        if (cOrInitialCapacity === undefined) {
            loadFactor ??= HashSet.defaultLoadFactor;

            this.buckets = new Array<T[]>(initialCapacity).fill(undefined);
        } else if (typeof cOrInitialCapacity === "number") {
            if (!loadFactor || loadFactor < 0 || loadFactor > 1) {
                loadFactor = HashSet.defaultLoadFactor;
            }

            // Make the initial capacity a power of 2.
            initialCapacity = Math.pow(2, Math.ceil(Math.log2(cOrInitialCapacity)));
            this.buckets = new Array<T[]>(initialCapacity).fill(undefined);
        } else {
            initialCapacity = cOrInitialCapacity.size();
            loadFactor = HashSet.defaultLoadFactor;
            this.buckets = new Array<T[]>(initialCapacity).fill(undefined);

            this.addAll(cOrInitialCapacity);
        }

        this.loadFactor = loadFactor;
        this.threshold = Math.floor(initialCapacity * loadFactor);
    }

    public *[Symbol.iterator](): IterableIterator<T> {
        yield* this.toArray();
    }

    /**
     * Add `o` to set if not there. Return existing value if already
     * there. This method performs the same operation as {@link add} aside from
     * the return value.
     *
     * Note: this method is not part of the Java API for HashSet, but was added for convenience.
     *
     * @param o The element to add.
     *
     * @returns Either the passed in object (if it wasn't there yet) or the stored object which is equal to the given
     *          object.
     */
    public findOrAdd(o: T): T {
        return this.getOrAddImpl(o);
    }

    /**
     * Find method based on equality of the current comparator. Might find an object with a different reference,
     * but the same properties as in `o` (object equality).
     *
     * Note: this method is not part of the Java API for HashSet, but was added for convenience.
     *
     * @param o The value/object to search for.
     *
     * @returns If found the stored value is returned otherwise undefined is returned.
     */
    public find(o: T): T | undefined {
        if (o === undefined) {
            return o;
        }

        const index = this.getBucketIndex(o);
        const bucket = this.buckets[index];
        if (bucket === undefined) {
            return undefined;
        }

        for (const e of bucket) {
            if (e === undefined) {
                // Empty slot; not there.
                return undefined;
            }

            if (this.comparator.equals(e, o)) {
                return e;
            }
        }

        return undefined;
    }

    /**
     * @returns the hash code value for this set. The hash code of a set is defined to be the sum of the hash codes
     *          of the elements in the set, where the hash code of a null element is defined to be zero.
     */
    public hashCode(): number {
        let hash = 0;
        for (const e of this) {
            hash += MurmurHash.valueHash(e);
        }

        return hash;
    }

    public equals(o: unknown): boolean {
        if (o === this) {
            return true;
        }

        if (!(o instanceof HashSet)) {
            return false;
        }

        if (o.size() !== this.size()) {
            return false;
        }

        return this.containsAll(o as HashSet<T>);
    }

    public add(t: T): boolean {
        return t === this.findOrAdd(t);
    }

    public size(): number {
        return this.n;
    }

    public isEmpty(): boolean {
        return this.n === 0;
    }

    public iterator(): java.util.Iterator<T> {
        return new ArrayListIterator(this.toArray(), false);
    }

    public contains(o: T): boolean {
        if (o === undefined) {
            return false;
        }

        return this.find(o) !== undefined;
    }

    public toArray(): T[];
    public toArray<U extends T>(a: U[]): U[];
    public toArray<U extends T>(a?: U[]): T[] | U[] {
        if (a === undefined) {
            const a = new Array<T>(this.size()).fill(undefined);
            let i = 0;
            for (const bucket of this.buckets) {
                if (bucket === undefined) {
                    continue;
                }

                for (const o of bucket) {
                    if (o === undefined) {
                        break;
                    }

                    a[i++] = o;
                }
            }

            return a;
        } else {
            if (a.length < this.size()) {
                a = new Array<U>(this.size());
            }
            a.fill(undefined);

            let i = 0;
            for (const bucket of this.buckets) {
                if (bucket === undefined) {
                    continue;
                }

                for (const o of bucket) {
                    if (o === undefined) {
                        break;
                    }

                    a[i++] = o as U;
                }
            }

            return a;
        }
    }

    public remove(obj: T): boolean {
        if (obj === undefined) {
            return false;
        }

        const index = this.getBucketIndex(obj);
        const bucket = this.buckets[index];
        if (bucket === undefined) {
            // no bucket
            return false;
        }

        for (let i = 0; i < bucket.length; i++) {
            const e = bucket[i];
            if (e === undefined) {
                // Empty slot - not there.
                return false;
            }

            if (this.comparator.equals(e, obj)) {
                // Shift all elements to the right down one.
                java.lang.System.arraycopy(bucket, i + 1, bucket, i, bucket.length - i - 1);
                bucket[bucket.length - 1] = undefined;
                --this.n;

                return true;
            }
        }

        return false;
    }

    public containsAll(collection: java.util.Collection<T>): boolean {
        if (collection instanceof HashSet) {
            const s = collection as HashSet<T>;
            for (const bucket of s.buckets) {
                if (bucket === undefined) {
                    continue;
                }

                for (const o of bucket) {
                    if (o === undefined) {
                        break;
                    }

                    if (!this.contains(o)) {
                        return false;
                    }

                }
            }
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
        let changed = false;
        for (const o of c) {
            const existing = this.findOrAdd(o);
            if (existing === o) {
                changed = true;
            }
        }

        return changed;
    }

    public retainAll(c: java.util.Collection<unknown>): boolean {
        let newSize = 0;
        for (const bucket of this.buckets) {
            if (bucket === undefined) {
                continue;
            }

            let i: number;
            let j: number;
            for (i = 0, j = 0; i < bucket.length; i++) {
                if (bucket[i] === undefined) {
                    break;
                }

                if (!c.contains(bucket[i])) {
                    // removed
                    continue;
                }

                // keep
                if (i !== j) {
                    bucket[j] = bucket[i];
                }

                j++;
                newSize++;
            }

            newSize += j;

            while (j < i) {
                bucket[j] = undefined;
                j++;
            }
        }

        const changed = newSize !== this.n;
        this.n = newSize;

        return changed;
    }

    public removeAll(c: java.util.Collection<T>): boolean {
        let changed = false;
        for (const o of c) {
            changed ||= this.remove(o);
        }

        return changed;
    }

    public clear(): void {
        this.buckets.fill(undefined);
        this.n = 0;
    }

    /** @returns a shallow copy of this HashSet instance: the elements themselves are not cloned. */
    public clone(): HashSet<T> {
        const result = new HashSet<T>(this as HashSet<T>);

        return result;
    }

    public toString(): string {
        if (this.size() === 0) {
            return "{}";
        }

        const buf = new java.lang.StringBuilder();
        buf.append("{");
        let first = true;
        for (const bucket of this.buckets) {
            if (bucket === undefined) {
                continue;
            }

            for (const o of bucket) {
                if (o === undefined) {
                    break;
                }

                if (first) {
                    first = false;
                } else {
                    buf.append(", ");
                }

                buf.append(JSON.stringify(o));
            }
        }
        buf.append("}");

        return buf.toString();
    }

    protected getOrAddImpl(o: T): T {
        if (this.n > this.threshold) {
            this.expand();
        }

        const b = this.getBucketIndex(o);
        const bucket = this.buckets[b];

        if (bucket === undefined) {
            // New bucket.
            this.buckets[b] = [o];
            ++this.n;

            return o;
        }

        // Look for it in the bucket.
        for (const existing of bucket) {
            if (this.comparator.equals(existing, o)) {
                return existing; // found existing, quit
            }
        }

        // Full bucket, expand and add to end.
        bucket.push(o);
        ++this.n;

        return o;
    }

    protected getBucketIndex(o: T): number {
        return this.comparator.hashCode(o) & (this.buckets.length - 1);
    }

    protected expand(): void {
        const old = this.buckets;

        const newCapacity = 2 * this.buckets.length;
        this.buckets = new Array<T[]>(newCapacity).fill(undefined);
        this.threshold = newCapacity * this.loadFactor;

        // Rehash all existing entries.
        for (const bucket of old) {
            if (!bucket) {
                continue;
            }

            for (const o of bucket) {
                const b = this.getBucketIndex(o);
                let newBucket = this.buckets[b];
                if (!newBucket) {
                    newBucket = [];
                    this.buckets[b] = newBucket;
                }

                newBucket.push(o);
            }
        }
    }
}
