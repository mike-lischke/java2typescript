/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../java";

/** Implements the Java Object semantics. */
export class JavaObject {
    private static nextId = 0;

    // Represents the default hash code of a Java object. Using a running number here.
    readonly #id;

    public constructor() {
        this.#id = JavaObject.nextId++;
    }

    public static get class(): java.lang.Class<JavaObject> {
        return java.lang.Class.fromConstructor(this.constructor as typeof JavaObject);
    }

    /**
     * Indicates whether some other object is "equal to" this one.
     *
     * @param obj The object to compare this instance to.
     *
     * @returns True if the given object is the same as this object.
     */
    public equals(obj: unknown): boolean {
        return obj === this; // Identity or reference equality, by default.
    }

    /** @returns the runtime class of this JavaObject. */
    public getClass(): java.lang.Class<JavaObject> {
        return java.lang.Class.fromConstructor(this.constructor as typeof JavaObject);
    }

    /** @returns a hash code value for the object. */
    public hashCode(): number {
        return this.#id;
    }

    /** Wakes up a single thread that is waiting on this object's monitor. */
    public notify(): void {
        // No implementation needed.
    }

    /** Wakes up all threads that are waiting on this object's monitor. */
    public notifyAll(): void {
        // No implementation needed.
    }

    /** @returns a string representation of the object. */
    public toString(): java.lang.String | null {
        return new java.lang.String(`${this.constructor.name}@${this.#id.toString(16)}`);
    }

    /**
     * Causes the current thread to wait until either another thread invokes the notify() method or the notifyAll()
     * method for this object, or a specified amount of time has elapsed.
     *
     * @param _timeout tbd
     * @param _nanos tbd
     */
    public wait(_timeout?: number, _nanos?: number): void {
        // No implementation needed.
    }

    /** Creates and returns a copy of this object. */
    protected clone(): JavaObject {
        throw new java.lang.CloneNotSupportedException();
    }

    protected [Symbol.toPrimitive](_hint: string): bigint | number | boolean | string | null {
        return `${this.toString()}`;
    }

}
