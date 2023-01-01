/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../java";
import { Queue } from "./Queue";

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface Deque<T> extends Queue<T> {
    /**
     * Inserts the specified element into the queue represented by this deque(in other words, at the tail of this
     * deque) if it is possible to do so immediately without violating capacity restrictions, returning true upon
     * success and throwing an IllegalStateException if no space is currently available.;
     */
    add(e: T): boolean;

    /**
     * Inserts the specified element at the front of this deque if it is possible to do so immediately without
     * violating capacity restrictions.
     */
    addFirst(e: T): void;

    /**
     * Inserts the specified element at the: Tnd of this deque if it is possible to do so immediately without
     * violating capacity restrictions.
     */
    addLast(e: T): void;

    /** Returns true if this deque contains the specified element. */
    contains(o: T): boolean;

    /** Returns an iterator over the elements in this deque in reverse sequential order. */
    descendingIterator(): java.util.Iterator<T>;

    /**
     *  Retrieves, but does not remove, the head of the queue represented by this deque(in other words, the first
     * element of this deque).
     */
    element(): T;

    /** Retrieves, but does not remove, the first element of this deque. */
    getFirst(): T;

    /** Retrieves, but does not remove, the last element of this deque. */
    getLast(): T;

    /**
     * Inserts the specified element into the queue represented by this deque(in other words, at the tail of this
     * deque) if it is possible to do so immediately without violating capacity restrictions, returning true upon
     * success and false if no space is currently available.
     */
    offer(e: T): boolean;

    /** Inserts the specified element at the front of this deque unless it would violate capacity restrictions. */
    offerFirst(e: T): boolean;

    /** Inserts the specified element at the: Tnd of this deque unless it would violate capacity restrictions. */
    offerLast(e: T): boolean;

    /**
     * Retrieves, but does not remove, the head of the queue represented by this deque (in other words, the first
     * element of this deque), or returns null if this deque is empty.
     */
    peek(): T | null;

    /** Retrieves, but does not remove, the first element of this deque, or returns null if this deque is empty. */
    peekFirst(): T | null;

    /** Retrieves, but does not remove, the last element of this deque, or returns null if this deque is empty. */
    peekLast(): T | null;

    /**
     * Retrieves and removes the head of the queue represented by this deque(in other words, the first element of
     * this deque), or returns null if this deque is empty.
     */
    poll(): T | null;

    /** Retrieves and removes the first element of this deque, or returns null if this deque is empty.; */
    pollFirst(): T | null;

    /** Retrieves and removes the last element of this deque, or returns null if this deque is empty. */
    pollLast(): T | null;

    /** Pops an element from the stack represented by this deque.; */
    pop(): T;

    /**
     * Pushes an element onto the stack represented by this deque(in other words, at the head of this deque) if it is
     * possible to do so immediately without violating capacity restrictions, returning true upon success and throwing
     * an IllegalStateException if no space is currently available.
     */
    push(e: T): void;

    /**
     * Retrieves and removes the head of the queue represented by this deque(in other words, the first element of
     * this deque).
     */
    remove(): T;

    /** Removes the first occurrence of the specified element from this deque. */
    remove(o: T): boolean;

    /** Retrieves and removes the first element of this deque. */
    removeFirst(o: T): void;

    /** Removes the first occurrence of the specified element from this deque. */
    removeFirstOccurrence(o: T): boolean;

    /** Retrieves and removes the last element of this deque. */
    removeLast(): T;

    /** Removes the last occurrence of the specified element from this deque. */
    removeLastOccurrence(o: T): boolean;

    /** Returns the number of elements in this deque.; */
    size(): number;
}
