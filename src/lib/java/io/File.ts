/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/* eslint-disable @typescript-eslint/unified-signatures */

import path from "path";
import fs from "fs";

import { java } from "../java";
import { JavaObject } from "../lang/Object";
import { S } from "../../templates";

export class File extends JavaObject implements java.lang.Comparable<File> {
    public static readonly separator = path.delimiter;
    public static readonly separatorChar = path.delimiter;
    public static readonly pathSeparator = path.sep;
    public static readonly pathSeparatorChar = path.sep;

    // The absolute path to the file or directory.
    private path: string;

    public constructor(pathName: java.lang.String);
    public constructor(parent: File | undefined, child: java.lang.String);
    public constructor(parent: java.lang.String | undefined, child: java.lang.String);
    public constructor(uri: URL);
    public constructor(pathNameOrParentUri: java.lang.String | File | URL | undefined, child?: java.lang.String) {
        super();

        if (!pathNameOrParentUri && !child) {
            throw new java.lang.NullPointerException();
        } else if (!pathNameOrParentUri) {
            this.path = path.normalize(child!.valueOf());
        } else {
            let parentPath: string;
            if (pathNameOrParentUri instanceof java.lang.String) {
                parentPath = path.normalize(pathNameOrParentUri.valueOf());
            } else if (pathNameOrParentUri instanceof File) {
                parentPath = path.normalize(pathNameOrParentUri.path);
            } else {
                parentPath = path.normalize(pathNameOrParentUri.pathname);
            }

            if (child) {
                let c = child.valueOf();
                c = path.normalize(c);
                if (path.isAbsolute(c)) {
                    c = path.relative(c, process.cwd());
                }

                this.path = path.resolve(c, parentPath);
            } else {
                this.path = parentPath;
            }
        }
    }

    public isAbsolute(): boolean {
        return path.isAbsolute(this.path);
    }

    public getPath(): string {
        return this.path;
    }

    public getAbsolutePath(): string {
        return this.path;
    }

    public getParentFile(): File {
        return new File(S`${path.dirname(this.path)}`);
    }

    public length(): bigint {
        const stat = fs.statSync(this.path, { bigint: true });

        return stat.size;
    }

    public mkdirs(): boolean {
        fs.mkdirSync(this.path, { recursive: true });

        return true;
    }

    public compareTo(other: File): number {
        return this.path.localeCompare(other.path);
    }
}
