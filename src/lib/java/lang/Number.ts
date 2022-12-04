/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { JavaObject } from "./Object";

export abstract class Number extends JavaObject {
    protected value = NaN;

    /** @returns the value of the specified number as a byte. */
    public byteValue(): number {
        return this.value & 0xFF;
    }

    /** @returns the value of the specified number as a double. */
    public doubleValue(): number {
        return this.value;
    }

    /** @returns the value of the specified number as a float. */
    public floatValue(): number {
        return this.value;
    }

    /** @returns the value of the specified number as an int. */
    public intValue(): number {
        return Math.round(this.value);
    }

    /** @returns the value of the specified number as a long. */
    public longValue(): bigint {
        return BigInt(Math.round(this.value));
    }

    /** @returns the value of the specified number as a short. */
    public shortValue(): number {
        return this.value & 0xFFFF;
    }

}
