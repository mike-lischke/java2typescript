/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../../../../lib/java/java";

class TestOutputStream extends java.io.OutputStream {
    public output = new Uint8Array(1000);
    public close = jest.fn(() => {/* */ });

    private position = 0;

    public flush(): void { /**/ }

    public write(b: Uint8Array | number): void;
    public write(b: Uint8Array, off: number, len: number): void;
    public write(b: Uint8Array | number, off?: number, len?: number): void {
        if (typeof b === "number") {
            this.output[this.position++] = b;
        } else {
            off ??= 0;
            len ??= b.length;
            this.output.set(b.subarray(off, off + len), this.position);
            this.position += len;
        }
    }

    public clear(): void {
        this.position = 0;
        this.output.fill(0);
    }
}

describe("BufferedOutputStream Tests", () => {
    it("Creation and Writing", () => {
        const buffer = new TestOutputStream();
        let stream = new java.io.BufferedOutputStream(buffer);

        // @ts-expect-error
        expect(stream.buf.length).toBe(0xFFFF);

        expect(() => { stream = new java.io.BufferedOutputStream(buffer, -1); }).toThrow();

        stream = new java.io.BufferedOutputStream(buffer, 10);

        // @ts-expect-error
        expect(stream.buf.length).toBe(10);

        stream.write(new Uint8Array([1, 2, 3]));

        // Written array is buffered. Not yet in output.
        expect(buffer.output.subarray(0, 3)).toEqual(new Uint8Array([0, 0, 0]));

        // Write more than what fits into the buffered stream.
        stream.write(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]));
        expect(buffer.output.subarray(7, 13)).toEqual(new Uint8Array([5, 6, 7, 8, 9, 10]));

        // No data beyond the value 17 written above.
        expect(buffer.output.subarray(20, 25)).toEqual(new Uint8Array([0, 0, 0, 0, 0]));

        // Add new data which should be appended.
        expect(() => {
            stream.write(new Uint8Array([1, 1, 1, 1, 1, 22, 22, 22, 22, 22]), 5, 7);
        }).toThrow("The specified values exceed the size of the specified source.");

        expect(buffer.output.subarray(20, 25)).toEqual(new Uint8Array([0, 0, 0, 0, 0]));

        // Buffered stream was flushed when more than 10 values where written above.
        // Write 3 values -> no flush.
        stream.write(new Uint8Array([1, 1, 1, 1, 1, 22, 22, 22, 22, 22, 33, 33, 33]), 5, 3);
        expect(buffer.output.subarray(20, 25)).toEqual(new Uint8Array([0, 0, 0, 0, 0]));

        // Write another 5 values -> no flush.
        stream.write(new Uint8Array([1, 1, 1, 1, 1, 22, 22, 22, 22, 22, 44, 44, 44]), 0, 5);
        expect(buffer.output.subarray(20, 25)).toEqual(new Uint8Array([0, 0, 0, 0, 0]));

        // Having 8 values in the buffered stream now. Write two more to make it flush.
        stream.write(new Uint8Array([1, 1, 1, 1, 1, 22, 22, 22, 22, 22, 44, 44, 44]), 11, 2);
        expect(buffer.output.subarray(20, 30)).toEqual(new Uint8Array([22, 22, 22, 1, 1, 1, 1, 1, 44, 44]));

        // @ts-expect-error
        expect(stream.count).toBe(0); // Everything flushed to the underlying stream.

        // Clear the underlying stream and start writing single bytes.
        buffer.clear();
        expect(buffer.close).toBeCalledTimes(0);

        expect(buffer.output.subarray(0, 5)).toEqual(new Uint8Array([0, 0, 0, 0, 0]));
        stream.write(1);
        stream.write(3);
        stream.write(7);
        stream.write(11);
        expect(buffer.output.subarray(0, 5)).toEqual(new Uint8Array([0, 0, 0, 0, 0]));

        stream.write(13);
        stream.write(17);
        stream.write(23);
        stream.write(29);
        expect(buffer.output.subarray(0, 5)).toEqual(new Uint8Array([0, 0, 0, 0, 0]));

        stream.write(22);
        stream.write(33);
        expect(buffer.output.subarray(0, 5)).toEqual(new Uint8Array([1, 3, 7, 11, 13]));
        stream.write(44);
        stream.write(55);

        // Additional content after last flush is buffered and not yet written to the underlying stream.
        expect(buffer.output.subarray(0, 12)).toEqual(new Uint8Array([1, 3, 7, 11, 13, 17, 23, 29, 22, 33, 0, 0]));
        stream.close();

        expect(buffer.close).toBeCalledTimes(1);
    });
});
