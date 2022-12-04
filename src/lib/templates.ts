/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/* eslint-disable @typescript-eslint/naming-convention */

import { java } from "./java/java";

// Tagged templates for emulation of automatic boxing of primitive values.

/**
 * Tagged template function to convert a string literal to `java.lang.String`.
 *
 * @param strings A list of strings in the string literal (all parts between expressions).
 * @param values The expressions used in string interpolation.
 *
 * @returns A `java.lang.String` instance with all strings concatenated.
 */
export const S = (strings: TemplateStringsArray, ...values: unknown[]): java.lang.String => {
    const entries: string[] = [];
    let i = 0;
    while (true) {
        entries.push(strings[i]);
        if (i < values.length) {
            entries.push(`${values[i++]}`);
        } else {
            break;
        }
    }

    return new java.lang.String(entries.join(""));
};

/**
 * Tagged template function to convert a number primitive value or a number string literal to `java.lang.Integer`.
 * Note: only one argument must be given, either a string or a number.
 *
 * @param strings A list of strings in the string literal (all parts between expressions).
 * @param values The expressions used in string interpolation.
 *
 * @returns A `java.lang.String` instance with all strings concatenated.
 */
export const I = (strings: TemplateStringsArray, ...values: number[]): java.lang.Integer => {
    if (values.length > 0) {
        return new java.lang.Integer(values[0]);
    }

    return new java.lang.Integer(strings[0]);
};

/**
 * Tagged template function to convert a boolean primitive value or a boolean string literal to `java.lang.Boolean`.
 * Note: only one argument must be given, either a string or a boolean.
 *
 * @param strings A list of strings in the string literal (all parts between expressions).
 * @param values The expressions used in string interpolation.
 *
 * @returns A `java.lang.String` instance with all strings concatenated.
 */
export const B = (strings: TemplateStringsArray, ...values: boolean[]): java.lang.Boolean => {
    if (values.length > 0) {
        return new java.lang.Boolean(values[0]);
    }

    return new java.lang.Boolean(strings[0]);
};
