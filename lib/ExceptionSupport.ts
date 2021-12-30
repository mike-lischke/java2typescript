/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, Mike Lischke
 *
 * See LICENSE file for more info.
 */

/* eslint-disable max-classes-per-file */

export class IllegalArgumentException extends Error {}

/**
 * @deprecated Don't use this exception. It is never thrown when converting strings to numbers.
 */
export class NumberFormatException extends Error {

}
