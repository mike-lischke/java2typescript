# Feature Details <!-- omit from toc -->

## Table of contents <!-- omit from toc -->

- [Introduction](#introduction)
- [Generics and Type Wildcards](#generics-and-type-wildcards)
- [Interfaces](#interfaces)
- [Abstract Intermediate Classes](#abstract-intermediate-classes)
- [Modifiers and Access Levels](#modifiers-and-access-levels)
- [Enumerations](#enumerations)
- [Iterators](#iterators)
- [Methods, Rest Parameters and Overloading](#methods-rest-parameters-and-overloading)
- [Implicit Nullability, the `null`, and Undefined Values](#implicit-nullability-the-null-and-undefined-values)
- [Arrays](#arrays)
- [Numbers](#numbers)
- [Char and String](#char-and-string)
- [Boxing and Unboxing](#boxing-and-unboxing)
- [Regular Expressions](#regular-expressions)
- [Initialisers](#initialisers)
- [Containers and Equality](#containers-and-equality)
- [Buffers](#buffers)
- [Nested Types](#nested-types)
  - [Static Nested Types](#static-nested-types)
  - [Inner Types](#inner-types)
  - [Local Classes](#local-classes)
  - [Anonymous Classes](#anonymous-classes)
- [Constructors](#constructors)
  - [Explicit Constructor Invocation](#explicit-constructor-invocation)
- [Exception Handling and Try-with-resources](#exception-handling-and-try-with-resources)
- [Reflection](#reflection)
- [System Properties](#system-properties)
- [Others](#other)
- [Unsupported Features](#unsupported-features)
  - [Annotations](#annotations)
  - [Serialisation and Deserialisation](#serialisation-and-deserialisation)
  - [Security](#security)
  - [Threading](#threading)
- [Symbol Resolution and Import Resolvers](#symbol-resolution-and-import-resolvers)


## <a name="introduction">Introduction</a>

Java and Typescript are in many aspects pretty similar, which makes a conversion relatively easy. However, there are also quite a few things that must be considered when using the converted Typescript code. Some require manual resolution and some language features are not available in Typescript. You didn't expect anything else, did you?

There are a number of objects which exist in both languages (`String`, `Object` etc.), which may create conflicts when used directly. Instead you should always use a qualified form of a translated class, for example `java.lang.String` instead of just `String`. In fact this principle is used throughout the JRE emulation as well, even if a class imports another class from the same package, except for classes which are used to derive from, in which case the base class is directly imported to avoid the static initialisation order fiasco.

## <a name="generics">Generics and Type Wildcards</a>

Generic semantics in Java and TS are pretty much the same, with the exception of bounded type parameters and type wildcards. The concepts are sometimes handled a bit differently in converted code. Java knows these scenarios:

- `compare<T>`: a straight forward type parameter, supported exactly like that in TS.
- `compare<U extends T>`: an upper bounded type parameter, supported exactly like that in TS.
- `compared<? extends T>`: an upper bounded type parameter with a wildcard, this corresponds to the first scenario in TS.
- `compare<? super T>`: a lower bounded type parameter with a wildcard, a concept not supported by TS (see also [this discussion](https://github.com/Microsoft/TypeScript/issues/14520)). Such an expression is converted to just `compare<T>`, which is not entirely correct and must be handled manually if required.
- `const s: Set<?> = ...`: a wildcard capture,  which is converted to `const s: Set<unknown>`.

## <a name="interfaces">Interfaces</a>

Java interfaces are more than interfaces in the original sense (API contracts), as they can have actual code, much like classes. As this is not supported in Typescript different paths are taken in the conversion process. Java interfaces without methods that have a body and non-static initialized fields are converted directly to their TS interface equivalent. Otherwise they are implemented as abstract classes, which is an acceptable workaround, especially, as TS interfaces can extend TS classes.

Static initialized fields are moved to a sidecar namespace, similar to what is done for nested types. This bears a problem, however, because such fields can be inherited in Java, while in Typescript they can not. If that's needed and the interface should be kept, then another static field in the "derived namespace" must be added with the same name and value, manually.

A sideshow of the different interface implementation is the possibility to overload interface methods in a class, which also violates the idea of interfaces, as this allows to implement a method differently than what the interface dictates. In Typescript this produces an error, which must be solved manually, by excluding the "overloaded" interface method from the implemented interface. For example:

```typescript
class Test implements Omit<java.lang.Collection<number>, "add"> {
    public add(n: number, doSomething: boolean) {
        ...
    }
}
```

The class `Test` implements the `add` method in a way, which does not conform to the interface `java.lang.Collection`. Totally legal in Java, but needs the `Omit` type trait in Typescript. With this change the `Test` class cannot be used when a `java.lang.Collection` is accepted, as it violates that interface.

## <a name="abstract-classes">Abstract Intermediate Classes</a>

Java often uses abstract intermediate classes (e.g. `java.util.AbstractList`). Such intermediate classes are rarely modelled in the JREE and concrete classes usually derive directly from their non-abstract ancestors, avoiding so large derivation chains and unnecessary work. For example the chain

`java.lang.Object`
    -> `java.util.AbstractCollection<E>`
        -> `java.util.AbstractList<E>`
            -> `java.util.AbstractSequentialList<E>`
                -> `java.util.LinkedList<E>`

is currently modelled as

`java.lang.Object`
    -> `java.util.LinkedList<E>`

but this may be changed later, if the need arises.

## <a name="modifiers">Modifiers and Access Levels</a>

Typescript, just like Java, supports the usual `public`, `protected` and `private` access levels. They are directly taken over, with the exception that a public class is converted to an exported class. In addition to those Java also knows the [package-private](https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html) access level, which has no representation in Typescript. Therefore it is converted to its closest semantic: `protected`. This may lead to a problem if code in the same package tries to access such a protected member (which is valid in Java). You have to solve this manually.

In addition to access levels there's a range of additional modifiers:

- `native`: unsupported, ignored
- `synchronized`: unsupported, ignored
- `transient`: unsupported, ignored
- `volatile`: unsupported, ignored
- `static`: same meaning in TS, taken over
- `abstract`: same meaning in TS, taken over
- `final`: converted to `readonly`
- `strictfp`: unsupported, ignored
- `sealed`, unsupported (Java 17), ignored
- `non-sealed`, unsupported (Java 17), ignored

## <a name="enumerations">Enumerations</a>

Enums in Java are essentially classes with extra functionality. Enum members (constants) are instances of the enum type with specific values. Each enum constant can customize the behavior of the inherited enum type, by specifying custom constructor parameters and an own class body, which may override methods. All that is also modelled in Typescript, which requires to implement all the implicit handling of the Java VM explicitly.

Even though enum members are instances of the enum class they can still be used in switch statements, unchanged. The base `Enum` class uses *primitive type coercion*, just like other types that represent primitive values.

Read also the [Boxing and Unboxing chapter](#boxing-and-unboxing).

## <a name="iterators">Iterators</a>

Both the `Iterator` and the `Iterable` interfaces are supported in Java as well as in TS. However, the `Iterator` interface in Java supports additional functionality (namely the mandatory `hasNext()` and optional `remove()` methods), which is not available in TS. For this reason an own implementation is used instead, but that supports the `Iterable` interface, to allow direct translation of `for` loops with iterable objects.

## <a name="methods">Methods, Rest Parameters and Overloading</a>

Method overloading is supported up to the point what's possible in Typescript. That excludes mixing static and non-static overloaded methods. All overloaded methods must have the same visibility (public/protected/private) and overloaded methods which override inherited methods may not work out of the box and may hence need manual changes.

The conversion to TS method overloading (with their overloading signatures and the implementation signature) requires sometimes to re-order source code. Because the implementation bodies of the method overloads are combined into one TS method body, it is not possible to maintain the same code structure for them.

Rest parameters are supported but need manual resolution in overloading scenarios, because the implementation signature becomes just a single rest parameter (which can represent any of the overload parameters).

## <a name="lambdas">Lambdas</a>

Lambdas are fully supported.

## <a name="nullability">Implicit Nullability, the `null`, and Undefined Values</a>

All parameters, fields and variables with an object type can be `null`, without explicit notation. This must not be confused with an undefined value. Just like in TS `null` is a (special) value and accepting it as method parameter does not mean this value can be undefined, at least when strictly comparing values. In Java, especially in method overloading scenarios, `null` and `undefined` can have a different meaning. Example:

```java
void method1(int param1) {
}

void method1(int param1, SomeObject param2) {
}
```

Calling `method1(1)` will use the first overload, while both `method(1, null)` and `method(1, objectInstance)` will use the second overload. This requires a special construct for method overloading in Typescript:

```typescript
public method1(param1: number, param2?: SomeObject | null) {
    if (param2 === undefined) {
        // Code from first Java overload.
    } else {
         // Code from second Java overload, which may or may not test if param2 is null.
    }
}
```

All non-primitive parameters, variables/fields and return values are converted with an additional `| null` part to indicate the possible null value for them. This may require additional handling, like manually throwing a `java.lang.NullPointerException` for values which must not be `null` and are not tested for `null` in Java code.

## <a name="arrays">Arrays</a>

Typescript does not support multi-dimensional array creation with array sizes (initialisers are supported however). That means constructs like `new String[[2][4]]` can only be converted to TS without initial sizes: `= [[[]]]`. This might require manual changes in the code that uses such an array, if it relies on a specific size of an array (by explicitly setting an array member, instead of pushing values to it).

## <a name="numbers">Numbers</a>

Single primitive numbers (byte, int, short, long, float, double) are converted to `number`. To match Java semantics better there's one exception: `long`, which is converted to `bigint` (64 bits). This creates a problem on TS side. There's no automatic conversion between a number and a bigint, like there is in Java. This must be solved manually.

Numbers in arrays, however, are converted to typed TS arrays according to their Java type. For example `int[]` is converted to `Int32Array`.

There's currently no support for `BigInteger` and `BigNumber`;

Read also the [Boxing and Unboxing chapter](#boxing-and-unboxing).

## <a name="string">Char and String</a>

Strings in Java and TS are pretty similar (at least in their respective realm). TS automatically does boxing and unboxing of string literals and string objects (just like Java). However, the Java `String` type has much more functionality, so it is translated like any other class instead of converting occurrences to the TS `string` type. This makes handling the actual strings in a TS context a bit more inconvenient, because this way the auto (un)boxing does not work as easy as between TS `String`, `string` and string literals.

Read also the [Boxing and Unboxing chapter](#boxing-and-unboxing).

In both languages strings are stored in UTF-16 (two bytes per character) and use surrogates for values > 0xFFFF. However, there's no simple `char` type in TS, so we can only use `number` for it. To better distinguish a char type from an ordinary number a type alias is used in TS (`java.lang.char`) for any occurrence of a single `char` (and uses a number as base type, with only the lowest 16 bits). However, using a number for a char is all but optimal, so arrays of chars are converted to `Uint16Array` instead, which should be as efficient as the Java implementation.

## <a name="boxing">Boxing and Unboxing</a>

Boxing describes the effect of wrapping a primitive value in an object for additional functionality, while unboxing describes the opposite way. Both Java and Typescript support a number of auto boxing and unboxing scenarios.

Automatic wrapping of a primitive value is typically done when assigning a literal or simple value to an object type, or when calling a method on a literal (like `"abc".length`).

Automatic unboxing, on the other hand, is used when primitive values are needed in an expression.

In translated Java source code only automatic unboxing is supported (via [primitive type coercion](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#primitive_coercion)). By default the `.toString()` method is used to convert any of the Java objects to a primitive value (a string). Certain classes override `[Symbol.toPrimitive]` and return another primitive value (e.g. boolean or number) instead.

With that in place you can use such objects mostly like in Java, for example:

```typescript
const b = new java.lang.StringBuilder("def");
console.log("abc" + b);
```

which prints `abcdef`.

For boxing a different approach is used: [tagged templates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates), which unfortunately is not automatic. It's merely a convenience feature that helps to lower manual work on converted code. The java2ts support library contains a number of tagged templates for various primitive types, all named with a single capital letter, according to the object type they create.

```typescript
const s = S`def`; // s is of type java.lang.String
console.log("abc" + s);
```

which prints `abcdef`. Or for numbers:

```typescript
const i1 = I`567`; // Using a string literal (i1 is of type java.lang.Integer).
const i2 = I`${890}`; // Using a number literal (i1 is of type java.lang.Integer).
console.log(1 + i1 + i2);
```

which prints `1458`. Unfortunately, the typescript compiler issues an error for the console call, saying that you cannot add a number and an `Integer` type, which is plain wrong, because obviously this is valid JS code. You can work around this error either by using the unary `+` in addition to the binary operator, wrap the `Integer` instance in a TS `Number`, cast the `Integer` objects to `any`, add a `.valueOf()` call to each object or suppress the error. See also this [years old Typescript issue](https://github.com/microsoft/TypeScript/issues/2361) about this matter.

If you use ESLint as your linter, you may want to disable two rules that get in the way with the described approach, which are [@typescript-eslint/restrict-template-expressions](https://typescript-eslint.io/rules/restrict-template-expressions) and [@typescript-eslint/restrict-plus-operands](https://typescript-eslint.io/rules/restrict-plus-operands).

## <a name="regex">Regular Expressions</a>

TS regular expressions do not support all features from Java regex, specifically these flags are not supported:

- Pattern.CANON_EQ
- Pattern.COMMENTS
- Pattern.LITERAL
- Pattern.UNIX_LINES

Just like for iterators, Java regular expressions are not converted to their native TS variant, but converted like normal code, with a thin wrapper that satisfies the Java APIs, but uses native regular expressions under the hood.

## <a name="initialisers">Initialisers</a>

Java class initialisers are handled properly, however, static initialisers require ECMA 2022 as transpilation target for the TS code. Non-static initialisers are converted to a parameter-less constructor (which might then be merged with other constructor code if that creates a constructor overloading situation).

## <a name="equality">Containers and Equality</a>

Containers (every class implementing `java.util.Set` or `java.util.Map`) require special attention. In Java these classes use **Object Equality** to locate elements. This approach not only compares objects by reference, but also uses their `equals()` method to compare them. This cannot only lead to deep comparisons, but also to equality of different instances, if they contain the same values. Comparison using the `equals` method is accompanied by the `hashCode` method, which returns a number that identifies that object as a single value. The general contract here is that objects which are considered equal **must**  generate the same hash code. However, there's no 1:1 matching: objects returning the same hash code are not always also equal (aka hash conflict).

The class `java.lang.Object` contains a default implementation for both methods, which uses **Identity Equality** (aka **Reference Equality**), both in Java and TS. This is accomplished by comparing the memory address of two objects (which is guaranteed to be unique). The default hash code in TS, however, is a running number internally (as there's no way to get the memory address there). Classes that rely on object equality must override `equals` and `hashCode` and provide an own implementation. The java2ts support library contains an implementation of the MurmurHash3 algorithm to provide hash codes for arbitrary objects and values.

Primitive types, on the other hand, are always compared by value (both in Java and TS). Number, bigint, string, boolean and the special values `undefined` and `NaN` fall under this category. So they neither need to implement an `equals` method nor can they be compared by reference. Side note: `null` and `symbol` are also marked as primitive type in JS/TS, but `null` is not really a primitive and `symbol` is not used in converted Java code.

## <a name="buffers">Buffers</a>

Buffers (like `lang.nio.CharBuffer` or `lang.nio.IntBuffer`) are implemented as specified in Java. However, there's no support for direct and indirect buffers. All buffers use `ArrayBuffer` as underlying storage structure, plus typed arrays (and `DataView` for byte buffers) as interface between the app and the back buffer.

## <a name="nested-types">Nested Types</a>

Classes, interfaces, enums and annotations can be nested, that is, defined within the scope of another class, interface or enum. The tool implements such [nested types](https://docs.oracle.com/javase/tutorial/java/javaOO/nested.html) in two different ways, depending on whether they are static (aka. static nested types) or non-static (aka. inner types).

Declaration merging is used to define an instance type for such members (to allow using them as type in expressions), by adding a namespace with the same name as the outer type and exporting that [InstanceType](https://www.typescriptlang.org/docs/handbook/utility-types.html#instancetypetype) from there. This works also recursively, by using sub declaration merging of types within a namespace. Interfaces don't need a class expression and are just exported as itself from the additional namespace.

> Note: exporting an instance type in the sidecar namespace requires that its constructor is public.

### <a name="static-nested-types">Static Nested Types</a>

Static nested types are implemented as class expressions (classes and enums). Enums, interfaces and annotations are implicitly static.

### <a name="inner-types">Inner Types</a>

Inner types on the other hand are converted to class factory functions (a function that returns a class expression), which when instantiated gets access to the owning class (which must exist to actually instantiate the inner class), including private members. Only classes can be inner types.

To use such classes as types you have to wrap them like this:

```typescript
const instance: InstanceType<typeof OuterClass.InnerClass>;
```

When using them as values you can write:

```typescript
const outer = new OuterClass();
const inner = new outer.InnerClass();
```

> Note: also for inner types the same rules for access modifiers apply. Package private access (which is converted to protected access) works in Java, but not in Typescript and you have to make such elements public to allow access to them from the outer class.

The other direction (access to fields in the outer type from within the inner class) is fully supported by using a special construct, which even works for private members of the outer type. The factory function gets the outer type reference (`this`) passed in as parameter `$outer`, which in turn can be used to access all fields of the outer class.

> Note: currently [member shadowing](https://docs.oracle.com/javase/tutorial/java/javaOO/nested.html#shadowing) is not supported, nor is access via `OuterClass.this.member` (which is required to access shadowed values) implemented. This might be added at a later stage.

### <a name="local-classes">Local Classes</a>

Local classes (which behave much like inner classes) are currently not properly handled.

### <a name="anonymous-classes">Anonymous Classes</a>

The concept of declaring and creating a class in-place is also supported by Typescript and uses class expressions for the implementation.

## <a name="constructors">Constructors</a>

Constructors are mostly handled like methods (including overloading), but need a bit more attention. Usually linters require that constructors are listed at the beginning of a class definition, so they will be moved to that position in the converted file (if not there already).

What's not supported is generic constructors, as this is not possible with TS. Such code must be manually fixed.

### <a name="eci">Explicit Constructor Invocation</a>

Explicit constructor invocation (also known as constructor chaining) is a concept where one constructor can call another constructor in the same class, by using the function call `this()`. This is implemented in TS by converting all constructors to a single implementation (like for any overloaded method), but additionally the generated body is placed into a local closure, which allows to call itself recursively, emulating so the chaining.

While this implementation works well, there are a few issues with it:

- Initialisation of read-only class members cause a Typescript error, because the initialisation happens now in the mentioned closure and not directly in the constructor body. These errors must be manually suppressed by placing a `// @ts-ignore` (or `@ts-expect-error`) line directly before each assignment line.
- Typescript considers `super()` calls, which are not directly executed in the constructor body as error. Additionally, such calls are not counted when Typescript (and ESlint) check for an existing `super()` call for derived classes. All these 3 errors must be suppressed as well. The tool will automatically insert TS suppression lines, if the `suppressTSErrorsForECI` option is set. Though this might hide other errors too, which is why the automatic insertion is optional. The ESlint errors are always suppressed as they rather have informational character and are for very specific problems (not like the TS suppression).

Here's a real world example of the final form of a constructor, which uses overloading and initialises read-only members:

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

## <a name="exceptions">Exception Handling and Try-with-resources</a>

The converter tries to preserve as much of Java's exception semantics as possible, even at the price of higher code complexity. However, there are certain limits.

Usually, the message of an exception (unless explicitly specified in the converted code) is not what the JRE is using, especially for exceptions originating in native code (e.g. file APIs).

The `Throwable` implementation parses the stacktrace in a TS error object to find the individual stack elements (`StackTraceElement`). However, that's not exactly what is available in Java (but close). This class also helps to implement the semantic of suppressed exceptions, but because that's automatic in Java, though not in JS/TS, this works only in certain circumstances (namely try-with-resource statements, see next paragraph). To recap: exceptions thrown in a try block are not visible when the finally block also throws an exception. In Java the exceptions from the try block are added as suppressed exceptions to the exception thrown in the finally block. In TS these exceptions are lost.

Java 8 and higher support a construct which ensures that certain resources are automatically closed, regardless of errors. For this concept the try/catch/finally statement supports an additional expression between the `try` keyword and the opening curly brace. Any object that implements the `AutoCloseable` interface is automatically closed when the try block finished execution (with or w/o errors). To emulate this behavior additional try blocks are inserted, which handle exceptions in the same way as Java does.

## <a name="reflection">Reflection</a>

Support of reflection is only done very rudimentary, as it requires help from the Java VM, which we don't have in TS and it's probably not a good idea to simulate that. An attempt is made to convert access to `getClass` in a class definition to an automatically generated method, which is however private and cannot be used by other classes. This is really only a workaround, which doesn't work well, so it might happen that this conversion is removed in the future.

Expressions like `type.class` are converted to a creation call of the `java.lang.Class` class, which implements only a very small part of the `Class` API (and has not the exact same semantic like what's in Java).

This all won't help much, so it's probably most of the time necessary to manually adjust such reflection code. Usually it's simpler in TS to write expressions like `if (t.getClass() === AClass.class)` as `if (t instanceof AClass)`, which cannot be generated automatically, because of the different levels at which each part of the source expression is handled.

## <a name="system-properties">System Properties</a>

System properties are supported just like in Java, and get their initial values from the current environment (either `navigator` or `os` and `process` Node JS modules). JVM, Java and JRE specific entries (see [java keys](https://docs.oracle.com/javase/7/docs/api/java/lang/System.html#getProperties()) are filled with arbitrary values, e.g. matching the supported Java version of the java2ts tool. Applications using such properties in generated code should replace the default values with something that matches the expected values.

## <a name="others">Others</a>

Anything else which deserves a note is listed here:

## <a name="unsupported">Unsupported Features</a>

There are a number of Java features, which will probably never be implemented in converted code, as there's no equivalent for them.

### <a name="Annotations">Annotations</a>

Annotations usually cannot be converted, except for a very few (like @final), which are implemented using decorators. The current implementation is however very basic. Don't expect much of that.

### <a name="serialisation">Serialisation and Deserialisation</a>

The serialisation concept is not supported in Typescript.

### <a name="security">Security</a>

Java optionally uses a security manager to manage access to certain resources, like system properties. The current JRE shims do not support such a manager.

### <a name="threading">Threading</a>

Because TS is single threaded (and workers cannot share objects) there's no need to support any of the synchronisation methods from Java. Synchronized blocks are converted to simple blocks, but the `synchronized` keyword is left as a comment in the target code to indicate that a block was originally used in multi threading scenarios and needed special attention.

For the same reason there's no need to add `Hashtable` to the JRE shims as it is essentially just a synchronized `HashMap`.

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

Normally you would, however, not create an empty source, but one that can deal with symbols and return fully qualified names. For an example how to do that check the `JavaPackageSource.ts` file, which manually creates a symbol table for all supported Java types, and holds the target path to the TS implementations (JREE) for path resolution.
