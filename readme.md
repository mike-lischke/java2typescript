[![Build & Test](https://github.com/mike-lischke/java2typescript/actions/workflows/nodejs.yml/badge.svg?branch=master)](https://github.com/mike-lischke/java2typescript/actions/workflows/nodejs.yml)
[![Java 11](https://img.shields.io/badge/java-11-4c7e9f.svg)](http://java.oracle.com) [![Downloads](https://img.shields.io/npm/dw/java2typescript?color=blue)](https://www.npmjs.com/package/java2typescript)

# Java To Typescript Converter

This tool is a Node.js application written in Typescript to convert Java source code to Typescript. The conversion usually takes a Java source package (path to the package root) and creates a copy of the folder structure of that, thereby translating all *.java files to Typescript.

The converter uses (a copy of) the [Java grammar from the ANTLR4 grammar directory](https://github.com/antlr/grammars-v4/tree/master/java/java), which supports Java 17, however, only language features up to Java 11 are supported.

Install the tool like most other Node.js packages, by running `npm i java2typescript` in your project folder.

# How To Use the Tool

There are two ways to execute a conversion. For convenience there's a converter script, exported as binary script when adding the converter package as dependency, which can be executed. The other way is to write an own script which imports the necessary classes and run the process from there.

## The `java2ts` Command

When you install the tool locally in a project, you can use an NPM script to run it. Define a script in your package.json:

```json
{
    "scripts": {
        "java2ts": "java2ts config.json"
    }
}
```

and run it:

```bash
npm run java2ts
```

in the root of your project. The config file contains everything needed by the tool and is described in detail in [configuration.md](doc/configuration.md).

When you install the tool globally (`npm i -g java2typescript`) you even can run it from everywhere, without involving NPM.

## Running From Your Code

It is possible to launch a conversion from your application, by importing the `JavaToTypescriptConverter` class, configuring its options and then run it like this:

```typescript
const configuration: IConverterConfiguration = {
    packageRoot: "../<path to package root folder>",
    ...
};

const converter = new JavaToTypescriptConverter(configuration);
await converter.startConversion();
```

This is almost identical how the above mentioned `java2ts` script does it, except for some support code to transform the config json file into the require configuration structure.

There's a dedicated repository demonstrating the use of java2typescript in both ways. Check it out: [java2ts-examples](https://github.com/mike-lischke/java2ts-examples).

To support iterative conversions (running the tool multiple times with the same settings) without overwriting good files (e.g. when you have fixed errors in a file) add the text `/* java2ts: keep */` as the first line in such a file. The associated Java file is always parsed (for symbol resolution), but a Typescript file with that line is not overwritten anymore. A different log line is printed in the console when that is the case.

## Supported Language Features

Of course there's no 1:1 translation between Java and Typescript and therefore it is important to understand what needs to be considered and what problems are to be expected. A separate document discusses these aspects: [feature documentation](doc/features.md).

### Common Problems in Converted Java Code

There is almost never an error free result, after conversion. There are simply too many conditions that influence the process and its result. The most common problem classes that can occur are:

- **Incomplete Conversion**: The source file may contain code that is not supported by java2typescript. However, the coverage of Java 11 features should be fairly complete, so this is a rare problem.
- **Bugs**: The conversion process may contain bugs.
- **Automatic Initialization**: Java guarantees proper initialization of every variable and class member, which is not the case in Typescript. For example, allocated arrays (`new Array<T>()`) have no initial values for each index (in fact the indexes don't exist yet until a value is assigned). Hence you must ensure such arrays are initialized properly (`array.fill()`). For other elements, like variables, your linter should warn you about that.
- **Boxing**: [Auto boxing in TypeScript](doc/features.md#boxing-and-unboxing) works only for built-in types. Other boxing, for example the conversion of a string literal to `java.lang.String`, is a manual process. For this reason you may get errors when string literals appear in Java code where `java.lang.String` is expected. In such cases you have to manually adjust the code to deal with this situation. This is probably the most common issue with translated code.
- **Circular Dependencies**: Another fairly common problem is circular dependencies. TypeScript handles dependencies completely different compared to Java. What's totally normal in Java, for example using a static instance of a class, which derives from the class being loaded, will not work in TypeScript, because a class is not fully evaluated until all its imports are. There are a number of strategies to overcome trouble with circular dependencies, but it still is a major pain point to solve.
- **Unsupported Features**: Certain constructs cannot be converted automatically (e.g. `this` calls, aka. explicit constructor invocation). The tool does as much as it can to convert the code, but some manual work is needed to make the code compiling and working.
- **Linter Errors**: Many projects use a linter (like ESLint). Converted Java code often does not conform to popular TS linter formatting rules. It is recommended to allow formatting the generated code by the IDE (e.g. in VS Code) to fix the most common problems (like indentation). To help getting over linter problems until you have time to deal with them use the conversion setting which allows to add arbitrary text to each generated file. This is useful to write suppression commands for linter or spelling errors. See the `configuration.options.prefix` field.
- **Project Settings**: There's a variety of possible TypeScript settings for a project (target versions, browser vs. Node.js etc.). These can cause errors that relate to your project setup, not the conversion process as such.
