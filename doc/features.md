# Feature Details

Java and Typescript are in many aspects pretty similar, which makes a conversion relatively easy. However, there are also quite a few things that must be considered when using the converted Typescript code. Some require manual resolution and some language features are not available in Typescript. You didn't expect anything else, did you?

The converter avoids extending existing classes (like `String`), which means certain functionality must be provided by other classes. For example `String.format` is converted to `util.format` (with no support for a locale).

## Interfaces

Java interfaces are one of the most incompatible objects between the two languages. Java interfaces can have initialized fields and method implementations, which is not supported in Typescript. Hence all interfaces are converted to abstract TS classes.

Fortunately, TS allows that a class `implements` another class, not only an interface. Using `implements` is however not always a good solution (especially when referencing symbols from the base class). An effort is made to use `extends` in simple cases (no existing `extends` clause and only one type in the `implements` clause) instead. Using `extends` for all classes in general is not possible, as that might lead to multiple inheritance, which is not supported by TS/JS.

## Enumerations

Enums in Java are objects with compiler synthesized methods, which can only partially mapped to TS enums. Only the enum constants can be taken over and only those that are not functions. Any other enum construct must be fixed manually.

## Iterators

Java Iterators differ significantly from their counterpart in TS and hence cannot automatically be converted. Instead they are implemented like normal Java code and cannot be used like native TS iterators. However, the JDK shims for maps and sets support both types of iterators, to allow direct use of them in TS iterations.

## Methods, Rest Parameters and Overloading

Method overloading is supported up to the point what's possible in Typescript. That excludes mixing static and non-static overloaded methods and generic methods with different type parameter lists. All overloaded methods must have the same visibility (public/protected/private) and overloaded methods which override inherited methods may not work out of the box and may hence need manual changes.

The conversion to the TS method overloading (with their overloading signatures and the implementation signature) requires sometimes to re-order source code. Because the implementation bodies of the method overloads are combined into one TS method body it is not possible to maintain the same code structure for them.

Rest parameters are supported but need manual resolution in overloading scenarios, because the implementation signature becomes just a single rest parameter (which can represent any of the overload parameters).

## Implicit Nullability

All object parameters, fields and variables can be null, without explicit notation. This would require to always generate a union type with `undefined` for such elements. However, often it is implicitly assumed that, for example, parameters are always assigned and the Java code contains no checks for null. For this reason (and to avoid bloating parameter lists) `undefined` is not added to parameters and so on. Instead the linter can help to determine cases where undefined elements can appear, for a manual fix.

## Arrays

Typescript does not support multi-dimensional array creation with array sizes (initializers are supported however). That means constructs like `new String[1][2][4]` can only be converted to TS without initial sizes: `= [[[]]]`. This might require manual changes in the code that uses such an array, if it relies on a specific size of an array (by explicitly setting an array member, instead of pushing values to it).

## Numbers

Single numbers are always converted to `number`, whether they are integers or floating point Java types. To match Java semantics better there's one exception: `long`, which is converted to `bigint` (64bit). This creates a problem on TS side. There's no automatic conversion between a number and a bigint, like there is in Java. This must be solved manually, just like cases where Java does automatic boxing and unboxing of primitive types from/to their object type (e.g. `Integer` <-> `int`)

Numbers in arrays are converted directly according to their Java type. For example `int[]` is converted to `Uint32Array`.

## Annotations

Annotations usually cannot be converted, except for a very few (like @final), which are implemented using decorators. The current implementation is however very basic. Don't expect much of that.

## Reflection

Reflection is partially supported, by implementing `getClass()` and `.class` accessors where needed. The package `java.lang.reflect` is not supported, however.

## Regular Expressions

TS regular expressions do not support all features from Java regex, specifically these flags are not supported:

    - Pattern.CANON_EQ
    - Pattern.COMMENTS
    - Pattern.LITERAL
    - Pattern.UNIX_LINES.

Just like for iterators, Java regular expressions are not converted to their native TS variant, but converted like normal code, with a thin wrapper that satisfies the Java APIs, but uses native regular expressions under the hood.

## Initializers

Java class initializers are handled properly, however, static initializers require ECMA 2022 as transpilation target for the TS code. Non-static initializers are converted to a parameter-less constructor (which might then be merged with other constructor code if that creates a constructor overloading situation).

## Char and String

Strings in Java and TS are pretty similar. TS automatically does boxing and unboxing of string literals and string objects (just like in Java). For this reason all appearances of `String` (the object type) are converted to type `string` (which denotes both string objects and string literals).

In both languages strings are stored in UTF16 (two bytes per character) and use surrogates for values > 0xFFFF. However, there's no simple `char` type in TS, so we can only use `number` for it. To better distinguish a char type from an ordinary number a type alias is used in TS (`CodePoint`) for any occurrence of a single `char`. However, using a number for a char is all but optimal, so arrays of chars are converted to `Uint16Array` instead, which is as efficient as the Java implementation.

Where both string implementations differ are the implemented interfaces. Particularly there's no way to implement `CharSequence` and `Comparable` interfaces, without extending the built-in `String` type. A manual resolution is necessary in cases where this is used.

## Containers and Equality

Containers (every class implementing `java.util.Set` and `java.util.Map`) require special attention. In Java these classes use **Object Equality** to locate elements. This approach not only compares objects by reference, but also uses their `equals()` method to compare them (together with their `hashCode()` method). This cannot only lead to deep comparisons, but also to equality of different instances, if they contain the same values. Object equality is achieved by comparing value hash codes. Such values can only be equal if they have the same hash code.

In contrast, there's the so-called **Identity Equality** (aka **Reference Equality**). This approach is defined by considering two objects being equal only, if their memory references are the same. There are special containers implementing exactly this behavior (like `java.util.IdentityHashMap`).

In JS/TS the second approach is used by all containers and an extra effort is required to add support for object equality. However, even though the `equals()` method is supported by all Java objects, the default behavior of this method is to compare only references. So, even if object equality is supported by default, it doesn't always mean, it's also in actual use. Only if types implement the `equals()` - and consequently the `hashCode()` - methods, then object equality is actually used.

In addition to these considerations there's the fact that primitive types are always compared by value (both in Java and JS/TS). Number, bigint, string, boolean and the special values `undefined` and `NaN` fall under this category. So they neither need to implement an `equals` method nor can they be compared by reference. Side note: `null` and `symbol` are also marked as primitive type in JS/TS, but `null` is not really a primitive and `symbol` is not used in converted Java code.

As a consequence of that it's very important to select the right JS/TS container replacement for a Java container. The JDK shims contain implementations for HashMap and HashSet, which follow the object equality semantic, and IdentityHashMap (using reference equality).

> Note: `HashMap.keySet`, `HashMap.entrySet` and `HashMap.values` are fully supported and return views of the values in the map, which support the Java semantics as described in the Java docs.

## Nested Classes and Interfaces

Nested classes and types are converted to local classes in Typescript by using either a class expression (for static nested classes) or class factory methods (for non-static nested classes). This concept allows non-static inner classes to access all members of the outer class (including private ones) and supports inheritance between local classes (and external use anyhow).

To allow use of such local classes as a type, a namespace declaration is automatically added at the end of the generated file.

## Constructors

Constructors are mostly handled like methods (including overloading), but need a bit more attention. Usually linters require that constructors are listed at the beginning of a class definition, so they will be moved to that position in the converted file (if not there already).

What's not supported is generic constructors, as this is not possible with TS. Such code must be manually fixed.

### Explicit Constructor Invocation

Explicit constructor invocation (also known as constructor chaining) is a concept where one constructor can call another constructor in the same class, by using the function call `this()`. This is implemented in TS by converting all constructors to a single implementation (like for any overloaded method), but additionally the generated body is placed into a local closure, which allows to call itself recursively, emulating so the chaining.

While this implementation works well, there are a few issues with it:

- Initialization of read-only class members cause a Typescript error, because the initialization happens now in the mentioned closure and not directly in the constructor body. These errors must be manually suppressed by placing a `// @ts-ignore` (or `@ts-expect-error`) line directly before each assignment line.
- Typescript considers `super()` calls, which are not directly executed in the constructor body as error. Additionally, such calls are not counted when Typescript (and ESlint) check for an existing `super()` call for derived classes. All these 3 errors must be suppressed as well. The tool will automatically insert TS suppression lines, if the `suppressTSErrorsForECI` option is set. Though this might hide other errors too, which is why the automatic insertion is optional. The ESlint errors are always suppressed as they rather have informational character and are for very specific problems (not like the TS suppression).

Here's a real world example of the final form of a constructor, which uses overloading and initializes read-only members:

```typescript
    /* eslint-disable constructor-super, @typescript-eslint/no-unsafe-call */
    public constructor(a: SingletonPredictionContext);
    public constructor(parents: PredictionContext[], returnStates: number[]);
    /* @ts-expect-error, because of the super() call in the closure. */
    public constructor(aOrParents: SingletonPredictionContext | PredictionContext[], returnStates?: number[]) {
        const $this = (aOrParents: SingletonPredictionContext | PredictionContext[], returnStates?: number[]): void => {
            if (aOrParents instanceof SingletonPredictionContext && returnStates === undefined) {
                const a = aOrParents;
                $this([a.parent], [a.returnState]);
            } else {
                const parents = aOrParents as PredictionContext[];
                /* @ts-expect-error, because of the super() call in the closure. */
                super(PredictionContext.calculateHashCode(parents, returnStates));
                /* @ts-ignore */
                this.parents = parents;
                /* @ts-ignore */
                this.returnStates = returnStates;
            }
        };

        $this(aOrParents, returnStates);

    }
    /* eslint-enable constructor-super, @typescript-eslint/no-unsafe-call */
```

## Exception Handling and Try-with-resources

The converter tries to preserve as much of Java's exception semantics as possible, even at the price of higher code complexity. However, there are certain limits.

Usually, the message of an exception (unless explicitly specified in the converted code) is not what the JDK is using, especially for exceptions originating in native code (e.g. file APIs). At a later point in time, someone might take the burden and extract the correct error messages from the JDK source code.

The `Throwable` implementation parses the stacktrace in a JS/TS error object to find the individual stack elements (`StackTraceElement`). However, that's not exactly what's available in Java (but close). This class also helps to implement the semantic of suppressed exceptions, but because that's automatic in Java, though not in JS/TS, this works only in certain circumstances (namely try-with-resource statements, see next paragraph). To recap: exceptions thrown in a try block are not visible when the finally block also throws an exception. In Java the exceptions from the try block are added as suppressed exceptions to the exception thrown in the finally block. In JS/TS these exceptions are lost, however.

Java 8 and higher support a construct which ensures that certain resources are automatically closed, regardless of errors. For this the try/catch/finally statement supports an additional expression between the `try` keyword and the opening curly brace. Any object that implements the AutoCloseable interface is automatically closed when the try block finished execution (with or w/o errors). To emulate this behavior additional try blocks are inserted, which handle exceptions in the same way as Java does.

## Serialization and Deserialization

The serialization concept is not supported in Typescript.

