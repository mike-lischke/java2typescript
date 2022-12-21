/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { S } from "../../templates";
import { IOException } from "./IOException";

export class UnsupportedEncodingException extends IOException {
    public constructor(name: string) {
        super(S`The encoding ${name} is not supported.`);
    }
}
