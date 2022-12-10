/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../java";
import { JavaObject } from "../lang/Object";

export class ArrayListIterator<T> extends JavaObject implements java.util.ListIterator<T> {

    // Holds the direction we navigated last (either by calling next() or previous()).
    private movedForward: boolean | undefined;

    // The current index in the iteration.
    private index: number;

    public constructor(
        private buffer: T[],
        private supportRemoval = true,
        private start = 0,
        private end = buffer.length) {
        super();
        if (start < 0 || end < 0 || start + end >= buffer.length) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        this.index = start;
    }

    public add(element: T): void {
        this.buffer.push(element);
    }

    public hasNext(): boolean {
        return this.index < this.end;
    }

    public hasPrevious(): boolean {
        return this.index > this.start;
    }

    public next(): T {
        if (this.index === this.end) {
            throw new java.lang.NoSuchElementException();
        }

        this.movedForward = true;

        return this.buffer[this.index++];
    }

    public nextIndex(): number {
        return this.index;
    }

    public previous(): T {
        if (this.index === this.start) {
            throw new java.lang.NoSuchElementException();
        }

        this.movedForward = false;

        return this.buffer[--this.index];
    }

    public previousIndex(): number {
        return this.index - 1;
    }

    public remove(): void {
        if (this.supportRemoval) {
            if (this.movedForward === undefined) {
                throw new java.lang.IllegalStateException();
            }

            if (this.movedForward) {
                // Index was moved to next element.
                this.buffer.splice(this.index - 1, 1);
            } else {
                // Index at last returned element.
                this.buffer.splice(this.index, 1);
            }
        } else {
            throw new java.lang.UnsupportedOperationException();
        }
    }

    public set(element: T): void {
        if (this.movedForward) {
            // Index was moved to next element.
            this.buffer[this.index - 1] = element;
        } else {
            // Index at last returned element.
            this.buffer[this.index] = element;
        }
    }

}

