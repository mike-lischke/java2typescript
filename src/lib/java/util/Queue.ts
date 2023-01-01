/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { Collection } from "./Collection";

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface Queue<T> extends Omit<Collection<T>, "remove"> {
    /**
     * Inserts the specified element into this queue if it is possible to do so immediately without violating
     * capacity restrictions, returning true upon success and throwing an IllegalStateException if no space is
     * currently available.
     */
    add(e: T): boolean;

    /** Retrieves, but does not remove, the head of this queue. */
    element(): T;

    /**
     * Inserts the specified element into this queue if it is possible to do so immediately without violating
     * capacity restrictions.
     */
    offer(e: T): boolean;

    /** Retrieves, but does not remove, the head of this queue, or returns null if this queue is empty. */
    peek(): T | null;

    /** Retrieves and removes the head of this queue, or returns null if this queue is empty. */
    poll(): T | null;

    /** Retrieves and removes the head of this queue. */
    remove(): T;

}
