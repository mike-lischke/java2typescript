/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../../java";
import { JavaObject } from "../../lang/Object";

import { NotImplementedError } from "../../../NotImplementedError";

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface MatchResult {
    // Returns the offset after the last character of the subsequence captured by the given group during this match.
    end(group?: number): number;

    // Returns the input subsequence captured by the given group during the previous match operation.
    group(group?: number): string;

    // Returns the number of capturing groups in this match result's pattern.
    groupCount(): number;

    // Returns the start index of the subsequence captured by the given group during this match.
    start(group?: number): number;
}

export class Matcher extends JavaObject implements MatchResult {

    private regexResults: RegExpExecArray | null;
    private appendPosition = 0;

    public constructor(private owner: java.util.regex.Pattern, private regex: RegExp, private input: string) {
        super();

        this.regexResults = regex.exec(input);
    }

    /**
     * Returns a literal replacement String for the specified String.
     *
     * @param _s tbd
     */
    public static quoteReplacement = (_s: string): string => {
        throw new NotImplementedError();
    };

    /**
     * Implements a non-terminal append-and-replace step.
     *
     * @param sb tbd
     * @param replacement tbd
     *
     * @returns tbd
     */
    public appendReplacement = (sb: java.lang.StringBuffer, replacement: string): Matcher => {

        // Note: in Java the replacement value may contain references to groups in the last match.
        //       However, here we ignore those currently.
        sb.append(this.input.substring(this.appendPosition, this.start()));
        sb.append(replacement);
        this.appendPosition = this.end();

        return this;
    };

    /**
     * Implements a terminal append-and-replace step.
     *
     * @param sb tbd
     *
     * @returns tbd
     */
    public appendTail = (sb: java.lang.StringBuffer): java.lang.StringBuffer => {
        sb.append(this.input.substring(this.appendPosition));

        return sb;
    };

    /**
     * @returns the offset after the last character of the subsequence captured by the given group
     * during the previous match operation.
     *
     * @param group tbd
     */
    public end = (group?: number): number => {
        // group === 0 is the same as no group.
        if (!group || this.regexResults === null) {
            return this.regex.lastIndex;
        }

        if (this.regexResults === null) {
            throw new java.lang.IllegalStateException();
        }

        if (group < 0 || group >= this.regexResults.length) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        throw new NotImplementedError();
    };

    /**
     * Resets this matcher and then attempts to find the next subsequence of the input sequence that matches
     * the pattern, starting at the specified index.
     *
     * @param _start tbd
     */
    public find = (_start?: number): boolean => {
        throw new NotImplementedError();
    };

    /** Returns the input subsequence captured by the given group during the previous match operation. */
    public group(group?: number): string;
    /**
     * Returns the input subsequence captured by the given named-capturing group during the previous match operation.
     */
    public group(name: string): string;
    public group(_groupOrName?: number | string): string {
        throw new NotImplementedError();
    }

    /**
     *  @returns the number of capturing groups in this matcher's pattern.
     */
    public groupCount = (): number => {
        if (this.regexResults === null) {
            throw new java.lang.IllegalStateException();
        }

        return this.regexResults.length - 1;
    };

    /** Queries the anchoring of region bounds for this matcher. */
    public hasAnchoringBounds = (): boolean => {
        throw new NotImplementedError();
    };

    /** Queries the transparency of region bounds for this matcher. */
    public hasTransparentBounds = (): boolean => {
        throw new NotImplementedError();
    };

    /**
     * @returns true if the end of input was hit by the search engine in the last match operation performed
     * by this matcher.
     */
    public hitEnd = (): boolean => {
        if (this.regexResults === null) {
            throw new java.lang.IllegalStateException();
        }

        return this.regex.lastIndex >= this.input.length - 1;
    };

    /** Attempts to match the input sequence, starting at the beginning of the region, against the pattern. */
    public lookingAt = (): boolean => {
        throw new NotImplementedError();
    };

    /** Attempts to match the entire region against the pattern. */
    public matches = (): boolean => {
        throw new NotImplementedError();
    };

    /**
     * @returns the pattern that is interpreted by this matcher.
     */
    public pattern = (): java.util.regex.Pattern => {
        return this.owner;
    };

    /**
     * Sets the limits of this matcher's region.
     *
     * @param _start tbd
     * @param _end tbd
     */
    public region = (_start: number, _end: number): Matcher => {
        throw new NotImplementedError();
    };

    /** Reports the end index (exclusive) of this matcher's region. */
    public regionEnd = (): number => {
        throw new NotImplementedError();
    };

    /** Reports the start index of this matcher's region. */
    public regionStart = (): number => {
        throw new NotImplementedError();
    };

    /**
     * Replaces every subsequence of the input sequence that matches the pattern with the given replacement string.
     *
     * @param _replacement tbd
     */
    public replaceAll = (_replacement: string): string => {
        throw new NotImplementedError();
    };

    /**
     * Replaces the first subsequence of the input sequence that matches the pattern with the given replacement string.
     *
     * @param _replacement tbd
     */
    public replaceFirst = (_replacement: string): string => {
        throw new NotImplementedError();
    };

    /** Returns true if more input could change a positive match into a negative one. */
    public requireEnd = (): boolean => {
        throw new NotImplementedError();
    };

    /**
     * Resets this matcher with a new input sequence.
     *
     * @param _input tbd
     */
    public reset = (_input?: string): Matcher => {
        throw new NotImplementedError();
    };

    /**
     * Returns the start index of the subsequence captured by the given group during the previous match operation.
     *
     * @param _group tbd
     */
    public start = (_group?: number): number => {
        throw new NotImplementedError();
    };

    /** @returns the match state of this matcher as a MatchResult. */
    public toMatchResult = (): MatchResult => {
        return this;
    };

    /**
     * Sets the anchoring of region bounds for this matcher.
     *
     * @param _b tbd
     */
    public useAnchoringBounds = (_b: boolean): Matcher => {
        throw new NotImplementedError();
    };

    /**
     * Changes the Pattern that this Matcher uses to find matches with.
     *
     * @param _newPattern tbd
     */
    public usePattern = (_newPattern: java.util.regex.Pattern): Matcher => {
        throw new NotImplementedError();
    };

    /**
     * Sets the transparency of region bounds for this matcher.
     *
     * @param _b tbd
     */
    public useTransparentBounds = (_b: boolean): Matcher => {
        throw new NotImplementedError();
    };

}
