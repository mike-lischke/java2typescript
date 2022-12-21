/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { JavaObject } from "../lang/Object";

export interface Comparator<T> {
    compare: (o1: T, o2: T) => number;
    equals: (obj: JavaObject) => boolean;
}
