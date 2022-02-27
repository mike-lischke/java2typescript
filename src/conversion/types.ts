/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { Symbol } from "antlr4-c3";

import { PackageSource } from "../PackageSource";

// Only necessary until next update of antlr-c3.
export enum EnhancedTypeKind {
    Unknown,

    Integer,
    Float,
    Number,

    String,
    Char,

    Boolean,

    Class,
    Interface,
    Array,
    Map,
    Enum,

    Alias,
}

export interface ISymbolInfo {
    symbol: Symbol;
    qualifiedName: string;
    source?: PackageSource;
}
