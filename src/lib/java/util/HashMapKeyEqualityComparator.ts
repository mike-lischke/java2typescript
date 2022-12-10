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
 * A specialized comparator implementation for hash maps. It only takes keys of map entries into account.
 */
export class HashMapKeyEqualityComparator<K, V> implements JavaEqualityComparator<HashMapEntry<K, V>> {
    /**
     * Computes the hash code of the key of the given hash map entry.
     *
     * @param value The hash map entry for which to compute the key hash.
     *
     * @returns The computed hash code.
     */
    public hashCode(value: HashMapEntry<K, V>): number {
        return MurmurHash.valueHash(value.getKey());
    }

    /**
     * Determines the equality of two hash map entries (considering only their keys).
     *
     * @param a First value to compare.
     * @param b Second value to compare.
     *
     * @returns True if both are equal, otherwise false.
     */
    public equals(a: HashMapEntry<K, V>, b: HashMapEntry<K, V>): boolean {
        const key1 = a.getKey();
        const key2 = b.getKey();
        if (a === b || key1 === key2) {
            return true;
        }

        // If we have primitive values and they failed the equality check above then they cannot be equal.
        // No need to compute hash codes for them.
        if (typeof key1 === "boolean" || typeof key1 === "number" || typeof key1 === "string") {
            return false;
        }

        if (isEquatable(key1) && isEquatable(key2)) {
            return key1.equals(key2);
        }

        if (Array.isArray(key1) && Array.isArray(key2)) {
            return java.util.Arrays.equals(key1, key2);
        }

        return this.hashCode(a) === this.hashCode(b);
    }
}
