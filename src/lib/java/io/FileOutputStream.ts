/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import * as fs from "fs/promises";
import { writeSync } from "fs";

import { java } from "../java";

import { OutputStream } from "./OutputStream";

export class FileOutputStream extends OutputStream {

    private fd: java.io.FileDescriptor;
    private path?: string;
    private closed = true;

    /** Creates a file output stream to write to the file represented by the specified File object. */
    public constructor(file: java.io.File, append?: boolean);
    /**
     * Creates a file output stream to write to the specified file descriptor, which represents an existing connection
     * to an actual file in the file system.
     */
    public constructor(fdObj: java.io.FileDescriptor);
    /** Creates a file output stream to write to the file with the specified name. */
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    public constructor(name: string, append?: boolean);
    public constructor(fileOrFdObjOrName: java.io.File | java.io.FileDescriptor | string, append?: boolean) {
        super();

        try {
            if (fileOrFdObjOrName instanceof java.io.FileDescriptor) {
                this.fd = fileOrFdObjOrName;
            } else {
                this.path = fileOrFdObjOrName instanceof java.io.File
                    ? fileOrFdObjOrName.getAbsolutePath()
                    : fileOrFdObjOrName;
                this.fd = new java.io.FileDescriptor();
                this.open(append ?? false);
            }
        } catch (error) {
            throw new java.io.FileNotFoundException("Create open or create file", java.lang.Throwable.fromError(error));
        }
    }

    /** Closes this output stream and releases any system resources associated with this stream. */
    public close(): void {
        if (this.closed) {
            return;
        }

        this.closed = true;
        this.fd.closeAll(new class {
            public constructor(private fd: java.io.FileDescriptor) { }

            public close(): void {
                this.fd.close();
            }
        }(this.fd));
    }

    /** Flushes this output stream and forces any buffered output bytes to be written out. */
    public flush(): void {
        this.fd.sync();
    }

    /** Writes b.length bytes from the specified byte array to this output stream. */
    public write(b: Uint8Array): void;
    /** Writes len bytes from the specified byte array starting at offset off to this output stream. */
    public write(b: Uint8Array, offset: number, length: number): void;
    /** Writes the specified byte to this output stream. */
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    public write(b: number): void;
    public write(b: Uint8Array | number, offset?: number, length?: number): void {
        if (!this.fd.valid()) {
            throw new java.io.IOException("Cannot write data because the file handle is invalid.");
        }

        try {
            if (typeof b === "number") {
                const buffer = new Uint8Array(1);
                buffer[0] = b;
                writeSync(this.fd.handle!.fd, buffer, 0, 1);
            } else {
                offset ??= 0;
                length ??= b.length;
                if (offset < 0 || length < 0 || offset + length > b.length) {
                    throw new java.lang.IndexOutOfBoundsException();
                }

                writeSync(this.fd.handle!.fd, b, offset, length);
            }
        } catch (error) {
            throw new java.io.IOException("Cannot write data to file", java.lang.Throwable.fromError(error));
        }
    }

    public getFD(): java.io.FileDescriptor {
        return this.fd;
    }

    private open(append: boolean): void {
        if (this.path) {
            fs.open(this.path, append ? "as" : "w", 0x400).then((handle) => {
                this.fd.handle = handle;
                this.closed = false;
            }).catch((reason) => {
                throw new java.io.IOException("Cannot open file", java.lang.Throwable.fromError(reason));
            });
        }
    }
}
