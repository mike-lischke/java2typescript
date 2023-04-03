# Conversion Configuration

The configuration object (`IConverterConfiguration`) mentioned in the readme file holds all necessary path information and options to steer the conversion process. Below's a description of each field.

## Top Level Configuration Values

* **packageRoot** (string, mandatory): The root path of a Java package tree. Usually not only a single Java file, but a whole package is converted. This root path is used to regenerate the same folder structure in the target root path and to resolve relative paths. Use an absolute path for this to avoid problems with path resolution.

* **javaLib** (string, optional): This value is used to import JRE types. If left empty, the `jree` package is used. Alternatively you can specify a path from which to import those types.

* **include** (array of string or regular expressions, optional): if given only Java files matching one of the entries are converted (all files without the `.java` extension are always ignored). Files are enumerated from the package root and their absolute names used for comparison.
Note: this setting has no influence on which files are parsed, only which are generated. Usually every file in a package can be parsed if a symbol from it is required, that is, it's imported in one of the listed files.

* **exclude** (array of string or regular expression, optional): if given then files matching any of the patterns are ignored and not converted. The exclusion matching runs after the inclusion matching, which means that a file which is in both lists will not be converted.

* **outputPath** (string, mandatory): specifies where generated files have to be written to. This path can be relative to the current path and gets the same folder structure as found in the package root path.

* **sourceReplace** (map, optional): Specifies patterns for string replacements to be done in a Java file before it is parsed.

* **targetReplace** (map, optional): Specifies patterns for string replacements to be done in the generated TS file.

* **options** (object with configuration options, mandatory): see below for a description of the possible values.

* **debug** (object with debug configuration options, optional): see below for a description of the possible values.

## Converter Options

The `options` field in the top level configuration object accepts the following fields:

* **prefix** (string, optional): content which is inserted before the first generated source line (e.g. linter settings).

* **convertAnnotations** (boolean, optional, experimental): if true then an attempt is made to convert (some) of the Java annotations to Typescript decorators. This is not fully working, so use with care.

* **lib** (string, optional): specifies a path (relative to the current path or absolute) which holds additional TS source files (like for MurmurHash or decorators), that are used in the generated code.

* **preferArrowFunctions** (boolean, optional): when true then methods and function expression use arrow syntax, which is preferred syntax. For overloaded methods this setting has no effect, because there arrow syntax is not supported.

* **autoAddBraces** (boolean, optional): if true then the tool automatically adds braces around code in `if`/`else`/`switch` statements, if there are none yet.

* **addNullUnionType**

* **suppressTypeWithInitializer**

* **wrapStringLiterals**

* **memberOrderOptions**

* **addIndexFiles** (boolean, optional): when true then the tool generates an index.ts file in every target (sub) folder, to allow for simpler import statements in generated files.

* **sourceMappings** (array of mapping entries, optional): a rarely used member to provide mappings between Java source files, which do not belong to the current package (and are not converted) and 3rd party JS/TS packages. So these mappings can be used to specify already converted Java packages. Each entry in the array is an object with 2 members (`sourcePath` and `importPath`), the path of the separate Java package and the import path to be used in generated files (if given as relative path then Node.js will try to solve the path in the node_module folder). The source files are only needed to collect symbol information.

* **importResolver** (custom import resolver function, optional): described in the next section.

* **classResolver** (map, optional): provides a mapping of a class name to an alternative name. Each value in the map consists of two parts: an alias (optional) and an import path. This allows to swap implementations for not supported Java 3rd party packages and use another JS/TS 3rd party libraries instead. The `importPath` usually specifies a 3rd party node module and the `alias` allows to change the imported type name to something more useful (e.g. the original name of the Java type).

There are no default values for any of the settings in this list, except that unspecified boolean values are taken as `false`.

## Debug Options

Sometimes it is necessary to determine which part of the converter generated a certain block of the TS code. Be it to fix a generation problem or because it is unclear from which Java code the output was produced. The tool processes Java files in a top down manner, splitting more complex tasks into smaller ones until a case can be properly handled. Each such split step is modelled after the parse tree generated from the Java source. So, knowing where in the parse tree a specific source position is helps to find the place in the converter tool where the equivalent TS code was constructed. The debug options object allows to specify such a position:

```typescript
debug: {
    pathForPosition?: {
        filePattern?: string | RegExp;
        position: {
            row: number;    // One-based line number
            column: number;
        };
    };
```

When this information is given then the converter tool checks every input file, after it was parsed, for a match with the file pattern. In case of a match a case of the parse tree is printed up to the given position. The last entry is the name of the rule covering the given position and can be used to identify the method in the converter that transformed code at this position.
