/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { ParserRuleContext, TerminalNode, ParseTree } from "antlr4ng";

/**
 * Get the lowest level parse tree, which covers the given position.
 *
 * @param root The start point to search from.
 * @param column The position in the given row.
 * @param row The row position to search for.
 *
 * @returns The parse tree which covers the given position or undefined if none could be found.
 */
export const parseTreeFromPosition = (root: ParseTree, column: number, row: number): ParseTree | undefined => {
    // Does the root node actually contain the position? If not we don't need to look further.
    if (root instanceof TerminalNode) {
        const token = root.symbol;
        if (token.line !== row) {
            return undefined;
        }

        const tokenStop = token.column + (token.stop - token.start + 1);
        if (token.column <= column && tokenStop >= column) {
            return root;
        }

        return undefined;
    } else {
        const context = (root as ParserRuleContext);
        if (!context.start || !context.stop) { // Invalid tree?
            return undefined;
        }

        if (context.start.line > row || (context.start.line === row && column < context.start.column)) {
            return undefined;
        }

        const tokenStop = context.stop.column + (context.stop.stop - context.stop.start + 1);
        if (context.stop.line < row || (context.stop.line === row && tokenStop < column)) {
            return undefined;
        }

        if (context.children) {
            for (const child of context.children) {
                const result = parseTreeFromPosition(child, column, row);
                if (result) {
                    return result;
                }
            }
        }

        return context;

    }
};

/**
 * Converts a parse tree invocation stack to a string and prints it to the console.
 *
 * @param fileName The name of the file for which the output is produced.
 * @param root The parse tree to use.
 * @param ruleNames The list of all rule names for pretty printing.
 * @param position The position in the source text where to start parse tree traversal from.
 * @param position.column The column value.
 * @param position.row The row value.
 */
export const printParseTreeStack = (fileName: string, root: ParseTree, ruleNames: string[],
    position: { column: number; row: number; }): void => {
    const tree = parseTreeFromPosition(root, position.column, position.row);
    if (!tree) {
        console.warn(`DEBUG: no parse tree found in ${fileName} at column ${position.column}, row ${position.row}`);
    }

    console.log("\n\n");
    if (tree instanceof TerminalNode) {
        console.log("Parse tree: " + (tree.parent as ParserRuleContext).toString(ruleNames));
        console.log("\nText at position: " + tree.toString());
    } else if (tree instanceof ParserRuleContext) {
        console.log(tree.toString(ruleNames));
    }

    console.log("\n");
};
