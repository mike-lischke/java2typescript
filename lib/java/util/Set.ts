/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../java";

// The set interface does not add any new method to the Collection interface.

// eslint-disable-next-line @typescript-eslint/naming-convention
export type Set<T> = java.util.Collection<T>;
