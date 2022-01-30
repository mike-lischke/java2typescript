/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, Mike Lischke
 *
 * See LICENSE file for more info.
 */

/* eslint-disable @typescript-eslint/naming-convention */

export class Integer {
    public static readonly MAX_VALUE = Number.MAX_SAFE_INTEGER;
    public static readonly MIN_VALUE = Number.MIN_SAFE_INTEGER;

    public static parseInt(s: string, radix = 10): number {
        return parseInt(s, radix);
    }
}
