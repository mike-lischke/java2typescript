/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { OrderedMap } from "immutable";

import { HashMap, IHashMapViewBackend } from "./HashMap";

export class LinkedHashMap<K, V> extends HashMap<K, V> {
    protected createBackend(): IHashMapViewBackend<K, V> {
        return { backend: OrderedMap<K, V>() };
    }
}
