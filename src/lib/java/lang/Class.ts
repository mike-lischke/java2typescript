/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { JavaObject } from "./Object";

/** A partial implementation of Java's Class type. */
export class Class extends JavaObject {

    private static classes = new Map<typeof JavaObject, Class>();

    private constructor(private c: typeof JavaObject) {
        super();
    }

    public static fromConstructor(c: typeof JavaObject): Class {
        let clazz = Class.classes.get(c);
        if (!clazz) {
            clazz = new Class(c);
            Class.classes.set(c, clazz);
        }

        return clazz;
    }

    public getName(): string {
        return this.c.name;
    }

    public isInstance(o: unknown): boolean {
        return o instanceof this.c;
    }

    public cast(o: unknown): typeof this.c {
        return o as typeof this.c;
    }
}
