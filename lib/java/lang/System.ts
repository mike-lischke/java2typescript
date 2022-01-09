/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { Console } from "../io/Console";

const consoleInstance = new Console();

// A partial implementation of Java's System type.
export class System {
    public static arraycopy<T>(src: T[], srcPos: number, dest: T[], destPos: number, count: number): void {
        dest.splice(destPos, count, ...src.slice(srcPos, srcPos + count));
    }

    public static console(): Console {
        return consoleInstance;
    }
}
