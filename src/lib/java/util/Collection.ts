/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../java";

/* eslint-disable @typescript-eslint/naming-convention */

export interface Collection<T> extends Iterable<T> {
    [Symbol.iterator](): IterableIterator<T>;

    /**
     * Ensures that this collection contains the specified element.
     */
    add(e: T): boolean;

    /**
     * Adds all of the elements in the specified collection to this collection.
     */
    addAll(c: Collection<T>): boolean;

    /**
     * Removes all of the elements from this collection.
     */
    clear(): void;

    /**
     * Returns true if this collection contains the specified element.
     */
    contains(o: T): boolean;

    /**
     * Returns true if this collection contains all of the elements in the specified collection.
     */
    containsAll(c: Collection<T>): boolean;

    /**
     * Compares the specified object with this collection for equality.
     */
    equals(other: unknown): boolean;

    /**
     * Returns the hash code value for this collection.
     */
    hashCode(): number;

    /**
     * Returns true if this collection contains no elements.
     */
    isEmpty(): boolean;

    /** Returns an iterator over the elements in this collection. */
    iterator(): java.util.Iterator<T>;

    /**
     * Removes a single instance of the specified element from this collection, if it is present.
     */
    remove(o: unknown): boolean;

    /**
     * Removes all of this collection's elements that are also contained in the specified collection.
     */
    removeAll(c: Collection<T>): boolean;

    /**
     * Retains only the elements in this collection that are contained in the specified collection.
     */
    retainAll(c: Collection<T>): boolean;

    /**
     * Returns the number of elements in this collection.
     */
    size(): number;

    toString(): java.lang.String;

    /**
     * Returns an array containing all of the elements in this collection.
     */
    toArray(): T[];

    /**
     * Returns an array containing all of the elements in this collection; the runtime type of the returned array
     * is that of the specified array.
     */
    toArray<T2>(a: T2[]): T2[];
}
