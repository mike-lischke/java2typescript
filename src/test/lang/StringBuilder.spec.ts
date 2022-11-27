/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../../lib/java/java";

export { };

describe("Tests", () => {
    it("Prepend raw string", () => {
        const builder = new java.lang.StringBuilder();
        builder.append('abc');
        builder.insert(0, 'def');
        expect(builder.toString()).toBe('defabc');
    });

    it("Prepend StringBuilder", () => {
        const builder = new java.lang.StringBuilder();
        builder.append('abc');

        const prepend = new java.lang.StringBuilder();
        prepend.append( 'def');

        builder.insert(0, prepend);
        expect(builder.toString()).toBe('defabc');
    });
});
