/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/* eslint-disable @typescript-eslint/naming-convention */

import { java } from "../java";

export interface List<T> extends java.util.Collection<T> {

    /**
     * Appends the specified element to the end of this list.
     */
    add(e: T): boolean;

    /**
     * Inserts the specified element at the specified position in this list.
     */
    add(index: number, element: T): void;

    /**
     * Appends all of the elements in the specified collection to the end of this list, in the order that they are
     * returned by the specified collection's iterator.
     */
    addAll(c: java.util.Collection<T>): boolean;

    /**
     * Inserts all of the elements in the specified collection into this list at the specified position.
     */
    addAll(index: number, c: java.util.Collection<T>): boolean;

    /**
     * Removes all of the elements from this list.
     */
    clear(): void;

    /**
     * Returns true if this list contains the specified element.
     */
    contains(element: T): boolean;

    /**
     * Returns true if this list contains all of the elements of the specified collection.
     */
    containsAll(c: java.util.Collection<T>): boolean;

    /**
     * Compares the specified object with this list for equality.
     */
    equals(other: unknown): boolean;

    /**
     * Returns the element at the specified position in this list.
     */
    get(index: number): T;

    /**
     * Returns the hash code value for this list.
     */
    hashCode(): number;

    /**
     * Returns the index of the first occurrence of the specified element in this list, or -1 if this list does not
     * contain the element.
     */
    indexOf(o: T): number;

    /**
     * Returns true if this list contains no elements.
     */
    isEmpty(): boolean;

    /**
     * Returns an iterator over the elements in this list in proper sequence.
     */
    iterator(): java.util.Iterator<T>;

    /**
     * Returns the index of the last occurrence of the specified element in this list, or -1 if this list does not
     * contain the element.
     */
    lastIndexOf(o: T): number;

    /**
     * Returns a list iterator over the elements in this list (in proper sequence), starting at the specified
     * position in the list (or 0 if no index is given).
     */
    listIterator(index?: number): java.util.ListIterator<T>;

    /**
     * Removes the element at the specified position in this list.
     */
    remove(index: number): T | undefined;
    remove(o: unknown): boolean;

    /**
     * Removes from this list all of its elements that are contained in the specified collection.
     */
    removeAll(c: java.util.Collection<T>): boolean;

    /**
     * Retains only the elements in this list that are contained in the specified collection.
     */
    retainAll(c: java.util.Collection<T>): boolean;

    /**
     * Replaces the element at the specified position in this list with the specified element.
     */
    set(index: number, element: T): T;

    /**
     * Returns the number of elements in this list.
     */
    size(): number;

    /**
     * Returns a view of the portion of this list between the specified fromIndex, inclusive, and toIndex, exclusive.
     */
    subList(fromIndex: number, toIndex: number): List<T>;

    /**
     * Returns an array containing all of the elements in this list in proper sequence (from first to last element).
     */
    toArray(): T[];

    /**
     * Returns an array containing all of the elements in this list in proper sequence (from first to last element);
     * the runtime type of the returned array is that of the specified array.
     */
    toArray<T2>(a: T2[]): T2[];

}
