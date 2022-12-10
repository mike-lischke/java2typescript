/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { JavaObject } from "../lang/Object";

export abstract class Comparator<T> extends JavaObject {
    public abstract compare: (o1: T, o2: T) => number;
    public abstract equals: (obj: unknown) => boolean;
}
