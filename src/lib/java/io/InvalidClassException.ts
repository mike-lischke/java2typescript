/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../java";

import { S } from "../../templates";
import { ObjectStreamException } from "./ObjectStreamException";

export class InvalidClassException extends ObjectStreamException {
    public constructor(className: string, reason: java.lang.String) {
        super(S`Invalid class "${className}: ${reason}"`);
    }
}
