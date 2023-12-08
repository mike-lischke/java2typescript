## Changelog for Java2TypeScript

### 1.1.0

- Switched from antlr4ts to antlr4ng. Regenerated all parser files.
- Added support for automatic adding of the `override` keyword for inherited methods.
- Fixed member ordering for nested classes.
- Fixed resolution of types from which another type derives or which it implements.
- Fixed wrong exclusion of transpiled files from tsconfig.json.
- Updated documentation.
- The javaLib setting now can either be undefined (defaulting to "jree"), a node package, a relative or an absolute path. Relative paths are resolved against the output path.
- Updated the type information from the Java documentation.
- Fully implemented annotation handling in the converter tool.
- Implemented a new feature where Java types are written without full qualifier. Instead constant reassignments and type aliases are generated from the imports in a file. This brings the generated code even closer to that of Java. See the new configuration setting `useUnqualifiedTypes`.
- Removed the automatic conversion of interfaces with implemented methods to abstract classes. Instead a side class and declaration merging should be used.
- Improved handling of nested types.
- Type aliases for number (e.g. int, long, etc.) are now imported using a type import.

### 1.0.1 - 1.0.2

Small bug fixes.

### 1.0.0

First public release.
