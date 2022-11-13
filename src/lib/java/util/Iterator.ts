/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/* eslint-disable @typescript-eslint/naming-convention */

export interface Iterator<T> {
    /** Returns true if the iteration has more elements. */
    hasNext(): boolean;

    /** Returns the next element in the iteration. */
    next(): T;

    /** Removes from the underlying collection the last element returned by this iterator (optional operation). */
    remove(): void;
}
