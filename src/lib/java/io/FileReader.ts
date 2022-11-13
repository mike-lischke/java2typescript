/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/* eslint-disable @typescript-eslint/unified-signatures */

import { java } from "../java";

import { InputStreamReader } from "./InputStreamReader";

export class FileReader extends InputStreamReader {
    /**
     * Creates a new {@code FileReader}, given the name of the file to read,
     * using the {@link Charset#defaultCharset() default charset}.
     *
     * @param      fileName the name of the file to read
     * @throws     FileNotFoundException  if the named file does not exist,
     *             is a directory rather than a regular file,
     *             or for some other reason cannot be opened for
     *             reading.
     * @see        Charset#defaultCharset()
     */
    public constructor(fileName: string);
    /**
     * Creates a new {@code FileReader}, given the {@code File} to read,
     * using the {@link Charset#defaultCharset() default charset}.
     *
     * @param      file the {@code File} to read
     * @throws     FileNotFoundException  if the file does not exist,
     *             is a directory rather than a regular file,
     *             or for some other reason cannot be opened for
     *             reading.
     * @see        Charset#defaultCharset()
     */
    public constructor(file: java.io.File);
    /**
     * Creates a new {@link FileReader}, given the {@link FileDescriptor} to read,
     * using the {@link Charset#defaultCharset() default charset}.
     *
     * @param fd the {@link FileDescriptor} to read
     * @see Charset#defaultCharset()
     */
    public constructor(fd: java.io.FileDescriptor);
    /**
     * Creates a new {@code FileReader}, given the name of the file to read
     * and the {@link Charset charset}.
     *
     * @param      fileName the name of the file to read
     * @param      charset the {@link java.nio.charset.Charset}
     * @throws     IOException  if the named file does not exist,
     *             is a directory rather than a regular file,
     *             or for some other reason cannot be opened for
     *             reading.
     */
    public constructor(fileName: string, charset: java.nio.charset.Charset);
    /**
     * Creates a new {@code FileReader}, given the {@link java.io.File} to read and
     * the {@link java.nio.charset.Charset}.
     *
     * @param      file the {@code File} to read
     * @param      charset the {@link Charset charset}
     * @throws     IOException  if the file does not exist,
     *             is a directory rather than a regular file,
     *             or for some other reason cannot be opened for
     *             reading.
     */
    public constructor(file: java.io.File, charset: java.nio.charset.Charset);
    public constructor(fileNameOrFileOrFd: string | java.io.File | java.io.FileDescriptor,
        charset?: java.nio.charset.Charset) {
        if (typeof fileNameOrFileOrFd === "string") {
            super(new java.io.FileInputStream(fileNameOrFileOrFd), charset);
        } else if (fileNameOrFileOrFd instanceof java.io.File) {
            super(new java.io.FileInputStream(fileNameOrFileOrFd), charset);
        } else {
            super(new java.io.FileInputStream(fileNameOrFileOrFd), charset);
        }
    }

}
