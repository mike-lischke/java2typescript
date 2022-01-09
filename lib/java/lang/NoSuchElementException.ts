/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

export class NoSuchElementException extends Error {
    public constructor(message?: string) {
        super(message ?? "No element available");
    }
}
