/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/* eslint-disable @typescript-eslint/unified-signatures */

import { readSync } from "fs";
import * as fs from "fs/promises";
import { S } from "../../templates";

import { java } from "../java";

import { InputStream } from "./InputStream";

export class FileInputStream extends InputStream implements java.io.AutoCloseable {
    private fd: java.io.FileDescriptor;
    private path: string;

    /**
     * Creates a FileInputStream by opening a connection to an actual file, the file named by the File object
     * file in the file system.
     */
    public constructor(file: java.io.File);
    /**
     * Creates a FileInputStream by using the file descriptor fdObj, which represents an existing connection
     * to an actual file in the file system.
     */
    public constructor(fdObj: java.io.FileDescriptor);
    /**
     * Creates a FileInputStream by opening a connection to an actual file, the file named by the path name
     * in the file system.
     */
    public constructor(name: java.lang.String);
    public constructor(fileOrFdObjOrName: java.io.File | java.io.FileDescriptor | java.lang.String) {
        super();

        if (fileOrFdObjOrName instanceof java.io.File) {
            this.path = fileOrFdObjOrName.getPath();
            this.fd = new java.io.FileDescriptor();
            this.open();
        } else if (fileOrFdObjOrName instanceof java.lang.String) {
            this.path = fileOrFdObjOrName.valueOf();
            this.fd = new java.io.FileDescriptor();
            this.open();
        } else {
            this.fd = fileOrFdObjOrName;
            this.path = "";
        }

        this.fd.attach(this);
    }

    /** Reads the next byte of data from the input stream. */
    public read(): number;
    /** Reads some number of bytes from the input stream and stores them into the buffer array b. */
    public read(b: Uint8Array): number;
    /** Reads up to len bytes of data from the input stream into an array of bytes. */
    public read(b: Uint8Array, offset: number, length: number): number;
    public read(b?: Uint8Array, offset?: number, length?: number): number {
        if (!b) {
            const buffer = Buffer.alloc(1);
            const read = readSync(this.fd.handle!.fd, buffer, 0, 1, null);

            if (read === 0) {
                return -1;
            }

            return buffer.at(0)!;
        }

        offset ??= 0;
        length ??= b.length;

        if (offset < 0 || length < 0 || offset + length > b.length) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        const read = readSync(this.fd.handle!.fd, b, offset ?? 0, length ?? b.length, null);
        if (read === 0) {
            return - 1;
        }

        return read;
    }

    public getFD(): java.io.FileDescriptor {
        return this.fd;
    }

    private open(): void {
        fs.open(this.path, "r", 0x400).then((handle) => {
            this.fd.handle = handle;
        }).catch((reason) => {
            throw new java.io.IOException(S`Cannot open file`, java.lang.Throwable.fromError(reason));
        });
    }
}
