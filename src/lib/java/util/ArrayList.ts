/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { is, List } from "immutable";

import { java } from "../java";
import { JavaObject } from "../lang/Object";

import { JavaIterator } from "../../JavaIterator";
import { IListIteratorBackend, ListIteratorImpl } from "./ListIteratorImpl";

export class ArrayList<T> extends JavaObject implements java.util.List<T> {

    private start: number;
    private end: number;

    #backend: IListIteratorBackend<T>;

    public constructor(input?: java.util.Collection<T> | T[] | Set<T> | number) {
        super();

        if (input === undefined || typeof input === "number") { // Initial count is ignored.
            this.#backend = { list: List<T>() };
        } else {
            this.#backend = { list: List(input) };
        }

        this.start = 0;
        this.end = this.#backend.list.count();
    }

    public *[Symbol.iterator](): IterableIterator<T> {
        yield* this.#backend.list;
    }

    public add(element: T): boolean;
    public add(index: number, element: T): void;
    public add(indexOrElement: number | T, element?: T): void | boolean {
        ++this.end;
        if (typeof indexOrElement === "number") {
            this.#backend.list = this.#backend.list.splice(this.start + indexOrElement, 0, element!);
        } else {
            this.#backend.list = this.#backend.list.splice(this.end, 0, indexOrElement);

            return true;
        }
    }

    public addAll(c: java.util.Collection<T>): boolean;
    public addAll(index: number, c: java.util.Collection<T>): boolean;
    public addAll(indexOrCollection: number | java.util.Collection<T>, c?: java.util.Collection<T>): boolean {
        let a;
        if (typeof indexOrCollection === "number") {
            a = c!.toArray();
            this.#backend.list = this.#backend.list.splice(this.start + indexOrCollection, 0, ...a);
        } else {
            a = indexOrCollection.toArray();
            this.#backend.list = this.#backend.list.splice(this.end, 0, ...a);
        }
        this.end += a.length;

        return true;
    }

    public clear(): void {
        this.#backend.list = this.#backend.list.splice(this.start, this.end - this.start);
        this.end = this.start;
    }

    public contains(element: T): boolean {
        const index = this.#backend.list.findIndex((value, i) => {
            if (i < this.start || i >= this.end) {
                return false;
            }

            return is(element, value);
        });

        return index > -1;
    }

    public containsAll(c: java.util.Collection<T>): boolean {
        let target = this.#backend.list;
        if (this.start > 0 || this.end < this.#backend.list.count()) {
            target = this.#backend.list.slice(this.start, this.end);
        }

        for (const element of c) {
            if (!target.includes(element)) {
                return false;
            }
        }

        return true;
    }

    public equals(other: unknown): boolean {
        if (this === other) {
            return true;
        }

        if (!(other instanceof ArrayList)) {
            return false;
        }

        if (this.start !== other.start || this.end !== other.end) {
            return false;
        }

        if (this.start > 0 || this.end < this.#backend.list.count()) {
            return this.#backend.list.slice(this.start, this.end)
                .equals(other.#backend.list.slice(other.start, other.end));
        }

        return this.#backend.list.equals(other.#backend);
    }

    public get(index: number): T {
        if (index < 0 || this.start + index >= this.end) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        return this.#backend.list.get(this.start + index)!;
    }

    public hashCode(): number {
        return this.#backend.list.hashCode();
    }

    public indexOf(element: T): number {
        const index = this.#backend.list.indexOf(element);
        if (index < this.start) {
            return index;
        }

        return index - this.start;
    }

    public isEmpty(): boolean {
        return this.end - this.start <= 0;
    }

    public iterator(): java.util.Iterator<T> {
        return new JavaIterator(this.#backend.list[Symbol.iterator]());
    }

    public lastIndexOf(element: T): number {
        if (this.isEmpty()) {
            return -1;
        }

        if (this.start > 0 || this.end < this.#backend.list.count()) {
            const temp = this.#backend.list.slice(this.start, this.end);

            return temp.lastIndexOf(element);
        }

        return this.#backend.list.lastIndexOf(element);
    }

    public listIterator(index = 0): java.util.ListIterator<T> {
        return new ListIteratorImpl(this.#backend, this.start + index, this.end);
    }

    public remove(index: number): T;
    public remove(element: T): boolean;
    public remove(elementOrIndex: T | number): boolean | T {
        if (typeof elementOrIndex === "number") {
            --this.end;

            const result = this.#backend.list.get(elementOrIndex)!;
            this.#backend.list = this.#backend.list.splice(this.start + elementOrIndex, 1);

            return result;
        } else {
            const index = this.#backend.list.indexOf(elementOrIndex);
            if (this.start <= index && index < this.end) {
                this.#backend.list.splice(index, 1);
                --this.end;

                return true;
            }

            return false;
        }
    }

    public removeAll(c: java.util.Collection<T>): boolean {
        const oldSize = this.#backend.list.count();
        this.#backend.list = this.#backend.list.filterNot((value) => {
            return c.contains(value);
        });

        if (this.#backend.list.count() < oldSize) {
            this.end -= oldSize - this.#backend.list.count();

            return true;
        }

        return false;
    }

    public retainAll(c: java.util.Collection<T>): boolean {
        const oldSize = this.#backend.list.count();
        this.#backend.list = this.#backend.list.filter((value) => {
            return c.contains(value);
        });

        if (this.#backend.list.count() < oldSize) {
            this.end -= oldSize - this.#backend.list.count();

            return true;
        }

        return false;
    }

    public set(index: number, element: T): T {
        if (index < 0 || index >= this.end) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        const result = this.#backend.list.get(this.start + index)!;
        this.#backend.list = this.#backend.list.set(this.start + index, element);

        return result;
    }

    public size(): number {
        return this.end - this.start;
    }

    public subList(fromIndex: number, toIndex: number): java.util.List<T> {
        const list = new ArrayList<T>();
        list.#backend = this.#backend;
        list.start = fromIndex;
        list.end = toIndex;

        return list;
    }

    public toArray(): T[];
    public toArray<T2 extends T>(a: T2[]): T2[];
    public toArray<T2 extends T>(a?: T2[]): T2[] | T[] {
        let target = this.#backend.list;
        if (this.start > 0 || this.end < this.#backend.list.count()) {
            target = this.#backend.list.slice(this.start, this.end);
        }

        if (a) {
            return target.toArray() as T2[];
        }

        return target.toArray();
    }
}
