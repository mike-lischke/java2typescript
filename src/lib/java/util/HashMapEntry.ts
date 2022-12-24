/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../java";

import { MurmurHash } from "../../MurmurHash";

export class HashMapEntry<K, V> implements java.util.Map.Entry<K, V> {
    private computedHash: number | undefined;

    public constructor(private key: K, private value: V) {
    }

    public equals(o: unknown): boolean {
        if (!(o instanceof HashMapEntry)) {
            return false;
        }

        let keysEqual = false;
        if (this.key == null) {
            if (o.key == null) {
                keysEqual = true;
            }
        } else if (o.key != null) {
            keysEqual = MurmurHash.hashCode(this.key) === MurmurHash.hashCode(o.key);
        }

        let valuesEqual = false;
        if (this.value == null) {
            if (o.value == null) {
                valuesEqual = true;
            }
        } else if (o.value != null) {
            valuesEqual = MurmurHash.hashCode(this.value) === MurmurHash.hashCode(o.value);
        }

        return keysEqual && valuesEqual;
    }

    public getKey(): K {
        return this.key;
    }

    public getValue(): V {
        return this.value;
    }

    public hashCode(): number {
        if (this.computedHash === undefined) {
            this.computedHash = (this.key === null ? 0 : MurmurHash.hashCode(this.key))
                ^ (this.value === null ? 0 : MurmurHash.hashCode(this.value));
        }

        return this.computedHash;
    }

    public setValue(value: V): V {
        const temp = this.value;
        this.value = value;
        this.computedHash = undefined;

        return temp;
    }
}
