# Feature Details <!-- omit from toc -->

## Table of contents <!-- omit from toc -->

- [Introduction](#introduction)
- [Generics and Type Wildcards](#generics-and-type-wildcards)
- [Interfaces](#interfaces)
- [Modifiers and Access Levels](#modifiers-and-access-levels)
- [Enumerations](#enumerations)
- [Iterators](#iterators)
- [Methods, Rest Parameters and Overloading](#methods-rest-parameters-and-overloading)
- [Implicit Nullability, the `null`, and undefined values](#implicit-nullability-the-null-and-undefined-values)
- [Arrays](#arrays)
- [Numbers](#numbers)
- [Text](#text)
  - [Char and String](#char-and-string)
  - [Encoding and Decoding](#encoding-and-decoding)
- [Boxing and Unboxing](#boxing-and-unboxing)
- [Regular Expressions](#regular-expressions)
- [Initialisers](#initialisers)
- [Containers and Equality](#containers-and-equality)
- [Buffers](#buffers)
- [Nested Classes and Interfaces](#nested-classes-and-interfaces)
- [Constructors](#constructors)
  - [Explicit Constructor Invocation](#explicit-constructor-invocation)
- [Exception Handling and Try-with-resources](#exception-handling-and-try-with-resources)
- [Reflection](#reflection)
- [System Properties](#system-properties)
- [Others](#others)
- [Unsupported Features](#unsupported-features)
  - [Annotations](#annotations)
  - [Serialisation and Deserialisation](#serialisation-and-deserialisation)
  - [Security](#security)
  - [Threading](#threading)
  - [Asynchronous File Operations](#asynchronous-file-operations)
- [Symbol Resolution and Import Resolvers](#symbol-resolution-and-import-resolvers)


## <a name="introduction">Introduction</a>

Java and Typescript are in many aspects pretty similar, which makes a conversion relatively easy. However, there are also quite a few things that must be considered when using the converted Typescript code. Some require manual resolution and some language features are not available in Typescript.

An important aspect for the conversion is what runtime to use that provides the same API like what's available in the JRE. Such a runtime is the JREE ([Java Runtime Environment Emulation](https://github.com/mike-lischke/jree)), which has been developed as part of the java2typescript development. Some language aspects are only relevant to that runtime and discussed there, while others are purely conversion related and hence listed below.

## <a name="generics">Generics and Type Wildcards</a>

Generic syntax and semantics in Java and TypeScript are pretty much the same, with the exception of bounded type parameters and type wildcards. The concepts are sometimes handled a bit differently in converted code. Java knows these scenarios:

- `compare<T>`: a straight forward type parameter, supported exactly like that in TypeScript.
- `compare<U extends T>`: an upper bounded type parameter, supported exactly like that in TypeScript.
- `compared<? extends T>`: an upper bounded type parameter with a wildcard, this corresponds to the first scenario in TypeScript.
- `compare<? super T>`: a lower bounded type parameter with a wildcard, a concept not supported by TypeScript (see also [this discussion](https://github.com/Microsoft/TypeScript/issues/14520)). Such an expression is converted to just `compare<T>`, which is not entirely correct and must be handled manually if required.
- `s: Set<?>`: a wildcard capture,  which is converted to `s: Set<unknown>`.

## <a name="interfaces">Interfaces</a>

Java interfaces are more than interfaces in the original sense (API contracts), as they can have actual code, much like classes. As this is not supported in Typescript different paths are taken in the conversion process. Java interfaces without methods and initialized fields are converted directly to their TypeScript interface equivalent. Otherwise they are implemented as abstract classes, which is an acceptable workaround. Especially, as TypeScript interfaces can extend TypeScript classes.

Together with the namespace, which is sometimes generated (see [Nested Classes and Interfaces](#nested-classes-and-interfaces)) this can lead to a file which contains an interface, a class and a namespace, all with the same name.

## <a name="modifiers">Modifiers and Access Levels</a>

Typescript, just like Java, supports the usual `public`, `protected` and `private` access levels. They are directly taken over, with the exception that a public class is converted to an exported class. In addition to those Java also knows the [package-private](https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html) access level, which has no representation in Typescript. Therefore it is converted to its closest semantic: `protected`. This may lead to a problem if code in the same package tries to access such a protected member (which is valid in Java). You have to solve this manually.

In addition to access levels there's a range of additional modifiers:

- `native`: unsupported, ignored
- `synchronized`: unsupported, ignored
- `transient`: unsupported, ignored
- `volatile`: unsupported, ignored
- `static`: same meaning in TS, taken over
- `abstract`: same meaning in TS, taken over
- `final`: converted to `readonly` for class members, ignored for top level types
- `strictfp`: unsupported, ignored
- `sealed`, unsupported (Java 17), ignored
- `non-sealed`, unsupported (Java 17), ignored

## <a name="enumerations">Enumerations</a>

Enums in Java are essentially classes with extra functionality. Enum members (constants) are instances of the enum type with specific values. Each enum constant can customize the behavior of the inherited enum type, by specifying custom constructor parameters and an own class body, which may override methods. All that is also modelled in Typescript, which requires to implement all the implicit handling of the Java VM explicitly.

Even though enum members are instances of the enum class they can still be used in switch statements, unchanged. The base `Enum` class uses *primitive type coercion*, just like other types that represent primitive values.

Read also the [Boxing and Unboxing chapter](#boxing-and-unboxing).

## <a name="iterators">Iterators</a>

Both the `Iterator` and the `Iterable` interfaces are supported in Java as well as in TypeScript. However, the `Iterator` interface in Java supports additional functionality (namely the mandatory `hasNext()` and optional `remove()` methods), which is not available in TypeScript. For this reason an own implementation is used instead, but that supports the `Iterable` interface, to allow direct translation of `for` loops with iterable objects.

## <a name="methods">Methods, Rest Parameters and Overloading</a>

Method overloading is supported up to the point what's possible in Typescript. That excludes mixing static and non-static overloaded methods. All overloaded methods must have the same visibility (public/protected/private) and overloaded methods which override inherited methods may not work out of the box and may hence need manual changes.

The conversion to TypeScript method overloading (with their overloading signatures and the implementation signature) requires sometimes to re-order source code. Because the implementation bodies of the method overloads are combined into one TypeScript method body, it is not possible to maintain the same code structure for them.

The generated implementation signature consists only of a single rest parameter, which has turned out to be the best way to handle different parameter lists, in possibly many overloads. And it allows to have rest parameters in overloads as well. The tool generates a switch statement which acts on the number of parameters found in the rest parameter list. The block for case branch then contains the translated code of the original Java method and often needs additional manual work (e.g. to fix cases where two overloads have the same amount of parameters).

## <a name="nullability">Implicit Nullability, the `null`, and Undefined Values</a>

All parameters, fields and variables with an object type can be `null`, without explicit notation. This must not be confused with an undefined value. Just like in TypeScript `null` is a (special) value and accepting it as method parameter does not mean this value can be undefined, at least when strictly comparing values.

All non-primitive parameters, variables/fields and return values are by default generated with an additional `| null` part to indicate the possible null value for them. This may not always be correct (e.g. when Java originally expects a non-null value) and may require extra work. There's an option value (`addNullUnionType`) to switch this behavior off.

## <a name="arrays">Arrays</a>

Typescript does not support multi-dimensional array creation with array sizes (initialisers are supported however). That means constructs like `new String[[2][4]]` can only be converted to TypeScript without initial sizes: `= [[[]]]`. Arrays in Java are of fixed size, which is why they are created with an initial size (or an initializer) and later manipulated using array indexes. You must therefore manually allocate enough space in such arrays.

## <a name="numbers">Numbers</a>

Typescript only knows 2 number types: `number` and `bigint`. To ease readability Java number types are kept as is. The JRE TS runtime contains type aliases which map all the primitive Java number types to the Typescript `number` (expect for `long` which is aliased to `bigint`). This way you can continue using these primitive types in the converted code, but you should be aware that there are no automatic conversions between them.

For each primitive type there's an object type in both languages (e.g. `int` and `java.lang.Integer` etc.). Unfortunately, it is not possible to automatically convert between the converted types in Typescript (read also the [Boxing and Unboxing chapter](#boxing-and-unboxing)). This requires probably most of the remaining manual work in the converted code, to fix all the assignments, which mix primitive and object types.

For arrays of primitive values the situation is different, however. Typescript knows [typed arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays), which allow to optimize handling for such arrays. As a result `int[]` can be converted to `Int32Array`, `float[]` to `Float32Array`, `double[]` to `Float64Array` etc.

There's currently no support for `BigInteger` and `BigNumber`;

## <a name="text>Text</a>

### <a name="string">Char and String</a>

Both Java and TypeScript have a large repertoire to handle strings. Each language automatically converts between string literals and string objects. Sadly, there's no automatic boxing of string literals using `java.lang.String` (just like with any of these primitive wrapper types).

Read also the [Boxing and Unboxing chapter](#boxing-and-unboxing).

In both languages strings are stored in UTF-16 (two bytes per character) and use surrogates for values > 0xFFFF. However, there's no simple `char` type in TS, so we can only use `number` for it. To better distinguish a char type from an ordinary number a type alias is used (`char`). Arrays of chars, on the other hand, are converted to `Uint16Array` instead, which should be as efficient as the Java implementation.

### <a name="coding">Encoding and Decoding</a>

The classes `java.nio.charset.Charset`, `java.nio.charset.CharsetEncoder` and `java.nio.charset.CharsetDecoder` internally use the `TextEncoder` and `TextDecoder` classes from the browser. With them a large number of charsets are available for decoding. Unfortunately, the `TextEncoder` class does not support encoding to other but UTF-8.

## <a name="boxing">Boxing and Unboxing</a>

Boxing describes the effect of wrapping a primitive value in an object for additional functionality, while unboxing describes the opposite way. Both Java and Typescript support a number of auto boxing and unboxing scenarios.

Automatic wrapping of a primitive value is typically done when assigning a literal or simple value to an object type, or when calling a method on a literal (like `"abc".length`).

Automatic unboxing, on the other hand, is used when primitive values are needed in an expression, which requires manual work. The tool has an option to convert string literals to string templates, which are provided by `JREE` to implicitly create a `java.lang.String` instance. This may get in the way when string literals are concatenated using the plus operator (you cannot add two objects together). If that's the case for you switch the behavior off by setting `wrapStringLiterals` to false.

## <a name="initialisers">Initialisers</a>

Java class initialisers are handled properly, however, static initialisers require ECMA 2022 as transpilation target for the TypeScript code. Non-static initialisers are converted to a parameter-less constructor (which might then be merged with other constructor code if that creates a constructor overloading situation).

The tool can omit the type of a member if it gets a value from an initializer. This can be switched by setting `suppressTypeWithInitializer` to `true` or `false`.

## <a name="classes">Nested Classes and Interfaces</a>

Nested classes and types are converted to local classes in Typescript by using either a class expression (for static nested classes) or class factory methods (for non-static nested classes). This concept allows non-static inner classes to access all members of the outer class (including private ones) and supports inheritance between local classes (and external use anyhow).

To allow use of such local classes as a type, a namespace declaration is automatically added at the end of the generated file.

> Note: in opposition to Java it is not possible for the outer class to access non-public members of nested classes. You have to convert all members that are required outside of the nested class to be publicly accessible. This shouldn't cause any trouble if the nested class itself is defined as non-public.

## <a name="constructors">Constructors</a>

Constructors are mostly handled like methods (including overloading), but need a bit more attention, especially when explicit constructor invocation (see below) exist.

What's not supported is generic constructors, as this is not possible with TypeScript. Such code must be manually fixed.

### <a name="eci">Explicit Constructor Invocation</a>

Explicit constructor invocation (also known as constructor chaining) is a concept where one constructor can call another constructor in the same class, by using the function call `this()`. The tools converts such calls like any other function call, which is obviously not correct. It is necessary to manually handle this case, but at least the individual code blocks for each overload is preserved (and converted).

## <a name="exceptions">Exception Handling and Try-with-resources</a>

The converter tries to preserve as much of Java's exception semantics as possible, even at the price of higher code complexity. However, there are certain limits.

Usually, the message of an exception (unless explicitly specified in the converted code) is not what the JRE is using, especially for exceptions originating in native code (e.g. file APIs).

The `Throwable` implementation parses the stacktrace in a TypeScript error object to find the individual stack elements (`StackTraceElement`). However, that's not exactly what is available in Java (but close). This class also helps to implement the semantic of suppressed exceptions, but because that's automatic in Java, though not in JS/TS, this works only in certain circumstances (namely in try-with-resource statements, see next paragraph). To recap: exceptions thrown in a try block are not visible when the finally block also throws an exception. In Java the exceptions from the try block are added as suppressed exceptions to the exception thrown in the finally block. In TypeScript these "inner" exceptions are lost.

Java 8 and higher support a construct which ensures that certain resources are automatically closed, regardless of errors. For this concept the try/catch/finally statement supports an additional expression between the `try` keyword and the opening curly brace. Any object that implements the `AutoCloseable` interface is automatically closed when the try block finished execution (with or w/o errors). To emulate this behavior additional try blocks are inserted, which handle exceptions in the same way as Java does.

## <a name="reflection">Reflection</a>

Reflection support is only rudimentary currently. All generated classes derive from `java.lang.Object` where some of the reflection support is located (`.class` getter and `.getClass()` method), but that's about it currently. Typescript also has some reflection support (list methods etc.), but that isn't used yet.

Sometimes Java code checks the type of a class by comparing it like `if (t.getClass() === AClass.class)`. This is converted as is and will even work, but it's better (and feels more natural) to (manually) convert such expression to the usual `if (t instanceof AClass)` expression.

## <a name="others">Others</a>

This chapter collects a few other things that are worth to be mentioned.

- `java.lang.Object.toString()` returns a Typescript string, not `java.lang.String` to avoid a circular dependency between the two classes.
- The same holds true for `java.lang.Class.getName()` and `java.lang.Class.getSimpleName()`.
- All classes deriving from `java.lang.Object` override the `toString()` method and return `java.lang.String`, however.
- All classes and interfaces that have a companion with the same name in Typescript (like Number, Object, String, Map etc.) are prefixed with `Java` to avoid confusion (e.g. JavaString, JavaMap etc.) and which allows to import them without conflicts. You still can use fully qualified names with the original class and interface names (e.g. `java.lang.Object`).

## <a name="unsupported">Unsupported Features</a>

### <a name="Annotations">Annotations</a>

Currently annotations are not converted.

### <a name="serialisation">Serialisation and Deserialisation</a>

The serialisation concept is not supported in Typescript.

### <a name="threading">Threading</a>

Because TypeScript is single threaded (and workers cannot share objects) there's no need to support any of the synchronisation methods from Java. Synchronized blocks are converted to simple blocks, but the `synchronized` keyword is left as a comment in the target code to indicate that a block was originally used in multi threading scenarios and needed special attention.

### <a name="async-file-operations">Asynchronous File Operations</a>

Asynchronous file operations (interruptible channels etc.) are not supported either.

### <a="memory-mapped-files>Memory Mapped Files</a>

Memory mapped files require support from a native package (Node.js does not support them and in a browser they are totally out of scope), so there's no support for them.

## <a name="symbol-resolution">Symbol Resolution and Import Resolvers</a>

In opposition to Java all non-local symbols in Typescript must use the fully qualified identifier form (e.g. `this.` for class/interface members, `ClassName.` for static members etc.). This requires to resolve every symbol (types, variable names etc.). The converter resolves symbols according to this model:

- The current file (local variables, parameters, normal and static class members, in this order).
- Any of the extended or implemented classes/interfaces (public and protected normal and static class members), in the order they are specified in the Java code.
- Any of the files in the current project/package (only exported classes/interfaces), in the order they are found while enumerating the files on disk.
- Module mappings (exported classes/interfaces from a 3rd party package), in the order they are given.
- Import resolvers.

If a symbol cannot be resolved then the original text is used and the user has to fix it manually.

> Note: The symbol resolution process does not handle symbol shadowing (for example a local variable with the same name as a method in the class), which is bad style anyway. This situation must be solved manually.

Import resolvers are the last resort to get symbols automatically resolved if nothing else works. There is one predefined resolver in the project: for the JRE. See the [separate readme](../src/lib/java/readme.md) for details, how to work with and extend the JRE shims.

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

Normally you would, however, not create an empty source, but one that can deal with symbols and return fully qualified names. For an example how to do that check the `JavaPackageSource.ts` file, which manually creates a symbol table for all supported Java types, and holds the target path to the TypeScript implementations (shims) for path resolution.
