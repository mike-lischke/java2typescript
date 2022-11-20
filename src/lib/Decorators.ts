/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument */

export const final = <T extends new (...args: any[]) => object>(target: T): T => {
    return class Final extends target {
        public constructor(...args: any[]) {
            if (new.target !== Final) {
                throw new Error("Cannot inherit from final class");
            }

            super(...args);
        }
    };
};

export const frozen = (target: Function): void => {
    Object.freeze(target);
    Object.freeze(target.prototype);
};
