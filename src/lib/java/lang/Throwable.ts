/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/* eslint-disable jsdoc/require-returns */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { java } from "../java";
import { JavaObject } from "./Object";

import { StackTraceElement } from "./StackTraceElement";

import { S } from "../../templates";
import { System } from "./System";

export class Throwable extends JavaObject {
    private stack?: string;

    #message: java.lang.String;
    #cause?: Throwable;
    #elements: StackTraceElement[] = [];
    #suppressed: Throwable[] = [];

    public constructor(message?: java.lang.String, cause?: Throwable);
    // This constructor is protected in Java, but in TS we cannot mix different modifiers in overloading.
    public constructor(message: java.lang.String, cause: Throwable, enableSuppression: boolean,
        writableStackTrace: boolean);
    public constructor(cause: Throwable);
    public constructor(messageOrCause?: java.lang.String | Throwable, cause?: Throwable, _enableSuppression?: boolean,
        _writableStackTrace?: boolean) {
        super();

        if (messageOrCause instanceof java.lang.String) {
            this.#message = messageOrCause;
            this.#cause = cause;
        } else {
            this.#message = S``;
            this.#cause = messageOrCause;
        }

        const temp = new Error();
        this.stack = temp.stack;

        this.fillInStackTrace();
    }

    /**
     * Creates a throwable wrapper around a JS error, while keeping the cause-chain intact.
     *
     * @param error A JS error.
     *
     * @returns A Throwable instance which wraps the given error.
     */
    public static fromError(error: unknown): Throwable {
        if (error instanceof Throwable) {
            return error;
        }

        if (error instanceof Error) {
            let cause;
            if (error.cause) {
                cause = Throwable.fromError(error.cause);
            }

            return new Throwable(S`${error.message}`, cause);
        }

        return new Throwable(S`${error}`);
    }

    /**
     * Appends the specified exception to the exceptions that were suppressed in order to deliver this exception.
     *
     * @param exception tbd
     */
    public addSuppressed(exception: Throwable): void {
        this.#suppressed.push(exception);
    }

    /** Fills in the execution stack trace. */
    public fillInStackTrace(): Throwable {
        if (this.stack) {
            const lines = this.stack.split("\n").slice(1);

            this.#elements = lines.map((line) => {
                return new StackTraceElement(line);
            });
        } else {
            this.#elements = [];
        }

        return this;
    }

    /** Returns the cause of this throwable or null if the cause is nonexistent or unknown. */
    public getCause(): Throwable | undefined {
        return this.#cause;
    }

    /** Creates a localized description of this throwable. */
    public getLocalizedMessage(): java.lang.String {
        return this.#message;
    }

    /** Returns the detail message string of this throwable. */
    public getMessage(): java.lang.String {
        return this.#message;
    }

    /** Provides programmatic access to the stack trace information printed by printStackTrace(). */
    public getStackTrace(): StackTraceElement[] {
        return this.#elements;
    }

    /**
     * Returns an array containing all of the exceptions that were suppressed, typically by the try-with-resources
     * statement, in order to deliver this exception.
     */
    public getSuppressed(): Throwable[] {
        return this.#suppressed;
    }

    /**
     * Initializes the cause of this throwable to the specified value.
     *
     * @param cause tbd
     */
    public initCause(cause: Throwable): this {
        this.#cause = cause;

        return this;
    }

    /**
     * Prints this throwable and its backtrace to the standard error stream.
     *
     * @param s tbd
     */
    public printStackTrace(s?: java.io.PrintStream): void {
        if (!s) {
            System.err.println(S`${this.stack}`);
        } else {
            s.println(S`${this.stack}`);
        }
    }

    /**
     * Sets the stack trace elements that will be returned by getStackTrace() and printed by printStackTrace() and
     * related methods.
     *
     * @param stackTrace tbd
     */
    public setStackTrace(stackTrace: StackTraceElement[]): void {
        this.#elements = stackTrace;
    }

    /** Returns a short description of this throwable. */
    public toString(): java.lang.String {
        const message = this.getLocalizedMessage();
        if (!message) {
            return S`${this.stack}`;
        }

        return S`${this.constructor.name}: ${message}`;
    }

    protected [Symbol.toPrimitive](): string {
        return `${this.toString()}`;
    }

}
