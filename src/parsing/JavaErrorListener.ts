/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { ANTLRErrorListener, Recognizer, RecognitionException, Token } from "antlr4ts";

export class JavaErrorListener implements ANTLRErrorListener<Token> {

    public errors: string[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public syntaxError<T extends Token | number>(recognizer: Recognizer<T, any>, offendingSymbol: T | undefined,
        line: number, charPositionInLine: number, msg: string, _e: RecognitionException | undefined): void {

        this.errors.push(msg);
    }
}
