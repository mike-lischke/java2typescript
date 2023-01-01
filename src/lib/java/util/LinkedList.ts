/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { List } from "immutable";
import { JavaIterator } from "../../JavaIterator";

import { java } from "../java";

import { JavaObject } from "../lang/Object";
import { IListIteratorBackend, ListIteratorImpl } from "./ListIteratorImpl";

/**
 * Implementation of the List and Deque interfaces. Implements all optional list operations, and
 * permits all elements (including null).
 *
 * In Java this is a doubly-linked list, but this class uses immutable.js for the actual implementation.
 */
export class LinkedList<T> extends JavaObject implements java.io.Serializable, java.lang.Cloneable<LinkedList<T>>,
    java.util.Deque<T>, java.util.List<T> {

    // For sub lists, which are backed by this list.
    private start: number;
    private end: number;

    #backend: IListIteratorBackend<T>;

    /**
     * Constructs an empty list or a list containing the elements of the specified collection, in the order they
     * are returned by the collection's iterator.
     *
     * @param c A collection to insert in this list.
     */
    public constructor(c?: Iterable<T>) {
        super();

        this.#backend = { list: List(c) };
        this.start = 0;
        this.end = this.#backend.list.count();
    }

    public *[Symbol.iterator](): IterableIterator<T> {
        yield* this.#backend.list;
    }

    /**
     * Appends the specified element to the end of this list.
     *
     * @param e The element to add.
     *
     * @returns true
     */
    public add(e: T): boolean;
    /**
     * Inserts the specified element at the specified position in this list.
     *
     * @param index
     * @param element
     */
    public add(index: number, element: T): void;
    public add(eOrIndex: T | number, element?: T): boolean | void {
        if (typeof eOrIndex == "number" && element !== undefined) {
            if (eOrIndex < 0 || eOrIndex >= this.end - this.start) {
                throw new java.lang.IndexOutOfBoundsException();
            }

            this.#backend.list = this.#backend.list.insert(eOrIndex, element);
            ++this.end;
        } else {
            this.#backend.list = this.#backend.list.push(eOrIndex as T);
            ++this.end;

            return true;
        }
    }

    /**
     * Appends all of the elements in the specified collection to the end of this list, in the order that they are
     * returned by the specified collection's iterator.
     *
     * @param c
     */
    public addAll(c: java.util.Collection<T>): boolean;
    /**
     * Inserts all of the elements in the specified collection into this list, starting at the specified position.
     *
     * @param index
     * @param c
     */
    public addAll(index: number, c: java.util.Collection<T>): boolean;
    public addAll(cOrIndex: java.util.Collection<T> | number, c?: java.util.Collection<T>): boolean {
        if (typeof cOrIndex !== "number") {
            this.#backend.list = this.#backend.list.push(...cOrIndex);
            this.end += cOrIndex.size();
        } else if (c) {
            if (cOrIndex < 0 || cOrIndex >= this.end - this.start) {
                throw new java.lang.IndexOutOfBoundsException();
            }

            this.#backend.list = this.#backend.list.splice(cOrIndex, 0, ...c);
            this.end += c.size();
        }

        return true;
    }

    /**
     * Inserts the specified element at the beginning of this list.
     *
     * @param e The element to add.
     */
    public addFirst(e: T): void {
        this.#backend.list = this.#backend.list.unshift(e);
        ++this.end;
    }

    /**
     * Appends the specified element to the end of this list.
     *
     * @param e The element to append.
     */
    public addLast(e: T): void {
        this.#backend.list = this.#backend.list.push(e);
        ++this.end;
    }

    /** Removes all of the elements from this list. */
    public clear(): void {
        this.#backend.list = this.#backend.list.clear();
        this.end = this.start;
    }

    /** @returns a shallow copy of this LinkedList. */
    public clone(): LinkedList<T> {
        return new LinkedList(this);
    }

    /**
     * @returns true if this list contains the specified element.
     *
     * @param o tbd
     */
    public contains(o: T): boolean {
        return this.#backend.list.contains(o);
    }

    /** @returns an iterator over the elements in this deque in reverse sequential order. */
    public descendingIterator(): java.util.Iterator<T> {
        return new JavaIterator(this.#backend.list.reverse()[Symbol.iterator]());
    }

    /** @returns but does not remove, the head (first element) of this list. */
    public element(): T {
        const value = this.#backend.list.first();

        if (value === undefined) {
            throw new java.lang.NoSuchElementException();
        }

        return value;
    }

    /**
     * @returns the element at the specified position in this list.
     *
     * @param index The index in the list.
     */
    public get(index: number): T {
        if (index < 0 || index >= this.#backend.list.size) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        return this.#backend.list.get(index)!;
    }

    /** @returns the first element in this list. */
    public getFirst(): T {
        return this.element();
    }

    /** @returns the last element in this list. */
    public getLast(): T {
        const value = this.#backend.list.last();

        if (value === undefined) {
            throw new java.lang.NoSuchElementException();
        }

        return value;
    }

    /**
     * @returns the index of the first occurrence of the specified element in this list, or - 1 if this list does not
     * contain the element.
     *
     * @param o tbd
     */
    public indexOf(o: T): number {
        return this.#backend.list.indexOf(o);
    }

    /**
     * @returns the index of the last occurrence of the specified element in this list, or - 1 if this list does not
     * contain the element.
     *
     * @param o tbd
     */
    public lastIndexOf(o: T): number {
        return this.#backend.list.lastIndexOf(o);
    }

    /**
     * @returns a list-iterator of the elements in this list (in proper sequence), starting at the specified
     * position in the list.
     *
     * @param index The start index.
     */
    public listIterator(index: number): java.util.ListIterator<T> {
        return new ListIteratorImpl(this.#backend, this.start + index, this.end);
    }

    /**
     * Adds the specified element as the tail (last element) of this list.
     *
     * @param e The element to add.
     *
     * @returns true
     */
    public offer(e: T): boolean {
        this.#backend.list = this.#backend.list.push(e);
        ++this.end;

        return true;
    }

    /**
     * Inserts the specified element at the front of this list.
     *
     * @param e the element to add.
     *
     * @returns true
     */
    public offerFirst(e: T): boolean {
        this.#backend.list = this.#backend.list.unshift(e);
        ++this.end;

        return true;
    }

    /**
     * Inserts the specified element at the end of this list.
     *
     * @param e The element to add.
     *
     * @returns true
     */
    public offerLast(e: T): boolean {
        return this.offer(e);
    }

    /** @returns but does not remove, the head(first element) of this list. */
    public peek(): T {
        return this.element();
    }

    /** @returns but does not remove, the first element of this list, or returns null if this list is empty. */
    public peekFirst(): T | null {
        return this.#backend.list.first() ?? null;
    }

    /**
     * Retrieves, but does not remove, the last element of this list, or returns null if this list is empty.
     *
     * @returns the last element or null, if the list is empty.
     */
    public peekLast(): T | null {
        return this.#backend.list.last() ?? null;
    }

    /**
     * Retrieves and removes the head (first element) of this list.
     *
     * @returns The first element, extracted from the list.
     */
    public poll(): T {
        const result = this.element();
        this.#backend.list = this.#backend.list.shift();
        --this.end;

        return result;
    }

    /**
     * Retrieves and removes the first element of this list, or returns null if this list is empty.
     *
     * @returns The first entry.
     */
    public pollFirst(): T | null {
        const result = this.#backend.list.first();
        this.#backend.list = this.#backend.list.shift();
        --this.end;

        return result ?? null;
    }

    /**
     *  Retrieves and removes the last element of this list, or returns null if this list is empty.
     *
     * @returns The last entry.
     */
    public pollLast(): T | null {
        const result = this.#backend.list.last();
        this.#backend.list = this.#backend.list.pop();
        --this.end;

        return result ?? null;
    }

    /**
     * Pops an element from the stack represented by this list.
     *
     * @returns The previously last element.
     */
    public pop(): T {
        // Note: push and pop in Java operate at the begin of the list, not the end (like in TS).
        const result = this.getFirst(); // Throws if the list is empty.
        this.#backend.list = this.#backend.list.shift();
        --this.end;

        return result;
    }

    /**
     * Pushes an element onto the stack represented by this list.
     *
     * @param e The element to add.
     */
    public push(e: T): void {
        this.addFirst(e);
    }

    /** Removes first element or the element at the specified position in this list. */
    public remove(index?: number): T;
    /** Removes the first occurrence of the specified element from this list, if it is present. */
    public remove(o: T): boolean;
    public remove(indexOrO?: number | T): T | boolean {
        if (indexOrO === undefined) {
            return this.pop();
        } else {
            if (this.#backend.list.size === 0) {
                throw new java.lang.NoSuchElementException();
            }

            if (typeof indexOrO === "number") {
                const result = this.get(indexOrO)!;
                this.#backend.list = this.#backend.list.remove(indexOrO);
                --this.end;

                return result;
            } else {
                const index = this.#backend.list.indexOf(indexOrO);

                if (index === -1) {
                    return false;
                }

                this.#backend.list = this.#backend.list.remove(index);
                --this.end;

                return true;
            }
        }
    }

    /**
     * Removes and returns the first element from this list.
     *
     * @returns the previously first element.
     */
    public removeFirst(): T {
        return this.pop();
    }

    /**
     * Removes the first occurrence of the specified element in this list (when traversing the list from head to tail).
     *
     * @param o The element to remove.
     *
     * @returns true if the element was in the list.
     */
    public removeFirstOccurrence(o: T): boolean {
        const index = this.#backend.list.indexOf(o);
        if (index > -1) {
            this.#backend.list = this.#backend.list.remove(index);
            --this.end;
        }

        return index > -1;
    }

    /**
     *  Removes and returns the last element from this list.
     *
     * @returns the previously last element.
     */
    public removeLast(): T {
        const result = this.getLast();
        this.#backend.list = this.#backend.list.pop();
        --this.end;

        return result;
    }

    /**
     * Removes the last occurrence of the specified element in this list(when traversing the list from head to tail).
     *
     * @param o the element to remove.
     *
     * @returns true if the element was found, otherwise false.
     */
    public removeLastOccurrence(o: T): boolean {
        const index = this.#backend.list.lastIndexOf(o);
        if (index > -1) {
            this.#backend.list = this.#backend.list.remove(index);
            --this.end;
        }

        return index > -1;
    }

    /**
     * Replaces the element at the specified position in this list with the specified element.
     *
     * @param index The index to change.
     * @param element The new element to set at the given index.
     *
     * @returns The previous element at that index.
     */
    public set(index: number, element: T): T {
        const result = this.get(index);

        this.#backend.list = this.#backend.list.set(index, element);

        return result;
    }

    /** @returns the number of elements in this list. */
    public size(): number {
        return this.#backend.list.count();
    }

    /** Returns an array containing all of the elements in this list in proper sequence(from first to last element). */
    public toArray(): T[];
    /**
     * Returns an array containing all of the elements in this list in proper sequence(from first to last element)
     * the runtime type of the returned array is that of the specified array.
     */
    public toArray<U>(a: U[]): U[];
    public toArray<U>(_a?: U[]): T[] | U[] {
        return this.#backend.list.toArray();
    }

    public iterator(): java.util.Iterator<T> {
        return new JavaIterator(this.#backend.list[Symbol.iterator]());
    }

    public containsAll(c: java.util.Collection<T>): boolean {
        return this.#backend.list.isSuperset(c);
    }

    public isEmpty(): boolean {
        return this.#backend.list.isEmpty();
    }

    public removeAll(c: java.util.Collection<T>): boolean {
        const list = this.#backend.list.filterNot((element) => {
            return c.contains(element);
        });

        const changeCount = list.count() - this.#backend.list.count();

        // Filtering always creates a new instance.
        this.#backend.list = list;
        this.end += changeCount;

        return changeCount !== 0;
    }

    public retainAll(c: java.util.Collection<T>): boolean {
        const list = this.#backend.list.filter((element) => {
            return c.contains(element);
        });

        const changeCount = list.count() - this.#backend.list.count();
        this.#backend.list = list;
        this.end += changeCount;

        return changeCount !== 0;
    }

    public subList(fromIndex: number, toIndex: number): java.util.List<T> {
        const list = new LinkedList<T>();
        list.#backend.list = this.#backend.list;
        list.start = this.start + fromIndex;
        list.end = this.start + toIndex;

        return list;
    }

    public hashCode(): number {
        return this.#backend.list.hashCode();
    }

    public equals(obj: unknown): boolean {
        if (this === obj) {
            return true;
        }

        if (!(obj instanceof LinkedList)) {
            return false;
        }

        return this.#backend.list.equals(obj.#backend.list);
    }
}
