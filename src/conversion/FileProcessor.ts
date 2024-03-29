/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import fs from "fs";
import path from "path";

import { ParserRuleContext, Interval, ParseTree, TerminalNode } from "antlr4ng";
import {
    ClassSymbol, InterfaceSymbol, ScopedSymbol, TypedSymbol, BaseSymbol, TypeKind, MethodSymbol, NamespaceSymbol,
    RoutineSymbol,
} from "antlr4-c3";

import { java, S } from "jree";

import { JavaLexer } from "../../parser/generated/JavaLexer.js";
import {
    AnnotationContext, AnnotationTypeDeclarationContext, ArgumentsContext, ArrayInitializerContext, BlockContext,
    BlockStatementContext, CatchClauseContext, ClassBodyContext, ClassBodyDeclarationContext,
    ClassCreatorRestContext, ClassDeclarationContext, ClassOrInterfaceModifierContext, ClassOrInterfaceTypeContext,
    ClassTypeContext, CompilationUnitContext, ConstantDeclaratorContext, ConstDeclarationContext,
    ConstructorDeclarationContext, CreatedNameContext, CreatorContext, ElementValueArrayInitializerContext,
    ElementValueContext, EnhancedForControlContext, EnumConstantContext,
    EnumConstantsContext, EnumDeclarationContext, ExplicitGenericInvocationContext,
    ExplicitGenericInvocationSuffixContext, ExpressionContext, ExpressionListContext, FieldDeclarationContext,
    FinallyBlockContext, ForControlContext, ForInitContext, FormalParameterContext, FormalParameterListContext,
    FormalParametersContext, GenericConstructorDeclarationContext, GenericInterfaceMethodDeclarationContext,
    GenericMethodDeclarationContext, InnerCreatorContext, InterfaceBodyContext, InterfaceBodyDeclarationContext,
    InterfaceCommonBodyDeclarationContext, InterfaceDeclarationContext, InterfaceMemberDeclarationContext,
    InterfaceMethodDeclarationContext, JavaParser, LambdaExpressionContext,
    LambdaParametersContext, LastFormalParameterContext, LiteralContext, LocalTypeDeclarationContext,
    LocalVariableDeclarationContext, MemberDeclarationContext, MethodBodyContext, MethodCallContext,
    MethodDeclarationContext, ModifierContext, NonWildcardTypeArgumentsContext,
    NonWildcardTypeArgumentsOrDiamondContext, ParExpressionContext, PrimaryContext, PrimitiveTypeContext,
    ResourceContext, ResourceSpecificationContext, StatementContext, SuperSuffixContext,
    SwitchBlockStatementGroupContext, SwitchLabelContext, TypeArgumentContext,
    TypeArgumentsContext, TypeArgumentsOrDiamondContext, TypeBoundContext, TypeDeclarationContext, TypeListContext,
    TypeParameterContext, TypeParametersContext, TypeTypeContext, TypeTypeOrVoidContext, VariableDeclaratorContext,
    VariableDeclaratorIdContext, VariableDeclaratorsContext, VariableInitializerContext, VariableModifierContext,
} from "../../parser/generated/JavaParser.js";

import { PackageSource } from "../PackageSource.js";
import { IClassResolver, IConverterConfiguration } from "./JavaToTypeScript.js";
import { EnumSymbol, JavaInterfaceSymbol } from "../parsing/JavaParseTreeWalker.js";
import { PackageSourceManager } from "../PackageSourceManager.js";
import { ContextType, ISymbolInfo, MemberType } from "./types.js";
import { MemberOrdering } from "./MemberOrdering.js";

enum ModifierType {
    None,
    Public,
    Protected,
    Private,
    Static,
    Abstract,
    Final,
    StrictFP,

    Native,
    Synchronized,
    Transient,
    Volatile,

    Annotation,

    /** Not a Java modifier, but used to indicate that the `override` keyword must be added. */
    Override,

    /**
     * Special value to indicate that the modifier (usually an annotation) was ignored and so must the following
     * whitespaces.
     */
    Ignored,
}

enum RelatedElement {
    Class,
    Method,
    Enum,
    Interface,
    File,
}

/** A description of a type for nested structures. */
interface ITypeInfo {
    /** The name of the type. Not assigned for anonymous types. */
    name?: string;

    /** Describes the type.  */
    type: ContextType;

    /** Generated type members. */
    generatedMembers: ITypeMemberDetails[];

    /** Generated or special declarations that have to be added after the main content. */
    deferredDeclarations: java.lang.StringBuilder;
}

interface IParameterInfo {
    name: string;
    type: string;
    nullable: boolean;

    /** Set to true, if this is a rest parameter. */
    rest: boolean;
}

/** Holds certain details of each member of a class. Required for method overloading and instance initialization. */
interface ITypeMemberDetails {
    type: MemberType;

    /** All whitespaces + comments before the modifier. */
    leadingWhitespace: string;

    /** Visibility/read only modifiers. */
    modifiers?: Set<string>;

    /** Name + optional type parameters of the member (only for methods + constructors). */
    nameWhitespace?: string;
    name?: string;
    typeParameters?: string;

    /** Separated name + TS type of all parameters (only for methods + constructors). */
    signature?: IParameterInfo[];

    /** Separate return type for methods. */
    returnType?: string;

    /** The converted signature TS code, including leading whitespaces. */
    signatureContent?: java.lang.StringBuilder;

    /**
     * The converted body block for methods + constructor or the full converted code for any other type,
     * including leading whitespaces.
     */
    bodyContent: java.lang.StringBuilder;

    /**
     * Only valid for constructors, to indicate that they do explicit constructor invocation, which requires special
     * handling in the generated code.
     */
    containsThisCall?: boolean;
}

interface IMethodReplaceEntry {
    replacement?: string;
    options: {
        parentheses?: "keep" | "remove" | "add" | "extract" | "indexed";
        removeDot?: boolean;
    };
}

/** Allows to specify additional parameters for constructors. Needed for manual enum construction. */
type ExtraParameters = Array<{ name: string; type: string; }>;

/** Converts the given Java file to Typescript. */
export class FileProcessor {

    private static arrayMethodMap = new Map<string | undefined, IMethodReplaceEntry>([
        ["set", { replacement: "", options: { parentheses: "indexed", removeDot: true } }],
        ["get", { replacement: "", options: { parentheses: "indexed", removeDot: true } }],

        ["add", { replacement: "push", options: {} }],
        ["subList", { replacement: "slice", options: {} }],
        ["size", { replacement: "length", options: { parentheses: "remove" } }],
        ["isEmpty", { replacement: "length === 0", options: { parentheses: "remove" } }],
    ]);

    private static mapMethodMap = new Map<string | undefined, IMethodReplaceEntry>([
        ["put", { replacement: "set", options: {} }],
    ]);

    private whiteSpaceAnchor = 0;

    // Imports from within the library path (helpers, direct imports of Java classes etc.).
    private userLibraryImports: Map<string, string[]>;

    // Names of 3rd party modules/packages to import.
    private userPackageImports: string[];

    // A list of actually used package imports in the file. From them type aliases and const
    // declarations are generated when fully qualified names are not used.
    private packageImports = new Map<string, BaseSymbol>();

    // The list of known package imports that are available for use in the current file. This includes imports from
    // the file itself and the default imports from java.lang.
    // Used only when fully qualified identifiers are not used.
    private availablePackageImports = new Map<string, BaseSymbol>();

    // Keeps names of classes for which inner processing is going on. Sometimes it is necessary to know the name
    // for special processing (e.g. auto creating static initializer functions or type aliases).
    private typeStack: java.util.Stack<ITypeInfo> = new java.util.Stack();

    private classResolver: Map<string, IClassResolver>;

    // Nested symbols from this file.
    private localSymbols = new Map<string, string>();

    // The classes that were resolved by the class resolver and must be listed in the imports.
    private resolvedClasses = new Set<string>();

    private memberOrdering: MemberOrdering | undefined;

    /**
     * Constructs a new file process and parses the given file. No conversion is done yet.
     *
     * @param source The source class holding the parser + symbol information.
     * @param configuration The values to configure the conversion process.
     */
    public constructor(
        private source: PackageSource,
        private configuration: IConverterConfiguration) {
        this.classResolver = configuration.options?.classResolver ?? new Map();
        this.userLibraryImports = configuration.options?.libraryImports ?? new Map();
        this.userPackageImports = configuration.options?.packageImports ?? [];

        if (configuration.options?.memberOrderOptions) {
            this.memberOrdering = new MemberOrdering(configuration.options.memberOrderOptions);
        }
    }

    /**
     * Converts the Java file whose path is given by `source` to Typescript and writes the generated content
     * to the file given by `target`;
     */
    public convertFile = async (): Promise<void> => {
        if (this.source.targetFile && fs.existsSync(this.source.targetFile)) {
            // If the target file already exists, check if it is marked to keep it (not overwrite).
            const stream = fs.createReadStream(this.source.targetFile, { encoding: "utf-8", start: 0, end: 20 });
            const firstByte = await stream[globalThis.Symbol.asyncIterator]().next();
            const line = firstByte.value as string;
            if (line && line.includes("java2ts: keep")) {
                console.log(`Keeping ${this.source.targetFile}`);

                return;
            }
        }

        // Remove previously recorded symbols.
        PackageSourceManager.clearImportedSymbols();

        if (this.source.parseTree) {
            process.stdout.write(`Converting: ${this.source.sourceFile}...`);

            // Collect nested object definitions for name resolution.
            const getAllNestedSymbols = (symbol: ScopedSymbol) => {
                let result: BaseSymbol[] = [];
                symbol.children.forEach((child) => {
                    result.push(child);
                    if (child instanceof ScopedSymbol) {
                        result = result.concat(getAllNestedSymbols(child));
                    }
                });

                return result;
            };

            const symbols = this.source.symbolTable ? getAllNestedSymbols(this.source.symbolTable) : [];
            symbols.forEach((symbol) => {
                if (symbol instanceof ClassSymbol || symbol instanceof InterfaceSymbol
                    || symbol instanceof EnumSymbol) {
                    const path = symbol.symbolPath.filter((entry) => {
                        return entry instanceof ClassSymbol || entry instanceof InterfaceSymbol
                            || entry instanceof EnumSymbol;
                    });

                    const resolved = path.reverse().map((entry) => {
                        return entry.name;
                    }).join(".");
                    this.localSymbols.set(symbol.name, resolved);
                }
            });

            let fileMatched = true;
            if (this.configuration.debug?.pathForPosition?.filePattern) {
                fileMatched = this.source.sourceFile.match(
                    this.configuration.debug.pathForPosition.filePattern) !== null;
            }

            if (this.configuration.debug?.pathForPosition && fileMatched) {
                this.source.printParseTreeForPosition(this.configuration.debug.pathForPosition.position);
            }

            if (this.source.targetFile) {
                const builder = new java.lang.StringBuilder();
                this.processCompilationUnit(builder, this.source.targetFile, this.source.parseTree);

                try {
                    let converted = `${builder}`;
                    this.configuration.targetReplace?.forEach((to: string, pattern: RegExp) => {
                        converted = converted.replace(pattern, to);
                    });

                    fs.mkdirSync(path.dirname(this.source.targetFile), { recursive: true });
                    fs.writeFileSync(this.source.targetFile, converted);
                    console.log(" done");
                } catch (e) {
                    console.log("failed");
                    throw e;
                }
            }

        } else {
            console.log(`Ignoring: ${this.source.sourceFile}`);
        }
    };

    private processCompilationUnit = (builder: java.lang.StringBuilder, target: string,
        context: CompilationUnitContext): void => {

        if (this.configuration.options?.useUnqualifiedTypes) {
            // Register default imports for the standard library that are available without explicit import.
            this.registerDefaultImports();
        }

        this.typeStack.push({
            name: "file",
            type: ContextType.File,
            deferredDeclarations: new java.lang.StringBuilder(),
            generatedMembers: [],
        });

        const firstChild = context.getChild(0);
        const header = new java.lang.StringBuilder();
        let prefix;
        if (typeof this.configuration.options?.prefix === "string") {
            prefix = () => { return this.configuration.options?.prefix as string; };
        } else if (typeof this.configuration.options?.prefix === "function") {
            prefix = this.configuration.options?.prefix;
        } else {
            prefix = () => { return ""; };
        }

        const importExtension = this.configuration.options?.importExtension ?? "";
        if (firstChild instanceof ParserRuleContext) {
            header.append(this.getLeadingWhiteSpaces(firstChild));
            header.append(prefix(this.source.sourceFile, this.source.targetFile));

            if (context.packageDeclaration()) {
                this.ignoreContent(context.packageDeclaration());
            }

            context.importDeclaration().forEach((entry, index) => {
                if (index === 0) {
                    header.append(this.getLeadingWhiteSpaces(entry));
                }

                this.ignoreContent(entry);

                const name = entry.qualifiedName().getText();
                const parts = name.split(".").map((part) => {
                    return part.trim();
                });

                if (parts.length > 1) {
                    const type = parts[parts.length - 1];

                    // Ignore wildcard imports.
                    if (type !== "*") {
                        const fullName = parts.join(".");

                        const info = this.resolveFromImports(fullName);
                        if (typeof info !== "string" && info.symbol) {
                            this.availablePackageImports.set(fullName, info.symbol);
                        }
                    }
                }
            });

            this.processTypeDeclarations(builder, context.typeDeclaration());
            if (this.typeStack.peek()) {
                builder.append(this.typeStack.peek().deferredDeclarations);
            }

            // The import list of the source is already consolidated, but we are going to add more imports
            // which may use some of the already imported symbols.
            const consolidatedImports = new Map<string, string[]>();

            this.userPackageImports.forEach((name) => {
                header.append(`import * as ${name} from "${name}";\n`);
            });
            header.append("\n");

            let aliases = "";
            if (this.configuration.options?.useUnqualifiedTypes && this.configuration.javaLib !== "") {
                // Create const reassignments and type aliases depending on the type of the imported symbol.
                this.packageImports.forEach((symbol, key) => {
                    // Cannot create a type alias for an enum type (it would be infinite recursion).
                    const createAssignment = !(symbol instanceof InterfaceSymbol);
                    const createTypeAlias = !(symbol instanceof RoutineSymbol) && key !== "java.lang.Enum";

                    if (createTypeAlias) {
                        if (("typeParameters" in symbol) && symbol.typeParameters) {
                            const typeParameters = symbol.typeParameters as string;
                            aliases += `type ${symbol.name}${typeParameters} = ${key}${typeParameters};\n`;
                        } else {
                            aliases += `type ${symbol.name} = ${key};\n`;
                        }
                    }

                    if (createAssignment) {
                        aliases += `const ${symbol.name} = ${key};\n`;
                    }
                });
            }

            this.source.importList.forEach((source) => {
                const info = source.getImportInfo(target);
                if (info[0].length > 0) {
                    let lib = consolidatedImports.get(info[1]);
                    if (!lib) {
                        lib = [];
                        consolidatedImports.set(info[1], lib);
                    }
                    lib.push(...info[0]);
                }
            });

            this.resolvedClasses.forEach((entry) => {
                const resolver = this.classResolver.get(entry);
                if (resolver) {
                    const importEntry = consolidatedImports.get(resolver.importPath);

                    const importName = entry + (resolver.alias ? " as " + resolver.alias : "");
                    if (importEntry) {
                        importEntry.push(importName);
                    } else {
                        consolidatedImports.set(resolver.importPath, [importName]);
                    }
                }
            });

            consolidatedImports.forEach((entry, key) => {
                if (key.startsWith(".") && !key.endsWith(importExtension)) {
                    key += importExtension;
                }
                header.append(`import { ${entry.join(", ")} } from "${key}";\n`);
            });

            if (aliases.length > 0) {
                header.append("\n");
                header.append(aliases);
            }
        }

        this.getContent(builder, context.EOF());

        header.append("\n");
        this.userLibraryImports.forEach((entry, key) => {
            let importPath: string;
            if (key.startsWith("/") || key.startsWith("./")) {
                importPath = path.relative(path.dirname(target), path.dirname(key));
                importPath = path.join(importPath, path.basename(key, ".ts"));

                if (importPath[0] !== ".") {
                    importPath = "./" + importPath;
                }
            } else {
                importPath = key;
            }

            if (importPath.startsWith(".") && !importPath.endsWith(importExtension)) {
                importPath += importExtension;
            }
            header.append(`import { ${entry.join(", ")} } from "${importPath}";\n`);
        });

        builder.insert(0, header);
    };

    private processTypeDeclarations = (builder: java.lang.StringBuilder, list: TypeDeclarationContext[]): void => {
        list.forEach((context) => {
            const prefix = new java.lang.StringBuilder();
            const ws = this.getLeadingWhiteSpaces(context);

            const modifiers = new Set<string>();
            let ignoreNextWhitespaces = false;
            context.classOrInterfaceModifier().forEach((context) => {
                if (ignoreNextWhitespaces) {
                    ignoreNextWhitespaces = false;
                    this.getLeadingWhiteSpaces(context);
                }

                switch (this.processClassOrInterfaceModifier(prefix, context, RelatedElement.File)) {
                    case ModifierType.Public: {
                        modifiers.add("export");
                        break;
                    }

                    case ModifierType.Protected: {
                        modifiers.add("protected");
                        break;
                    }

                    case ModifierType.Private: {
                        modifiers.add("private");
                        break;
                    }

                    case ModifierType.Abstract: {
                        modifiers.add("abstract");
                        break;
                    }

                    case ModifierType.Ignored: {
                        ignoreNextWhitespaces = true;
                        break;
                    }

                    default:
                }
            });

            if (!modifiers.has("export") && !modifiers.has("protected") && !modifiers.has("private")) {
                // No modifier means package-private. TS doesn't have such a concept, so we have to export instead.
                modifiers.add("export");
            }

            if (context.classDeclaration()) {
                const details = this.processClassDeclaration(context.classDeclaration(), `${ws}`, modifiers, null);
                if (details) {
                    builder.append(details.bodyContent);
                }
            } else if (context.enumDeclaration()) {
                const details = this.processEnumDeclaration(context.enumDeclaration(), modifiers);
                if (details) {
                    builder.append(details.bodyContent);
                }
            } else if (context.interfaceDeclaration()) {
                const details = this.processInterfaceDeclaration(context.interfaceDeclaration(), `${ws}`,
                    modifiers.has("export"));
                if (details) {
                    builder.append(details.bodyContent);
                }
            } else { // annotationTypeDeclaration
                this.getContent(builder, context, true);
            }
        });
    };

    private processClassOrInterfaceModifier = (builder: java.lang.StringBuilder,
        context: ClassOrInterfaceModifierContext | null, parentType: RelatedElement): ModifierType => {

        let result = ModifierType.None;

        if (!context) {
            return result;
        }

        const element = context.getChild(0);
        if (element instanceof TerminalNode) {
            builder.append(this.getLeadingWhiteSpaces(element));

            switch (element.symbol.type) {
                case JavaParser.PUBLIC: {
                    result = ModifierType.Public;
                    if (parentType === RelatedElement.File) {
                        this.ignoreContent(element);
                        builder.append("export ");
                    } else {
                        this.getContent(builder, element);
                    }

                    break;
                }

                case JavaParser.PROTECTED: {
                    result = ModifierType.Protected;
                    this.getContent(builder, element);

                    break;
                }

                case JavaParser.PRIVATE: {
                    result = ModifierType.Private;
                    this.getContent(builder, element);

                    break;
                }

                case JavaParser.STATIC: {
                    result = ModifierType.Static;
                    this.getContent(builder, element);

                    break;
                }

                case JavaParser.ABSTRACT: {
                    result = ModifierType.Abstract;
                    this.getContent(builder, element);

                    break;
                }

                case JavaParser.FINAL: {
                    result = ModifierType.Final;
                    this.ignoreContent(element);

                    break;
                }

                default: {
                    this.ignoreContent(element);

                    break;
                }
            }
        } else {
            this.processAnnotation(builder, context.annotation());

            return ModifierType.Annotation;
        }

        return result;
    };

    private processAnnotation = (builder: java.lang.StringBuilder, context: AnnotationContext | null): void => {
        if (this.configuration.options?.convertAnnotations && context) {
            if (context.qualifiedName()) {
                this.getContent(builder, context.AT());

                // Resolve the annotation name to trigger the import.
                const name = context.qualifiedName()!.getText();
                this.resolveType(context, name);

                this.getContent(builder, context.qualifiedName());
            } else {
                // Taken over as is. Must be manually converted.
                this.getContent(builder, context.altAnnotationQualifiedName());
            }

            if (context.elementValuePairs()) {
                // Convert the value pairs to a single object literal, with keys and values.
                this.getContent(builder, context.LPAREN());
                builder.append("{");
                context.elementValuePairs()!.elementValuePair().forEach((pair) => {
                    this.getContent(builder, pair.identifier());
                    builder.append(": ");
                    this.ignoreContent(pair.ASSIGN());
                    this.processElementValue(builder, pair.elementValue());
                });

                builder.append("}");
                this.getContent(builder, context.RPAREN());
            } else if (context.elementValue()) {
                this.getContent(builder, context.LPAREN());
                this.processElementValue(builder, context.elementValue());
                this.getContent(builder, context.RPAREN());
            }

            builder.append("\n");
        } else {
            this.ignoreContent(context);
        }
    };

    private processElementValue = (builder: java.lang.StringBuilder, context: ElementValueContext | null): void => {
        if (context) {
            if (context.expression()) {
                this.processExpression(builder, context.expression());
            } else if (context.annotation()) {
                this.processAnnotation(builder, context.annotation());
            } else if (context.elementValueArrayInitializer()) {
                this.processElementValueArrayInitializer(builder, context.elementValueArrayInitializer());
            } else {
                this.getContent(builder, context);
            }
        }
    };

    private processElementValueArrayInitializer = (builder: java.lang.StringBuilder,
        context: ElementValueArrayInitializerContext | null): void => {
        if (context) {
            let ws = this.getLeadingWhiteSpaces(context.LBRACE());
            builder.append(ws);
            builder.append("[");
            context.elementValue().forEach((value) => {
                this.processElementValue(builder, value);
            });

            ws = this.getLeadingWhiteSpaces(context.RBRACE());
            builder.append(ws);
            builder.append("]");
        }
    };

    private processClassDeclaration = (context: ClassDeclarationContext | null, prefix: string, modifiers: Set<string>,
        extraCtorParams: ExtraParameters | null): ITypeMemberDetails | undefined => {
        if (!context) {
            return undefined;
        }

        const result: ITypeMemberDetails = {
            type: MemberType.Class,
            name: context.identifier().getText(),
            leadingWhitespace: "",
            bodyContent: new java.lang.StringBuilder(),
        };

        this.typeStack.push({
            name: context.identifier().getText(),
            type: ContextType.Class,
            deferredDeclarations: new java.lang.StringBuilder(),
            generatedMembers: [],
        });

        const localBuilder = new java.lang.StringBuilder();

        this.getContent(localBuilder, context.CLASS());
        this.getContent(localBuilder, context.identifier());

        let typeParameters = "";
        if (context.typeParameters()) {
            const typeParametersBuilder = new java.lang.StringBuilder();
            this.processTypeParameters(typeParametersBuilder, context.typeParameters());
            typeParameters = `${typeParametersBuilder.toString()}`;

            localBuilder.append(typeParameters);
        }

        if (context.EXTENDS()) {
            this.getContent(localBuilder, context.EXTENDS());
            this.processTypeType(localBuilder, context.typeType());
        } else if (this.configuration.javaLib !== "") {
            // Add the default extends clause.
            localBuilder.append(" extends JavaObject");
            this.registerJavaImport("JavaObject");
        }

        if (context.IMPLEMENTS()) {
            this.getContent(localBuilder, context.IMPLEMENTS());
            this.processTypeList(localBuilder, context.typeList(0));
        }

        if (this.processClassBody(localBuilder, context.classBody(), extraCtorParams)) {
            modifiers.add("abstract");
        }

        // Conclude nested content within this class declaration.
        const nested = this.processNestedContent(modifiers.has("export"));
        const className = context.identifier().getText();

        // Check if this declaration itself is nested.
        if (this.typeStack.size() > 1) {
            // This is a nested class declaration. Convert it either to a class expression or a class factory function.
            // We have to make it public or the sidecar namespace instance type declaration will not compile.
            modifiers.delete("protected");
            modifiers.delete("private");
            modifiers.add("public");

            const modifier = this.createModifierString(modifiers);
            result.bodyContent.append(`${prefix}${modifier} ${className} = `);
            if (modifiers.has("static")) {
                result.bodyContent.append(`${localBuilder.toString()};\n`);
            } else {
                result.bodyContent.append(`(($outer) => {\nreturn ${localBuilder.toString()}\n})(this);\n`);
            }

            const owner = this.typeStack.peek();

            // Add a type declaration for the nested type, so it can be used as a type in expressions.
            const typeOfText = modifiers.has("static") ? "typeof " : "";

            if (typeParameters || modifiers.has("static")) {
                // The type parameters on the right-hand-side must not include any type constraints.
                // In fact not even any annotations or comments need to be included. So we just iterate
                // again over the type parameters and only include the names.
                const temp: string[] = [];
                context.typeParameters()?.typeParameter().forEach((typeParameter) => {
                    temp.push(typeParameter.identifier().getText());
                });

                let minimizedTypeParameters = temp.length > 0 ? temp.join(",") : "";
                if (typeParameters.length > 0) {
                    typeParameters = `<${typeParameters}>`;
                }

                if (minimizedTypeParameters.length > 0) {
                    minimizedTypeParameters = `<${minimizedTypeParameters}>`;
                }

                this.typeStack.peek().deferredDeclarations.append(`\texport type ${className}` +
                    `${typeParameters} = InstanceType<typeof ${owner.name!}.${className}` +
                    `${minimizedTypeParameters}>;\n`);
            } else {
                this.typeStack.peek().deferredDeclarations.append(`\texport type ${className}` +
                    ` = InstanceType<${typeOfText}${owner.name!}["${className}"]>;\n`);
            }
        } else {
            // A top level class declaration.
            const modifier = this.createModifierString(modifiers);
            result.bodyContent.append(`${prefix}${modifier} `);
            result.bodyContent.append(localBuilder);
        }

        this.typeStack.peek().deferredDeclarations.append(nested);

        return result;
    };

    /**
     * Processes the body of a class declaration.
     *
     * @param builder The builder to append the processed content to.
     * @param context The parse context of the class body.
     * @param extraCtorParams Optional extra parameters to add to the constructor.
     *
     * @returns True if the class contains abstract members.
     */
    private processClassBody = (builder: java.lang.StringBuilder, context: ClassBodyContext | null,
        extraCtorParams: ExtraParameters | null): boolean => {
        if (!context) {
            return false;
        }

        this.getContent(builder, context.LBRACE());
        const containsAbstract = this.processClassBodyDeclarations(builder, context.classBodyDeclaration(),
            extraCtorParams);
        this.getContent(builder, context.RBRACE());

        return containsAbstract;
    };

    private processClassBodyDeclarations = (builder: java.lang.StringBuilder,
        list: ClassBodyDeclarationContext[], extraCtorParams: ExtraParameters | null): boolean => {
        const members: ITypeMemberDetails[] = [];
        let containsAbstract = false;

        const initializer = new java.lang.StringBuilder();

        list.forEach((context) => {
            if (context.SEMI()) {
                // Empty statement.
                const leadingWhitespace = this.getLeadingWhiteSpaces(context);
                const bodyContent = new java.lang.StringBuilder();
                this.getContent(bodyContent, context, false);
                members.push({ type: MemberType.Empty, leadingWhitespace, name: "", bodyContent });
            } else if (context.block()) {
                // Static or instance initializer.
                if (context.STATIC()) {
                    const bodyContent = new java.lang.StringBuilder();
                    const leadingWhitespace = this.getLeadingWhiteSpaces(context);
                    this.getContent(bodyContent, context.STATIC());
                    this.processBlock({ builder: bodyContent, context: context.block() });
                    members.push({
                        type: MemberType.Static,
                        leadingWhitespace,
                        name: "",
                        bodyContent,
                    });
                } else {
                    // Code in instance initializers is added to the class' constructor.
                    // In opposition to static initializers this code must be collected (if spread over multiple
                    // initializers) and inserted as a whole.
                    const block = context.block();
                    if (block) {
                        this.ignoreContent(block.LBRACE());
                        block.blockStatement().forEach((statement) => {
                            this.processBlockStatement(initializer, statement);
                        });
                        initializer.append(this.getLeadingWhiteSpaces(block.RBRACE()));
                        this.ignoreContent(block.RBRACE());
                    }
                }
            } else {
                const prefix = new java.lang.StringBuilder();
                let ws = this.getLeadingWhiteSpaces(context);

                const modifiers = new Set<string>();
                let ignoreNextWhitespaces = false;
                context.modifier().forEach((context) => {
                    if (ignoreNextWhitespaces) {
                        ignoreNextWhitespaces = false;
                        this.getLeadingWhiteSpaces(context);
                    }

                    switch (this.processModifier(prefix, context)) {
                        case ModifierType.Public: {
                            modifiers.add("public");
                            break;
                        }

                        case ModifierType.Protected: {
                            modifiers.add("protected");
                            break;
                        }

                        case ModifierType.Private: {
                            modifiers.add("private");
                            break;
                        }

                        case ModifierType.Final: {
                            modifiers.add("readonly");
                            break;
                        }

                        case ModifierType.Ignored: {
                            ignoreNextWhitespaces = true;
                            break;
                        }

                        case ModifierType.Abstract: {
                            modifiers.add("abstract");
                            containsAbstract = true;
                            break;
                        }

                        case ModifierType.Static: {
                            modifiers.add("static");
                            break;
                        }

                        case ModifierType.Annotation: {
                            ws += prefix;
                            break;
                        }

                        default:
                    }
                });

                if (!modifiers.has("public") && !modifiers.has("protected") && !modifiers.has("private")) {
                    // No modifier means package-private.
                    modifiers.add("protected");
                }

                if (context.memberDeclaration()) {
                    const detailList = this.processMemberDeclaration(context.memberDeclaration(), `${ws}`, modifiers,
                        extraCtorParams);

                    detailList.forEach((details) => {
                        if (details.bodyContent.length() > 0) {
                            // The content is empty if the member was converted to a (nested) namespace
                            // for nested interfaces, classes and enums.
                            members.push(details);
                        }
                    });
                }
            }
        });

        if (initializer.length() > 0) {
            // If there's instance initializer code, generate a special member entry for it.
            this.typeStack.peek().generatedMembers.push({
                type: MemberType.Initializer,
                leadingWhitespace: "",
                bodyContent: initializer,
            });
        }

        this.processBodyMembers(builder, members, true);

        return containsAbstract;
    };

    private processModifier = (builder: java.lang.StringBuilder, context: ModifierContext): ModifierType => {
        builder.append(this.getLeadingWhiteSpaces(context));

        let result = ModifierType.None;
        if (context.classOrInterfaceModifier()) {
            result = this.processClassOrInterfaceModifier(builder, context.classOrInterfaceModifier(),
                RelatedElement.Class);
        } else {
            this.ignoreContent(context);
            result = ModifierType.Ignored;
        }

        return result;
    };

    private processMemberDeclaration = (context: MemberDeclarationContext | null, prefix: string,
        modifiers: Set<string>, extraCtorParams: ExtraParameters | null): ITypeMemberDetails[] => {
        if (!context) {
            return [];
        }

        const result: ITypeMemberDetails[] = [];

        const firstChild = context.getChild(0) as ParserRuleContext;
        switch (firstChild.ruleIndex) {
            case JavaParser.RULE_methodDeclaration: {
                const details = this.processMethodDeclaration(context.methodDeclaration());
                if (details) {
                    details.leadingWhitespace = prefix;
                    if (this.overridesMethod(context, details)) {
                        modifiers.add("override");
                    }
                    details.modifiers = modifiers;
                    result.push(details);
                }

                break;
            }

            case JavaParser.RULE_genericMethodDeclaration: {
                const details = this.processGenericMethodDeclaration(context.genericMethodDeclaration());
                if (details) {
                    details.leadingWhitespace = prefix;
                    details.modifiers = modifiers;
                    result.push(details);
                }

                break;
            }

            case JavaParser.RULE_fieldDeclaration: {
                const list = this.processFieldDeclaration(context.fieldDeclaration(), modifiers);
                list.forEach((details) => {
                    details.leadingWhitespace = prefix;
                    details.modifiers = modifiers;
                });
                result.push(...list);

                break;
            }

            case JavaParser.RULE_constructorDeclaration: {
                const details = this.processConstructorDeclaration(extraCtorParams, context.constructorDeclaration());
                if (details) {
                    details.leadingWhitespace = prefix;
                    details.modifiers = modifiers;
                    result.push(details);
                }

                break;
            }

            case JavaParser.RULE_genericConstructorDeclaration: {
                const details = this.processGenericConstructorDeclaration(extraCtorParams,
                    context.genericConstructorDeclaration());
                if (details) {
                    details.leadingWhitespace = prefix;
                    details.modifiers = modifiers;
                    result.push(details);
                }

                break;
            }

            case JavaParser.RULE_interfaceDeclaration: {
                const details = this.processInterfaceDeclaration(context.interfaceDeclaration(), prefix,
                    modifiers.has("public"));
                if (details) {
                    modifiers.add("static");
                    details.leadingWhitespace = prefix;
                    details.modifiers = modifiers;
                    result.push(details);
                }

                break;
            }

            case JavaParser.RULE_annotationTypeDeclaration: {
                const details = this.processAnnotationTypeDeclaration(context.annotationTypeDeclaration());
                if (details) {
                    modifiers.add("static");
                    details.leadingWhitespace = prefix;
                    details.modifiers = modifiers;
                    result.push(details);
                }

                break;
            }

            case JavaParser.RULE_classDeclaration: {
                const details = this.processClassDeclaration(context.classDeclaration(), prefix, modifiers, null);
                if (details) {
                    details.leadingWhitespace = prefix;
                    details.modifiers = modifiers;
                    result.push(details);
                }

                break;
            }

            case JavaParser.RULE_enumDeclaration: {
                const details = this.processEnumDeclaration(context.enumDeclaration(), modifiers);
                if (details) {
                    modifiers.add("static");
                    details.leadingWhitespace = prefix;
                    details.modifiers = modifiers;
                    result.push(details);
                }

                break;
            }

            default:
        }

        return result;
    };

    private processMethodDeclaration = (context: MethodDeclarationContext | null,
        genericParams?: java.lang.StringBuilder): ITypeMemberDetails | undefined => {
        if (!context) {
            return undefined;
        }

        const result: ITypeMemberDetails = {
            type: MemberType.Method,
            leadingWhitespace: "",
            bodyContent: new java.lang.StringBuilder(),
        };

        const returnType = new java.lang.StringBuilder();

        if (!this.processTypeTypeOrVoid(returnType, context.typeTypeOrVoid())) {
            // Not a primitive type so make it explicitly nullable.
            const addNull = this.configuration.options?.addNullUnionType ?? true;
            if (addNull) {
                returnType.append(" | null");
            }
        }

        result.nameWhitespace = this.getLeadingWhiteSpaces(context.identifier());
        result.name = context.identifier().getText();
        this.ignoreContent(context.identifier());

        result.signatureContent = new java.lang.StringBuilder();
        result.signature = [];
        result.returnType = `${returnType.toString()}`;

        if (this.configuration.options?.preferArrowFunctions) {
            result.signatureContent.append(result.modifiers?.has("abstract") ? ": " : " = ");
        }

        if (genericParams) {
            result.signatureContent.append(genericParams);
        }

        this.processFormalParameters(result, context.formalParameters());

        // TODO: move brackets to the type string.
        if (context.LBRACK().length > 0) {
            result.leadingWhitespace = this.getLeadingWhiteSpaces(context.LBRACK(0));

            const rightBrackets = context.RBRACK();
            this.whiteSpaceAnchor = rightBrackets[rightBrackets.length - 1].symbol.stop + 1;
        }

        if (this.configuration.options?.preferArrowFunctions) {
            if (result.modifiers?.has("abstract")) {
                result.signatureContent.append(` => ${returnType.toString()}`);
            } else {
                result.signatureContent.append(`: ${returnType.toString()} =>`);
            }
        } else {
            result.signatureContent.append(`: ${returnType.toString()}`);
        }

        if (context.THROWS()) {
            this.ignoreContent(context.qualifiedNameList());
        }

        this.processMethodBody(result.bodyContent, context.methodBody());

        return result;
    };

    private processFormalParameters = (details: ITypeMemberDetails, context: FormalParametersContext): void => {
        if (details.signatureContent) {
            this.getContent(details.signatureContent, context.LPAREN());
            this.processFormalParameterList(details, context.formalParameterList());
            this.getContent(details.signatureContent, context.RPAREN());
        }
    };

    private processFormalParameterList = (details: ITypeMemberDetails,
        context: FormalParameterListContext | null): void => {
        if (!context) {
            return;
        }

        let index = 0;
        let child = context.getChild(index);
        while (true) {
            if (!(child instanceof FormalParameterContext) || !details.signatureContent) {
                break;
            }

            details.signature?.push(this.processFormalParameter(details.signatureContent, child));
            if (++index === context.getChildCount()) {
                break;
            }

            child = context.getChild(index);
            if (!(child instanceof TerminalNode)) {
                break;
            }

            this.getContent(details.signatureContent, child);

            if (++index === context.getChildCount()) {
                break;
            }

            child = context.getChild(index);
        }

        if (child instanceof LastFormalParameterContext && details.signatureContent) {
            details.signature!.push(this.processFormalParameter(details.signatureContent, child));
        }
    };

    /**
     * Processes a single formal parameter.
     *
     * @param builder The target buffer to write the converted code to.
     * @param context The parse context to examine.
     *
     * @returns Returns name and type of the parameter.
     */
    private processFormalParameter = (builder: java.lang.StringBuilder,
        context: FormalParameterContext | LastFormalParameterContext): IParameterInfo => {

        context.variableModifier().forEach((modifier) => {
            this.getContent(builder, modifier, true);
        });

        const typeWs = this.getLeadingWhiteSpaces(context.typeType());

        const type = new java.lang.StringBuilder();
        let nullable = false;
        let nullText = "";
        if (!this.processTypeType(type, context.typeType())) {
            // Not a primitive type so make it explicitly nullable. Do not add the `| null` text to the parameter's
            // generated type string, however, to avoid duplicate null types in overloading scenarios.
            nullable = true;

            const addNull = this.configuration.options?.addNullUnionType ?? true;
            if (addNull) {
                nullText = "| null";
            }
        }

        let brackets = "";
        if (context instanceof LastFormalParameterContext) {
            context.annotation().forEach((annotation) => {
                this.processAnnotation(builder, annotation);
            });
            this.getContent(builder, context.ELLIPSIS());

            // Rest parameters in TS need an array notation.
            brackets = "[]";
        }

        const identifier = context.variableDeclaratorId().identifier();
        const nameWs = this.getLeadingWhiteSpaces(identifier);
        builder.append(typeWs);
        this.getContent(builder, identifier);
        builder.append(`:${nameWs}${type}${nullText}${brackets}`);

        if (context.variableDeclaratorId().LBRACK().length > 0) {
            // Old array style given.
            let index = 1;
            const children = context.variableDeclaratorId().children ?? [];
            while (index < children.length) {
                this.getContent(builder, children[index++] as TerminalNode);
            }
        }

        return {
            name: identifier.getText(),
            type: `${type}${brackets}`,
            nullable,
            rest: brackets.length > 0,
        };
    };

    private processMethodBody = (builder: java.lang.StringBuilder, context: MethodBodyContext): void => {
        if (context.block()) {
            this.processBlock({ builder, context: context.block() });
        } else {
            this.getContent(builder, context.SEMI());
        }
    };

    private processGenericMethodDeclaration = (
        context: GenericMethodDeclarationContext | null): ITypeMemberDetails | undefined => {
        if (!context) {
            return undefined;
        }

        const params = new java.lang.StringBuilder();
        this.processTypeParameters(params, context.typeParameters());

        const result = this.processMethodDeclaration(context.methodDeclaration(), params);
        if (result) {
            result.typeParameters = `${params.toString()}`;
        }

        return result;
    };

    private processFieldDeclaration = (context: FieldDeclarationContext | null,
        modifiers: Set<string>): ITypeMemberDetails[] => {

        if (!context) {
            return [];
        }

        const type = new java.lang.StringBuilder();
        const addNull = this.configuration.options?.addNullUnionType ?? true;
        const makeOptional = !this.processTypeType(type, context.typeType()) && addNull;

        const list = this.processVariableDeclarators(context.variableDeclarators(), type, modifiers, makeOptional);
        const lastEntry = list[list.length - 1];
        this.getContent(lastEntry.bodyContent, context.SEMI());

        return list;
    };

    private processConstructorDeclaration = (extraCtorParams: ExtraParameters | null,
        context: ConstructorDeclarationContext | null): ITypeMemberDetails | undefined => {

        if (!context) {
            return undefined;
        }

        const result: ITypeMemberDetails = {
            type: MemberType.Constructor,
            name: "constructor",
            leadingWhitespace: "",
            bodyContent: new java.lang.StringBuilder(),
            signatureContent: new java.lang.StringBuilder(),
            signature: [],
            nameWhitespace: this.getLeadingWhiteSpaces(context.identifier()),
        };

        this.ignoreContent(context.identifier());
        this.processFormalParameters(result, context.formalParameters());

        if (context.THROWS()) {
            this.ignoreContent(context.qualifiedNameList());
        }

        let hasSuperCall = false;
        let hasThisCall = false;
        for (const blockStatement of context.block().blockStatement()) {
            const statement = blockStatement.statement();
            if (statement && statement.expression().length > 0) {
                const expression = statement.expression(0);
                if (expression?.methodCall()?.SUPER()) {
                    hasSuperCall = true;

                    break;
                } else if (expression?.methodCall()?.THIS()) {
                    hasThisCall = true;

                    break;
                }
            }
        }

        if (!hasSuperCall && this.configuration.javaLib === "") {
            // Don't add a super call if no base class is specified and no java lib is used.
            hasSuperCall = true;
        }

        result.containsThisCall = hasThisCall;

        // See if we should automatically add a call to super. Only if none exists yet and this class extends another.
        const info = this.source.resolveType(context.identifier().getText());
        let needSuperCall = false;
        if (info && info.symbol instanceof ClassSymbol) {
            // A class always extends another class, and be it only the base Java object.
            needSuperCall = !hasSuperCall && !hasThisCall;
        }

        let superCall = needSuperCall ? "super();\n" : undefined;

        // If extra constructor parameters are given add them to the signature content (no need to update
        // the signature, however) and to the generated super call.
        if (extraCtorParams) {
            const list = extraCtorParams.map((entry) => {
                return `${entry.name}: ${entry.type}`;
            });

            if (result.signatureContent) {
                const length = result.signatureContent.length();
                result.signatureContent.delete(length - 1, length);
                result.signatureContent.append(", ");
                result.signatureContent.append(list.join(", "));
                result.signatureContent.append(")");
            }

            if (needSuperCall) {
                // Should always be true for an enum constructor.
                const params = extraCtorParams.map((entry) => {
                    return entry.name;
                });

                superCall = `super(${params.join(", ")});\n`;
            }
        }

        this.processBlock({ builder: result.bodyContent, context: context.block(), extra: superCall });

        return result;
    };

    private processGenericConstructorDeclaration = (extraCtorParams: ExtraParameters | null,
        context: GenericConstructorDeclarationContext | null): ITypeMemberDetails | undefined => {

        if (!context) {
            return undefined;
        }

        // Constructors cannot have type parameters.
        this.ignoreContent(context.typeParameters());

        return this.processConstructorDeclaration(extraCtorParams, context.constructorDeclaration());
    };

    private processTypeParameters = (builder: java.lang.StringBuilder, context: TypeParametersContext | null): void => {
        if (!context) {
            return;
        }

        this.getContent(builder, context.LT());

        let index = 1;
        while (true) {
            const child = context.getChild(index++) as TypeParameterContext;
            this.processTypeParameter(builder, child);

            if (index === context.getChildCount() - 1) {
                break;
            }

            this.getContent(builder, context.getChild(index++));
        }

        this.getContent(builder, context.GT());
    };

    private processTypeParameter = (builder: java.lang.StringBuilder, context: TypeParameterContext): void => {
        let i = 0;
        while (i < context.getChildCount()) {
            const child = context.getChild(i++);
            if (child instanceof AnnotationContext) {
                this.processAnnotation(builder, child);
            } else {
                break;
            }
        }

        this.getContent(builder, context.identifier());

        if (context.EXTENDS()) {
            i += 2;
            while (i < context.getChildCount()) {
                const child = context.getChild(i++);
                if (child instanceof AnnotationContext) {
                    this.processAnnotation(builder, child);
                } else {
                    break;
                }
            }

            this.processTypeBound(builder, context.typeBound());
        }
    };

    private processTypeBound = (builder: java.lang.StringBuilder, context: TypeBoundContext | null): void => {
        if (!context) {
            return;
        }

        let index = 0;
        while (true) {
            const child = context.getChild(index++);
            this.processTypeType(builder, child as TypeTypeContext);

            if (index === context.getChildCount()) {
                break;
            }

            this.getContent(builder, context.getChild(index++));
        }
    };

    private processInterfaceDeclaration = (context: InterfaceDeclarationContext | null, prefix: string,
        doExport: boolean): ITypeMemberDetails | undefined => {
        if (!context) {
            return undefined;
        }

        const result: ITypeMemberDetails = {
            type: MemberType.Interface,
            name: context.identifier().getText(),
            leadingWhitespace: "",
            bodyContent: new java.lang.StringBuilder(),
        };

        this.typeStack.push({
            name: context.identifier().getText(),
            type: ContextType.Interface,
            deferredDeclarations: new java.lang.StringBuilder(),
            generatedMembers: [],
        });

        const localBuilder = new java.lang.StringBuilder();

        // Java interfaces can only be converted directly to TS interfaces under certain circumstances.
        // If a Java interface is not compatible with TS then it is converted to an abstract class.
        // We have to prepare both cases here, until we can make the decision.
        const ws = this.getLeadingWhiteSpaces(context.INTERFACE());
        this.ignoreContent(context.INTERFACE());

        const identifierBuilder = new java.lang.StringBuffer();
        this.getContent(identifierBuilder, context.identifier());

        if (context.typeParameters()) {
            this.processTypeParameters(localBuilder, context.typeParameters());
        }

        if (context.EXTENDS()) {
            this.getContent(localBuilder, context.EXTENDS());
            this.processTypeList(localBuilder, context.typeList());
        }

        const info = this.source.getQualifiedSymbol(context, context.identifier().getText());
        const interfaceSymbol = info ? info.symbol as JavaInterfaceSymbol : undefined;
        const isTypescriptCompatible = interfaceSymbol?.isTypescriptCompatible ?? false;

        this.processInterfaceBody(localBuilder, isTypescriptCompatible, context.interfaceBody());
        if (isTypescriptCompatible) {
            localBuilder.insert(0, `${ws}interface${identifierBuilder}`);
        } else {
            localBuilder.insert(0, `${ws}abstract class${identifierBuilder}`);
        }

        const nested = this.processNestedContent(doExport);

        // Check if this declaration itself is nested.
        if (this.typeStack.size() > 1) {
            this.typeStack.peek().deferredDeclarations.append(`\texport ${localBuilder}\n\n`);
        } else {
            result.bodyContent.append(`${prefix}${localBuilder}`);
        }

        this.typeStack.peek().deferredDeclarations.append(nested);

        return result;
    };

    private processInterfaceBody = (builder: java.lang.StringBuilder, isTypescriptCompatible: boolean,
        context: InterfaceBodyContext): void => {
        this.getContent(builder, context.LBRACE());
        this.processInterfaceBodyDeclarations(builder, isTypescriptCompatible, context.interfaceBodyDeclaration());
        this.getContent(builder, context.RBRACE());
    };

    private processInterfaceBodyDeclarations = (builder: java.lang.StringBuilder, isTypescriptCompatible: boolean,
        list: InterfaceBodyDeclarationContext[]): boolean => {
        const members: ITypeMemberDetails[] = [];

        list.forEach((context) => {
            if (!context.SEMI()) {
                const prefix = new java.lang.StringBuilder();
                prefix.append(this.getLeadingWhiteSpaces(context));
                const modifiers = new Set<string>();

                // Ignore modifiers, if we can use a TS interface.
                if (!isTypescriptCompatible) {
                    let ignoreNextWhitespaces = false;
                    context.modifier().forEach((modifierContext) => {
                        if (ignoreNextWhitespaces) {
                            ignoreNextWhitespaces = false;
                            this.getLeadingWhiteSpaces(modifierContext);
                        }

                        switch (this.processModifier(prefix, modifierContext)) {
                            case ModifierType.Public: {
                                modifiers.add("public");
                                break;
                            }

                            case ModifierType.Protected: {
                                modifiers.add("protected");
                                break;
                            }

                            case ModifierType.Private: {
                                modifiers.add("private");
                                break;
                            }

                            case ModifierType.Final: {
                                modifiers.add("readonly");
                                break;
                            }

                            case ModifierType.Ignored: {
                                ignoreNextWhitespaces = true;
                                break;
                            }

                            default:
                        }
                    });

                    if (!modifiers.has("public") && !modifiers.has("protected") && !modifiers.has("private")) {
                        // No modifier means package private.
                        modifiers.add("protected");
                    }

                    if (ignoreNextWhitespaces) {
                        this.getLeadingWhiteSpaces(context.interfaceMemberDeclaration());
                    }
                }

                const details = this.processInterfaceMemberDeclaration(context.interfaceMemberDeclaration(),
                    `${prefix.toString()}`, modifiers, isTypescriptCompatible);

                if (details) {
                    if (isTypescriptCompatible) {
                        // Reset type and modifier for methods marked as being abstract.
                        details.type = MemberType.Method;
                        details.modifiers = undefined;
                    }

                    if (details.bodyContent.length() > 0) {
                        // The declaration is empty if it was converted to a (nested) namespace.
                        members.push(details);
                    }
                }
            }
        });

        this.processBodyMembers(builder, members, false);

        return isTypescriptCompatible;
    };

    private processInterfaceMemberDeclaration = (context: InterfaceMemberDeclarationContext | null, prefix: string,
        modifiers: Set<string>, isTypescriptCompatible: boolean): ITypeMemberDetails | undefined => {
        if (!context) {
            return;
        }

        const result: ITypeMemberDetails = {
            type: MemberType.Empty,
            leadingWhitespace: prefix,
            modifiers,
            bodyContent: new java.lang.StringBuilder(),
        };

        const firstChild = context.getChild(0) as ParserRuleContext;
        switch (firstChild.ruleIndex) {
            case JavaParser.RULE_constDeclaration: {
                this.processConstDeclaration(result, firstChild as ConstDeclarationContext);

                // Const declarations must be moved to a separate namespace.
                this.typeStack.peek().deferredDeclarations.append(`\texport const ${result.bodyContent}\n`);
                result.bodyContent.clear();

                break;
            }

            case JavaParser.RULE_interfaceMethodDeclaration: {
                this.processInterfaceMethodDeclaration(result, firstChild as InterfaceMethodDeclarationContext,
                    isTypescriptCompatible);

                break;
            }

            case JavaParser.RULE_genericInterfaceMethodDeclaration: {
                this.processGenericInterfaceMethodDeclaration(result,
                    firstChild as GenericInterfaceMethodDeclarationContext, isTypescriptCompatible);

                break;
            }

            case JavaParser.RULE_interfaceDeclaration: {
                return this.processInterfaceDeclaration(firstChild as InterfaceDeclarationContext,
                    prefix, modifiers.has("public"));
            }

            case JavaParser.RULE_annotationTypeDeclaration: {
                return this.processAnnotationTypeDeclaration(firstChild as AnnotationTypeDeclarationContext);
            }

            case JavaParser.RULE_classDeclaration: {
                return this.processClassDeclaration(firstChild as ClassDeclarationContext, prefix, modifiers, null);
            }

            case JavaParser.RULE_enumDeclaration: {
                return this.processEnumDeclaration(firstChild as EnumDeclarationContext, modifiers);

            }

            default:
        }

        return result;
    };

    private processConstDeclaration = (details: ITypeMemberDetails, context: ConstDeclarationContext): void => {
        details.type = MemberType.Field;

        const type = new java.lang.StringBuilder();
        this.processTypeType(type, context.typeType());

        let index = 1;
        while (true) {
            let child = context.getChild(index++);
            this.processConstantDeclarator(details.bodyContent, child as ConstantDeclaratorContext,
                `${type.toString()}`);

            child = context.getChild(index++);
            this.getContent(details.bodyContent, child); // Comma or semicolon.
            if (child!.getText() === ";") {
                break;
            }
        }
    };

    private processConstantDeclarator = (builder: java.lang.StringBuilder, context: ConstantDeclaratorContext,
        type: string): void => {

        const ws = this.getLeadingWhiteSpaces(context.identifier());
        this.getContent(builder, context.identifier());

        builder.append(`:${ws}`);
        builder.append(type);

        context.RBRACK().forEach((bracket) => {
            this.getContent(builder, bracket);
        });

        this.getContent(builder, context.ASSIGN());
        this.processVariableInitializer(builder, context.variableInitializer());
    };

    private processInterfaceMethodDeclaration = (details: ITypeMemberDetails,
        context: InterfaceMethodDeclarationContext, isTypescriptCompatible: boolean): void => {

        // Ignore all method modifiers. Interface members in TS have no modifiers.
        context.interfaceMethodModifier().forEach((modifier) => {
            this.ignoreContent(modifier);
        });

        this.processInterfaceCommonBodyDeclaration(details, context.interfaceCommonBodyDeclaration(),
            isTypescriptCompatible);
    };

    private processGenericInterfaceMethodDeclaration = (details: ITypeMemberDetails,
        context: GenericInterfaceMethodDeclarationContext, isTypescriptCompatible: boolean): void => {

        // Ignore all method modifiers. Interface members in TS have no modifiers.
        context.interfaceMethodModifier().forEach((modifier) => {
            this.ignoreContent(modifier);
        });

        const typeParameters = new java.lang.StringBuilder();
        this.processTypeParameters(typeParameters, context.typeParameters());
        details.typeParameters = `${typeParameters.toString()}`;

        this.processInterfaceCommonBodyDeclaration(details, context.interfaceCommonBodyDeclaration(),
            isTypescriptCompatible);
    };

    private processInterfaceCommonBodyDeclaration = (details: ITypeMemberDetails,
        context: InterfaceCommonBodyDeclarationContext, isTypescriptCompatible: boolean): void => {
        details.signatureContent = new java.lang.StringBuilder();
        details.signature = [];

        context.annotation().forEach((annotation) => {
            this.ignoreContent(annotation);
        });

        const returnType = new java.lang.StringBuilder();
        this.processTypeTypeOrVoid(returnType, context.typeTypeOrVoid());
        details.returnType = `${returnType.toString()}`;

        const isAbstract = context.methodBody().SEMI() != null && !isTypescriptCompatible;
        if (isAbstract) {
            details.type = MemberType.Abstract;
            details.modifiers?.add("abstract");
        } else {
            details.type = MemberType.Method;
        }

        const useArrowFunction = !isTypescriptCompatible && this.configuration.options?.preferArrowFunctions;
        details.name = context.identifier().getText();
        details.nameWhitespace = this.getLeadingWhiteSpaces(context.identifier());
        this.ignoreContent(context.identifier());
        if (useArrowFunction) {
            details.signatureContent.append(isAbstract ? ": " : " = ");
        }

        if (details.typeParameters) {
            details.signatureContent.append(details.typeParameters);
        }

        this.processFormalParameters(details, context.formalParameters());

        // For old style square brackets (after the method parameters) collect them and add them to the type.
        context.RBRACK().forEach((bracket) => {
            this.getContent(returnType, bracket);
        });

        if (context.THROWS()) {
            this.ignoreContent(context.qualifiedNameList());
        }

        details.signatureContent.append(useArrowFunction ? " => " : ": ");
        details.signatureContent.append(returnType);

        this.processMethodBody(details.bodyContent, context.methodBody());
    };

    private processAnnotationTypeDeclaration = (
        context: AnnotationTypeDeclarationContext | null): ITypeMemberDetails | undefined => {

        if (!context) {
            return undefined;
        }

        const result: ITypeMemberDetails = {
            type: MemberType.Annotation,
            name: context.identifier().getText(),
            leadingWhitespace: "",
            bodyContent: new java.lang.StringBuilder(),
        };

        this.getContent(result.bodyContent, context, true); // Not supported in TS.

        return result;
    };

    private processEnumDeclaration = (context: EnumDeclarationContext | null,
        modifiers: Set<string>): ITypeMemberDetails | undefined => {
        if (!context) {
            return undefined;
        }

        const result: ITypeMemberDetails = {
            type: MemberType.Enum,
            name: context.identifier().getText(),
            leadingWhitespace: "",
            bodyContent: new java.lang.StringBuilder(),
        };

        // Enums in Java are essentially classes with some extra (implicit) handling.
        // We convert them to TS classes and explicitly add what Java does internally.
        this.typeStack.push({
            name: context.identifier().getText(),
            type: ContextType.Enum,
            deferredDeclarations: new java.lang.StringBuilder(),
            generatedMembers: [],
        });

        const localBuilder = new java.lang.StringBuilder();

        localBuilder.append(this.getLeadingWhiteSpaces(context.ENUM()));
        this.ignoreContent(context.ENUM());
        localBuilder.append("class");
        this.getContent(localBuilder, context.identifier());

        let qualifier = "";
        if (!this.configuration?.options?.useUnqualifiedTypes) {
            qualifier = "java.lang.";
        }

        localBuilder.append(S` extends ${qualifier}Enum<${context.identifier().getText()}>`); // Implicit in Java.
        this.resolveType(context, "Enum");

        if (context.IMPLEMENTS()) {
            this.getContent(localBuilder, context.IMPLEMENTS());
            this.processTypeList(localBuilder, context.typeList());
        }

        this.getContent(localBuilder, context.LBRACE());
        this.processEnumConstants(localBuilder, context.enumConstants());
        this.getContent(localBuilder, context.COMMA());

        const declarations = context.enumBodyDeclarations();
        if (declarations) {
            this.getContent(localBuilder, declarations.SEMI());

            // We have to add two enum specific parameters to the explicit constructor of an enum type, but
            // only if there's one. Additionally, we assume there's only a single constructor, no overloads.
            const extraParameters: ExtraParameters = [
                { name: "$name$", type: "java.lang.String" },
                { name: "$index$", type: "number" },
            ];
            this.processClassBodyDeclarations(localBuilder, declarations.classBodyDeclaration(), extraParameters);
        }

        this.getContent(localBuilder, context.RBRACE());

        // Conclude nested content within this class declaration.
        const nested = this.processNestedContent(modifiers.has("export"));

        // Check if this enum itself is nested.
        if (this.typeStack.size() > 1) {
            const className = context.identifier().getText();

            // This is a nested enum declaration, which are implicitly static.
            result.bodyContent.append(` ${className} = ${localBuilder.toString()};\n`);
            const owner = this.typeStack.peek();

            this.typeStack.peek().deferredDeclarations.append(`\texport type ${className}` +
                ` = InstanceType<typeof ${owner.name!}.${className}>;\n`);
        } else {
            // A top level enum declaration.
            const modifier = this.createModifierString(modifiers);
            result.bodyContent.append(`${modifier}`);
            result.bodyContent.append(localBuilder);

        }

        this.typeStack.peek().deferredDeclarations.append(nested);

        return result;
    };

    private processEnumConstants = (builder: java.lang.StringBuilder, context: EnumConstantsContext | null): void => {
        if (!context) {
            return;
        }

        const commas = context.COMMA();
        context.enumConstant().forEach((constant, index) => {
            this.processEnumConstant(builder, constant, index);
            if (index < commas.length) {
                // Replace comma with semicolon on all but the last entry.
                builder.append(this.getLeadingWhiteSpaces(commas[index]));
                this.ignoreContent(commas[index]);
                builder.append(";");
            }
        });
    };

    private processEnumConstant = (builder: java.lang.StringBuilder, context: EnumConstantContext,
        index: number): void => {
        const list = context.annotation();
        if (list.length > 0) {
            this.getRangeCommented(builder, list[0], list[list.length - 1]);
        }

        builder.append(this.getLeadingWhiteSpaces(context.identifier()));
        builder.append(S`public static readonly `);

        this.getContent(builder, context.identifier());

        const owner = this.typeStack.peek();
        const ownerName = owner?.name ?? "<unknown>";
        const enumName = context.identifier().getText();
        builder.append(`: ${ownerName} = `);

        builder.append(`new class extends ${ownerName} `);
        const argumentsBuilder = new java.lang.StringBuilder();
        this.processArguments(argumentsBuilder, context.arguments());

        if (context.classBody()) {
            this.processClassBody(builder, context.classBody(), null);
        } else {
            builder.append("{\n}");
        }

        if (argumentsBuilder.length() > 0) {
            builder.append(argumentsBuilder);
            builder.setCharAt(builder.length() - 1, 0x2C); // Replace the closing par with a comma.
        } else {
            builder.append("(");
        }

        // Finally add the initializer code to set the right name + ordinal for this field.
        builder.append(`S\`${enumName}\`, ${index})`);
        this.registerJavaImport("S");
    };

    private processBlock = (details: {
        builder: java.lang.StringBuilder,
        context: BlockContext | null,
        extra?: string;
        ignoreBraces?: boolean;
    }): void => {
        if (!details.context) {
            return;
        }

        if (!details.ignoreBraces) {
            this.getContent(details.builder, details.context.LBRACE());
        }

        if (details.extra) {
            // Add this string to the block before processing the rest.
            if (details.context.blockStatement().length > 0) {
                details.builder.append(this.getLeadingWhiteSpaces(details.context.blockStatement(0)));
            } else {
                details.builder.append(this.getLeadingWhiteSpaces(details.context.RBRACE()));
            }
            details.builder.append(details.extra);
        }

        details.context.blockStatement().forEach((child) => {
            this.processBlockStatement(details.builder, child);
        });

        if (!details.ignoreBraces) {
            this.getContent(details.builder, details.context.RBRACE());
        }
    };

    private processBlockStatement = (builder: java.lang.StringBuilder, context: BlockStatementContext): void => {
        if (context.localVariableDeclaration()) {
            this.processLocalVariableDeclaration(builder, context.localVariableDeclaration());
            this.getContent(builder, context.SEMI());
        } else if (context.statement()) {
            this.processStatement(builder, context.statement());
        } else {
            this.processLocalTypeDeclaration(builder, context.localTypeDeclaration());
        }
    };

    private processLocalVariableDeclaration = (builder: java.lang.StringBuilder,
        context: LocalVariableDeclarationContext | null): void => {
        if (!context) {
            return;
        }

        context.variableModifier().forEach((modifier) => {
            this.processVariableModifier(builder, modifier);
        });

        const ws = this.getLeadingWhiteSpaces(context.typeType());
        const type = new java.lang.StringBuilder();
        this.processTypeType(type, context.typeType());

        // What's matched as type can be the special form of `var a = 1`.
        if (type.toString().valueOf() === "var") {
            type.clear();
        }

        builder.append(ws);
        const list = this.processVariableDeclarators(context.variableDeclarators(), type, new Set(), false);
        list.forEach((details) => {
            builder.append(details.leadingWhitespace);
            builder.append(details.bodyContent);
        });
    };

    private processVariableModifier = (builder: java.lang.StringBuilder, context: VariableModifierContext): void => {
        if (context.FINAL()) {
            // The `final` would make this a `const`, but we always add a `let` later in the process -
            // a linter can convert to const then.
            builder.append(this.getLeadingWhiteSpaces(context.FINAL()));
            this.ignoreContent(context.FINAL());
        } else {
            // Decorators are not valid at this position, so we just ignore them.
            this.getContent(builder, context, true);
        }
    };

    private processVariableDeclarators = (context: VariableDeclaratorsContext, type: java.lang.StringBuilder,
        modifiers: Set<string>, makeOptional: boolean): ITypeMemberDetails[] => {
        let index = 0;

        const result: ITypeMemberDetails[] = [];

        while (true) {
            const child = context.getChild(index++);

            const details: ITypeMemberDetails = {
                type: MemberType.Field,
                leadingWhitespace: "",
                bodyContent: new java.lang.StringBuilder(),
            };

            this.processVariableDeclarator(details.bodyContent, child as VariableDeclaratorContext, type, makeOptional);
            result.push(details);
            if (index === context.getChildCount()) {
                break;
            }

            const comma = context.getChild(index++);
            details.bodyContent.append(`;${this.getLeadingWhiteSpaces(comma)}\n`);
            this.ignoreContent(comma);
        }

        return result;
    };

    private processVariableDeclarator = (builder: java.lang.StringBuilder, context: VariableDeclaratorContext,
        type: java.lang.StringBuilder, makeOptional: boolean): void => {
        const ws = this.getLeadingWhiteSpaces(context.variableDeclaratorId());

        const localBuilder = new java.lang.StringBuilder();
        this.getContent(localBuilder, context.variableDeclaratorId().identifier());
        const name = localBuilder.toString();

        if (context.parent?.parent instanceof LocalVariableDeclarationContext) {
            builder.append("let ");
        }

        const hasInitializer = context.ASSIGN() != null;
        if (type.length() > 0) {
            builder.append(`${ws}${name}`);

            const suppressType = this.configuration.options?.suppressTypeWithInitializer ?? false;
            if (!hasInitializer || !suppressType) {
                builder.append(`: ${type}${makeOptional ? " | null" : ""}`);
            }
        } else {
            builder.append(`${ws}${name} `);
        }

        if (context.variableDeclaratorId().LBRACK().length > 0) {
            let index = 1;
            const children = context.variableDeclaratorId().children ?? [];
            while (index < children.length) {
                this.getContent(builder, children[index++] as TerminalNode);
            }
        }

        if (hasInitializer) {
            this.getContent(builder, context.ASSIGN());
            this.processVariableInitializer(builder, context.variableInitializer());
        }
    };

    private processVariableInitializer = (builder: java.lang.StringBuilder,
        context: VariableInitializerContext | null): void => {
        if (!context) {
            return;
        }

        if (context.arrayInitializer()) {
            this.processArrayInitializer(builder, context.arrayInitializer());
        } else {
            this.processExpression(builder, context.expression());
        }
    };

    private processArrayInitializer = (builder: java.lang.StringBuilder,
        context: ArrayInitializerContext | null): void => {
        if (!context) {
            return;
        }

        builder.append(this.getLeadingWhiteSpaces(context.LBRACE()) + "[");

        context.variableInitializer().forEach((child) => {
            this.processVariableInitializer(builder, child);
        });

        builder.append(this.getLeadingWhiteSpaces(context.RBRACE()) + "]");
    };

    private processParExpression = (builder: java.lang.StringBuilder,
        context: ParExpressionContext | null): ISymbolInfo | null => {
        if (!context) {
            return null;
        }

        this.getContent(builder, context.LPAREN());
        const result = this.processExpression(builder, context.expression());
        this.getContent(builder, context.RPAREN());

        return result;
    };

    /**
     * Processes a single expression.
     *
     * @param builder The target buffer to write the result to.
     * @param context The expression context for processing.
     *
     * @returns If the expression results in an identifiable member (e.g. a field) then the symbol for it is returned.
     */
    private processExpression = (builder: java.lang.StringBuilder,
        context: ExpressionContext | null): ISymbolInfo | null => {
        if (!context) {
            return null;
        }

        let instance: ISymbolInfo | null = null;

        const firstChild = context.getChild(0);
        if (firstChild instanceof TerminalNode) {
            switch (firstChild.symbol.type) {
                case JavaLexer.NEW: {
                    builder.append(this.getLeadingWhiteSpaces(context.NEW()));
                    this.ignoreContent(context.NEW());

                    const temp = new java.lang.StringBuilder();
                    const useNew = this.processCreator(temp, context.creator());
                    builder.append(useNew ? "new " : "");
                    builder.append(temp);

                    break;
                }

                case JavaLexer.LPAREN: { // A type cast.
                    const leftWs = this.getLeadingWhiteSpaces(context.LPAREN());
                    this.ignoreContent(context.LPAREN());

                    const type = new java.lang.StringBuilder();
                    context.annotation().forEach((annotation) => {
                        this.processAnnotation(type, annotation);
                    });

                    const typeType = context.typeType();
                    if (typeType.length > 1) {
                        // This is a construct we cannot convert.
                        this.getRangeCommented(builder, typeType[0], typeType[typeType.length - 1]);
                    } else if (typeType.length === 1) {
                        this.processTypeType(type, typeType[0]);
                    }

                    // Replace casts that can be better expressed.
                    const rightWs = this.getLeadingWhiteSpaces(context.RPAREN());
                    switch (type.toString().valueOf()) {
                        case "string": {
                            const expression = new java.lang.StringBuilder();
                            this.processExpression(expression, context.expression(0));
                            builder.append(`${leftWs}String(${expression.toString()})${rightWs}`);

                            break;
                        }

                        case "number": {
                            const expression = new java.lang.StringBuilder();
                            this.processExpression(expression, context.expression(0));
                            builder.append(`${leftWs}Number(${expression.toString()})${rightWs}`);

                            break;
                        }

                        default: {
                            const temp = new java.lang.StringBuilder();
                            builder.append(leftWs);
                            this.processExpression(builder, context.expression(0));
                            builder.append(temp);
                            builder.append(" as ");
                            builder.append(type);

                            break;
                        }
                    }

                    break;
                }

                default: {
                    this.getContent(builder, firstChild);
                    this.processExpression(builder, context.expression(0));
                }
            }
        } else {
            const firstChild = context.getChild(0) as ParserRuleContext;
            switch (firstChild.ruleIndex) {
                case JavaParser.RULE_primary: {
                    instance = this.processPrimary(builder, context.primary());
                    break;
                }

                case JavaParser.RULE_expression: {
                    builder.append(this.getLeadingWhiteSpaces(context.expression(0)));

                    const firstExpression = new java.lang.StringBuilder();
                    instance = this.processExpression(firstExpression, context.expression(0));

                    // eslint-disable-next-line no-underscore-dangle
                    const operator = context._bop;
                    if (operator) {
                        switch (operator.type) {
                            case JavaLexer.INSTANCEOF: {
                                builder.append(firstExpression);
                                this.processTypeType(builder, context.typeType(0));
                                break;
                            }

                            case JavaLexer.DOT: {
                                if (context.identifier()) {
                                    builder.append(firstExpression);
                                    this.getContent(builder, context.DOT());
                                    this.getContent(builder, context.identifier());
                                } else if (context.getChild(2) instanceof TerminalNode) {
                                    const node = context.getChild(2) as unknown as TerminalNode;
                                    switch (node.symbol.type) {
                                        case JavaLexer.IDENTIFIER:
                                        case JavaLexer.THIS: {
                                            builder.append(firstExpression);
                                            this.getContent(builder, context.DOT());
                                            this.getContent(builder, node);
                                            break;
                                        }

                                        case JavaLexer.NEW: {
                                            // Convert `expression.new Class()` to `new expression.Class()`.
                                            this.getContent(builder, context.NEW());
                                            builder.append(firstExpression);
                                            this.getContent(builder, context.DOT());
                                            this.processNonWildcardTypeArguments(builder,
                                                context.nonWildcardTypeArguments());
                                            this.processInnerCreator(builder, context.innerCreator());

                                            break;
                                        }

                                        case JavaLexer.SUPER: {
                                            builder.append(firstExpression);
                                            this.getContent(builder, context.DOT());
                                            this.processSuperSuffix(builder, context.superSuffix());
                                            break;
                                        }

                                        default:
                                    }
                                } else {
                                    const call = context.methodCall();
                                    if (call) {
                                        builder.append(firstExpression);
                                        this.getContent(builder, context.DOT());
                                        this.processMethodCall(builder, call, instance);
                                    } else {
                                        builder.append(firstExpression);
                                        this.getContent(builder, context.DOT());
                                        this.processExplicitGenericInvocation(builder,
                                            context.explicitGenericInvocation());
                                    }
                                }

                                break;
                            }

                            default: {
                                builder.append(firstExpression);

                                // A binary expression (or trinary in case of the ?: statement);
                                // Replace certain comparison operators with the safe type.
                                let usedOperator = operator.text;
                                if (operator.type === JavaLexer.EQUAL) {
                                    usedOperator = "===";
                                } else if (operator.type === JavaLexer.NOTEQUAL) {
                                    usedOperator = "!==";
                                }
                                builder.append(this.getLeadingWhiteSpaces(context.getChild(1)));
                                builder.append(usedOperator ?? "");

                                this.processExpression(builder, context.expression(1));

                                if (operator.type === JavaLexer.QUESTION) {
                                    this.processExpression(builder, context.expression(2));
                                }

                                break;
                            }
                        }

                    } else {
                        builder.append(firstExpression);
                        const secondChild = context.getChild(1);
                        if (secondChild instanceof TerminalNode) {
                            switch (secondChild.symbol.type) {
                                case JavaLexer.LT:
                                case JavaLexer.GT: {
                                    builder.append(this.getLeadingWhiteSpaces(context.expression(1)));
                                    this.processExpression(builder, context.expression(1));
                                    break;
                                }

                                case JavaLexer.COLONCOLON: {
                                    builder.append(this.getLeadingWhiteSpaces(context.COLONCOLON()) + ".");
                                    this.processTypeArguments(builder, context.typeArguments());
                                    this.getContent(builder, context.identifier());

                                    break;
                                }

                                case JavaLexer.INC:
                                case JavaLexer.DEC: {
                                    this.getContent(builder, secondChild);
                                    break;
                                }

                                case JavaLexer.LBRACK: { // Array access.
                                    this.getContent(builder, context.LBRACK());
                                    this.processExpression(builder, context.expression(1));
                                    this.getContent(builder, context.RBRACK());
                                    break;
                                }

                                default: {
                                    // Something unhandled.
                                    builder.append(" /* Internal error: unhandled expression part. */ ");
                                    break;
                                }
                            }
                        } else {
                            // Something unhandled.
                            builder.append(" /* Internal error: unhandled expression part. */ ");
                        }
                    }

                    break;
                }

                case JavaParser.RULE_methodCall: {
                    // A method call with no instance to call on.
                    this.processMethodCall(builder, context.methodCall(), null);

                    break;
                }

                case JavaParser.RULE_lambdaExpression: {
                    this.processLambdaExpression(builder, context.lambdaExpression());
                    break;
                }

                case JavaParser.RULE_typeType: {
                    // Method reference.
                    this.processTypeType(builder, context.typeType(0));
                    builder.append(this.getLeadingWhiteSpaces(context.COLONCOLON()) + ".");
                    if (context.typeArguments()) {
                        this.processTypeArguments(builder, context.typeArguments());
                        this.getContent(builder, context.identifier());
                    } else {
                        this.getContent(builder, context.NEW());
                    }

                    break;
                }

                case JavaParser.RULE_classType: {
                    // Class reference.
                    this.processClassType(builder, context.classType());
                    builder.append(this.getLeadingWhiteSpaces(context.COLONCOLON()) + ".");
                    if (context.typeArguments()) {
                        this.processTypeArguments(builder, context.typeArguments());
                    }
                    this.getContent(builder, context.NEW());

                    break;
                }

                default: {
                    this.getContent(builder, context);
                }
            }
        }

        return instance;
    };

    private processExplicitGenericInvocation = (builder: java.lang.StringBuilder,
        context: ExplicitGenericInvocationContext | null): void => {
        this.getContent(builder, context);
    };

    private processSuperSuffix = (builder: java.lang.StringBuilder, context: SuperSuffixContext | null): void => {
        if (!context) {
            return;
        }

        if (context.arguments()) {
            this.processArguments(builder, context.arguments());
        } else {
            this.getContent(builder, context);
        }
    };

    private processNonWildcardTypeArguments = (builder: java.lang.StringBuilder,
        context: NonWildcardTypeArgumentsContext | null): void => {
        if (!context) {
            return;
        }

        this.processTypeList(builder, context.typeList());
        this.getContent(builder, context.GT());
    };

    private processInnerCreator = (builder: java.lang.StringBuilder, context: InnerCreatorContext | null): void => {
        if (!context) {
            return;
        }

        this.processNonWildcardTypeArgumentsOrDiamond(builder, context.nonWildcardTypeArgumentsOrDiamond());
        this.processClassCreatorRest(builder, context.classCreatorRest());
    };

    private processClassCreatorRest = (builder: java.lang.StringBuilder,
        context: ClassCreatorRestContext | null): void => {
        if (!context) {
            return;
        }

        if (context.classBody()) {
            // This is an anonymous inner class, which gets converted to a class expression.
            const localBuilder = new java.lang.StringBuilder();
            this.processArguments(localBuilder, context.arguments());
            this.processClassBody(builder, context.classBody(), null);
            builder.append(localBuilder);
        } else {
            this.processArguments(builder, context.arguments());
        }
    };

    private processArguments = (builder: java.lang.StringBuilder, context: ArgumentsContext | null): void => {
        if (!context) {
            return;
        }

        this.getContent(builder, context.LPAREN());
        this.processExpressionList(builder, context.expressionList());
        this.getContent(builder, context.RPAREN());
    };

    private processNonWildcardTypeArgumentsOrDiamond = (builder: java.lang.StringBuilder,
        context: NonWildcardTypeArgumentsOrDiamondContext | null): void => {
        if (!context) {
            return;
        }

        if (context.nonWildcardTypeArguments()) {
            this.processNonWildcardTypeArguments(builder, context.nonWildcardTypeArguments());
        } else {
            this.getContent(builder, context);
        }
    };

    private processLambdaExpression = (builder: java.lang.StringBuilder,
        context: LambdaExpressionContext | null): void => {
        if (!context) {
            return;
        }

        this.processLambdaParameters(builder, context.lambdaParameters());
        builder.append(this.getLeadingWhiteSpaces(context.ARROW()));
        builder.append("=>");

        if (context.lambdaBody().expression()) {
            this.processExpression(builder, context.lambdaBody().expression());
        } else {
            this.processBlock({ builder, context: context.lambdaBody().block() });
        }
    };

    private processLambdaParameters = (builder: java.lang.StringBuilder, context: LambdaParametersContext): void => {
        if (context.identifier().length > 0) {
            context.identifier().forEach((identifier) => {
                this.getContent(builder, identifier);
            });
        } else if (context.formalParameterList()) {
            const details: ITypeMemberDetails = {
                type: MemberType.Lambda,
                leadingWhitespace: "",
                bodyContent: builder,
            };
            this.processFormalParameterList(details, context.formalParameterList());
        }

        if (context.RPAREN()) {
            this.getContent(builder, context.RPAREN());
        }
    };

    /**
     * Process a method call with either the current class as instance or for the given instance.
     *
     * @param builder The target buffer to write to.
     * @param context The context to be processed.
     * @param instance Optional symbol information, if the method call belongs to this instance. This allows us to
     *                 transform certain method calls to their TS equivalent.
     */
    private processMethodCall = (builder: java.lang.StringBuilder, context: MethodCallContext | null,
        instance: ISymbolInfo | null): void => {
        if (!context) {
            return;
        }

        if (context.THIS()) {
            this.getContent(builder, context.LPAREN());
            if (context.expressionList()) {
                this.processExpressionList(builder, context.expressionList());
            }
            this.getContent(builder, context.RPAREN());
        } else if (context.SUPER()) {
            this.getContent(builder, context.LPAREN());
            if (context.expressionList()) {
                this.processExpressionList(builder, context.expressionList());
            }
            this.getContent(builder, context.RPAREN());
        } else {
            const methodName = context.identifier()?.getText() ?? "";
            const ws = this.getLeadingWhiteSpaces(context.identifier());

            this.ignoreContent(context.identifier());
            builder.append(ws);

            let transformed = false; // Was the call completely transformed?

            if (instance && instance.symbol instanceof TypedSymbol && instance.symbol.type) {
                // Replace some known method call identifiers with their TS equivalent.
                let transform: IMethodReplaceEntry | undefined;

                switch (instance.symbol.type.kind) {
                    case TypeKind.Array: {
                        transform = FileProcessor.arrayMethodMap.get(methodName);

                        break;
                    }

                    default:
                }

                if (transform) {
                    if (transform.options.removeDot) {
                        // On enter there's already the dot in the output, which we have to remove.
                        builder.deleteCharAt(builder.length() - 1);
                    }

                    if (!transform.replacement) {
                        // No replacement given. Use the original text.
                        builder.append(methodName);
                    } else {
                        builder.append(transform.replacement);
                    }

                    switch (transform.options.parentheses) {
                        case "remove": {
                            this.ignoreContent(context.RPAREN());
                            transformed = true;

                            break;
                        }

                        case "extract": {
                            builder.append(this.getLeadingWhiteSpaces(context.LPAREN()));
                            this.ignoreContent(context.LPAREN());
                            if (context.expressionList()) {
                                this.processExpressionList(builder, context.expressionList());
                            }
                            builder.append(this.getLeadingWhiteSpaces(context.RPAREN()));
                            this.ignoreContent(context.RPAREN());

                            transformed = true;

                            break;
                        }

                        case "indexed": {
                            builder.append(`${this.getLeadingWhiteSpaces(context.LPAREN())}[`);
                            this.ignoreContent(context.LPAREN());
                            if (context.expressionList()) {
                                this.processExpressionList(builder, context.expressionList());
                            }
                            builder.append(`${this.getLeadingWhiteSpaces(context.RPAREN())}]`);
                            this.ignoreContent(context.RPAREN());

                            transformed = true;

                            break;
                        }

                        default: // In a method call there are always parentheses. Hence no need to add or keep.
                    }
                } else {
                    builder.append(methodName);
                }
            } else if (instance) {
                builder.append(methodName);
            } else {
                // Check if there's a qualifier for this call. If not try to resolve the method to a known symbol.
                const expression = context.parent as ParserRuleContext as ExpressionContext;
                let info: string | ISymbolInfo | undefined;
                if (expression.expression().length === 0) {
                    info = this.resolveType(context, methodName);
                }

                if (!info) {
                    builder.append(methodName);
                } else if (typeof info === "string") {
                    builder.append(info);
                } else {
                    builder.append(info.qualifiedName);
                }
            }

            if (!transformed) {
                // If the call itself was not transformed, add the remaining parts here.
                this.processMethodCallExpression(builder, context);
            }
        }
    };

    private processMethodCallExpression = (builder: java.lang.StringBuilder, context: MethodCallContext): void => {
        this.getContent(builder, context.LPAREN());
        if (context.expressionList()) {
            this.processExpressionList(builder, context.expressionList());
        }
        this.getContent(builder, context.RPAREN());
    };

    private processExpressionList = (builder: java.lang.StringBuilder, context: ExpressionListContext | null): void => {
        if (!context) {
            return;
        }

        let i = 0;
        while (i < context.getChildCount()) {
            let child = context.getChild(i++);
            this.processExpression(builder, child as ExpressionContext);

            if (i === context.getChildCount()) {
                break;
            }

            child = context.getChild(i++);
            this.getContent(builder, child); // The comma.
        }
    };

    /**
     * Processes a creator rule for `new` expressions.
     *
     * @param builder The build for the output.
     * @param context The creator context to process.
     *
     * @returns true if the caller should use the `new` operator, otherwise false (e.g. for array initializers).
     */
    private processCreator = (builder: java.lang.StringBuilder, context: CreatorContext | null): boolean => {
        if (!context) {
            return false;
        }

        builder.append(this.getLeadingWhiteSpaces(context));

        // Check if this is an anonymous inner class. If so prepare the class expression we have to create.
        let innerClass = false;
        if (context.classCreatorRest() && context.classCreatorRest()?.classBody()) {
            innerClass = true;
            const info = this.resolveType(context, context.createdName().getText());
            if (typeof info === "string") {
                builder.append("class extends ");
            } else {
                if (info.symbol instanceof InterfaceSymbol) {
                    if (this.configuration.javaLib === "") {
                        builder.append("class implements ");
                    } else {
                        builder.append("class extends JavaObject implements ");
                        this.registerJavaImport("JavaObject");
                    }
                } else {
                    builder.append("class extends ");
                }
            }

            this.typeStack.push({
                type: ContextType.ClassExpression,
                deferredDeclarations: new java.lang.StringBuilder(),
                generatedMembers: [],
            });
        }

        if (context.nonWildcardTypeArguments()) {
            // Generic creator.
            this.processNonWildcardTypeArguments(builder, context.nonWildcardTypeArguments());
            this.processCreatedName(builder, context.createdName());
            this.processClassCreatorRest(builder, context.classCreatorRest());
        } else {
            // Non-generic creator.
            const rest = context.arrayCreatorRest();
            if (rest) {
                // Array size or initializer. Convert that to a generic TS array creator.
                if (rest.arrayInitializer()) {
                    // An initializer doesn't need a `new something[]` expression. Instead we can directly use
                    // the initializer, after converting braces to brackets.
                    this.processArrayInitializer(builder, rest.arrayInitializer());

                    return false;
                } else {
                    // Not data, but array sizes. If there's more than a single dimension, we have to leave out the
                    // sizes, however, as they are not supported.
                    const count = rest.expression().length;
                    if (count === 1) {
                        const temp = new java.lang.StringBuilder();
                        this.processCreatedName(temp, context.createdName());

                        // Special case for char arrays.
                        const type = context.createdName().primitiveType();
                        if (type) {
                            this.convertPrimitiveType(builder, type.start!.type, true);
                        } else {
                            builder.append("Array<");
                            builder.append(temp);
                            builder.append(">");
                        }

                        builder.append(this.getLeadingWhiteSpaces(rest.LBRACK(0)));

                        temp.clear();
                        this.processExpression(temp, rest.expression(0));
                        builder.append("(");
                        builder.append(temp);
                        builder.append(")");

                        builder.append(this.getLeadingWhiteSpaces(rest.RBRACK(0)));
                    } else {
                        builder.append("[".repeat(count));
                        builder.append("]".repeat(count));
                    }
                }
            } else {
                this.processCreatedName(builder, context.createdName());
                this.processClassCreatorRest(builder, context.classCreatorRest());
            }
        }

        if (innerClass) {
            this.typeStack.pop();
        }

        return true;
    };

    private processCreatedName = (builder: java.lang.StringBuilder, context: CreatedNameContext): void => {
        if (context.primitiveType()) {
            this.processPrimitiveType(builder, context.primitiveType());

            return;
        }

        let index = 0;
        while (index < context.getChildCount()) {
            let child = context.getChild(index++);
            if (index === 1) {
                const ws = this.getLeadingWhiteSpaces(child);
                const info = this.resolveType(context, child!.getText());
                if (typeof info === "string") {
                    builder.append(`${ws}${info}`);
                } else {
                    builder.append(`${ws}${info.qualifiedName}`);
                }
            } else {
                this.getContent(builder, child);
            }

            if (index === context.getChildCount()) {
                break;
            }

            child = context.getChild(index);
            if (child instanceof TypeArgumentsOrDiamondContext) {
                builder.append(this.getLeadingWhiteSpaces(child));
                if (child.getText() !== "<>") { // Using .text here, as that leaves out all white spaces.
                    this.processTypeArguments(builder, child.typeArguments());
                }

                ++index;
                if (index === context.getChildCount()) {
                    break;
                }
            }

            this.getContent(builder, child); // The dot.
            ++index;
        }

    };

    private processPrimary = (builder: java.lang.StringBuilder,
        context: PrimaryContext | null): ISymbolInfo | null => {
        if (!context) {
            return null;
        }

        let instance: ISymbolInfo | null = null;

        const firstChild = context.getChild(0);
        if (firstChild instanceof TerminalNode) {
            switch (firstChild.symbol.type) {
                case JavaLexer.LPAREN: {
                    this.getContent(builder, context.LPAREN());
                    this.processExpression(builder, context.expression());
                    this.getContent(builder, context.RPAREN());

                    break;
                }

                case JavaLexer.THIS:
                case JavaLexer.SUPER: {
                    this.getContent(builder, firstChild);
                    break;
                }

                default: {
                    const ws = this.getLeadingWhiteSpaces(context.identifier());
                    builder.append(ws);

                    let name = context.identifier()?.getText() ?? "";
                    instance = context.parent && (this.source.getQualifiedSymbol(context.parent, name) ?? null);

                    if (!instance) {
                        const info = this.resolveType(context, name);
                        name = typeof info === "string" ? info : info.qualifiedName;
                    } else {
                        const parts = instance.qualifiedName.split(".");
                        const info = this.resolveType(context, parts[0]);
                        parts[0] = typeof info === "string" ? info : info.qualifiedName;
                        builder.append(parts.join("."));
                    }
                    builder.append(name);
                }
            }
        } else {
            switch ((firstChild as ParserRuleContext).ruleIndex) {
                case JavaParser.RULE_typeTypeOrVoid: {
                    this.processTypeTypeOrVoid(builder, context.typeTypeOrVoid());
                    this.getContent(builder, context.CLASS());

                    break;
                }

                case JavaParser.RULE_literal: {
                    this.processLiteral(builder, context.literal());
                    break;
                }

                case JavaParser.RULE_identifier: {
                    builder.append(this.getLeadingWhiteSpaces(context.identifier()));
                    const identifier = context.identifier()?.getText();
                    const info = this.resolveType(context.parent, identifier ?? "");
                    if (typeof info === "string") {
                        builder.append(info);
                    } else {
                        instance = info;
                        builder.append(info.qualifiedName);
                    }

                    break;
                }

                default: {
                    this.processNonWildcardTypeArguments(builder, context.nonWildcardTypeArguments());
                    if (context.THIS()) {
                        this.getContent(builder, context.THIS());
                        this.processArguments(builder, context.arguments());
                    } else {
                        this.processExplicitGenericInvocationSuffix(builder, context.explicitGenericInvocationSuffix());
                    }
                    break;
                }
            }
        }

        return instance;
    };

    private processLiteral = (builder: java.lang.StringBuilder, context: LiteralContext | null): void => {
        if (!context) {
            return;
        }

        builder.append(this.getLeadingWhiteSpaces(context));

        if (context.integerLiteral()) {
            // Long integer literals can be converted to big int.
            const value = context.integerLiteral()?.getText() ?? "";
            if (value.endsWith("l") || value.endsWith("L")) {
                builder.append(`${value.substring(0, value.length - 1)}n`);
            } else {
                builder.append(value);
            }
        } else if (context.floatLiteral()) {
            // Double float literals have no expression in JS/TS, so we just remove the suffix.
            const value = context.floatLiteral()?.getText() ?? "";
            if (value.endsWith("f") || value.endsWith("F") || value.endsWith("d") || value.endsWith("D")) {
                builder.append(value.substring(0, value.length - 1));
            } else {
                builder.append(value);
            }
        } else if (context.STRING_LITERAL()) {
            const wrap = this.configuration.options?.wrapStringLiterals ?? false;
            if (wrap) {
                const value = context.STRING_LITERAL()?.getText() ?? "";
                builder.append(`S\`${value.substring(1, value.length - 1)}\``);
                this.registerJavaImport("S");
            } else {
                this.getContent(builder, context.STRING_LITERAL());
            }
        } else {
            this.getContent(builder, context);
        }
    };

    private processExplicitGenericInvocationSuffix = (builder: java.lang.StringBuilder,
        context: ExplicitGenericInvocationSuffixContext | null): void => {
        if (!context) {
            return;
        }

        if (context.SUPER()) {
            this.getContent(builder, context.SUPER());
            this.processSuperSuffix(builder, context.superSuffix());
        } else {
            this.getContent(builder, context.identifier());
            this.processArguments(builder, context.arguments());
        }
    };

    private processStatement = (builder: java.lang.StringBuilder, context: StatementContext | null): void => {
        if (!context) {
            return;
        }

        let id: number;
        const firstChild = context.getChild(0);
        if (firstChild instanceof TerminalNode) {
            id = firstChild.symbol.type;

            switch (id) {
                case JavaParser.RULE_block: {
                    this.processBlock({ builder, context: context.block() });

                    break;
                }

                case JavaLexer.ASSERT: {
                    this.getContent(builder, context, true);

                    break;
                }

                case JavaLexer.IF: {
                    this.getContent(builder, context.IF());
                    this.processParExpression(builder, context.parExpression());

                    this.expressionWithBraces(builder, context.statement(0)!);
                    if (context.ELSE()) {
                        this.getContent(builder, context.ELSE());

                        this.expressionWithBraces(builder, context.statement(1)!);
                    }

                    break;
                }

                case JavaLexer.FOR: {
                    this.getContent(builder, context.FOR());
                    this.getContent(builder, context.LPAREN());
                    this.processForControl(builder, context.forControl());
                    this.getContent(builder, context.RPAREN());
                    this.expressionWithBraces(builder, context.statement(0)!);

                    break;
                }

                case JavaLexer.WHILE: {
                    this.getContent(builder, context.WHILE());
                    this.processParExpression(builder, context.parExpression());
                    this.processStatement(builder, context.statement(0));
                    break;
                }

                case JavaLexer.DO: {
                    this.getContent(builder, context.DO());
                    this.processStatement(builder, context.statement(0));
                    this.processParExpression(builder, context.parExpression());

                    break;
                }

                case JavaLexer.TRY: {
                    // With try-with-resource statements it can be there's neither a catch nor a finally clause.
                    // If that's the case then we don't need the outer try block anymore.
                    const hasCatchOrFinally = context.catchClause().length !== 0
                        || context.finallyBlock() != null;

                    if (hasCatchOrFinally) {
                        this.getContent(builder, context.TRY());
                    } else {
                        builder.append(this.getLeadingWhiteSpaces(context.TRY()));
                        this.ignoreContent(context.TRY());
                    }

                    if (context.resourceSpecification()) {
                        this.registerJavaImport("closeResources");
                        this.registerJavaImport("handleResourceError");
                        this.registerJavaImport("throwResourceError");

                        builder.append(" {\n// This holds the final error to throw (if any).\nlet error: " +
                            "java.lang.Throwable | undefined;\n\n");
                        const names = this.processResourceSpecification(builder, context.resourceSpecification());
                        builder.append("\ntry {\n\ttry ");
                        this.processBlock({ builder, context: context.block() });
                        builder.append(`\n\tfinally {\n\terror = closeResources([${names.join(", ")}]);\n\t}\n`);
                        builder.append("} catch(e) {\n\terror = handleResourceError(e, error);\n");
                        builder.append("} finally {\n\tthrowResourceError(error);\n}\n}\n");
                    } else {
                        this.processBlock({ builder, context: context.block() });
                    }

                    this.processCatchClauses(builder, context.catchClause());
                    this.processFinallyBlock(builder, context.finallyBlock());

                    break;
                }

                case JavaLexer.SWITCH: {
                    this.getContent(builder, context.SWITCH());
                    this.processParExpression(builder, context.parExpression());

                    // See if there's a default branch.
                    let hasDefault = false;
                    context.switchBlockStatementGroup().forEach((group) => {
                        hasDefault ||= this.processSwitchBlockStatementGroup(builder, group);
                    });

                    context.switchLabel().forEach((label) => {
                        hasDefault ||= this.processSwitchLabel(builder, label);
                    });

                    if (!hasDefault) {
                        builder.append("\n\ndefault:\n");
                    }

                    this.getContent(builder, context.RBRACE());

                    break;
                }

                case JavaLexer.SYNCHRONIZED: {
                    builder.append(`${this.getLeadingWhiteSpaces(context.SYNCHRONIZED())}/* `);
                    this.getContent(builder, context.SYNCHRONIZED());
                    this.getContent(builder, context.parExpression());
                    this.getContent(builder, context.block()!.LBRACE());
                    builder.append(" */");
                    this.processBlock({ builder, context: context.block(), ignoreBraces: true });
                    this.getContent(builder, context.block()!.RBRACE(), true);

                    break;
                }

                case JavaLexer.RETURN: {
                    this.getContent(builder, context.RETURN());
                    if (context.expression().length > 0) {
                        this.processExpression(builder, context.expression(0));
                    }

                    this.getContent(builder, context.SEMI());

                    break;
                }

                case JavaLexer.THROW: {
                    this.getContent(builder, context.THROW());
                    this.processExpression(builder, context.expression(0));
                    this.getContent(builder, context.SEMI());

                    break;
                }

                case JavaParser.RULE_expression: {
                    this.processExpression(builder, context.expression(0));
                    this.getContent(builder, context.SEMI());

                    break;
                }

                case JavaLexer.BREAK:
                case JavaLexer.CONTINUE:
                case JavaLexer.SEMI: {
                    this.getContent(builder, context);
                    break;
                }

                case JavaLexer.IDENTIFIER: {
                    this.processStatement(builder, context.statement(0));

                    break;
                }

                default:
            }
        } else {
            id = (firstChild as ParserRuleContext).ruleIndex;

            switch (id) {
                case JavaParser.RULE_block: {
                    this.processBlock({ builder, context: firstChild as BlockContext });
                    break;
                }

                case JavaParser.RULE_expression: {
                    this.processExpression(builder, firstChild as ExpressionContext);
                    this.getContent(builder, context.SEMI());
                    break;
                }

                case JavaParser.RULE_switchExpression: {
                    // Java 17 feature, not supported here.
                    //this.processSwitchExpression(builder, firstChild as SwitchExpressionContext);
                    this.getContent(builder, context.SEMI());
                    break;
                }

                case JavaParser.RULE_identifier: {
                    this.getContent(builder, context.identifier());
                    this.getContent(builder, context.COLON());
                    this.processStatement(builder, context.statement(0));
                    break;
                }

                default:
            }
        }
    };

    private processResourceSpecification = (builder: java.lang.StringBuilder,
        context: ResourceSpecificationContext | null): string[] => {
        if (!context) {
            return [];
        }

        builder.append(this.getLeadingWhiteSpaces(context.LPAREN()));
        this.ignoreContent(context.LPAREN());

        const names = this.processResources(builder, context.resources().resource());

        this.ignoreContent(context.RPAREN());

        return names;
    };

    private processResources = (builder: java.lang.StringBuilder, resources: ResourceContext[]): string[] => {
        const names: string[] = [];

        resources.forEach((resource) => {
            let identifier: string;
            if (resource.identifier()) {
                // A single identifier. This specifies the name of a closable object.
                identifier = resource.identifier()?.getText() ?? "";
            } else {
                const modifiers = resource.variableModifier();
                if (modifiers.length > 0) {
                    this.ignoreContent(modifiers[modifiers.length - 1]);
                }

                if (resource.VAR()) {
                    builder.append(`${this.getLeadingWhiteSpaces(resource.VAR())}const`);
                    identifier = resource.identifier()?.getText() ?? "";
                } else {
                    builder.append(`${this.getLeadingWhiteSpaces(resource.classOrInterfaceType())}const`);

                    const localBuilder = new java.lang.StringBuilder();
                    this.processClassOrInterfaceType(localBuilder, resource.classOrInterfaceType());

                    identifier = resource.variableDeclaratorId()?.identifier().getText() ?? "";
                    this.getContent(builder, resource.variableDeclaratorId());
                    builder.append(`: ${localBuilder.toString()} `);
                }

                this.getContent(builder, resource.ASSIGN());
                this.processExpression(builder, resource.expression());
            }

            names.push(identifier);
        });

        return names;
    };

    private processSwitchBlockStatementGroup = (builder: java.lang.StringBuilder,
        context: SwitchBlockStatementGroupContext): boolean => {

        let hasDefault = false;
        context.switchLabel().forEach((label) => {
            hasDefault ||= this.processSwitchLabel(builder, label);
        });

        const needBraces = context.blockStatement().length > 1 || !context.blockStatement(0)?.statement()
            || !context.blockStatement(0)?.statement()?.block();
        const addBraces = needBraces && this.configuration.options?.autoAddBraces;

        if (addBraces) {
            builder.append("{");
        }

        context.blockStatement().forEach((block) => {
            this.processBlockStatement(builder, block);
        });

        if (addBraces) {
            builder.append("\n}\n");
        }

        return hasDefault;
    };

    private processSwitchLabel = (builder: java.lang.StringBuilder, context: SwitchLabelContext): boolean => {
        if (context.DEFAULT()) {
            this.getContent(builder, context);

            return true;
        } else if (context.expression()) {
            this.processExpression(builder, context.expression());
        } else {
            this.getContent(builder, context.IDENTIFIER());
        }

        this.getContent(builder, context.COLON());

        return false;
    };

    private processFinallyBlock = (builder: java.lang.StringBuilder, context: FinallyBlockContext | null,
        extra?: string): void => {
        if (!context) {
            return;
        }

        this.processBlock({ builder, context: context.block(), extra });
    };

    private processCatchClauses = (builder: java.lang.StringBuilder, contexts: CatchClauseContext[]): void => {
        if (contexts.length === 0) {
            return;
        }

        // Construct a unique name from all catch error names.
        const names = new Set<string>();
        contexts.forEach((context) => {
            names.add(context.identifier().getText());
        });

        const nameArray = Array.from(names);
        nameArray.forEach((name, index) => {
            if (index > 0) {
                nameArray[index] = name[0].toUpperCase() + name.substring(1);
            }
        });
        const catchName = nameArray.join("Or");

        builder.append(` catch (${catchName}) {\n`);

        contexts.forEach((context, index) => {
            this.ignoreContent(context.LPAREN());
            context.variableModifier().forEach((modifier) => {
                this.ignoreContent(modifier);
            });

            builder.append(this.getLeadingWhiteSpaces(context.catchType()));
            const typeChecks = context.catchType().qualifiedName().map((name) => {
                let qualifiedName = name.getText();
                const info = this.resolveType(context, qualifiedName);
                if (typeof info !== "string") {
                    qualifiedName = info.qualifiedName;
                }

                return `${catchName} instanceof ${qualifiedName}`;
            });

            this.ignoreContent(context.RPAREN());
            builder.append(`${index === 0 ? "" : "else "}if (${typeChecks.join(" || ")})`);

            const currentName = context.identifier().getText();
            const assignment = currentName !== catchName
                ? `const ${context.identifier().getText()} = ${catchName};\n`
                : "";
            this.processBlock({ builder, context: context.block(), extra: assignment });
            if (index === contexts.length - 1) {
                builder.append(` else {\n\tthrow ${catchName};\n\t}\n`);
            }
        });

        builder.append("}");
    };

    private processForControl = (builder: java.lang.StringBuilder, context: ForControlContext | null): void => {
        if (!context) {
            return;
        }

        if (context.enhancedForControl()) {
            this.processEnhancedForControl(builder, context.enhancedForControl());

            return;
        }

        this.processForInit(builder, context.forInit());
        this.getContent(builder, context.SEMI(0));
        this.processExpression(builder, context.expression());
        this.getContent(builder, context.SEMI(1));
        this.processExpressionList(builder, context.expressionList());
    };

    private processForInit = (builder: java.lang.StringBuilder, context: ForInitContext | null): void => {
        if (!context) {
            return;
        }

        if (context.localVariableDeclaration()) {
            this.processLocalVariableDeclaration(builder, context.localVariableDeclaration());
        } else {
            this.processExpressionList(builder, context.expressionList());
        }
    };

    private processEnhancedForControl = (builder: java.lang.StringBuilder,
        context: EnhancedForControlContext | null): void => {
        if (!context) {
            return;
        }

        context.variableModifier().forEach((modifier) => {
            this.processVariableModifier(builder, modifier);
        });

        const temp = new java.lang.StringBuilder();
        this.processTypeType(temp, context.typeType()); // Ignore the type.

        builder.append("let");
        this.processVariableDeclaratorId(builder, context.variableDeclaratorId());
        builder.append(this.getLeadingWhiteSpaces(context.COLON()) + "of");
        this.processExpression(builder, context.expression());
    };

    private processVariableDeclaratorId = (builder: java.lang.StringBuilder,
        context: VariableDeclaratorIdContext): void => {
        this.getContent(builder, context);
    };

    private processLocalTypeDeclaration = (builder: java.lang.StringBuilder,
        context: LocalTypeDeclarationContext | null): void => {
        this.getContent(builder, context, true);
    };

    private processTypeList = (builder: java.lang.StringBuilder, context: TypeListContext | null): void => {
        if (!context) {
            return;
        }

        const list: java.lang.StringBuilder[] = [];

        let index = 0;
        while (true) {
            const type = new java.lang.StringBuilder();
            this.processTypeType(type, context.getChild(index++) as TypeTypeContext);

            let ignoreNext = false;
            if (`${type.toString()}`.trim() !== "Serializable") {
                list.push(type);
            } else {
                // Remove the last added builder too (which must be comma text).
                ignoreNext = list.pop() === undefined;
            }

            if (index === context.getChildCount()) {
                break;
            }

            // Handle the comma.
            const comma = new java.lang.StringBuilder();
            this.getContent(comma, context.getChild(index++), false);
            if (!ignoreNext) {
                list.push(comma);
            }
        }

        list.forEach((entry) => {
            builder.append(entry);
        });
    };

    private processTypeTypeOrVoid = (builder: java.lang.StringBuilder,
        context: TypeTypeOrVoidContext | null): boolean => {
        if (!context) {
            return false;
        }

        if (context.VOID()) {
            this.getContent(builder, context.VOID());

            return true;
        }

        return this.processTypeType(builder, context.typeType());
    };

    private processTypeType = (builder: java.lang.StringBuilder, context: TypeTypeContext | null): boolean => {
        if (!context) {
            return false;
        }

        builder.append(this.getLeadingWhiteSpaces(context.getChild(0) as ParserRuleContext));

        // Only consider leading annotations and ignore those associated to square brackets (if any).
        let index = 0;
        while (context.getChild(index) instanceof AnnotationContext) {
            this.processAnnotation(builder, context.getChild(index) as AnnotationContext);
            ++index;
        }

        let isPrimitiveType = false;
        let ignoreBrackets = false;

        const child = context.getChild(index);
        if (child instanceof ClassOrInterfaceTypeContext) {
            this.processClassOrInterfaceType(builder, child);
        } else {
            isPrimitiveType = true;
            const type = (child as PrimitiveTypeContext).start!.type;
            ignoreBrackets = context.LBRACK().length > 0;
            this.convertPrimitiveType(builder, type, ignoreBrackets);
        }
        ++index;

        while (index < context.getChildCount()) {
            while (index < context.getChildCount() && context.getChild(index) instanceof AnnotationContext) {
                this.processAnnotation(builder, context.getChild(index) as AnnotationContext);
                ++index;
            }

            // Array notation.
            if (index < context.getChildCount() - 1) {
                if (ignoreBrackets) {
                    // Already handled above for the most inner bracket pair.
                    ignoreBrackets = false;
                    this.ignoreContent(context.getChild(index++));
                    this.ignoreContent(context.getChild(index++));
                } else {
                    this.getContent(builder, context.getChild(index++));
                    this.getContent(builder, context.getChild(index++));
                }
            }
        }

        return isPrimitiveType;
    };

    private processClassType = (builder: java.lang.StringBuilder, context: ClassTypeContext | null): void => {
        if (!context) {
            return;
        }

        if (context.classOrInterfaceType()) {
            this.processClassOrInterfaceType(builder, context.classOrInterfaceType());
        }

        context.annotation().forEach((annotation) => {
            this.processAnnotation(builder, annotation);
        });

        if (context.typeArguments()) {
            this.processTypeArguments(builder, context.typeArguments());
        } else {
            this.getContent(builder, context.identifier());
        }
    };

    private processClassOrInterfaceType = (builder: java.lang.StringBuilder,
        context: ClassOrInterfaceTypeContext | null): void => {
        if (!context) {
            return;
        }

        let index = 0;
        while (true) {
            const child = context.getChild(index++);

            builder.append(this.getLeadingWhiteSpaces(child));

            // Only resolve the first identifier part in the qualified identifier.
            if (index === 1) {
                const info = this.resolveType(context, child!.getText());
                if (typeof info === "string") {
                    builder.append(info);
                } else {
                    builder.append(info.qualifiedName);
                }
            } else {
                builder.append(child!.getText());
            }

            if (index === context.getChildCount()) {
                break;
            }

            if (context.getChild(index) instanceof TypeArgumentsContext) {
                this.processTypeArguments(builder, context.getChild(index++) as TypeArgumentsContext);
            }

            if (index === context.getChildCount()) {
                break;
            }

            if (context.getChild(index) instanceof TerminalNode) {
                builder.append(this.getLeadingWhiteSpaces(context.getChild(index++)) + ".");
            }

            if (index === context.getChildCount()) {
                break;
            }
        }
    };

    private processTypeArguments = (builder: java.lang.StringBuilder, context: TypeArgumentsContext | null): void => {
        if (!context) {
            return;
        }

        this.getContent(builder, context.LT());

        let index = 1;
        while (true) {
            const child = context.getChild(index++) as TypeArgumentContext;
            this.processTypeArgument(builder, child);
            if (index === context.getChildCount() - 1) {
                break;
            }

            this.getContent(builder, context.getChild(index++)); // Comma.
        }

        this.getContent(builder, context.GT());
    };

    private processTypeArgument = (builder: java.lang.StringBuilder, context: TypeArgumentContext): void => {
        const firstChild = context.getChild(0);
        if (firstChild instanceof TypeTypeContext) {
            this.processTypeType(builder, firstChild);
        } else {
            if (context.annotation().length > 0) {
                context.annotation().forEach((child) => {
                    this.getContent(builder, child, true);
                });

                builder.append(this.getLeadingWhiteSpaces(context.QUESTION()));
            } else {
                // The ? operator, like in List<?>.
                builder.append(this.getLeadingWhiteSpaces(firstChild));
            }

            if (context.EXTENDS() || context.SUPER()) {
                // If there's a question mark with a sub type, use only the subtype.
                this.ignoreContent(context.QUESTION());
                if (context.EXTENDS()) {
                    this.ignoreContent(context.EXTENDS());
                } else {
                    this.ignoreContent(context.SUPER());
                }
                this.processTypeType(builder, context.typeType());
            } else {
                // A standalone question mark. Make this an unknown.
                builder.append("unknown");
                this.ignoreContent(context.QUESTION());
            }
        }
    };

    private processPrimitiveType = (builder: java.lang.StringBuilder, context: PrimitiveTypeContext | null): void => {
        if (!context) {
            return;
        }

        builder.append(this.getLeadingWhiteSpaces(context));

        if (context.LONG()) {
            builder.append("bigint");
        } else {
            builder.append(context.getText());
        }
    };

    /**
     * Processing of the individual body members. They may require reordering (static parts) or need a rewrite
     * (overloaded methods).
     *
     * This is also the place where we add generated members.
     *
     * @param builder The target builder to write the final output to.
     * @param members A list of process member entries.
     * @param needOverloadHandling Set for interfaces to indicate that no overload handling is required.
     */
    private processBodyMembers = (builder: java.lang.StringBuilder, members: ITypeMemberDetails[],
        needOverloadHandling: boolean): void => {
        const pending: ITypeMemberDetails[] = [];

        // Sort members according to the member order options.
        if (this.memberOrdering) {
            members = this.memberOrdering.apply(members, this.typeStack.peek().type) as ITypeMemberDetails[];
        }

        const generatedMembers = this.typeStack.peek().generatedMembers ?? [];

        while (true) {
            const member = members.shift();
            if (!member) {
                break;
            }

            switch (member.type) {
                case MemberType.Constructor:
                case MemberType.Method: {
                    members = this.processConstructorAndMethodMembers(builder, member, members, generatedMembers,
                        needOverloadHandling);
                    break;
                }

                case MemberType.Abstract: {
                    const modifier = this.createModifierString(member.modifiers) + " ";
                    builder.append(member.leadingWhitespace);
                    builder.append(modifier);
                    builder.append(member.nameWhitespace ?? "");
                    builder.append(member.name ?? "unknown");
                    if (member.signatureContent) {
                        builder.append(member.signatureContent);
                    }
                    builder.append(member.bodyContent);

                    break;
                }

                case MemberType.Class: {
                    // Class definitions already have whitespaces and modifiers applied to their content.
                    builder.append(member.bodyContent);

                    break;
                }

                default: {
                    const modifier = this.createModifierString(member.modifiers) + " ";
                    builder.append(member.leadingWhitespace);
                    builder.append(modifier);
                    builder.append(member.bodyContent);

                    break;
                }
            }
        }

        pending.forEach((member) => {
            builder.append(member.leadingWhitespace);
            builder.append(member.name ?? "unknown");
            if (member.signatureContent) {
                builder.append(member.signatureContent);
            }
            builder.append(member.bodyContent);
        });

        // Finally add any other generated member.
        generatedMembers.forEach((member) => {
            if (member.type === MemberType.Initializer) {
                // If there's still instance initializer code in the list then it means we have no explicit constructor
                // declaration. So, add one here.
                builder.append(`\npublic constructor() {\n\tsuper();\n${member.bodyContent.toString()}\n}`);
            } else {
                builder.append(member.leadingWhitespace);
                builder.append(this.createModifierString(member.modifiers));
                builder.append(member.nameWhitespace ?? "");
                builder.append(member.name ?? "");
                if (member.signatureContent) {
                    builder.append(member.signatureContent);
                }
                builder.append(member.bodyContent);
            }
        });
    };

    private processConstructorAndMethodMembers(builder: java.lang.StringBuilder, member: ITypeMemberDetails,
        members: ITypeMemberDetails[], generatedMembers: ITypeMemberDetails[],
        needOverloadHandling: boolean) {
        const name = member.name;

        let overloads: ITypeMemberDetails[] = [];

        if (needOverloadHandling) {
            // Certain methods cannot be overloaded. Static and non-static cannot be mixed and
            // abstract methods are not changed, as they have no body.
            const isStatic = member.modifiers?.has("static") ?? false;
            overloads = members.filter((candidate) => {
                return candidate.name === name && !candidate.modifiers?.has("abstract")
                    && isStatic === candidate.modifiers?.has("static");
            });
        }

        if (overloads.length > 0) {
            overloads.unshift(member);

            let staticCount = 0;
            overloads.forEach((candidate) => {
                if (candidate.modifiers?.has("static")) {
                    ++staticCount;
                }
            });

            // All static overloads or no static overload.
            if (staticCount === 0 || staticCount === overloads.length) {
                // Remove the found overloads from the members list.
                members = members.filter((candidate) => {
                    return candidate.name !== name;
                });

                // Sort the overloads by increasing parameter count.
                overloads.sort((a, b) => {
                    return (a.signature ?? []).length - (b.signature ?? []).length;
                });

                // Write the overload signatures.
                overloads.forEach((overload) => {
                    builder.append(overload.leadingWhitespace);
                    builder.append(this.createModifierString(overload.modifiers) + " ");

                    // Remove the arrow style for overloading.
                    let signature = `${overload.signatureContent?.toString()}` ?? "";
                    if (signature.startsWith(" = ") && signature.endsWith(" =>")) {
                        signature = signature.substring(3, signature.length - 3);
                    }
                    builder.append(overload.nameWhitespace ?? "");
                    builder.append(overload.name ?? "");
                    builder.append(signature);
                    builder.append(";");
                });

                // Construct the implementation signature and get the set of possible return types.
                const returnTypes = new Set<string>();
                overloads.forEach((overload) => {
                    if (member.type === MemberType.Method && overload.returnType) {
                        returnTypes.add(overload.returnType);
                    }
                });

                let implSignatureParams = "";
                const maxParamCount = (overloads[overloads.length - 1].signature ?? []).length;
                if (maxParamCount > 0) {
                    implSignatureParams = "...args: unknown[]";
                }

                // Check the combined parameters list to see if we really need a type check for the individual
                // parameters. If a parameter exists in all overloads with the same name then there's no need to
                // check its type.
                const modifier = this.createModifierString(member.modifiers);
                if (member.type === MemberType.Constructor) {
                    builder.append(`\n    ${modifier} constructor(${implSignatureParams}) {\n`);
                } else {
                    const combinedReturnTypeString = Array.from(returnTypes).join(" | ");
                    builder.append(`\n${modifier}` +
                        `${member.nameWhitespace ?? ""}${member.name ?? "unknown"}${member.typeParameters ?? ""}(` +
                        `${implSignatureParams}): ${combinedReturnTypeString} {\n`);
                }

                builder.append("\t\tswitch (args.length) {\n");

                // Add the body code for each overload, depending on the overload parameters.
                overloads.forEach((overload) => {
                    builder.append(`\t\t\tcase ${overload.signature?.length ?? 0}: {\n`);
                    if ((overload.signature?.length ?? 0) > 0) {
                        builder.append("\t\t\t\tconst [");
                        let typeString = "";
                        overload.signature?.forEach((param, index) => {
                            if (index > 0) {
                                builder.append(", ");
                                typeString += ", ";
                            }
                            builder.append(param.name);
                            typeString += param.type;
                        });
                        builder.append(`] = args as [${typeString}];\n\n`);
                    }

                    let content = `${overload.bodyContent}`; // Convert to string.
                    content = content.trim();
                    builder.append(content.substring(1, content.length - 1)); // Remove the curly braces.
                    builder.append(`\n\n\t\t\t\tbreak;\n\t\t\t}\n\n`);
                });

                builder.append("\t\t\tdefault: {\n\t\t\t\t");
                builder.append("throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);\n");
                builder.append("\t\t\t}\n");
                builder.append("\t\t}\n");
                this.registerJavaImport("S");

                // Add collected instance initializer code now, if there's any.
                if (member.type === MemberType.Constructor) {
                    // There can only be one initializer entry.
                    const index = generatedMembers.findIndex((candidate) => {
                        return candidate.type === MemberType.Initializer;
                    });

                    if (index > -1) {
                        const member = generatedMembers[index];
                        generatedMembers.splice(index, 1);
                        builder.append(`${member.bodyContent}\n`);
                    }
                }

                builder.append("\t}\n");
            }
        } else {
            builder.append(member.leadingWhitespace);
            builder.append(this.createModifierString(member.modifiers) + " ");
            builder.append(member.nameWhitespace ?? "");
            builder.append(member.name ?? "");
            if (member.signatureContent) {
                builder.append(member.signatureContent);
            }
            builder.append(member.bodyContent);
        }

        return members;
    }

    /**
     * Depending on the configuration settings this method adds braces around a statement if there aren't any yet.
     *
     * @param builder The target buffer to add content to.
     * @param statement The statement to process.
     */
    private expressionWithBraces = (builder: java.lang.StringBuilder, statement: StatementContext): void => {
        const addBraces = !statement.block() && this.configuration.options?.autoAddBraces;

        if (addBraces) {
            builder.append(" {\n");
        }
        this.processStatement(builder, statement);
        if (addBraces) {
            builder.append("\n}\n");
        }
    };

    /**
     * Returns all white spaces (including comments) between the current white space anchor and the first character
     * covered by the target.
     * The white space anchor is then set to the position directly following the target.
     *
     * @param target A parse tree for which to return the leading white spaces.
     *
     * @returns The original white space text between tokens.
     */
    private getLeadingWhiteSpaces = (target: ParseTree | null): string => {
        if (!target) {
            return "";
        }

        let startIndex = 0;
        let stopIndex;
        if (target instanceof TerminalNode) {
            startIndex = target.symbol.start;
            stopIndex = target.symbol.stop;
        } else if (target instanceof ParserRuleContext) {
            startIndex = target.start!.start;
            stopIndex = target.stop?.stop;
        }

        const interval = Interval.of(this.whiteSpaceAnchor, startIndex - 1);
        this.whiteSpaceAnchor = (stopIndex ?? startIndex) + 1;

        return this.source.getText(interval);
    };

    /**
     * Used for constructs that cannot be (fully) represented in Typescript or can simply be taken over as they are.
     *
     * @param builder The target buffer to add content to.
     * @param target A parse tree for which to get the content.
     * @param commented If true the target content is placed in a multi line comment.
     */
    private getContent = (builder: java.lang.StringBuilder, target: ParseTree | null,
        commented = false): void => {
        if (!target) {
            return;
        }

        let startIndex = 0;
        let stopIndex;

        if (target instanceof TerminalNode) {
            startIndex = target.symbol.start;
            stopIndex = target.symbol.stop;
        } else if (target instanceof ParserRuleContext) {
            startIndex = target.start!.start;
            stopIndex = target.stop?.stop;
        }

        const interval = Interval.of(startIndex, stopIndex ?? startIndex);

        const ws = this.getLeadingWhiteSpaces(target);

        if (commented) {
            builder.append(`${ws}/* ${this.source.getText(interval)} */ `);
        } else {
            builder.append(ws);
            builder.append(this.source.getText(interval));
        }
    };

    /**
     * Ignore the content for the given target. It's usually replaced by something else or not handled at all.
     *
     * @param target A parse tree for which to get the content.
     */
    private ignoreContent = (target: ParseTree | null): void => {
        if (target) {
            this.getContent(new java.lang.StringBuilder(), target);
        }
    };

    /**
     * Returns a range of text always commented.
     *
     * @param builder The target buffer to add content to.
     * @param start The context whose start index begins the range.
     * @param stop  The context whose stop index ends the range.
     */
    private getRangeCommented = (builder: java.lang.StringBuilder, start?: ParserRuleContext | TerminalNode,
        stop?: ParserRuleContext | TerminalNode): void => {
        if (!start || !stop) {
            return;
        }

        const startIndex = start instanceof TerminalNode ? start.symbol.start : start.start!.start;
        const stopIndex = stop instanceof TerminalNode ? stop.symbol.stop : (stop.stop?.stop ?? startIndex);
        const interval = Interval.of(startIndex, stopIndex);

        const ws = this.getLeadingWhiteSpaces(start);
        this.whiteSpaceAnchor = stopIndex + 1;

        builder.append(`${ws}/* ${this.source.getText(interval)} */`);
    };

    /**
     * Called when a class, interface or enum body construction was finished. It takes all nested declarations for the
     * current type on the type stack and constructs a namespace declaration of it.
     * Also removes the TOS from the stack.
     *
     * @param doExport True if the new namespace must be exported.
     *
     * @returns The new namespace declaration.
     */
    private processNestedContent = (doExport: boolean): java.lang.StringBuilder => {
        const result = new java.lang.StringBuilder();
        const classInfo = this.typeStack.pop();
        if (classInfo && classInfo.deferredDeclarations.length() > 0) {
            result.append("\n\n");
            result.append("// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare\n");
            result.append((doExport ? "export " : "") + "namespace ");
            result.append(classInfo.name ?? "unknown");
            result.append(" {\n");
            result.append(classInfo.deferredDeclarations);
            result.append("}\n\n");
        }

        return result;
    };

    /**
     * This is the central method to resolve all types that can occur in the source code.
     * Resolving a symbol involves a number of steps:
     *
     * 1. Find a configured replacement via the class resolver, or
     * 2. Find the type in the current file and add certain prefixes, if necessary (e.g. `this.`), or
     * 3. Find the type in the exported type list of any of the imported packages.
     *
     * @param context A parse tree to start searching from for local symbols.
     * @param name The name of the type to check.
     *
     * @returns Either a replacement for the given name or the name itself.
     */
    private resolveType = (context: ParseTree | null, name: string): ISymbolInfo | string => {
        if (!context) {
            return name;
        }

        // 1. The application can force a remap of types to something else.
        const forClass = this.classResolver.get(name);
        if (forClass) {
            // If no import path is given then just change the name of the type (e.g. "String" -> "string").
            if (forClass.importPath.length === 0) {
                return forClass.alias ?? name;
            }

            // Don't change the type name here, but just register it for later handling in import processing.
            this.resolvedClasses.add(name);

            return name;
        }

        // 2. Is it a symbol from this file or a base class/interface?
        const info = this.source.getQualifiedSymbol(context, name);
        if (info) {
            // If the resolved symbol is a class from a different package continue resolving to handle
            // imports properly.
            if (!(info.symbol instanceof ClassSymbol) || info.qualifiedName !== info.symbol.name) {
                return info;
            }
        }

        // 3. Is it an imported type?
        return this.resolveFromImports(name);
    };

    /**
     * Loops over all imports and tries to find the symbol with the given name.
     *
     * @param name The name of the symbol to find.
     *
     * @returns Either the symbol info or the name itself.
     */
    private resolveFromImports(name: string): ISymbolInfo | string {
        for (const source of this.source.importList) {
            const info = source.resolveType(name);
            if (info) {
                if (this.configuration.options?.useUnqualifiedTypes) {
                    const fullName = info.qualifiedName;
                    // The name has already been added to the package imports, so just return the it.
                    if (this.packageImports.has(fullName)) {
                        return name;
                    }

                    // First mention of this type, so check if it is actually available for import.
                    // If so, add it to the package imports and return the name.
                    const candidate = this.availablePackageImports.get(fullName);
                    if (candidate) {
                        this.packageImports.set(fullName, candidate);

                        return name;
                    }
                }

                return info;
            }
        }

        return name;
    }

    /**
     * Iterates over all symbols in the java.lang package (ignoring sub namespaces like java.lang.annotation) and
     * adds them to the default package imports.
     */
    private registerDefaultImports(): void {
        const [file] = this.source.importList;
        const java = file.symbolTable.firstChild as ScopedSymbol;
        java.children.forEach((child) => {
            if (child.name === "lang") { // Looking for all symbols in java.lang.
                (child as NamespaceSymbol).children.forEach((symbol) => {
                    if (!(symbol instanceof NamespaceSymbol)) {
                        const fullName = symbol.qualifiedName(".", true).substring(5);
                        this.availablePackageImports.set(fullName, symbol);
                    }
                });

                return;
            }
        });

    }

    /**
     * Used to add a symbol for import via the java main import (e.g. helper code).
     *
     * @param name The name to add.
     */
    private registerJavaImport = (name: string): void => {
        // The Java source always exists and is always the first source.
        const [java] = [...this.source.importList];
        java.addImportedSymbol(name);
    };

    /**
     * Takes a set of modifiers and creates a modifier string with the correct order of the individual modifiers.
     *
     * @param modifiers The set of modifiers or undefined.
     *
     * @returns The constructed string (in the case of undefined modifiers the string is empty).
     */
    private createModifierString = (modifiers?: Set<string>): string => {
        if (!modifiers) {
            return "";
        }

        const sorted: string[] = [];
        if (modifiers.has("export")) {
            sorted.push("export");
        }

        if (modifiers.has("public")) {
            sorted.push("public");
        }

        if (modifiers.has("protected")) {
            sorted.push("protected");
        }

        if (modifiers.has("private")) {
            sorted.push("private");
        }

        if (modifiers.has("override")) {
            sorted.push("override");
        }

        if (modifiers.has("abstract")) {
            sorted.push("abstract");
        }

        if (modifiers.has("static")) {
            sorted.push("static");
        }

        if (modifiers.has("readonly")) {
            sorted.push("readonly");
        }

        return sorted.join(" ");
    };

    /**
     * Checks if the given method overrides a method from a base class.
     *
     * @param context The parse context of the method.
     * @param details The details of the method to check.
     *
     * @returns True if the method overrides a method from a base class, otherwise false.
     */
    private overridesMethod = (context: MemberDeclarationContext, details: ITypeMemberDetails): boolean => {
        if (!details.name) {
            return false;
        }

        const info = this.source.getQualifiedSymbol(context, details.name);
        if (!info) {
            return false;
        }

        let run = info.symbol;
        while (run) {
            if (run instanceof ClassSymbol) {
                if (run.extends.length === 0) {
                    return false;
                }

                const methodSymbol = run.extends[0].resolveSync(details.name);
                if (methodSymbol && methodSymbol instanceof MethodSymbol) {
                    return true;
                }
            }

            run = run.parent;
        }

        return false;
    };

    /**
     * Called when a primitive type is encountered (maybe in conjunction with an array).
     *
     * @param builder The builder to append the type to.
     * @param type The token type of the primitive type.
     * @param isArray True if the type is part of an array expression, otherwise false.
     */
    private convertPrimitiveType = (builder: java.lang.StringBuilder, type: number, isArray: boolean): void => {
        switch (type) {
            case JavaLexer.CHAR: {
                if (isArray) {
                    builder.append("Uint16Array");
                } else if (this.configuration.options?.convertNumberPrimitiveTypes) {
                    builder.append("number");
                } else {
                    this.registerJavaImport("type char");
                    builder.append("char");
                }

                break;
            }

            case JavaLexer.BYTE: {
                if (isArray) {
                    builder.append("Int8Array");
                } else if (this.configuration.options?.convertNumberPrimitiveTypes) {
                    builder.append("number");
                } else {
                    this.registerJavaImport("type byte");
                    builder.append("byte");
                }

                break;
            }

            case JavaLexer.SHORT: {
                if (isArray) {
                    builder.append("Int16Array");
                } else if (this.configuration.options?.convertNumberPrimitiveTypes) {
                    builder.append("number");
                } else {
                    this.registerJavaImport("type short");
                    builder.append("short");
                }

                break;
            }

            case JavaLexer.INT: {
                if (isArray) {
                    builder.append("Int32Array");
                } else if (this.configuration.options?.convertNumberPrimitiveTypes) {
                    builder.append("number");
                } else {
                    this.registerJavaImport("type int");
                    builder.append("int");
                }

                break;
            }

            case JavaLexer.LONG: {
                if (isArray) {
                    builder.append("BigInt64Array");
                } else if (this.configuration.options?.convertNumberPrimitiveTypes) {
                    builder.append("bigint");
                } else {
                    this.registerJavaImport("type long");
                    builder.append("long");
                }

                break;
            }

            case JavaLexer.FLOAT: {
                if (isArray) {
                    builder.append("Float64Array");
                } else if (this.configuration.options?.convertNumberPrimitiveTypes) {
                    builder.append("number");
                } else {
                    this.registerJavaImport("type float");
                    builder.append("float");
                }

                break;
            }

            case JavaLexer.DOUBLE: {
                if (isArray) {
                    builder.append("Float64Array");
                } else if (this.configuration.options?.convertNumberPrimitiveTypes) {
                    builder.append("number");
                } else {
                    this.registerJavaImport("type double");
                    builder.append("double");
                }

                break;
            }

            case JavaLexer.BOOLEAN: {
                if (isArray) {
                    builder.append("boolean[]");
                } else {
                    builder.append("boolean");
                }

                break;
            }

            default: {
                throw new Error(`Unknown primitive type: ${type}`);
            }
        }
    };
}
