# **java2typescript**
A Node.js tool for converting Java source packages to Typescript
---

With this tool it is possible to do the major work of converting Java code to Typescript. Of course a lot of manual work remains after the conversion run, but at least all the tedious standard changes (like exchanging variable name and its type) is done automatically.

The tool uses (a copy of) the [Java grammar from the ANTLR4 grammar directory](https://github.com/antlr/grammars-v4/tree/master/java/java), which supports Java 17, even though not all features from later Java versions are supported in the converter tool.

# Abstract

Conversion from one programming language to another is usually a pretty big task and every help to automate that task is welcome. Some language combinations produce extra work, if their syntax is too different, however Java and Typescript (the typed variant of Javascript) are so close that a conversion is relatively easy.

The other side of the equation is what infrastructure the source code uses (SDK, third party libraries etc.) and how to represent that in the target language. And after having this tool doing the main work from a syntactic stand point, this is probably what produces most of the remaining work. In order to help with that the tool comes with polyfills for certain Java SDK classes. These are usually not complete, but grow in completeness the more of a class/interface is needed. At least this allows for an iterative approach when doing a conversion.

Also helpful for an iterative approach is that a conversion process usually takes only a very small amount of time, in the range of seconds, depending on the project size and how fast the file system is (enumeration, file loading, file writing).

# Limitations

It's practically never the case that two languages have the same semantic concepts everywhere and so is it with Java and Typescript, even though they are so close that much of the code can directly be taken over (after proper symbol resolution). What's not supported out of the box is this:

- Java interfaces are probably the most incompatible objects between the two languages. Java interfaces can have initialized fields and method implementations, which is not possible in Typescript. Hence all interfaces are converted to abstract TS classes. Fortunately, TS allows that a class `implements` another class, not only an interface. Using `implements` is however not always a good solution (especially when referencing symbols from the base class). An effort is made to use `extends` in simple cases (no existing `extends` clause and only one type for the `implements` clause). Using `extends` for all types in general is not possible, as that might lead to multiple inheritance, which is not supported by TS/JS.
- Constructor overloading and method overloading. This is a concept, which can be implemented in Typescript as well, but requires significant extra work to merge parameter handling, which is out of the scope currently.
- Java has no concept of optional fields and parameters. Hence it is difficult to tell if a parameter is allowed to be undefined. This must be handled manually on a case-by-case basis.
- Java automatically converts between `long` and other integer type. TS uses `bigint` for 64 bit integer types and the `n` suffix for bigint literals. In Java these integer types can freely be mixed, but TS will complain if one tries to, say, shift a bigint using a standard number literal. This must be solved manually.
- Annotations usually cannot be converted, except for a very few (like @final), which are then converted using decorators. The current implementation is however very simple. Don't expect much of that.
- Generic constructors are not possible in Typescript. This must be solve manually.
- Resources are not handled at all.

# Conversion

The conversion process tries hard to keep all whitespaces + comments in place. However, when code must be reordered or generated, this can lead to misformatted target code. Also no conversion is done for tabs. A good linter and/or prettifier is recommended to fix this easily.

Starting a conversion requires a number of things. Everything is kicked of by creating an instance of the `JavaToTypescriptConverter` class, providing a configuration object, and calling `startConversion` of that instance. Below is an example of that with comments/examples:

```typescript
const convertPackageBlah = async () => {
    const antlrToolOptions: IConverterConfiguration = {
        packageRoot: "<absolute-path-to-root-folder-of-the-package-to-convert>",
        include: [
            // If given this list determines which files to include in the conversion.
            // If not given or empty then all found Java files will be converted.
            // Allowed are strings with regular expressions or an explicit regex.
        ],
        exclude: [
            // If given this list determines which files to ignore.
            // Allowed are strings with regular expressions or an explicit regex.
        ],
        output: "<target-folder>",
        options: {
            // A prefix to insert into all generated files (after the initial whitespaces, which usually include copyright headers etc.)
            // Useful for adding linter options, own library imports and the like.
            prefix: `
/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention, no-redeclare,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering, max-len
*/

/* cspell: disable */

`,
            // A function to help resolving Java packages that cannot automatically be resolved by the tool. More info below.
            importResolver,

            // A folder where additional helper classes can be placed, e.g. decorator implementations.
            lib: "lib",

            // A flag to indicate whether the tool should try to convert Java annotations (e.g. @final or @deprecated). This doesn't work well yet. So better leave this out.
            convertAnnotations: false,

            // A list of mappings from package IDs to source folders of these packages. This helps to resolve symbols from third party libraries
            // of which you have the Java source. These files are however not converted. Only a symbol table is created for each file.
            sourceMappings: new Map<string, string>([
                ["<com.party.third>", "<path-to-package-source>"]
            ]),

            // If you prefer arrow instead of normal functions then set this to true. Note however that arrow functions are not always useful, e.g. for overloaded methods. Maybe in a later version support is added to automatically switch it off, where it gets in the way.
            preferArrowFunctions: false,

            // Usually braces should be placed around all blocks, as that is good coding style. With this option the tool will add braces for blocks in `if` and `else` clauses, if they are missing.
            autoAddBraces: true,
        },

        // This field is usefull for debugging the conversion process.
        debug: {
            // When set, this field specifies a file pattern and a source position for which the tool should print the parse tree path to the console. With this info you know which part in the code converts the source code at that position.
            pathForPosition: {
                filePattern: "IntStream.java",
                position: {
                    row: 34,
                    column: 2,
                },
            },
        },

    };

    const converter = new JavaToTypescriptConverter(antlrToolOptions);
    await converter.startConversion();
};
```

It's best to specify all source paths as absolute paths, in order to avoid trouble with relative path construction. Library + target paths can be relative, however.

The folder structure of a Java project/package is recreated in the target folder, which helps to locate the generated file more easily.

# Import Resolvers

In opposition to Java all symbols in Typescript must use the fully qualified identifier form (e.g. `this.` for class/interface members, `ClassName.` for static members etc.). This requires to resolve every symbol (types, variable names etc.). The converter resolves symbols according to this model:

- The current file (local variables, parameters, normal and static class members, in this order).
- Any of the extended or implemented classes/interfaces (public and protected normal and static class members).
- Any of the files in the current project/package (only exported classes/interfaces).
- Module mappings (exported classes/interfaces from a 3rd party package).
- Import resolvers.

If a symbol cannot be resolved then the original text is used and the user has to fix it manually.

Import resolvers are the last resort to get symbols automatically resolved if nothing else works. There is one predefined resolver in the project: for the Java SDK. See the [separate readme](lib/java/readme.md) for details, how to work with and extend the Java SDK polyfills.

The converter uses socalled package sources for keeping symbol information per file. There are 2 types of package sources:

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

In this example the resolver creates empty sources for each known Java SDK package (which could not be resolved otherwise). An empty source has an empty symbol table and can hence not resolve symbols. So they serve rather as placeholders. If a package cannot be resolved `java2typescript` implicitly creates an empty source (and logs that in the console).

Normally you would, however, not create an empty source, but one that can deal with symbols and return fully qualfied names. For an example how to do that check the `JavaPackageSource.ts` file, which manually creates a symbol table for all supported Java types, and holds the target path to the TS implementations (polyfills) for path resolution.
