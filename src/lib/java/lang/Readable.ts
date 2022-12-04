/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../java";

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface Readable {
    /** Attempts to read characters into the specified character buffer. */
    read(cb: java.nio.CharBuffer): number;
}
