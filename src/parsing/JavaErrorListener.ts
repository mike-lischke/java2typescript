/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Recognizer, RecognitionException, Token, ATNSimulator, BaseErrorListener } from "antlr4ng";

export class JavaErrorListener extends BaseErrorListener {

    public errors: string[] = [];

    public override syntaxError<S extends Token, T extends ATNSimulator>(recognizer: Recognizer<T>,
        offendingSymbol: S | null, line: number, charPositionInLine: number, msg: string,
        _e: RecognitionException | null): void {
        this.errors.push(msg);
    }
}
