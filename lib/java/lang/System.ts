/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import os from "os";

import { Console } from "../io/Console";
import { PrintStream } from "../io/PrintStream";
import { SystemOutputStream } from "../io/SystemOutputStream";

/** A partial implementation of Java's System type. */
export class System {
    private static consoleInstance: Console;
    private static errorStream: PrintStream;
    private static outputStream: PrintStream;

    public static arraycopy<T>(src: T[], srcPos: number, dest: T[], destPos: number, count: number): void {
        dest.splice(destPos, count, ...src.slice(srcPos, srcPos + count));
    }

    public static console(): Console {
        return System.consoleInstance;
    }

    public static get err(): PrintStream {
        return System.errorStream;
    }

    public static get out(): PrintStream {
        return System.outputStream;
    }

    public static lineSeparator(): string {
        return os.EOL;
    }

    public static getProperty(key: string, def?: string): string | undefined {
        switch (key) {
            case "user.dir": {
                return process.cwd();
            }

            case "user.home": {
                return process.env.HOME;
            }

            case "user.name": {
                return process.env.USER;
            }

            case "line.separator": {
                return os.EOL;
            }

            default: {
                return def;
            }
        }
    }

    static {
        System.consoleInstance = new Console();
        System.errorStream = new PrintStream(new SystemOutputStream(true));
        System.outputStream = new PrintStream(new SystemOutputStream(false));
    }
}
