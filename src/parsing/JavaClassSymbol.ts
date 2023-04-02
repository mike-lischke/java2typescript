/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { ClassSymbol, BaseSymbol } from "antlr4-c3";

import { JavaFileSymbolTable } from "../JavaFileSymbolTable.js";

/**
 * Extends the standard class symbol type by handling implemented types and adds symbol resolving for inherited members.
 */
export class JavaClassSymbol extends ClassSymbol {

    public override resolveSync(name: string, localOnly?: boolean): BaseSymbol | undefined {
        // First look for members of the classes this one is derived from.
        if (this.symbolTable instanceof JavaFileSymbolTable) {
            this.symbolTable.resolveReferences();
        }

        const localType = super.resolveSync(name, localOnly);
        if (localType) {
            return localType;
        }

        if (this.extends.length > 0) {
            if (this.extends[0].name === name) {
                return this.extends[0];
            }

            const symbol = this.extends[0].resolveSync(name, true);
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

        return undefined;
    }
}
