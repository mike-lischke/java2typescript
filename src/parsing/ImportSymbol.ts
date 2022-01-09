/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { Symbol } from "antlr4-c3";

export class ImportSymbol extends Symbol {
    public readonly fullPath: string;
    public readonly relativePath: string;

    public constructor(name: string, packageRoot: string, public fullImport: boolean) {
        super(name);
    }
}
