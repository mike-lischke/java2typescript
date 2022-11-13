/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

import { NotImplementedError } from "../../NotImplementedError";
import { char, IllegalArgumentException } from "../lang";
import { Readable } from "../lang/Readable";
import { CharBuffer } from "../nio/CharBuffer";
import { ReadOnlyBufferException } from "../nio/ReadOnlyBufferException";
import { AutoCloseable } from "./AutoCloseable";
import { Closeable } from "./Closeable";
import { IOException } from "./IOException";

export abstract class Reader implements Closeable, AutoCloseable, Readable {
    // Maximum skip-buffer size.
    private static readonly maxSkipBufferSize = 8192;

    // Skip buffer, null until allocated.
    private skipBuffer?: Uint16Array;

    /**
     * Marks the present position in the stream.
     *
     * @param readAheadLimit tbd
     */
    public mark(readAheadLimit: number): void {
        throw new IOException("mark() not supported");
    }

    /**
     * Tells whether this stream supports the mark() operation.
     *
     * @returns tbd
     */
    public markSupported(): boolean {
        return false;
    }

    public read(target?: Uint16Array | CharBuffer): char;
    public /* abstract */ read(target: Uint16Array, offset: number, length: number): number;
    public read(target?: Uint16Array | CharBuffer, offset?: number, length?: number): number {
        if (target === undefined) {
            // Reads a single character.
            const temp = new Uint16Array(1);
            this.read(temp, 0, 1);

            return temp[0];
        } else if (target instanceof Uint16Array) {
            // Reads characters into an array.
            if (offset !== undefined || length !== undefined) {
                // Simulate the abstract method.
                throw new NotImplementedError("abstract");
            }

            return this.read(target, 0, target.length);
        } else {
            // Attempts to read characters into the specified character buffer.
            if (target.isReadOnly()) {
                throw new ReadOnlyBufferException();
            }

            let readCount = 0;
            if (target.hasArray()) {
                const buffer = target.array();
                const pos = target.position;
                const rem = Math.max(target.limit - pos, 0);
                const off = target.arrayOffset() + pos;
                readCount = this.read(buffer, off, rem);
                if (readCount > 0) {
                    target.position = pos + readCount;
                }
            } else {
                const len = target.remaining();
                const buffer = new Uint16Array(len);
                readCount = this.read(buffer, 0, len);
                if (readCount > 0) {
                    target.put(buffer, 0, readCount);
                }
            }

            return readCount;

        }
    }

    // Tells whether this stream is ready to be read.
    public ready(): boolean {
        return false;
    }

    // Resets the stream.
    public reset(): void {
        throw new IOException("reset() not supported");
    }

    // Skips characters.
    public skip(n: number): number {
        if (n < 0) {
            throw new IllegalArgumentException("skip value is negative");
        }

        const nn = Math.min(n, Reader.maxSkipBufferSize);

        // Note: the Java implementation wraps the following code in a synchronized block, which we not need.
        if ((!this.skipBuffer) || (this.skipBuffer.length < nn)) {
            this.skipBuffer = new Uint16Array(nn);
        }

        let r = n;
        while (r > 0) {
            const nc = this.read(this.skipBuffer, 0, Math.min(r, nn));
            if (nc === -1) {
                break;
            }
            r -= nc;
        }

        return n - r;

    }

    // Closes the stream and releases any system resources associated with it.
    public abstract close(): void;
}
