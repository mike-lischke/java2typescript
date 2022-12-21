/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "./java/java";
import { JavaObject } from "./java/lang/Object";

/** A JRE iterator which wraps a Typescript iterator. */
export class JavaIterator<T> extends JavaObject implements java.util.Iterator<T> {

    private nextValue: IteratorResult<T, T>;

    public constructor(private iterator: Iterator<T>) {
        super();
        this.nextValue = iterator.next();
    }

    public hasNext(): boolean {
        return !this.nextValue.done;
    }

    public next(): T {
        const result = this.nextValue;
        this.nextValue = this.iterator.next();

        return result.value;
    }

    public remove(): void {
        throw new java.lang.UnsupportedOperationException();
    }

}
