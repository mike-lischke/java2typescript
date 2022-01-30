/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { ClassSymbol, Symbol } from "antlr4-c3";

// Extends the standard class symbol type by handling implemented types and adds symbol resolving for inherited members.
export class JavaClassSymbol extends ClassSymbol {

    public resolveSync(name: string, localOnly?: boolean): Symbol | undefined {
        let symbol = super.resolveSync(name, localOnly);
        if (!symbol && !localOnly) {
            if (this.extends.length > 0) {
                symbol = this.extends[0].resolveSync(name, true);
            }

            if (!symbol && this.implements.length > 0) {
                for (const base of this.implements) {
                    symbol = base.resolveSync(name, true);
                    if (symbol) {
                        break;
                    }
                }
            }
        }

        return symbol;
    }
}
