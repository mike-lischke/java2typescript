/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/** cspell: ignore mkdirs */

/* eslint-disable @typescript-eslint/unified-signatures */

import path from "path";
import fs from "fs";

import { java } from "../java";

export class File implements java.lang.Comparable<File> {
    public static readonly separator = path.delimiter;
    public static readonly separatorChar = path.delimiter;
    public static readonly pathSeparator = path.sep;
    public static readonly pathSeparatorChar = path.sep;

    // The absolute path to the file or directory.
    private path: string;

    public constructor(pathName: string);
    public constructor(parent: File | undefined, child: string);
    public constructor(parent: string | undefined, child: string);
    public constructor(uri: URL);
    public constructor(pathNameOrParentUri: string | File | URL | undefined, child?: string) {
        if (!pathNameOrParentUri && !child) {
            throw new java.lang.NullPointerException();
        } else if (!pathNameOrParentUri) {
            this.path = path.normalize(child!);
        } else {
            let parentPath: string;
            if (typeof pathNameOrParentUri === "string") {
                parentPath = path.normalize(pathNameOrParentUri);
            } else if (pathNameOrParentUri instanceof File) {
                parentPath = path.normalize(pathNameOrParentUri.path);
            } else {
                parentPath = path.normalize(pathNameOrParentUri.pathname);
            }

            if (child) {
                child = path.normalize(child);
                if (path.isAbsolute(child)) {
                    child = path.relative(child, process.cwd());
                }

                this.path = path.resolve(child, parentPath);
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
        return new File(path.dirname(this.path));
    }

    public mkdirs(): boolean {
        fs.mkdirSync(this.path, { recursive: true });

        return true;
    }

    public compareTo(other: File): number {
        return this.path.localeCompare(other.path);
    }
}

