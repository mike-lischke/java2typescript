/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { BaseSymbol } from "antlr4-c3";

import { PackageSource } from "../PackageSource.js";

export interface ISymbolInfo {
    /** The resolved symbol or undefined for anonymous class expressions.  */
    symbol?: BaseSymbol;
    qualifiedName: string;
    source?: PackageSource;
}

/** Determines the type of context for which certain processing is going to happen. */
export enum ContextType {
    File,
    Class,
    Interface,
    Enum,
    ClassExpression,
}

export enum MemberType {
    Initializer,
    Field,
    Constructor,
    Method,
    Lambda,
    Static,
    Abstract,
    Annotation,
    Class,
    Interface,
    Enum,
    Empty,
}
