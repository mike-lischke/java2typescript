/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../java";

import { ArrayListIterator } from ".";
import { MurmurHash } from "../../MurmurHash";

export class ArrayList<T> implements java.util.List<T> {

    private buffer: T[];
    private start: number;
    private end: number;

    public constructor(input?: java.util.Collection<T> | T[] | Set<T> | number) {
        if (input === undefined) {
            this.buffer = [];
        } else if (typeof input === "number") {
            this.buffer = new Array(input);
        } else if (Array.isArray(input)) {
            this.buffer = input;
        } else if (input instanceof Set<T>) {
            this.buffer = Array.from(input);
        } else {
            this.buffer = input.toArray();
        }

        this.start = 0;
        this.end = this.buffer.length;
    }

    public *[Symbol.iterator](): IterableIterator<T> {
        yield* this.buffer;
    }

    public add(element: T): boolean;
    public add(index: number, element: T): void;
    public add(indexOrElement: number | T, element?: T): void | boolean {
        ++this.end;
        if (typeof indexOrElement === "number") {
            this.buffer.splice(this.start + indexOrElement, 0, element!);
        } else {
            this.buffer.splice(this.end, 0, indexOrElement);

            return true;
        }
    }

    public addAll(c: java.util.Collection<T>): boolean;
    public addAll(index: number, c: java.util.Collection<T>): boolean;
    public addAll(indexOrCollection: number | java.util.Collection<T>, c?: java.util.Collection<T>): boolean {
        let a;
        if (typeof indexOrCollection === "number") {
            a = c!.toArray();
            this.buffer.splice(this.start + indexOrCollection, 0, ...a);
        } else {
            a = indexOrCollection.toArray();
            this.buffer.splice(this.end, 0, ...a);
        }
        this.end += a.length;

        return true;
    }

    public clear(): void {
        this.buffer = [];
        this.start = 0;
        this.end = 0;
    }

    public contains(element: T): boolean {
        if (this.end < this.buffer.length) {
            // Have to make a temporary copy, because there's no way to limit search to a specific end index.
            const temp = this.buffer.slice(this.start, this.end);

            return temp.includes(element);
        }

        return this.buffer.includes(element, this.start);
    }

    public containsAll(c: java.util.Collection<T>): boolean {
        let target = this.buffer;
        if (this.end < this.buffer.length) {
            target = this.buffer.slice(this.start, this.end);
        }

        for (const element of c) {
            if (!target.includes(element)) {
                return false;
            }
        }

        return true;
    }

    public equals(other: ArrayList<T>): boolean {
        if (this.start !== other.start || this.end !== other.end) {
            return false;
        }

        return this.buffer.every((value, index) => {
            if (index < this.start || index >= this.end) {
                return true;
            }

            return value === other.buffer[index];
        });
    }

    public get(index: number): T {
        if (index < this.start || index >= this.end) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        return this.buffer[index];
    }

    public hashCode(): number {
        let hash = MurmurHash.initialize(11);
        for (let i = this.start; i < this.end; ++i) {
            hash = MurmurHash.update(hash, this.buffer[i]);
        }
        hash = MurmurHash.finish(hash, this.end - this.start);

        return hash;
    }

    public indexOf(element: T): number {
        return this.buffer.indexOf(element) - this.start;
    }

    public isEmpty(): boolean {
        return this.end - this.start <= 0;
    }

    public iterator(): java.util.Iterator<T> {
        return new ArrayListIterator(this.buffer);
    }

    public lastIndexOf(element: T): number {
        if (this.isEmpty()) {
            return -1;
        }

        if (this.start > 0) {
            const temp = this.buffer.slice(this.start, this.end);

            return temp.lastIndexOf(element);
        }

        return this.buffer.lastIndexOf(element, this.end - 1);
    }

    public listIterator(index?: number): java.util.ListIterator<T> {
        if (this.start > 0 || this.end < this.buffer.length) {
            return new ArrayListIterator(this.buffer.slice(this.start, this.end), true, index, this.end);
        }

        return new ArrayListIterator(this.buffer, true, index);
    }

    public remove(index: number): T;
    public remove(element: T): boolean;
    public remove(elementOrIndex: T | number): boolean | T {
        if (typeof elementOrIndex === "number") {
            --this.end;

            return this.buffer.splice(this.start + elementOrIndex, 1)[0];
        } else {
            const index = this.buffer.indexOf(elementOrIndex);
            if (this.start <= index && index < this.end) {
                this.buffer.splice(index, 1);
                --this.end;

                return true;
            }

            return false;
        }
    }

    public removeAll(c: java.util.Collection<T>): boolean {
        let result = false;

        for (const element of c) {
            const index = this.buffer.indexOf(element);
            if (this.start <= index && index < this.end) {
                this.buffer.splice(index, 1);
                --this.end;
                result = true;
            }
        }

        return result;
    }

    public retainAll(c: java.util.Collection<T>): boolean {
        if (c.size() === 0) {
            return false;
        }

        let result = false;
        const newList: T[] = [];

        let target = this.buffer;
        if (this.start > 0 || this.end < this.buffer.length) {
            target = this.buffer.slice(this.start, this.end);
        }

        for (const element of c) {
            if (target.includes(element)) {
                newList.push(element);

                result = true;
            }
        }

        this.buffer.splice(this.start, this.end, ...newList);
        this.end = newList.length - this.end;

        return result;
    }

    public set(index: number, element: T): T {
        if (index - this.start < 0 || this.start + index >= this.end) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        return this.buffer.splice(this.start + index, 1, element)[0];
    }

    public size(): number {
        return this.end - this.start;
    }

    public subList(fromIndex: number, toIndex: number): java.util.List<T> {
        const list = new ArrayList<T>();
        list.buffer = this.buffer;
        list.start = fromIndex;
        list.end = toIndex;

        return list;
    }

    public toArray(): T[];
    public toArray<T2 extends T>(a: T2[]): T2[];
    public toArray<T2 extends T>(a?: T2[]): T2[] | T[] {
        let target = this.buffer;
        if (this.start > 0 || this.end < this.buffer.length) {
            target = this.buffer.slice(this.start, this.end);
        }

        if (a) {
            return target as T2[];
        }

        return target;
    }
}
