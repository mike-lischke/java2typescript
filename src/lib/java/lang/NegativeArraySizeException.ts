/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { S } from "../../templates";
import { java } from "../java";
import { RuntimeException } from "./RuntimeException";

export class NegativeArraySizeException extends RuntimeException {
    public constructor(message?: java.lang.String) {
        super(message ?? S`A negative array size is invalid.`);
    }
}
