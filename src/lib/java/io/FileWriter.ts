/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/* eslint-disable @typescript-eslint/unified-signatures */

import { java } from "../java";
import { OutputStreamWriter } from "./OutputStreamWriter";

export class FileWriter extends OutputStreamWriter {
    public constructor(fileName: java.lang.String);
    public constructor(fileName: java.lang.String, append: boolean);
    public constructor(file: java.io.File);
    public constructor(file: java.io.File, append: boolean);
    public constructor(fd: java.io.FileDescriptor);
    public constructor(fileName: java.lang.String, charset: java.nio.charset.Charset);
    public constructor(fileName: java.lang.String, charset: java.nio.charset.Charset, append: boolean);
    public constructor(file: java.io.File, charset: java.nio.charset.Charset);
    public constructor(file: java.io.File, charset: java.nio.charset.Charset, append: boolean);
    public constructor(fileNameOrFileOrFd: java.lang.String | java.io.File | java.io.FileDescriptor,
        appendOrCharset?: boolean | java.nio.charset.Charset, append?: boolean) {
        let doAppend = false;
        let charset;
        if (typeof appendOrCharset === "boolean") {
            doAppend = appendOrCharset;
        } else if (append !== undefined) {
            doAppend = append;
            charset = appendOrCharset;
        }

        let stream: java.io.FileOutputStream;
        if (fileNameOrFileOrFd instanceof java.lang.String) {
            stream = new java.io.FileOutputStream(fileNameOrFileOrFd, doAppend);
        } else if (fileNameOrFileOrFd instanceof java.io.File) {
            stream = new java.io.FileOutputStream(fileNameOrFileOrFd, doAppend);
        } else {
            stream = new java.io.FileOutputStream(fileNameOrFileOrFd);
        }

        super(stream, charset);
    }
}
