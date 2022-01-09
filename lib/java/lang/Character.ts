/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, Mike Lischke
 *
 * See LICENSE file for more info.
 */

/* eslint-disable max-classes-per-file, @typescript-eslint/no-namespace, no-redeclare,
                  @typescript-eslint/naming-convention,
*/

// A partial implementation of the Java Character class.

export class Character {
    public static isISOControl = (c: number): boolean => {
        return false;
    };

    public static isDigit(s: string): boolean {
        if (s.length !== 1) {
            return false;
        }

        return s.match(/0-9/).length > 0;
    }

    public static toString(s: string): string {
        return s;
    }

    public static toUpperCase(s: string): string {
        return s.toUpperCase();
    }

    public static toLowerCase(s: string): string {
        return s.toLowerCase();
    }

}

export namespace Character {
    export class UnicodeBlock {
        public static readonly BASIC_LATIN = 1;

        public static of = (c: number): number => {
            return 0;
        };

    }
}
