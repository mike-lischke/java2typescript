/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/* eslint-disable @typescript-eslint/naming-convention */

import { final } from "../../Decorators";
import { java } from "../java";

@final
export class BooleanImpl implements java.io.Serializable, java.lang.Comparable<BooleanImpl> {

    public static readonly TRUE: Boolean;
    public static readonly FALSE: Boolean;
    public static TYPE: java.lang.Class<Boolean>;

    private value = false;

    public constructor(value?: boolean | string) {
        if (value !== undefined) {
            if (typeof value === "boolean") {
                this.value = value;
            } else {
                this.value = value.toLowerCase() === "true";
            }
        }
    }

    /**
     * Parses the string argument as a boolean.
     *
     * @param s The string to parse.
     *
     * @returns The boolean value that corresponds to the given string, or `false` if no string was given.
     */
    public static parseBoolean(s?: string): boolean {
        return s !== undefined && s.toLowerCase() === "true";
    }

    /**
     * Returns a String object representing the specified boolean.
     *
     * @param b The value to convert.
     *
     * @returns a string representing this Boolean's value.
     */
    public static toString(b: boolean): string {
        return b ? "true" : "false";
    }

    /**
     * Returns a Boolean with a value represented by the specified string or boolean value.
     *
     * @param value tbd
     *
     * @returns tbd
     */
    public static valueOf(value?: boolean | string): BooleanImpl {
        return new BooleanImpl(value);
    }

    /**
     * Compares two boolean values.
     *
     * @param x tbd
     * @param y tbd
     *
     * @returns tbd
     */
    public static compare(x: boolean, y: boolean): number {
        if (x === y) {
            return 0;
        }

        if (!x && y) {
            return -1;
        }

        return 1;
    }

    /**
     * @returns true if and only if the system property named by the argument exists and is equal to the string "true".
     *
     * @param name tbd
     */
    public static getBoolean(name: string): boolean {
        const value = java.lang.System.getProperty(name);

        return value === "true";
    }

    /** @returns the value of this Boolean object as a boolean primitive. */
    public booleanValue(): boolean {
        return this.value;
    }

    /**
     * Compares this Boolean instance with another.
     *
     * @param b tbd
     *
     * @returns tbd
     */
    public compareTo(b: BooleanImpl): number {
        return BooleanImpl.compare(this.value, b.value);
    }

    /**
     * Returns true if and only if the argument is not null and is a Boolean object that represents the same boolean
     * value as this object.
     *
     * @param obj tbd
     *
     * @returns tbd
     */
    public equals(obj: unknown): boolean {
        if (obj === this) {
            return true;
        }

        if (obj instanceof BooleanImpl) {
            return this.value === obj.value;
        }

        return false;
    }

    /** @returns a hash code for this Boolean object. */
    public hashCode(): number {
        return 0;
    }

    /** @returns a string representing this Boolean's value. */
    public toString(): string {
        return this.value ? "true" : "false";
    }

    public valueOf(): boolean {
        return this.value;
    }
}

export const Boolean = BooleanImpl as unknown as new (value: boolean | string) => boolean;
