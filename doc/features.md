# Feature Details

Java and Typescript are in many aspects pretty similar, which makes a conversion relatively easy. However, there are also quite a few things that must be considered when using the converted Typescript code. Some require manual resolution and some language features are not available in Typescript. You didn't expect anything else, did you?

The converter avoids extending existing classes (like `String`), which means certain functionality must be provided by other classes. For example `String.format` is converted to `util.format` (with no support for a locale).

## Interfaces

Java interfaces are one of the most incompatible objects between the two languages. Java interfaces can have initialized fields and method implementations, which is not supported in Typescript. Hence all interfaces are converted to abstract TS classes.

Fortunately, TS allows that a class `implements` another class, not only an interface. Using `implements` is however not always a good solution (especially when referencing symbols from the base class). An effort is made to use `extends` in simple cases (no existing `extends` clause and only one type in the `implements` clause) instead. Using `extends` for all classes in general is not possible, as that might lead to multiple inheritance, which is not supported by TS/JS.

## Object

All Java types are implicitly based off `java.lang.Object`. This concept is currently not used for the generated TS code. That also means that no generated class supports any of the `java.lang.Object` methods (`clone`, `finalize`, `getClass`, `notify`, `notifyAll`, `wait`). See also the reflection section.

## Enumerations

Enums in Java are objects with compiler synthesized methods, which can only partially mapped to TS enums. Only the enum constants can be taken over and only those that are not functions. Any other enum construct must be fixed manually.

## Iterators

Both the `Iterator` and the `Iterable` interfaces are supported in Java as well as in TS. However, the `Iterator` interface in Java supports additional functionality (namely mandatory `hasNext()` and optional `remove()`), which is not available in TS. Hence an own implementation is used instead, but that supports the `Iterable` interface, to allow direct translation of `for` loops with iterable objects.

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

Support of reflection is only done very rudimentary, as it requires help from the Java VM, which we don't have in TS and it's probably not a good idea to simulate that. An attempt is made to convert access to `getClass` in a class definition to an automatically generated method, which is however private and cannot be used by other classes. This is really only a workaround, which doesn't work well, so it might happen that this conversion is removed in the future.

Expressions like `type.class` are converted to a creation call of the `java.lang.Class` class, which implements only a very small part of the `Class` API (and has not the exact same semantic like what's in Java).

This all won't help much, so it's probably most of the time necessary to manually adjust such reflection code. Usually it's simpler in TS to write expressions like `if (t.getClass() === AClass.class)` as `if (t instanceof AClass)`, which cannot be generated automatically, because of the different levels at which each part of the source expression is handled.

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

Strings in Java and TS are pretty similar. TS automatically does boxing and unboxing of string literals and string objects (just like Java). For this reason all parameters of `String` (the object type) are converted to type `string`, which allows to pass in either a TS string object or literal and a Java string object.

In both languages strings are stored in UTF16 (two bytes per character) and use surrogates for values > 0xFFFF. However, there's no simple `char` type in TS, so we can only use `number` for it. To better distinguish a char type from an ordinary number a type alias is used in TS (`java.lang.char`) for any occurrence of a single `char` (and uses a number as base type, with only the lowest 16 bits). This type is treated as value from the Unicode basic multilingual pane (BMP) and uses surrogate pairs to form values beyond 0xFFFF. However, using a number for a char is all but optimal, so arrays of chars are converted to `Uint16Array` instead, which is as efficient as the Java implementation.

Where both string implementations differ are the implemented interfaces. Particularly there's no way to implement `CharSequence` and `Comparable` interfaces, without extending the built-in `String` type. A manual resolution is necessary in cases where this is used.

## Containers and Equality

Containers (every class implementing `java.util.Set` and `java.util.Map`) require special attention. In Java these classes use **Object Equality** to locate elements. This approach not only compares objects by reference, but also uses their `equals()` method to compare them (together with their `hashCode()` method). This cannot only lead to deep comparisons, but also to equality of different instances, if they contain the same values. Object equality is achieved by comparing value hash codes. Such values can only be equal if they have the same hash code.

In contrast, there's the so-called **Identity Equality** (aka **Reference Equality**). This approach is defined by considering two objects being equal only, if their memory references are the same. There are special containers implementing exactly this behavior (like `java.util.IdentityHashMap`).

In JS/TS the second approach is used by all containers and an extra effort is required to add support for object equality. However, even though the `equals()` method is supported by all Java objects, the default behavior of this method is to compare only references. So, even if object equality is supported by default, it doesn't always mean, it's also in actual use. Only if types implement the `equals()` - and consequently the `hashCode()` - methods, then object equality is actually used.

In addition to these considerations there's the fact that primitive types are always compared by value (both in Java and JS/TS). Number, bigint, string, boolean and the special values `undefined` and `NaN` fall under this category. So they neither need to implement an `equals` method nor can they be compared by reference. Side note: `null` and `symbol` are also marked as primitive type in JS/TS, but `null` is not really a primitive and `symbol` is not used in converted Java code.

As a consequence of that it's very important to select the right JS/TS container replacement for a Java container. The JRE shims contain implementations for HashMap and HashSet, which follow the object equality semantic, and IdentityHashMap (using reference equality).

> Note: `HashMap.keySet`, `HashMap.entrySet` and `HashMap.values` are fully supported and return views of the values in the map, which support the Java semantics as described in the Java docs.

## Nested Classes and Interfaces

Nested classes and types are converted to local classes in Typescript by using either a class expression (for static nested classes) or class factory methods (for non-static nested classes). This concept allows non-static inner classes to access all members of the outer class (including private ones) and supports inheritance between local classes (and external use anyhow).

To allow use of such local classes as a type, a namespace declaration is automatically added at the end of the generated file.

> Note: in opposition to Java it is not possible for the outer class to access non-public members of nested classes. You have to convert all members that are required outside of the nested class to be publicly accessible. This shouldn't cause any trouble if the nested class itself is defined as non-public.

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

Usually, the message of an exception (unless explicitly specified in the converted code) is not what the JRE is using, especially for exceptions originating in native code (e.g. file APIs).

The `Throwable` implementation parses the stacktrace in a TS error object to find the individual stack elements (`StackTraceElement`). However, that's not exactly what is available in Java (but close). This class also helps to implement the semantic of suppressed exceptions, but because that's automatic in Java, though not in JS/TS, this works only in certain circumstances (namely try-with-resource statements, see next paragraph). To recap: exceptions thrown in a try block are not visible when the finally block also throws an exception. In Java the exceptions from the try block are added as suppressed exceptions to the exception thrown in the finally block. In TS these exceptions are lost.

Java 8 and higher support a construct which ensures that certain resources are automatically closed, regardless of errors. For this concept the try/catch/finally statement supports an additional expression between the `try` keyword and the opening curly brace. Any object that implements the `AutoCloseable` interface is automatically closed when the try block finished execution (with or w/o errors). To emulate this behavior additional try blocks are inserted, which handle exceptions in the same way as Java does.

## Serialization and Deserialization

The serialization concept is not supported in Typescript.

## Security

Java optionally uses a security manager to manage access to certain resources, like system properties. The current JRE shims do not support such a manager.

## Threading

Because TS is single threaded (and workers cannot share objects) there's no need to support any of the synchronization methods from Java. Synchronized blocks are converted to simple blocks, but the `synchronized` keyword is left as a comment in the target code to indicate that a block was originally used in multi threading scenarios and needed special attention.

For the same reason there's no need to add `Hashtable` to the JRE shims as it is essentially just a synchronized `HashMap`.

## System Properties

System properties are supported just like in Java, and get their initial values from the current environment (either `navigator` or `os` and `process` Node JS modules). JVM, Java and JRE specific entries (see [`java` namespace](https://docs.oracle.com/javase/7/docs/api/java/lang/System.html#getProperties()) are filled with arbitrary values, e.g. matching the supported Java version of the java2ts tool. Applications using such properties in generated code should replace the default values with something that matches the expected values.

## Symbol Resolution and Import Resolvers

In opposition to Java all symbols in Typescript must use the fully qualified identifier form (e.g. `this.` for class/interface members, `ClassName.` for static members etc.). This requires to resolve every symbol (types, variable names etc.). The converter resolves symbols according to this model:

- The current file (local variables, parameters, normal and static class members, in this order).
- Any of the extended or implemented classes/interfaces (public and protected normal and static class members), in the order they are specified in the Java code.
- Any of the files in the current project/package (only exported classes/interfaces), in the order they are found while enumerating the files on disk.
- Module mappings (exported classes/interfaces from a 3rd party package), in the order they are given.
- Import resolvers.

If a symbol cannot be resolved then the original text is used and the user has to fix it manually.

> Note: The symbol resolution process does not handle symbol shadowing (for example a local variable with the same name as a method in the class), which is bad style anyway. This situation must be solved manually.

Import resolvers are the last resort to get symbols automatically resolved if nothing else works. There is one predefined resolver in the project: for the JRE. See the [separate readme](../lib/java/readme.md) for details, how to work with and extend the JRE shims.

The converter uses so-called package sources for keeping symbol information per file. There are 2 types of package sources:

- For source code Java files.
- For packages without source code.

A file package source is automatically created for each of the Java files in the current package (and each of the 3rd party source files, if specified in the source mapping configuration field). The package source parses the file and creates a symbol table from the generated parse tree. This symbol table is then used to resolve symbols. A package source also knows where to find the source files, to properly create relative import paths in the generated files.

An import resolver function maps a package ID to a package source it creates:

```typescript
const importResolver = (packageId: string): PackageSource[] => {
    const result: PackageSource[] = [];

    knownSDKPackages.forEach((value) => {
        if (packageId.startsWith(value)) {
            result.push(PackageSourceManager.emptySource(value));
        }
    });

    return result;
};
```

In this example the resolver creates empty sources for each known JRE package (which could not be resolved otherwise). An empty source has an empty symbol table and can hence not resolve symbols. So they serve rather as placeholders. If a package cannot be resolved `java2typescript` implicitly creates an empty source (and logs that in the console).

Normally you would, however, not create an empty source, but one that can deal with symbols and return fully qualified names. For an example how to do that check the `JavaPackageSource.ts` file, which manually creates a symbol table for all supported Java types, and holds the target path to the TS implementations (shims) for path resolution.
