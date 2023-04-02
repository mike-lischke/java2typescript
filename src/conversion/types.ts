/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
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
