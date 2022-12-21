/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { isArrayLike, isEquatable } from "../../helpers";
import { MurmurHash } from "../../MurmurHash";
import { S } from "../../templates";
import { java } from "../java";
import { JavaObject } from "../lang/Object";
import { Arrays } from "./Arrays";

export class Objects extends JavaObject {
    /** Returns 0 if the arguments are identical and c.compare(a, b) otherwise. */
    public static compare<T>(a: T, b: T, c: java.util.Comparator<T>): number {
        if (a === b) {
            return 0;
        }

        return c.compare(a, b);
    }

    /** Returns true if the arguments are deeply equal to each other and false otherwise. */
    public static deepEquals(a: java.lang.Object | ArrayLike<unknown> | null,
        b: java.lang.Object | ArrayLike<unknown> | null): boolean {
        if (a === b) {
            return true;
        }

        if (!a || !b) {
            return false;
        }

        if (isArrayLike(a)) {
            if (isArrayLike(b)) {
                return Arrays.deepEquals(a, b);
            }

            return false;
        }

        if (isArrayLike(b)) {
            return false;
        }

        if (isEquatable(a)) {
            return a.equals(b);
        }

        return a === b;
    }

    /** Returns true if the arguments are equal to each other and false otherwise. */
    public static equals(a: java.lang.Object | null, b: java.lang.Object | null): boolean {
        if (a === b) {
            true;
        }

        if (!a || !b) {
            return false;
        }

        return a.equals(b);
    }

    /** Generates a hash code for a sequence of input values. */
    public static hash(...values: unknown[]): number {
        return MurmurHash.valueHash(values, 37);
    }

    /** Returns the hash code of a non - null argument and 0 for a null argument. */
    public static hashCode(o: java.lang.Object | null): number {
        if (o === null) {
            return 0;
        }

        return o.hashCode();
    }

    /** Checks that the specified object reference is not null. */
    public static requireNonNull<T>(obj: T, message?: java.lang.String): T {
        if (obj === null) {
            throw new java.lang.NullPointerException(message);
        }

        return obj;
    }

    /** Returns the result of calling toString on the first argument if the first argument is not null and returns the second argument otherwise.; */
    public static toString(o: java.lang.Object | null, nullDefault?: java.lang.String): java.lang.String {
        if (o === null) {
            return nullDefault ?? S`null`;
        }

        return o.toString();
    }
}
