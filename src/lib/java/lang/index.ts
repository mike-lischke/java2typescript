/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/** The equivalent of Java's char type. Treat it as 16 bit integer! */
// eslint-disable-next-line @typescript-eslint/naming-convention
export type char = number;

export { JavaObject as Object } from "./Object";
export * from "./StringBuilder";
export * from "./StringBuffer";
export * from "./Character";
export * from "./CharSequence";
export * from "./String";
export * from "./Number";
export * from "./Integer";
export * from "./Long";
export * from "./Boolean";
export * from "./Class";
export * from "./Cloneable";
export * from "./Appendable";
export * from "./Comparable";
export * from "./Readable";

export * from "./Throwable";
export * from "./Error";
export * from "./Exception";
export * from "./RuntimeException";
export * from "./IndexOutOfBoundsException";
export * from "./NoSuchElementException";
export * from "./IllegalArgumentException";
export * from "./NumberFormatException";
export * from "./IllegalStateException";
export * from "./UnsupportedOperationException";
export * from "./NullPointerException";
export * from "./LinkageError";
export * from "./IncompatibleClassChangeError";
export * from "./NoSuchMethodError";
export * from "./VirtualMachineError";
export * from "./OutOfMemoryError";
export * from "./NegativeArraySizeException";
export * from "./CloneNotSupportedException";

export * from "./System";
export * from "./StackTraceElement";

/**
 * Helper method to convert Unicode 21 bit code points to a string, using the built-in TS string type.
 *
 * @param codePoints The codepoints to convert.
 *
 * @returns The string containing the values from the input.
 */
export const codePointsToString = (codePoints: Uint32Array): string => {
    return String.fromCodePoint(...codePoints);
};

/**
 * Helper method to convert Unicode 16 bit values to a string, using the built-in TS string type.
 * This conversion supports surrogate pairs.
 *
 * @param charCodes The codepoints to convert.
 *
 * @returns The string containing the values from the input.
 */
export const charCodesToString = (charCodes: Uint16Array): string => {
    return String.fromCharCode(...charCodes);
};
