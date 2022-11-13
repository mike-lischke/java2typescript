/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../java";

import { JavaEqualityComparator } from "../../JavaEqualityComparator";
import { MurmurHash } from "../../MurmurHash";
import { HashMapEntry } from "./HashMapEntry";
import { isEquatable } from "../../helpers";

/**
 * A specialized comparator implementation for hash maps. It only takes values of map entries into account.
 */
export class HashMapValueEqualityComparator<K, V> implements JavaEqualityComparator<HashMapEntry<K, V>> {
    /**
     * Computes the hash code of the value of the given hash map entry.
     *
     * @param value The hash map entry for which to compute the value hash.
     *
     * @returns The computed hash code.
     */
    public hashCode = (value: HashMapEntry<K, V>): number => {
        return MurmurHash.valueHash(value.getValue());
    };

    /**
     * Determines the equality of two hash map entries (considering only their values).
     *
     * @param a The has map entry to compare.
     * @param b The value for comparison.
     *
     * @returns True if the entry's value equals the given value, otherwise false.
     */
    public equals = (a: HashMapEntry<K, V>, b: HashMapEntry<K, V>): boolean => {
        const value1 = a.getValue();
        const value2 = b.getValue();
        if (value1 === value2) {
            return true;
        }

        // If we have primitive values and they failed the equality check above then they cannot be equal.
        // No need to compute hash codes for them.
        if (typeof value1 === "boolean" || typeof value1 === "number" || typeof value1 === "string") {
            return false;
        }

        if (isEquatable(value1) && isEquatable(value2)) {
            return value1.equals(value2);
        }

        if (Array.isArray(value1) && Array.isArray(value2)) {
            return java.util.Arrays.equals(value1, value2);
        }

        return false;
    };
}
