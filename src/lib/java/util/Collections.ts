/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../java";
import { JavaObject } from "../lang/Object";
import { ArrayList } from "./ArrayList";
import { HashMap } from "./HashMap";
import { HashSet } from "./HashSet";

/* eslint-disable @typescript-eslint/naming-convention */

export abstract class Collections extends JavaObject {
    public static readonly EMPTY_LIST = new ArrayList();
    public static readonly EMPTY_MAP = new HashMap();
    public static readonly EMPTY_SET = new HashSet();

    public static unmodifiableMap<T extends Map<unknown, unknown>>(map: T): Readonly<T> {
        return map;
    }

    public static unmodifiableList<T>(list: java.util.List<T>): Readonly<java.util.List<T>> {
        return list;
    }

    public static reverse<T>(list: java.util.List<T>): void {
        const array = list.toArray().reverse();
        list.clear();
        for (const entry of array) {
            list.add(entry);
        }
    }

    public static emptyList<T>(): java.util.List<T> {
        return new java.util.ArrayList<T>();
    }

    public static sort<T>(list: java.util.List<T>, c: java.util.Comparator<T>): java.util.List<T> {
        const array = list.toArray();
        array.sort((a, b) => {
            return c.compare(a, b);
        });

        return new java.util.ArrayList<T>(array);
    }

    public static max<T1 extends java.lang.Comparable<T1>>(coll: java.util.Collection<T1>): T1 | null;
    public static max<T2>(coll: java.util.Collection<T2>, comp: java.util.Comparator<T2>): T2 | null;
    public static max<T1 extends java.lang.Object & java.lang.Comparable<T1>, T2>(
        coll: java.util.Collection<T1> | java.util.Collection<T2>, comp?: java.util.Comparator<T2>): T1 | T2 | null {
        if (comp) {
            let result: T2 | null = null;

            for (const current of coll as java.util.Collection<T2>) {
                if (result === null) {
                    result = current;
                    continue;
                }

                const comparison = comp.compare(result, current);
                if (comparison < 0) {
                    result = current;
                }
            }

            return result;
        } else {
            let result: T1 | null = null;

            for (const current of coll as java.util.Collection<T1>) {
                if (result === null) {
                    result = current;
                    continue;
                }

                const comparison = result.compareTo(current);
                if (comparison < 0) {
                    result = current;
                }
            }

            return result;
        }
    }

    public static min<T1 extends java.lang.Comparable<T1>>(coll: java.util.Collection<T1>): T1 | null;
    public static min<T2>(coll: java.util.Collection<T2>, comp: java.util.Comparator<T2>): T2 | null;
    public static min<T1 extends java.lang.Comparable<T1>, T2>(
        coll: java.util.Collection<T1> | java.util.Collection<T2>, comp?: java.util.Comparator<T2>): T1 | T2 | null {
        if (comp) {
            let result: T2 | null = null;

            for (const current of coll as java.util.Collection<T2>) {
                if (result === null) {
                    result = current;
                    continue;
                }

                const comparison = comp.compare(result, current);
                if (comparison > 0) {
                    result = current;
                }
            }

            return result;
        } else {
            let result: T1 | null = null;

            for (const current of coll as java.util.Collection<T1>) {
                if (result === null) {
                    result = current;
                    continue;
                }

                const comparison = result.compareTo(current);
                if (comparison > 0) {
                    result = current;
                }
            }

            return result;
        }
    }

}
