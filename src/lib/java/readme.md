# Java Runtime Environment Emulation (JREE)

This folder contains Typescript implementations of often used JRE classes. They are organized so that converted source code can access them with their normal JRE name (fully qualified), for instance `java.lang.Character`.

This is accomplished by creating one file per JRE class, named after the last package ID part (e.g. `Character.ts`), which exports exactly that single class. This file is then imported in the index.ts file in that folder. The index.ts file itself is then re-exported again in another file in the same folder, whose name corresponds to the second last package ID part, here `lang.ts`, with the exported name `lang`.

This pattern is then used for all parent folders up to `java` and at the end makes all JRE classes/interfaces/enums available with the single `java` import. It might look a bit long-winded using multiple imports and (re) exports, but it turned out to be the best way, since namespaces are discouraged (and namespace merging has its limits) and modules cannot be merged.

# Circular Module Dependencies

Unfortunately, this approach is particularly prone to circular dependencies, because importing from any of the module export files, like `java` or `util` from within another JRE class shim during initialization time will result in a crash at runtime. Here's an example of that effect:

```typescript
import { java } from "../java";

export class IOException extends java.lang.Exception {
}
```

The class `IOException` is imported in the java/io/index.ts file. So, when it is initialized the entire `java` sub package has not yet finished initialization, which leads to the crash. The solution for this problem is to import such classes directly, instead of using the fully qualified identifier:

```typescript
import { Exception } from "../lang/Exception";

export class IOException extends Exception {
}
```

> Note: this is only necessary for code that is used during initialization time within the JRE emulation. For any other code you should use the fully qualified identifier, to remove any doubt that could arise which class is actually being used (particularly for classes that exist both in Java and Typescript, like `Object`, `Number` or `String`).

# Creating a New Shim

This chapter explains how to add a new JRE class from a new package, that isn't available yet in the library folder.

Assume you want to add the package class `java.awt.image.ColorModel`.

1. Start by creating the folder `awt` in `java` and the folder `image` in the new `awt` folder.
2. Create the files `index.ts` and `awt.ts` in `java/awt`.
3. Create the files `index.ts` and `image.ts` in `java/awt/image`.
4. Create your `ColorModel.ts` implementation and put it into `java/awt/image/`.
5. Add `import * from "ColorModel";` to the `index.ts` file in the same folder.
6. Add

```typescript
import * as image from "./index";

export { image };
```

to the `image.ts` file.

7. Add `export * from "./image/image";` to `java/awt/index.ts`.
8. Add

```typescript
import * as awt from "./index";

export { awt };
```

to the `awt.ts` file.

9. Add `export * from "./awt/awt";` to `java/index.ts`.

Obviously the folder creation and changes to `image.ts`, `awt.ts` and `java/index.ts` are one time tasks, as long as new TS files end up in existing folders. The only change which is always needed is to add a new class to the `index.ts` file in its folder.
