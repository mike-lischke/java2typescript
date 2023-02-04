[![CircleCI](https://circleci.com/gh/mike-lischke/java2typescript/tree/master.svg?style=svg)](https://circleci.com/gh/mike-lischke/java2typescript/tree/master)
[![Java 11](https://img.shields.io/badge/java-11-4c7e9f.svg)](http://java.oracle.com)

# Java To Typescript Converter

This tool is an application written itself in Typescript and running in Node.js, to convert Java source code to Typescript. The conversion usually takes a Java source package (path to the package root) and creates a copy of the folder and file structure of that, thereby translating all *.java files to Typescript. The tool is very flexible when it comes to 3rd party libraries used in the converted code. It is possible to specify a JS/TS replacement for such a package and/or create a java package source which guides the transformation process to use other type information or JS/TS source code. Java package sources are the building blocks to provide access to types outside the package being converted. The main package source is the JRE.

The tool uses (a copy of) the [Java grammar from the ANTLR4 grammar directory](https://github.com/antlr/grammars-v4/tree/master/java/java), which supports Java 17. The converter, however, only supports language features up to Java 11.

# How To Use the Tool

## Standalone

It is possible to launch a conversion from your application, by importing the `JavaToTypescriptConverter` class, configure its options and run it:

```typescript
const configuration: IConverterConfiguration = {
    packageRoot: path.resolve(process.cwd(), "../<path to package root folder>"),
    ...
};

const converter = new JavaToTypescriptConverter(configuration);
await converter.startConversion();
```

## Node Package


## Customizing the Conversion Process

It's best to specify all source paths as absolute paths, in order to avoid trouble with relative path construction. Library + target paths can be relative, however.

To support iterative conversions (running the tool several times with the same settings) without overwriting good files (e.g. when you have fixed errors in a file) add `/* java2ts: keep */` as the first line in such a file. This is checked by the tool and the file is then not changed. The console output will change to indicate that a file is kept instead of re-generated.

For details of the supported Java language features and things to consider after conversion read the [feature documentation](doc/features.md).

A detailed description of the conversion configuration can be found in the [configuration documentation](doc/configuration.md).
