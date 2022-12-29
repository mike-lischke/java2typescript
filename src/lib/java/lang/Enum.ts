/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../java";
import { JavaObject } from "./Object";

import { NotImplementedError } from "../../NotImplementedError";
import { MurmurHash } from "../../MurmurHash";

export class Enum<T extends Enum<T>> extends JavaObject {
    #name: java.lang.String = new java.lang.String();
    #ordinal = 0;

    protected constructor(name: java.lang.String, ordinal: number) {
        super();

        this.#name = name;
        this.#ordinal = ordinal;
    }

    /**
     * Returns the enum constant of the specified enum type with the specified name.;
     *
     * @param _enumType tbd
     * @param _name tbd
     */
    public static valueOf<T extends Enum<T>>(_enumType: java.lang.Class<JavaObject>, _name: java.lang.String): T {
        throw new NotImplementedError();
    }

    /** @returns a hash code for this enum constant. */
    public hashCode(): number {
        let result = MurmurHash.initialize(37);
        result = MurmurHash.update(result, this.#name);
        result = MurmurHash.update(result, this.#ordinal);

        return MurmurHash.finish(result, 2);
    }

    /** @returns the name of this enum constant, exactly as declared in its enum declaration. */
    public name(): java.lang.String {
        return this.#name;
    }

    /**
     * @returns the ordinal of this enumeration constant(its position in its enum declaration, where the initial
     * constant is assigned an ordinal of zero).
     */
    public ordinal(): number {
        return this.#ordinal;
    }

    /** @returns the name of this enum constant, as contained in the declaration. */
    public toString(): java.lang.String {
        return this.#name;
    }

    protected [Symbol.toPrimitive](hint: string): number | string {
        if (hint === "string") {
            return this.#ordinal.toString();
        }

        return this.#ordinal;
    }

}
