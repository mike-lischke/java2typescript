/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/* eslint-disable @typescript-eslint/naming-convention */

import { final } from "../../Decorators";
import { java } from "../java";

/**
 * The Character class wraps a value of the primitive type char in an object. An object of type Character contains a
 * single field whose type is char.
 * In addition, this class provides several methods for determining a character's category (lowercase letter, digit,
 * etc.) and for converting characters from uppercase to lowercase and vice versa.
 *
 * Character information is based on the Unicode Standard, version 6.0.0.
 */
@final
export class Character {
    public UnicodeBlock = class {
        public static readonly BASIC_LATIN = 1;

        public static of = (_c: java.lang.char): number => {
            return 0;
        };

    };

    public static isISOControl = (_c: java.lang.char): boolean => {
        return false;
    };

    public static isDigit(c: java.lang.char): boolean {
        return String.fromCodePoint(c).match(/0-9/) !== null;
    }

    public static toString(c: java.lang.char): string {
        return String.fromCodePoint(c);
    }

    public static toUpperCase(s: string): string {
        return s.toUpperCase();
    }

    public static toLowerCase(s: string): string {
        return s.toLowerCase();
    }
}
