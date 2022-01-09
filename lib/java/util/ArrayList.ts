/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

/* eslint-disable @typescript-eslint/no-namespace */

import hash_sum from "hash-sum";

import { List } from "./List";

import { ArrayListIterator, Collection, ListIterator } from ".";
import { IndexOutOfBoundsException } from "../lang";

export class ArrayList<T> extends List<T> {

    private buffer: T[];

    public constructor(input?: Collection<T> | T[] | number) {
        super();

        if (input === undefined) {
            this.buffer = [];
        } else if (typeof input === "number") {
            this.buffer = new Array(input);
        } else if (Array.isArray(input)) {
            this.buffer = input;
        } else {
            this.buffer = input.toArray();
        }
    }

    public add(element: T): boolean;
    public add(index: number, element: T): void;
    public add(indexOrElement: number | T, element?: T): void | boolean {
        if (typeof indexOrElement === "number") {
            this.buffer.splice(indexOrElement, 0, element);
        } else {
            this.buffer.push(indexOrElement);

            return true;
        }
    }

    public addAll(c: Collection<T>): boolean;
    public addAll(index: number, c: Collection<T>): boolean;
    public addAll(indexOrCollection: number | Collection<T>, c?: Collection<T>): boolean {
        const a = c.toArray();
        if (typeof indexOrCollection === "number") {
            this.buffer.splice(indexOrCollection, 0, ...a);
        } else {
            this.buffer.push(...a);
        }

        return true;
    }

    public clear(): void {
        this.buffer = [];
    }

    public contains(element: T): boolean {
        return this.buffer.includes(element);
    }

    public containsAll(c: Collection<T>): boolean {
        for (const element of c) {
            if (!this.buffer.includes(element)) {
                return false;
            }
        }

        return true;
    }

    public equals(other: ArrayList<T>): boolean {
        return this.buffer.length === other.buffer.length && this.buffer.every((value, index) => {
            return value === other.buffer[index];
        });
    }

    public get(index: number): T {
        if (index < 0 || index >= this.buffer.length) {
            throw new IndexOutOfBoundsException();
        }

        return this.buffer[index];
    }

    public hashCode(): number {
        return parseInt(hash_sum(this.buffer), 16);
    }

    public indexOf(element: T): number {
        return this.buffer.indexOf(element);
    }

    public isEmpty(): boolean {
        return this.buffer.length === 0;
    }

    public iterator(): Iterator<T> {
        return this[Symbol.iterator]();
    }

    public lastIndexOf(element: T): number {
        return this.buffer.lastIndexOf(element);
    }

    public listIterator(index?: number): ListIterator<T> {
        return new ArrayListIterator(this.buffer, index);
    }

    public remove(index: number): T;
    public remove(element: T): boolean;
    public remove(elementOrIndex: T | number): boolean | T {
        if (typeof elementOrIndex === "number") {
            return this.buffer.splice(elementOrIndex, 1)[0];
        } else {
            const index = this.buffer.indexOf(elementOrIndex);
            if (index > -1) {
                this.buffer.splice(index, 1);

                return true;
            }

            return false;
        }
    }

    public removeAll(c: Collection<T>): boolean {
        let result = false;

        for (const element of c) {
            const index = this.buffer.indexOf(element);
            if (index > -1) {
                this.buffer.splice(index, 1);
                result = true;
            }
        }

        return result;
    }

    public retainAll(c: Collection<T>): boolean {
        let result = false;

        const newList: T[] = [];
        for (const element of c) {
            if (this.buffer.includes(element)) {
                newList.push(element);

                result = true;
            }
        }
        this.buffer = newList;

        return result;
    }

    public set(index: number, element: T): T {
        if (index < 0 || index >= this.buffer.length) {
            throw new IndexOutOfBoundsException();
        }

        return this.buffer.splice(index, 1, element)[0];
    }

    public size(): number {
        return this.buffer.length;
    }

    public subList(_fromIndex: number, _toIndex: number): List<T> {
        throw new Error("Unsupported operation");
    }

    public toArray(): T[];
    public toArray<T2 extends T>(a: T2[]): T2[];
    public toArray<T2 extends T>(a?: T2[]): T2[] | T[] {
        if (a) {
            return this.buffer as T2[];
        }

        return this.buffer;
    }
}
