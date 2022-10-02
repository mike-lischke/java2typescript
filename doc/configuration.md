# Conversion Configuration

The configuration object (`IConverterConfiguration`) mentioned in the last section all necessary path information and options to steer the conversion process. Here's a description of each field:

* packageRoot (string, mandatory): The root path of a Java package tree. Usually not only a single Java file, but a whole package is converted. This root path is used to regenerate the same folder structure in the target root path and to resolve relative paths. Use an absolute path for this to avoid problems with path resolution.

* javaLib (string, mandatory): The the root path to the JDK shims. Also this path should be absolute. The java2ts tool comes with a number of JDK shims which you can use in the generated code, but to make that self-contained these shims should be copied to a folder within your target project folder structure. Alternatively you can use a symlink to the original shims, but in any case the target folder should be close to the generated sources to avoid complicated import paths.

* include (array of string or regular expressions, optional): if given only Java files matching one of the entries are converted (all files without the `.java` extension are always ignored). Files are enumerated from the package root and their absolute names used for comparison.
Note: this setting has no influence on which files are parsed, only which are generated. Usually every file in a package can be parsed if a symbol from it is required, that is, it's imported in one of the listed files.

* exclude (array of string or regular expression, optional): if given then files matching any of the patterns are ignored and not converted. The exclusion matching runs after the inclusion matching, which means that a file which is in both lists will not be converted.

* output (string, mandatory): specifies where generated files have to be written to. This path can be relative to the current path and gets the same folder structure as found in the package root path.

* options (object with configuration options, mandatory): see below for a description of the possible values.

* debug (object with debug configuration options, optional): see below for a description of the possible values.

The processing options objects (`IConverterOptions`) supports these fields:

* prefix (string, optional): content which is inserted before the first generated source line (e.g. linter settings).

* convertAnnotations (boolean, optional, experimental): if true then an attempt is made to convert (some) of the Java annotations to Typescript decorators. This is not fully working, so use with care.

* lib (string, optional): specifies a path (relative to the current path or absolute) which holds additional TS source files (like for MurmurHash or decorators), that are used in the generated code.

* preferArrowFunctions (boolean, optional): when true then methods and function expression use arrow syntax, which is preferred syntax. For overloaded methods this setting has no effect, because there arrow syntax is not supported.

* autoAddBraces (boolean, optional): if true then the tool automatically adds braces around code in `if`/`else`/`switch` statements, if there are none yet.

* addIndexFiles (boolean, optional): when true then the tool generates an index.ts file in every target (sub) folder, to allow for simpler import statements in generated files.

* sourceMappings (array of mapping entries, optional): a rarely used member to provide mappings between Java source files, which do not belong to the current package (and are not converted) and 3rd party JS/TS packages. So these mappings can be used to specify already converted Java packages. Each entry in the array is an object with 2 members (`sourcePath` and `importPath`), the path of the separate Java package and the import path to be used in generated files (if given as relative path then Node.js will try to solve the path in the node_module folder). The source files are only needed to collect symbol information.

* importResolver (custom import resolver function, optional): described in the next section.

* classResolver (map, optional): provides a mapping of a class name to an alternative name. Each value in the map consists of two parts: an alias (optional) and an import path. This allows to swap implementations for not supported Java 3rd party packages and use another JS/TS 3rd party libraries instead. The `importPath` usually specifies a 3rd party node module and the `alias` allows to change the imported type name to something more useful (e.g. the original name of the Java type).

* suppressTSErrorsForECI (boolean, optional): when true then the tool will add TS error suppression comments when needed (see also the chapter about explicit constructor invocation in the [feature documentation](features.md)).

There are no default values for any of the settings in this list, except that unspecified boolean values are taken as `false`.

## Symbol Resolution and Import Resolvers

In opposition to Java all symbols in Typescript must use the fully qualified identifier form (e.g. `this.` for class/interface members, `ClassName.` for static members etc.). This requires to resolve every symbol (types, variable names etc.). The converter resolves symbols according to this model:

- The current file (local variables, parameters, normal and static class members, in this order).
- Any of the extended or implemented classes/interfaces (public and protected normal and static class members), in the order they are specified in the Java code.
- Any of the files in the current project/package (only exported classes/interfaces), in the order they are found while enumerating the files on disk.
- Module mappings (exported classes/interfaces from a 3rd party package), in the order they are given.
- Import resolvers.

If a symbol cannot be resolved then the original text is used and the user has to fix it manually.

> Note: The symbol resolution process does not handle symbol shadowing (for example a local variable with the same name as a method in the class), which is bad style anyway. This situation must be solved manually.

Import resolvers are the last resort to get symbols automatically resolved if nothing else works. There is one predefined resolver in the project: for the JDK. See the [separate readme](../lib/java/readme.md) for details, how to work with and extend the JDK shims.

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

In this example the resolver creates empty sources for each known JDK package (which could not be resolved otherwise). An empty source has an empty symbol table and can hence not resolve symbols. So they serve rather as placeholders. If a package cannot be resolved `java2typescript` implicitly creates an empty source (and logs that in the console).

Normally you would, however, not create an empty source, but one that can deal with symbols and return fully qualified names. For an example how to do that check the `JavaPackageSource.ts` file, which manually creates a symbol table for all supported Java types, and holds the target path to the TS implementations (shims) for path resolution.
