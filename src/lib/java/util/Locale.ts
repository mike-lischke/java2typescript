/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../java";
import { JavaObject } from "../lang/Object";

/** This class has no meaningful implementation and exist only to satisfy call signatures. */
export class Locale extends JavaObject implements java.lang.Cloneable<Locale> {
    public static getDefault(): Locale {
        return new Locale();
    }

    public clone(): Locale {
        return this;
    }
}
