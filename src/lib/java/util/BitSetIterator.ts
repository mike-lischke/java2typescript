/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */

// The code in this file was taken from the antlr4ts package.

export class BitSetIterator implements IterableIterator<number> {
    private index = 0;
    private mask = 0xFFFF;

    public constructor(private data: Uint16Array) { }

    public next(): IteratorResult<number> {
        while (this.index < this.data.length) {
            const bits = this.data[this.index] & this.mask;
            if (bits !== 0) {
                const bitNumber = this.index * 16 + this.findLSBSet(bits);
                this.mask = this.bitsFor(bitNumber + 1, 15);

                return { done: false, value: bitNumber };
            }
            this.index++;
            this.mask = 0xFFFF;
        }

        return { done: true, value: -1 };
    }

    public [Symbol.iterator](): IterableIterator<number> {
        return this;
    }

    /**
     * Get's the bit number of the least significant bit set LSB which is set in a word non-zero word;
     * Bit numbers run from LSB to MSB starting with 0.
     *
     * @param word tbd
     *
     * @returns tbd
     */
    private findLSBSet = (word: number) => {
        let bit = 1;
        for (let i = 0; i < 16; i++) {
            if ((word & bit) !== 0) {
                return i;
            }
            bit = (bit << 1) >>> 0;
        }
        throw new RangeError("No specified bit found");
    };

    /**
     * Gets a 16-bit mask with bit numbers fromBit to toBit (inclusive) set.
     * Bit numbers run from LSB to MSB starting with 0.
     *
     * @param fromBit tbd
     * @param toBit tbd
     *
     * @returns tbd
     */
    private bitsFor = (fromBit: number, toBit: number): number => {
        fromBit &= 0xF;
        toBit &= 0xF;
        if (fromBit === toBit) {
            return (1 << fromBit) >>> 0;
        }

        return ((0xFFFF >>> (15 - toBit)) ^ (0xFFFF >>> (16 - fromBit)));
    };
}

