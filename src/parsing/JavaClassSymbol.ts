/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { ClassSymbol, Symbol } from "antlr4-c3";
import { JavaFileSymbolTable } from "../java/JavaFileSymbolTable";

/**
 * Extends the standard class symbol type by handling implemented types and adds symbol resolving for inherited members.
 */
export class JavaClassSymbol extends ClassSymbol {

    public resolveSync(name: string, localOnly?: boolean): Symbol | undefined {
        // First look for members of the classes this one is derived from.
        if (this.symbolTable instanceof JavaFileSymbolTable) {
            this.symbolTable.resolveReferences();
        }

        if (this.extends.length > 0) {
            if (this.extends[0].name === name) {
                return this.extends[0];
            }

            const symbol = this.extends[0].resolveSync(name, localOnly);
            if (symbol) {
                return symbol;
            }
        }

        if (this.implements.length > 0) {
            for (const base of this.implements) {
                if (base.name === name) {
                    return base;
                }

                const symbol = base.resolveSync(name, localOnly);
                if (symbol) {
                    return symbol;
                }
            }
        }

        return super.resolveSync(name, localOnly);
    }
}
