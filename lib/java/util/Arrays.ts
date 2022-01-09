/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { ArrayList, List } from ".";

export class Arrays {
    public static readonly sort = <T>(list: T[]): void => {
        const sorted = list.sort((a, b) => {
            if (a < b) {
                return -1;
            }

            if (a > b) {
                return 1;
            }

            return 0;
        });

        // Copy over the values to simulate in-place sorting.
        sorted.forEach((value, index) => {
            list[index] = value;
        });
    };

    public static readonly asList = <T>(list: T[]): List<T> => {
        return new ArrayList<T>(list);
    };
}

