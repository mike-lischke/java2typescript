# Symbol Resolution

For the tool to generate correct import statements and symbol qualifiers it is essential to be able to resolve a symbol, that is, to find the origin where it is defined. There can be a number of sources, starting with local variables, normal and static class members, nested types, inherited types, imported types from the package and imported types from another package, both with and without source code. If you have 3rd party packages without source code, from which types are imported, this description is for you.

## Package Sources

Symbol resolution in java2typescript is based on package sources. A package source can represent a single source file or an entire package. Each package source holds a single symbol table, which is used to resolve symbols. In cases like the JRE the symbol table is loaded from json files (which are part of the tool package and have been automatically generated from the Java documentation), instead of parsing the JRE source code.

A package source additionally holds the source string for its symbols, which is used in Typescript `import` statements. This import path can either be a file path or a node module (allowing it so to back a 3rd party Java package with a node package).

If you have a 3rd party library (or one of the unsupported JRE classes) you can create a package source too and fill it with hard coded symbol information. There's no limit (other than available memory) for how many package sources you can use.

## The Process of Resolving a Symbol

The converter resolves symbols according to this model:

- The current file: local variables, parameters, normal and static class members, members of the owning class (if being nested), in this order.
- Any of the extended or implemented classes/interfaces (public and protected normal and static class members), in the order they are specified in the Java code.
- Any of the files in the current project/package (only exported classes/interfaces), in the order they are found while enumerating the files on disk.
- Module mappings (exported classes/interfaces from a 3rd party package), in the order they are given.
- Import resolvers.

If a symbol cannot be resolved then the original text is used and you will have to fix it manually.

Import resolvers are the last resort to get symbols automatically resolved if nothing else works. There is one predefined resolver in the project: for the JRE (as mentioned already above).

## Package Source Management

A file package source is automatically created for each of the Java files in the current package (and each of the 3rd party source files, if specified in the source mapping configuration field). The package source parses the file and creates a symbol table from the generated parse tree.

### Source Mappings

A source mapping allows to "link in" another source package. This allows to convert one package but use symbols from another, without converting that too. All Java files in the mapped source are parsed just like the files in the package being converted. Each source mapping contains the path where to find the Java source code and a target specifier (folder, node package) from which to import the types used in the converted code.

This feature is especially useful when converting large projects. You can convert one package at a time and then use the converted code in other packages.

## Class Resolvers

Another alternative is to provide a map with values that define how a specific symbol is to be mapped to another symbol, like an import from a third party library. This mapping allows to define a type alias to import a type with a different name.

### Import Resolvers

An import resolver function maps a package ID to a package source:

```typescript
const importResolver = (packageId: string): PackageSource[] => {
    const result: PackageSource[] = [];

    knownSDKPackages.forEach((value) => {
        if (packageId.startsWith(value)) {
            result.push(PackageSourceManager.emptySource(value)); // You'd better create a real package source here.
        }
    });

    return result;
};
```

In this example the resolver creates empty sources for each known SDK package (which could not be resolved otherwise). An empty source has an empty symbol table and can hence not resolve symbols. So they are rather placeholders. If a package cannot be resolved `java2typescript` implicitly creates an empty source (and logs that in the console).

The import resolver can be assigned to the `IConverterConfiguration.options.importResolver` field. This is only possible if you write your own conversion script as described in [the readme](../readme.md#running-from-your-code) chapter.
