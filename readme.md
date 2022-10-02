[![CircleCI](https://circleci.com/gh/mike-lischke/java2typescript/tree/master.svg?style=svg)](https://circleci.com/gh/mike-lischke/java2typescript/tree/master)

# **java2typescript**

Java2Typescript is a Node.js tool for converting Java source packages to Typescript.

With this tool it is possible to do the major work of converting Java code to Typescript. Of course a lot of manual work remains after the conversion run, but at least all the tedious standard changes (like exchanging variable name and its type) is done automatically.

The tool uses (a copy of) the [Java grammar from the ANTLR4 grammar directory](https://github.com/antlr/grammars-v4/tree/master/java/java), which supports Java 17. The converter, however, only supports language features up to Java 11.

## How To

Starting a conversion requires a number of things. Everything is kicked off by creating an instance of the `JavaToTypescriptConverter` class, providing a configuration object, and calling `startConversion` of that instance:

```typescript
const convertMyPackage = async () => {
    const configuration: IConverterConfiguration = {
        ...
    };

    const converter = new JavaToTypescriptConverter(configuration);
    await converter.startConversion();
};

await convertMyPackage();
```

It's best to specify all source paths as absolute paths, in order to avoid trouble with relative path construction. Library + target paths can be relative, however.

The folder structure of a Java project/package is recreated in the target folder, which helps to locate the generated files more easily.

To support iterative conversions (running the tool several times with the same settings) without overwriting good files (e.g. when you have fixed errors in a file) add `/* java2ts: keep */` as the first line in such a file. This is checked by the tool and the file is then not changed. The console output will change, to indicate that a file is kept instead of re-generated.

For details of the supported Java language features and things to consider after conversion read the [feature documentation](doc/features.md).

A detailed description of the conversion configuration read the [configuration documentation](doc/configuration.md).
