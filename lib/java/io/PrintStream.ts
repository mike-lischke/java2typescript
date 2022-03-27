/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

// A very simple implementation of this class, only to have print/println available, which always print to the console.
export class PrintStream {

    public constructor(private forErrors: boolean) { }

    public print(text: string): void {
        if (this.forErrors) {
            process.stderr.write(text);
        } else {
            process.stdout.write(text);
        }
    }

    public println(text?: string): void {
        if (this.forErrors) {
            console.error(text);
        } else {
            console.log(text);
        }
    }
}
