/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../java";

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface Appendable {
    /** Appends the specified character to this Appendable. */
    append(c: java.lang.char): this;

    /** Appends the specified character sequence to this Appendable. */
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    append(csq: java.lang.CharSequence): this;

    /** Appends a subsequence of the specified character sequence to this Appendable. */
    append(csq: java.lang.CharSequence, start: number, end: number): this;
}
