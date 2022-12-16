/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import fs from "fs";
import path from "path";

import { ParserRuleContext } from "antlr4ts";
import { Interval } from "antlr4ts/misc/";
import { ParseTree, TerminalNode } from "antlr4ts/tree";
import { ClassSymbol, InterfaceSymbol, TypedSymbol } from "antlr4-c3";

import { java } from "../lib/java/java";

import { JavaLexer } from "../../java/generated/JavaLexer";
import {
    AnnotationContext, AnnotationTypeDeclarationContext, ArgumentsContext, ArrayInitializerContext, BlockContext,
    BlockStatementContext, CatchClauseContext, ClassBodyContext, ClassBodyDeclarationContext,
    ClassCreatorRestContext, ClassDeclarationContext, ClassOrInterfaceModifierContext, ClassOrInterfaceTypeContext,
    ClassTypeContext, CompilationUnitContext, ConstantDeclaratorContext, ConstDeclarationContext,
    ConstructorDeclarationContext, CreatedNameContext, CreatorContext, EnhancedForControlContext, EnumConstantContext,
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
} from "../../java/generated/JavaParser";

import { PackageSource } from "../PackageSource";
import { ConverterOptionsPrefixFunc, IClassResolver, IConverterConfiguration } from "./JavaToTypeScript";
import { EnumSymbol, JavaInterfaceSymbol } from "../parsing/JavaParseTreeWalker";
import { PackageSourceManager } from "../PackageSourceManager";
import { EnhancedTypeKind, ISymbolInfo } from "./types";

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

    /** Generated type members. */
    generatedMembers: IClassMemberDetails[];

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

enum MemberType {
    Initializer,
    Field,
    Constructor,
    Method,
    Lambda,
    Static,
    Abstract,
    Annotation,
    Class,
    Interface,
    Enum,
    Empty,
}

/** Holds certain details of each member of a class. Required for method overloading and instance initialization. */
interface IClassMemberDetails {
    type: MemberType;

    /** All whitespaces + comments before the modifier. */
    leadingWhitespace: string;

    /** Visibility/read only modifier. */
    modifier: string;

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

    private whiteSpaceAnchor = 0;

    // Imports from within the library path (helpers, direct imports of Java classes etc.).
    private libraryImports = new Map<string, string[]>();

    // Names of 3rd party modules/packages to import.
    private moduleImports = new Set<string>();

    // Keeps names of classes for which inner processing is going on. Sometimes it is necessary to know the name
    // for special processing (e.g. auto creating static initializer functions or type aliases).
    private typeStack: java.util.Stack<ITypeInfo> = new java.util.Stack();

    private classResolver: Map<string, IClassResolver>;

    // Nested symbols from this file.
    private localSymbols = new Map<string, string>();

    // The class that were resolved by the class resolver and must be listed in the imports.
    private resolvedClasses = new Set<string>();

    /**
     * Constructs a new file process and parses the given file. No conversion is done yet.
     *
     * @param source The source class holding the parser + symbol information.
     * @param configuration The values to configure the conversion process.
     */
    public constructor(
        private source: PackageSource,
        private configuration: IConverterConfiguration) {
        this.classResolver = configuration.options.classResolver ?? new Map();
    }

    /**
     * Converts the Java file whose path is given by `source` to Typescript and writes the generated content
     * to the file given by `target`;
     */
    public convertFile = async (): Promise<void> => {
        if (this.source.targetFile && fs.existsSync(this.source.targetFile)) {
            // If the target file already exists, check if it is marked to keep it (not overwrite).
            const stream = fs.createReadStream(this.source.targetFile, { encoding: "utf-8", start: 0, end: 20 });
            const firstByte = await stream[Symbol.asyncIterator]().next();
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
            const symbols = this.source.symbolTable?.getAllNestedSymbolsSync() ?? [];
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
                const libPath = path.relative(path.dirname(this.source.targetFile),
                    this.configuration.options.lib ?? "./");
                const builder = new java.lang.StringBuilder();
                this.processCompilationUnit(builder, this.source.targetFile, libPath, this.source.parseTree);

                try {
                    let converted: string = String.fromCharCode(...builder.array());
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

    private processCompilationUnit = (builder: java.lang.StringBuilder, target: string, libPath: string,
        context: CompilationUnitContext): void => {
        this.typeStack.push({
            name: "file",
            deferredDeclarations: new java.lang.StringBuilder(),
            generatedMembers: [],
        });

        const firstChild = context.getChild(0);
        const header = new java.lang.StringBuilder();
        const prefix = this.configuration.options.prefix as ConverterOptionsPrefixFunc;
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
            });

            this.processTypeDeclaration(builder, context.typeDeclaration());
            if (this.typeStack.tos) {
                builder.append(this.typeStack.tos.deferredDeclarations);
            }

            this.moduleImports.forEach((name) => {
                header.append(`import * as ${name} from "${name}";\n`);
            });
            header.append("\n");

            this.source.importList.forEach((source) => {
                const info = source.getImportInfo(target);
                if (info[0].length > 0) {
                    header.append(`import { ${info[0].join(",")} } from "${info[1]}";\n`);
                }
            });

            // Class mappings. These can contain multiple entries that are loaded from the same module, so we have
            // to group by import path and create an import list from the types we collected per import.
            const consolidatedImports = new Map<string, string[]>();
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
                header.append(`import { ${entry.join(", ")} } from "${key}";\n`);
            });

            header.append("\n");
        }

        this.getContent(builder, context.EOF());

        header.append("\n");
        this.libraryImports.forEach((entry, key) => {
            const importPath = path.join(libPath, key);
            header.append(`import { ${entry.join(", ")} } from "${importPath}";\n`);
        });

        builder.insert(0, header);
    };

    private processTypeDeclaration = (builder: java.lang.StringBuilder, list: TypeDeclarationContext[]): void => {
        list.forEach((context) => {
            let prefix = this.getLeadingWhiteSpaces(context);
            let hasVisibility = false;

            let doExport = false;
            const modifierBuilder = new java.lang.StringBuilder();
            let ignoreNextWhitespaces = false;
            context.classOrInterfaceModifier().forEach((context) => {
                if (ignoreNextWhitespaces) {
                    ignoreNextWhitespaces = false;
                    this.getLeadingWhiteSpaces(context);
                }

                switch (this.processClassOrInterfaceModifier(modifierBuilder, context, RelatedElement.File)) {
                    case ModifierType.Public: {
                        prefix += "export ";
                        hasVisibility = true;
                        doExport = true;
                        break;
                    }

                    case ModifierType.Protected:
                    case ModifierType.Private: {
                        hasVisibility = true;
                        break;
                    }

                    case ModifierType.Ignored: {
                        ignoreNextWhitespaces = true;
                        break;
                    }

                    default:
                }
            });

            if (!hasVisibility) {
                // No modifier means: export.
                prefix += "export ";
                doExport = true;
            }

            if (context.classDeclaration()) {
                this.processClassDeclaration(builder, context.classDeclaration(), prefix,
                    `${modifierBuilder.toString()}`);
            } else if (context.enumDeclaration()) {
                this.processEnumDeclaration(builder, context.enumDeclaration(), prefix);
            } else if (context.interfaceDeclaration()) {
                this.processInterfaceDeclaration(builder, context.interfaceDeclaration(), prefix, doExport);
            } else { // annotationTypeDeclaration
                this.getContent(builder, context, true);
            }
        });
    };

    private processClassOrInterfaceModifier = (builder: java.lang.StringBuilder,
        context: ClassOrInterfaceModifierContext | undefined, parentType: RelatedElement): ModifierType => {

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

                case JavaParser.STATIC:
                case JavaParser.ABSTRACT: {
                    this.getContent(builder, element);

                    break;
                }

                case JavaParser.FINAL: {
                    builder.append("readonly ");
                    break;
                }

                default: {
                    this.ignoreContent(element);

                    break;
                }
            }
        } else if (this.configuration.options.convertAnnotations && context.annotation()) {
            this.processAnnotation(builder, context.annotation());
        } else {
            this.ignoreContent(context.annotation());
            result = ModifierType.Ignored;
        }

        return result;
    };

    private processAnnotation = (builder: java.lang.StringBuilder, context?: AnnotationContext): void => {
        this.getContent(builder, context, true);
    };

    private processClassDeclaration = (builder: java.lang.StringBuilder, context: ClassDeclarationContext | undefined,
        prefix: string, modifier: string): void => {
        if (!context) {
            return;
        }

        this.typeStack.push({
            name: context.identifier().text,
            deferredDeclarations: new java.lang.StringBuilder(),
            generatedMembers: [],
        });

        const localBuilder = new java.lang.StringBuilder();

        this.getContent(localBuilder, context.CLASS());
        this.getContent(localBuilder, context.identifier());

        if (context.typeParameters()) {
            this.processTypeParameters(localBuilder, context.typeParameters());
        }

        // JS/TS can extend only a single class, but implement multiple classes. Due to the fact that we have to convert
        // Java interfaces to (abstract) classes in TS, we have a problem with inheritance then, if we would generally
        // convert the `implements` clause to `extends`.
        // Fortunately, TS allows that a class implements a class (not only interfaces), which is what we use here.
        // Sometimes this causes extra work after conversion, so we check the special case that a class only implements
        // one interface and extends no other class, in which case we can convert the `implements` clause to `extends`.
        if (context.EXTENDS() && context.typeType()) {
            this.getContent(localBuilder, context.EXTENDS());
            this.processTypeType(localBuilder, context.typeType());
        } else {
            localBuilder.append(" extends JavaObject");
            this.libraryImports.set("java/lang/Object", ["JavaObject"]);
        }

        if (context.IMPLEMENTS()) {
            let convertToExtends = !context.EXTENDS() && context.typeList(0).typeType().length === 1;
            if (convertToExtends) {
                // Additionally check if the implemented interface is a native TS interface.
                // No need to convert to EXTENDS in such a case.
                const type = context.typeList(0).typeType(0);
                if (type.classOrInterfaceType()) {
                    const name = type.classOrInterfaceType()!.identifier(0).text;
                    const info = this.source.getQualifiedSymbol(context, name);
                    const interfaceSymbol = info ? info.symbol as JavaInterfaceSymbol : undefined;

                    if (interfaceSymbol?.isTypescriptCompatible) {
                        convertToExtends = false;
                    }
                }
            }

            if (convertToExtends) {
                localBuilder.append(this.getLeadingWhiteSpaces(context.IMPLEMENTS()));
                localBuilder.append("extends ");
                this.processTypeList(localBuilder, context.typeList(0));
            } else {
                this.getContent(localBuilder, context.IMPLEMENTS());
                this.processTypeList(localBuilder, context.typeList(0));
            }
        }

        const mustBeAbstract = this.processClassBody(localBuilder, context.classBody())
            || modifier.includes("abstract");

        // Conclude nested content within this class declaration.
        const nested = this.processNestedContent(modifier.includes("export"));
        const className = context.identifier().text;

        // Check if this declaration itself is nested.
        if (this.typeStack.length > 1) {
            // This is a nested class declaration. Convert it either to a class expression or a class factory function.
            if (modifier.includes("static")) {
                builder.append(`${prefix}${modifier} ${className} = ${localBuilder.toString()};\n`);
            } else {
                builder.append(`${prefix}${modifier} ${className} = (($outer) => ` +
                    `{\nreturn ${localBuilder.toString()}`);
                builder.append(`\n})(this);\n`);
            }

            const owner = this.typeStack.tos;

            // Add a type declaration for the nested class, so it can be used as a type.
            const typeOfText = modifier.includes("static") ? "typeof " : "";

            let typeParameters = "";
            if (context.typeParameters()) {
                typeParameters = context.typeParameters()!.text;
            }

            // Add a comment to suppress Typescript's error for non-public nested types, if necessary.
            let suppression = "";
            if (!modifier.includes("public")) {
                suppression = "\t// @ts-expect-error, because of protected inner class.\n";
            }

            this.typeStack.tos?.deferredDeclarations.append(`${suppression}\texport type ${className}` +
                `${typeParameters} = InstanceType<${typeOfText}${owner!.name!}.${className}${typeParameters}>;\n`);
        } else {
            // A top level class declaration.
            builder.append(`${prefix}${mustBeAbstract ? "abstract " : ""}`);
            builder.append(localBuilder);
        }

        this.typeStack.tos?.deferredDeclarations.append(nested);
    };

    private processClassBody = (builder: java.lang.StringBuilder, context?: ClassBodyContext): boolean => {
        if (!context) {
            return false;
        }

        this.getContent(builder, context.LBRACE());
        const containsAbstract = this.processClassBodyDeclarations(builder, context.classBodyDeclaration());
        this.getContent(builder, context.RBRACE());

        return containsAbstract;
    };

    private processClassBodyDeclarations = (builder: java.lang.StringBuilder,
        list: ClassBodyDeclarationContext[]): boolean => {
        const members: IClassMemberDetails[] = [];
        let containsAbstract = false;

        const initializer = new java.lang.StringBuilder();

        list.forEach((context) => {
            if (context.SEMI()) {
                // Empty statement.
                const leadingWhitespace = this.getLeadingWhiteSpaces(context);
                const bodyContent = new java.lang.StringBuilder();
                this.getContent(bodyContent, context, false);
                members.push({ type: MemberType.Empty, leadingWhitespace, modifier: "", name: "", bodyContent });
            } else if (context.block()) {
                // Static or instance initializer.
                if (context.STATIC()) {
                    const bodyContent = new java.lang.StringBuilder();
                    const leadingWhitespace = this.getLeadingWhiteSpaces(context);
                    this.getContent(bodyContent, context.STATIC());
                    this.processBlock(bodyContent, context.block());
                    members.push({
                        type: MemberType.Static,
                        leadingWhitespace,
                        modifier: "public",
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
                let hasVisibility = false;
                const modifierBuilder = new java.lang.StringBuilder();
                const ws = this.getLeadingWhiteSpaces(context);
                let ignoreNextWhitespaces = false;
                context.modifier().forEach((context) => {
                    if (ignoreNextWhitespaces) {
                        ignoreNextWhitespaces = false;
                        this.getLeadingWhiteSpaces(context);
                    }

                    switch (this.processModifier(modifierBuilder, context)) {
                        case ModifierType.Public:
                        case ModifierType.Protected:
                        case ModifierType.Private: {
                            hasVisibility = true;

                            break;
                        }

                        case ModifierType.Ignored: {
                            ignoreNextWhitespaces = true;
                            break;
                        }

                        case ModifierType.Abstract: {
                            containsAbstract = true;
                            break;
                        }

                        default:
                    }
                });

                if (!hasVisibility) {
                    // No modifier means: public.
                    modifierBuilder.insert(0, "public ");
                }

                if (context.memberDeclaration()) {
                    const details = this.processMemberDeclaration(context.memberDeclaration(), ws,
                        `${modifierBuilder.toString()}`);

                    if (details && details.bodyContent.length() > 0) {
                        // The content is empty if the member was converted to a (nested) namespace
                        // for nested interfaces, classes and enums.
                        members.push(details);
                    }
                }
            }
        });

        if (initializer.length() > 0) {
            // If there's instance initializer code, generate a special member entry for it.
            this.typeStack.tos?.generatedMembers.push({
                type: MemberType.Initializer,
                leadingWhitespace: "",
                modifier: "",
                bodyContent: initializer,
            });
        }

        this.processBodyMembers(builder, members);

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

    private processMemberDeclaration = (context: MemberDeclarationContext | undefined, prefix: string,
        modifier: string): IClassMemberDetails | undefined => {
        if (!context) {
            return;
        }

        const result: IClassMemberDetails = {
            type: MemberType.Empty,
            leadingWhitespace: prefix,
            modifier,
            bodyContent: new java.lang.StringBuilder(),
        };

        const firstChild = context.getChild(0) as ParserRuleContext;
        switch (firstChild.ruleIndex) {
            case JavaParser.RULE_methodDeclaration: {
                this.processMethodDeclaration(result, context.methodDeclaration());

                break;
            }

            case JavaParser.RULE_genericMethodDeclaration: {
                this.processGenericMethodDeclaration(result, context.genericMethodDeclaration());

                break;
            }

            case JavaParser.RULE_fieldDeclaration: {
                // The modifier for fields must be replicated if multiple fields for one type are defined.
                // That's why we have to remove it from the member details field. Same for leading whitespaces.
                result.modifier = "";
                this.processFieldDeclaration(result, context.fieldDeclaration(), modifier);

                break;
            }

            case JavaParser.RULE_constructorDeclaration: {
                this.processConstructorDeclaration(result, context.constructorDeclaration());

                break;
            }

            case JavaParser.RULE_genericConstructorDeclaration: {
                this.processGenericConstructorDeclaration(result, context.genericConstructorDeclaration());

                break;
            }

            case JavaParser.RULE_interfaceDeclaration: {
                result.type = MemberType.Interface;
                this.processInterfaceDeclaration(result.bodyContent, context.interfaceDeclaration(), prefix,
                    modifier.includes("public"));

                break;
            }

            case JavaParser.RULE_annotationTypeDeclaration: {
                result.type = MemberType.Annotation;
                this.processAnnotationTypeDeclaration(result.bodyContent, context.annotationTypeDeclaration());

                break;
            }

            case JavaParser.RULE_classDeclaration: {
                result.type = MemberType.Class;
                this.processClassDeclaration(result.bodyContent, context.classDeclaration(), prefix, modifier);

                break;
            }

            case JavaParser.RULE_enumDeclaration: {
                result.type = MemberType.Enum;
                this.processEnumDeclaration(result.bodyContent, context.enumDeclaration(), prefix);

                break;
            }

            default:
        }

        return result;
    };

    private processMethodDeclaration = (details: IClassMemberDetails, context?: MethodDeclarationContext,
        genericParams?: java.lang.StringBuilder): void => {
        if (!context) {
            return;
        }

        const returnType = new java.lang.StringBuilder();

        details.type = MemberType.Method;
        if (!this.processTypeTypeOrVoid(returnType, context.typeTypeOrVoid())) {
            // Not a primitive type so make it explicitly nullable.
            returnType.append(" | null");
        }

        details.nameWhitespace = this.getLeadingWhiteSpaces(context.identifier());
        details.name = context.identifier().text;
        this.ignoreContent(context.identifier());

        details.signatureContent = new java.lang.StringBuilder();
        details.signature = [];
        details.returnType = `${returnType.toString()}`;

        if (this.configuration.options.preferArrowFunctions) {
            details.signatureContent.append(details.modifier.includes("abstract") ? ": " : " = ");
        }

        if (genericParams) {
            details.signatureContent.append(genericParams);
        }

        this.processFormalParameters(details, context.formalParameters());

        // TODO: move brackets to the type string.
        if (context.LBRACK().length > 0) {
            details.leadingWhitespace = this.getLeadingWhiteSpaces(context.LBRACK(0));

            const rightBrackets = context.RBRACK();
            this.whiteSpaceAnchor = rightBrackets[rightBrackets.length - 1].symbol.stopIndex + 1;
        }

        if (this.configuration.options.preferArrowFunctions) {
            if (details.modifier.includes("abstract")) {
                details.signatureContent.append(` => ${returnType.toString()}`);
            } else {
                details.signatureContent.append(`: ${returnType.toString()} =>`);
            }
        } else {
            details.signatureContent.append(`: ${returnType.toString()}`);
        }

        if (context.THROWS()) {
            this.ignoreContent(context.qualifiedNameList());
        }

        this.processMethodBody(details.bodyContent, context.methodBody());
    };

    private processFormalParameters = (details: IClassMemberDetails, context: FormalParametersContext): void => {
        if (details.signatureContent) {
            this.getContent(details.signatureContent, context.LPAREN());
            this.processFormalParameterList(details, context.formalParameterList());
            this.getContent(details.signatureContent, context.RPAREN());
        }
    };

    private processFormalParameterList = (details: IClassMemberDetails, context?: FormalParameterListContext): void => {
        if (!context) {
            return;
        }

        let index = 0;
        let child = context.getChild(index);
        while (true) {
            if (!(child instanceof FormalParameterContext)) {
                break;
            }

            details.signature?.push(this.processFormalParameter(details.signatureContent!, child));
            if (++index === context.childCount) {
                break;
            }

            child = context.getChild(index);
            if (!(child instanceof TerminalNode)) {
                break;
            }

            this.getContent(details.signatureContent!, child);

            if (++index === context.childCount) {
                break;
            }

            child = context.getChild(index);
        }

        if (child instanceof LastFormalParameterContext) {
            details.signature!.push(this.processFormalParameter(details.signatureContent!, child));
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
            nullText = "| null";
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
            name: identifier.text,
            type: `${type}${brackets}`,
            nullable,
            rest: brackets.length > 0,
        };
    };

    private processMethodBody = (builder: java.lang.StringBuilder, context: MethodBodyContext): void => {
        if (context.block()) {
            this.processBlock(builder, context.block());
        } else {
            this.getContent(builder, context.SEMI());
        }
    };

    private processGenericMethodDeclaration = (details: IClassMemberDetails,
        context?: GenericMethodDeclarationContext): void => {

        if (!context) {
            return;
        }

        const params = new java.lang.StringBuilder();
        this.processTypeParameters(params, context.typeParameters());
        details.typeParameters = `${params.toString()}`;

        return this.processMethodDeclaration(details, context.methodDeclaration(), params);
    };

    private processFieldDeclaration = (details: IClassMemberDetails, context: FieldDeclarationContext | undefined,
        modifier: string): void => {

        if (!context) {
            return;
        }

        details.type = MemberType.Field;

        const type = new java.lang.StringBuilder();
        const isPrimitiveType = this.processTypeType(type, context.typeType());

        this.processVariableDeclarators(details.bodyContent, context.variableDeclarators(), type, modifier,
            !isPrimitiveType);
        this.getContent(details.bodyContent, context.SEMI());
    };

    private processConstructorDeclaration = (details: IClassMemberDetails,
        context?: ConstructorDeclarationContext): void => {

        if (!context) {
            return;
        }

        details.name = "constructor";
        details.type = MemberType.Constructor;
        details.signatureContent = new java.lang.StringBuilder();
        details.signature = [];

        details.nameWhitespace = this.getLeadingWhiteSpaces(context.identifier());
        this.ignoreContent(context.identifier());
        this.processFormalParameters(details, context.formalParameters());

        if (context.THROWS()) {
            this.ignoreContent(context.qualifiedNameList());
        }

        let hasSuperCall = false;
        let hasThisCall = false;
        for (const blockStatement of context.block().blockStatement()) {
            const statement = blockStatement.statement();
            if (statement && statement.expression().length > 0) {
                const expression = statement.expression(0);
                if (expression.methodCall()?.SUPER()) {
                    hasSuperCall = true;

                    break;
                } else if (expression.methodCall()?.THIS()) {
                    hasThisCall = true;

                    break;
                }
            }
        }

        details.containsThisCall = hasThisCall;

        // See if we should automatically add a call to super. Only if none exists yet and this class extends another.
        const info = this.source.resolveType(context.identifier().text);
        let needSuperCall = false;
        if (info && info.symbol instanceof ClassSymbol) {
            if (info.symbol.extends.length > 0) {
                needSuperCall = !hasSuperCall && !hasThisCall;
            }
        }

        this.processBlock(details.bodyContent, context.block(), needSuperCall ? "super();\n" : undefined);
    };

    private processGenericConstructorDeclaration = (details: IClassMemberDetails,
        context?: GenericConstructorDeclarationContext): void => {

        if (!context) {
            return;
        }

        // Constructors cannot have type parameters.
        this.getContent(details.bodyContent, context.typeParameters(), true);
        this.processConstructorDeclaration(details, context.constructorDeclaration());
    };

    private processTypeParameters = (builder: java.lang.StringBuilder, context?: TypeParametersContext): void => {
        if (!context) {
            return;
        }

        this.getContent(builder, context.LT());

        let index = 1;
        while (true) {
            const child = context.getChild(index++) as TypeParameterContext;
            this.processTypeParameter(builder, child);

            if (index === context.childCount - 1) {
                break;
            }

            this.getContent(builder, context.getChild(index++) as TerminalNode);
        }

        this.getContent(builder, context.GT());
    };

    private processTypeParameter = (builder: java.lang.StringBuilder, context: TypeParameterContext): void => {
        let i = 0;
        while (i < context.childCount) {
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
            while (i < context.childCount) {
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

    private processTypeBound = (builder: java.lang.StringBuilder, context?: TypeBoundContext): void => {
        if (!context) {
            return;
        }

        let index = 0;
        while (true) {
            const child = context.getChild(index++);
            this.processTypeType(builder, child as TypeTypeContext);

            if (index === context.childCount) {
                break;
            }

            this.getContent(builder, context.getChild(index++) as TerminalNode);
        }
    };

    private processInterfaceDeclaration = (builder: java.lang.StringBuilder,
        context: InterfaceDeclarationContext | undefined, prefix: string, doExport: boolean): void => {
        if (!context) {
            return;
        }

        this.typeStack.push({
            name: context.identifier().text,
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

        const info = this.source.getQualifiedSymbol(context, context.identifier().text);
        const interfaceSymbol = info ? info.symbol as JavaInterfaceSymbol : undefined;
        const isTypescriptCompatible = interfaceSymbol?.isTypescriptCompatible ?? false;

        this.processInterfaceBody(localBuilder, isTypescriptCompatible, context.interfaceBody());
        if (isTypescriptCompatible) {
            localBuilder.insert(0, `${ws}interface${identifierBuilder.toString()}`);
        } else {
            localBuilder.insert(0, `${ws}abstract class${identifierBuilder.toString()}`);
        }

        if (this.typeStack.length > 1) {
            const nested = this.processNestedContent(doExport);
            this.typeStack.tos?.deferredDeclarations.append(`${prefix}${nested.toString()}${localBuilder.toString()}`);
        } else {
            builder.append(`${prefix}${localBuilder.toString()}`);
        }
    };

    private processInterfaceBody = (builder: java.lang.StringBuilder, isTypescriptCompatible: boolean,
        context: InterfaceBodyContext): void => {
        this.getContent(builder, context.LBRACE());
        this.processInterfaceBodyDeclarations(builder, isTypescriptCompatible, context.interfaceBodyDeclaration());
        this.getContent(builder, context.RBRACE());
    };

    private processInterfaceBodyDeclarations = (builder: java.lang.StringBuilder, isTypescriptCompatible: boolean,
        list: InterfaceBodyDeclarationContext[]): boolean => {
        const members: IClassMemberDetails[] = [];

        list.forEach((context) => {
            if (!context.SEMI()) {
                const modifierBuilder = new java.lang.StringBuilder();
                const ws = this.getLeadingWhiteSpaces(context);

                // Ignore modifiers, if we can use a TS interface.
                if (!isTypescriptCompatible) {
                    let hasVisibility = false;
                    let ignoreNextWhitespaces = false;
                    context.modifier().forEach((modifierContext) => {
                        if (ignoreNextWhitespaces) {
                            ignoreNextWhitespaces = false;
                            this.getLeadingWhiteSpaces(modifierContext);
                        }

                        switch (this.processModifier(modifierBuilder, modifierContext)) {
                            case ModifierType.Public:
                            case ModifierType.Protected:
                            case ModifierType.Private: {
                                hasVisibility = true;
                                break;
                            }

                            case ModifierType.Ignored: {
                                ignoreNextWhitespaces = true;
                                break;
                            }

                            default:
                        }
                    });

                    if (!hasVisibility) {
                        // No modifier means: public.
                        modifierBuilder.insert(0, "public ");
                    }

                    if (ignoreNextWhitespaces) {
                        this.getLeadingWhiteSpaces(context.interfaceMemberDeclaration());
                    }
                }

                const details = this.processInterfaceMemberDeclaration(context.interfaceMemberDeclaration(), ws,
                    `${modifierBuilder.toString()}`);

                if (details) {
                    if (isTypescriptCompatible) {
                        // Reset type and modifier for methods marked as being abstract.
                        details.type = MemberType.Method;
                        details.modifier = "";
                    }

                    if (details.bodyContent.length() > 0) {
                        // The declaration is empty if it was converted to a (nested) namespace.
                        members.push(details);
                    }
                }
            }
        });

        this.processBodyMembers(builder, members);

        return isTypescriptCompatible;
    };

    private processInterfaceMemberDeclaration = (context: InterfaceMemberDeclarationContext | undefined, prefix: string,
        modifier: string): IClassMemberDetails | undefined => {
        if (!context) {
            return;
        }

        const result: IClassMemberDetails = {
            type: MemberType.Empty,
            leadingWhitespace: prefix,
            modifier,
            bodyContent: new java.lang.StringBuilder(),
        };

        const firstChild = context.getChild(0) as ParserRuleContext;
        switch (firstChild.ruleIndex) {
            case JavaParser.RULE_constDeclaration: {
                this.processConstDeclaration(result, firstChild as ConstDeclarationContext);

                break;
            }

            case JavaParser.RULE_interfaceMethodDeclaration: {
                this.processInterfaceMethodDeclaration(result, firstChild as InterfaceMethodDeclarationContext);

                break;
            }

            case JavaParser.RULE_genericInterfaceMethodDeclaration: {
                this.processGenericInterfaceMethodDeclaration(result,
                    firstChild as GenericInterfaceMethodDeclarationContext);

                break;
            }

            case JavaParser.RULE_interfaceDeclaration: {
                this.processInterfaceDeclaration(result.bodyContent, firstChild as InterfaceDeclarationContext,
                    prefix, modifier.includes("public"));

                break;
            }

            case JavaParser.RULE_annotationTypeDeclaration: {
                this.processAnnotationTypeDeclaration(result.bodyContent,
                    firstChild as AnnotationTypeDeclarationContext);

                break;
            }

            case JavaParser.RULE_classDeclaration: {
                this.processClassDeclaration(result.bodyContent, firstChild as ClassDeclarationContext, prefix,
                    modifier);

                break;
            }

            case JavaParser.RULE_enumDeclaration: {
                this.processEnumDeclaration(result.bodyContent, firstChild as EnumDeclarationContext, prefix);

                break;
            }

            default:
        }

        return result;
    };

    private processConstDeclaration = (details: IClassMemberDetails, context: ConstDeclarationContext): void => {
        details.type = MemberType.Field;

        const type = new java.lang.StringBuilder();
        this.processTypeType(type, context.typeType());

        let index = 1;
        while (true) {
            let child = context.getChild(index++);
            this.processConstantDeclarator(details.bodyContent, child as ConstantDeclaratorContext,
                `${type.toString()}`);

            child = context.getChild(index++);
            this.getContent(details.bodyContent, child as TerminalNode); // Comma or semicolon.
            if (child.text === ";") {
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

    private processInterfaceMethodDeclaration = (details: IClassMemberDetails,
        context: InterfaceMethodDeclarationContext): void => {

        // Ignore all method modifiers. Interface members in TS have no modifiers.
        context.interfaceMethodModifier().forEach((modifier) => {
            this.ignoreContent(modifier);
        });

        this.processInterfaceCommonBodyDeclaration(details, context.interfaceCommonBodyDeclaration());
    };

    private processGenericInterfaceMethodDeclaration = (details: IClassMemberDetails,
        context: GenericInterfaceMethodDeclarationContext): void => {

        // Ignore all method modifiers. Interface members in TS have no modifiers.
        context.interfaceMethodModifier().forEach((modifier) => {
            this.ignoreContent(modifier);
        });

        const typeParameters = new java.lang.StringBuilder();
        this.processTypeParameters(typeParameters, context.typeParameters());
        details.typeParameters = `${typeParameters.toString()}`;

        this.processInterfaceCommonBodyDeclaration(details, context.interfaceCommonBodyDeclaration());
    };

    private processInterfaceCommonBodyDeclaration = (details: IClassMemberDetails,
        context: InterfaceCommonBodyDeclarationContext): void => {
        details.signatureContent = new java.lang.StringBuilder();
        details.signature = [];

        context.annotation().forEach((annotation) => {
            this.ignoreContent(annotation);
        });

        const returnType = new java.lang.StringBuilder();
        this.processTypeTypeOrVoid(returnType, context.typeTypeOrVoid());
        details.returnType = `${returnType.toString()}`;

        const isAbstract = context.methodBody().SEMI() !== undefined;
        if (isAbstract) {
            details.type = MemberType.Abstract;
            details.modifier += " abstract";
        } else {
            details.type = MemberType.Method;
        }

        details.name = context.identifier().text;
        details.nameWhitespace = this.getLeadingWhiteSpaces(context.identifier());
        this.ignoreContent(context.identifier());
        if (this.configuration.options.preferArrowFunctions) {
            details.signatureContent.append(isAbstract ? ": " : " = ");
        }
        this.processFormalParameters(details, context.formalParameters());

        // For old style square brackets (after the method parameters) collect them and add them to the type.
        context.RBRACK().forEach((bracket) => {
            this.getContent(returnType, bracket);
        });

        if (context.THROWS()) {
            this.ignoreContent(context.qualifiedNameList());
        }

        details.signatureContent.append(this.configuration.options.preferArrowFunctions ? " => " : ": ");
        details.signatureContent.append(returnType);

        this.processMethodBody(details.bodyContent, context.methodBody());
    };

    private processAnnotationTypeDeclaration = (builder: java.lang.StringBuilder,
        context?: AnnotationTypeDeclarationContext): void => {
        this.getContent(builder, context, true); // Not supported in TS.
    };

    private processEnumDeclaration = (builder: java.lang.StringBuilder, context: EnumDeclarationContext | undefined,
        prefix: string): void => {
        if (!context) {
            return;
        }

        // Enum declarations always must be moved to an outer namespace.
        const localBuilder = new java.lang.StringBuilder(prefix);
        this.getContent(localBuilder, context.identifier());
        this.getRangeCommented(localBuilder, context.IMPLEMENTS(), context.typeList());
        this.getContent(localBuilder, context.LBRACE());
        this.processEnumConstants(localBuilder, context.enumConstants());
        this.getContent(localBuilder, context.COMMA());
        this.getContent(localBuilder, context.enumBodyDeclarations(), true);

        this.getContent(localBuilder, context.RBRACE());
        this.typeStack.tos?.deferredDeclarations.append(localBuilder);
    };

    private processEnumConstants = (builder: java.lang.StringBuilder, context?: EnumConstantsContext): void => {
        if (!context) {
            return;
        }

        context.enumConstant().forEach((constant, index) => {
            if (index > 0) {
                this.getContent(builder, context.COMMA(index - 1));
            }

            this.processEnumConstant(builder, constant);
        });

    };

    private processEnumConstant = (builder: java.lang.StringBuilder, context: EnumConstantContext): void => {
        if (context.classBody()) {
            // An enum method -> unsupported.
            this.getContent(builder, context, true);
        } else {
            const list = context.annotation();
            if (list.length > 0) {
                this.getRangeCommented(builder, list[0], list[list.length - 1]);
            }

            this.getContent(builder, context.identifier());

            const args = context.arguments();
            if (args) {
                // The Java way of defining explicit values. Can use only one of them per entry, though.
                const count = args.expressionList()?.expression().length ?? 0;
                if (count === 1) {
                    builder.append(" = ");
                    this.processExpression(builder, args.expressionList()?.expression(0));
                } else {
                    this.getContent(builder, context.arguments(), true);
                }
            }
        }
    };

    private processBlock = (builder: java.lang.StringBuilder, context?: BlockContext, extra?: string): void => {
        if (!context) {
            return;
        }

        this.getContent(builder, context.LBRACE());

        if (extra) {
            // Add this string to the block before processing the rest.
            if (context.blockStatement().length > 0) {
                builder.append(this.getLeadingWhiteSpaces(context.blockStatement(0)));
            } else {
                builder.append(this.getLeadingWhiteSpaces(context.RBRACE()));
            }
            builder.append(extra);
        }

        context.blockStatement().forEach((child) => {
            this.processBlockStatement(builder, child);
        });

        this.getContent(builder, context.RBRACE());
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
        context?: LocalVariableDeclarationContext): void => {
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
        this.processVariableDeclarators(builder, context.variableDeclarators(), type, "", false);
    };

    private processVariableModifier = (builder: java.lang.StringBuilder, context: VariableModifierContext): void => {
        if (context.FINAL()) {
            // The `final` would make this a `const`, but we always add a `let` later in the process -
            // a linter can convert to const then.
            builder.append(this.getLeadingWhiteSpaces(context.FINAL()));
            this.ignoreContent(context.FINAL());
        } else {
            this.getContent(builder, context, true);
        }
    };

    private processVariableDeclarators = (builder: java.lang.StringBuilder, context: VariableDeclaratorsContext,
        type: java.lang.StringBuilder, modifier: string, makeOptional: boolean): void => {
        let index = 0;

        while (true) {
            const child = context.getChild(index++);

            builder.append(modifier);
            this.processVariableDeclarator(builder, child as VariableDeclaratorContext, type, makeOptional);
            if (index === context.childCount) {
                break;
            }

            // Separate each declarator and add the type again.
            const comma = context.getChild(index++) as TerminalNode;
            builder.append(`;${this.getLeadingWhiteSpaces(comma)}\n`);
            this.ignoreContent(comma);
        }
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

        if (type.length() > 0) {
            builder.append(`${ws}${name}: `);
            builder.append(`${type}${makeOptional ? " | null" : ""}`);
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

        if (context.ASSIGN()) {
            this.getContent(builder, context.ASSIGN());
            this.processVariableInitializer(builder, context.variableInitializer());
        }
    };

    private processVariableInitializer = (builder: java.lang.StringBuilder,
        context?: VariableInitializerContext): void => {
        if (!context) {
            return;
        }

        if (context.arrayInitializer()) {
            this.processArrayInitializer(builder, context.arrayInitializer());
        } else {
            this.processExpression(builder, context.expression());
        }
    };

    private processArrayInitializer = (builder: java.lang.StringBuilder, context?: ArrayInitializerContext): void => {
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
        context?: ParExpressionContext): ISymbolInfo | undefined => {
        if (!context) {
            return;
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
        context?: ExpressionContext): ISymbolInfo | undefined => {
        if (!context) {
            return undefined;
        }

        let instance: ISymbolInfo | undefined;

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
                                    const node = context.getChild(2) as TerminalNode;
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
                                builder.append(this.getLeadingWhiteSpaces(context.getChild(1) as TerminalNode));
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
                    this.processMethodCall(builder, context.methodCall());

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
        context?: ExplicitGenericInvocationContext): void => {
        this.getContent(builder, context);
    };

    private processSuperSuffix = (builder: java.lang.StringBuilder, context?: SuperSuffixContext): void => {
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
        context?: NonWildcardTypeArgumentsContext): void => {
        if (!context) {
            return;
        }

        this.processTypeList(builder, context.typeList());
        this.getContent(builder, context.GT());
    };

    private processInnerCreator = (builder: java.lang.StringBuilder, context?: InnerCreatorContext): void => {
        if (!context) {
            return;
        }

        this.processNonWildcardTypeArgumentsOrDiamond(builder, context.nonWildcardTypeArgumentsOrDiamond());
        this.processClassCreatorRest(builder, context.classCreatorRest());
    };

    private processClassCreatorRest = (builder: java.lang.StringBuilder, context?: ClassCreatorRestContext): void => {
        if (!context) {
            return;
        }

        if (context.classBody()) {
            // This is an anonymous inner class, which gets converted to a class expression.
            const localBuilder = new java.lang.StringBuilder();
            this.processArguments(localBuilder, context.arguments());
            this.processClassBody(builder, context.classBody());
            builder.append(localBuilder);
        } else {
            this.processArguments(builder, context.arguments());
        }
    };

    private processArguments = (builder: java.lang.StringBuilder, context?: ArgumentsContext): void => {
        if (!context) {
            return;
        }

        this.getContent(builder, context.LPAREN());
        this.processExpressionList(builder, context.expressionList());
        this.getContent(builder, context.RPAREN());
    };

    private processNonWildcardTypeArgumentsOrDiamond = (builder: java.lang.StringBuilder,
        context?: NonWildcardTypeArgumentsOrDiamondContext): void => {
        if (!context) {
            return;
        }

        if (context.nonWildcardTypeArguments()) {
            this.processNonWildcardTypeArguments(builder, context.nonWildcardTypeArguments());
        } else {
            this.getContent(builder, context);
        }
    };

    private processLambdaExpression = (builder: java.lang.StringBuilder, context?: LambdaExpressionContext): void => {
        if (!context) {
            return;
        }

        this.processLambdaParameters(builder, context.lambdaParameters());
        builder.append(this.getLeadingWhiteSpaces(context.ARROW()));
        builder.append("=>");

        if (context.lambdaBody().expression()) {
            this.processExpression(builder, context.lambdaBody().expression());
        } else {
            this.processBlock(builder, context.lambdaBody().block());
        }
    };

    private processLambdaParameters = (builder: java.lang.StringBuilder, context: LambdaParametersContext): void => {
        if (context.identifier().length > 0) {
            context.identifier().forEach((identifier) => {
                this.getContent(builder, identifier);
            });
        } else if (context.formalParameterList()) {
            const details: IClassMemberDetails = {
                type: MemberType.Lambda,
                leadingWhitespace: "",
                modifier: "",
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
    private processMethodCall = (builder: java.lang.StringBuilder, context?: MethodCallContext,
        instance?: ISymbolInfo): void => {
        if (!context) {
            return;
        }

        if (context.THIS()) {
            // Convert the explicit constructor invocation to a call to a closure, created for handling this situation.
            builder.append(this.getLeadingWhiteSpaces(context.THIS()));
            builder.append("$this");
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
            const methodName = context.identifier()?.text ?? "";
            const ws = this.getLeadingWhiteSpaces(context.identifier());

            this.ignoreContent(context.identifier());
            builder.append(ws);

            let transformed = false; // Was the call completely transformed?

            if (instance && instance.symbol instanceof TypedSymbol && instance.symbol.type) {
                // Replace some known method call identifiers with their TS equivalent.
                let transform: IMethodReplaceEntry | undefined;

                switch (instance.symbol.type.kind as unknown as EnhancedTypeKind) {
                    case EnhancedTypeKind.Array: {
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
                const expression = context.parent as ExpressionContext;
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

    private processExpressionList = (builder: java.lang.StringBuilder, context?: ExpressionListContext): void => {
        if (!context) {
            return;
        }

        let i = 0;
        while (i < context.childCount) {
            let child = context.getChild(i++);
            this.processExpression(builder, child as ExpressionContext);

            if (i === context.childCount) {
                break;
            }

            child = context.getChild(i++);
            this.getContent(builder, child as TerminalNode); // The comma.
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
    private processCreator = (builder: java.lang.StringBuilder, context?: CreatorContext): boolean => {
        if (!context) {
            return false;
        }

        builder.append(this.getLeadingWhiteSpaces(context));

        // Check if this is an anonymous inner class. If so prepare the class expression we have to create.
        let innerClass = false;
        if (context.classCreatorRest() && context.classCreatorRest()?.classBody()) {
            innerClass = true;
            builder.append("class extends ");

            this.typeStack.push({
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
                        builder.append(" Array<");
                        builder.append(temp);
                        builder.append(">");

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
        while (index < context.childCount) {
            let child = context.getChild(index++);
            if (index === 1) {
                const ws = this.getLeadingWhiteSpaces(child as TerminalNode);
                const info = this.resolveType(context, child.text);
                if (typeof info === "string") {
                    builder.append(`${ws}${info}`);
                } else {
                    builder.append(`${ws}${info.qualifiedName}`);
                }
            } else {
                this.getContent(builder, child as TerminalNode);
            }

            if (index === context.childCount) {
                break;
            }

            child = context.getChild(index);
            if (child instanceof TypeArgumentsOrDiamondContext) {
                builder.append(this.getLeadingWhiteSpaces(child));
                if (child.text !== "<>") { // Using .text here, as that leaves out all white spaces.
                    this.processTypeArguments(builder, child.typeArguments());
                }

                ++index;
                if (index === context.childCount) {
                    break;
                }
            }

            this.getContent(builder, child as TerminalNode); // The dot.
        }

    };

    private processPrimary = (builder: java.lang.StringBuilder, context?: PrimaryContext): ISymbolInfo | undefined => {
        if (!context) {
            return;
        }

        let instance: ISymbolInfo | undefined;

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

                    let name = context.identifier()?.text ?? "";
                    instance = context.parent && this.source.getQualifiedSymbol(context.parent, name);

                    if (instance === undefined) {
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
                    const identifier = context.identifier()?.text;
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

    private processLiteral = (builder: java.lang.StringBuilder, context?: LiteralContext): void => {
        if (!context) {
            return;
        }

        builder.append(this.getLeadingWhiteSpaces(context));

        if (context.integerLiteral()) {
            // Long integer literals can be converted to big int.
            const value = context.integerLiteral()?.text ?? "";
            if (value.endsWith("l") || value.endsWith("L")) {
                builder.append(`${value.substring(0, value.length - 1)}n`);
            } else {
                builder.append(value);
            }
        } else if (context.floatLiteral()) {
            // Double float literals have no expression in JS/TS, so we just remove the suffix.
            const value = context.floatLiteral()?.text ?? "";
            if (value.endsWith("f") || value.endsWith("F") || value.endsWith("d") || value.endsWith("D")) {
                builder.append(value.substring(0, value.length - 1));
            } else {
                builder.append(value);
            }
        } else {
            this.getContent(builder, context);
        }
    };

    private processExplicitGenericInvocationSuffix = (builder: java.lang.StringBuilder,
        context?: ExplicitGenericInvocationSuffixContext): void => {
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

    private processStatement = (builder: java.lang.StringBuilder, context?: StatementContext): void => {
        if (!context) {
            return;
        }

        let id: number;
        const firstChild = context.getChild(0);
        if (firstChild instanceof TerminalNode) {
            id = firstChild.symbol.type;

            switch (id) {
                case JavaParser.RULE_block: {
                    this.processBlock(builder, context.block());

                    break;
                }

                case JavaLexer.ASSERT: {
                    this.getContent(builder, context, true);

                    break;
                }

                case JavaLexer.IF: {
                    this.getContent(builder, context.IF());
                    this.processParExpression(builder, context.parExpression());

                    let statement = context.statement(0);
                    const addBraces = !statement.block() && this.configuration.options.autoAddBraces;

                    if (addBraces) {
                        builder.append(" {\n");
                    }
                    this.processStatement(builder, statement);
                    if (addBraces) {
                        builder.append("\n}\n");
                    }

                    if (context.ELSE()) {
                        this.getContent(builder, context.ELSE());

                        statement = context.statement(1);
                        const addBraces = !statement.block() && this.configuration.options.autoAddBraces;

                        if (addBraces) {
                            builder.append(" {");
                        }
                        this.processStatement(builder, statement);
                        if (addBraces) {
                            builder.append("\n}\n");
                        }
                    }

                    break;
                }

                case JavaLexer.FOR: {
                    this.getContent(builder, context.FOR());
                    this.getContent(builder, context.LPAREN());
                    this.processForControl(builder, context.forControl());
                    this.getContent(builder, context.RPAREN());
                    this.processStatement(builder, context.statement(0));

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
                        || context.finallyBlock() !== undefined;

                    if (hasCatchOrFinally) {
                        this.getContent(builder, context.TRY());
                    } else {
                        builder.append(this.getLeadingWhiteSpaces(context.TRY()));
                        this.ignoreContent(context.TRY());
                    }

                    if (context.resourceSpecification()) {
                        this.libraryImports.set("helpers", ["closeResources", "handleResourceError",
                            "throwResourceError"]);

                        builder.append(" {\n// This holds the final error to throw (if any).\nlet error: " +
                            "java.lang.Throwable | undefined;\n\n");
                        const names = this.processResourceSpecification(builder, context.resourceSpecification());
                        builder.append("\ntry {\n\ttry ");
                        this.processBlock(builder, context.block());
                        builder.append(`\n\tfinally {\n\terror = closeResources([${names.join(", ")}]);\n\t}\n`);
                        builder.append("} catch(e) {\n\terror = handleResourceError(e, error);\n");
                        builder.append("} finally {\n\tthrowResourceError(error);\n}\n}\n");
                    } else {
                        this.processBlock(builder, context.block());
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
                    builder.append(" */");
                    this.processBlock(builder, context.block());

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
                    this.processBlock(builder, firstChild as BlockContext);
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
        context?: ResourceSpecificationContext): string[] => {
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
                identifier = resource.identifier()?.text ?? "";
            } else {
                const modifiers = resource.variableModifier();
                if (modifiers.length > 0) {
                    this.ignoreContent(modifiers[modifiers.length - 1]);
                }

                if (resource.VAR()) {
                    builder.append(`${this.getLeadingWhiteSpaces(resource.VAR())}const`);
                    identifier = resource.identifier()?.text ?? "";
                } else {
                    builder.append(`${this.getLeadingWhiteSpaces(resource.classOrInterfaceType())}const`);

                    const localBuilder = new java.lang.StringBuilder();
                    this.processClassOrInterfaceType(localBuilder, resource.classOrInterfaceType());

                    identifier = resource.variableDeclaratorId()?.identifier().text ?? "";
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

        const needBraces = context.blockStatement().length > 1 || !context.blockStatement(0).statement()
            || !context.blockStatement(0).statement()?.block();
        const addBraces = needBraces && this.configuration.options.autoAddBraces;

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

    private processFinallyBlock = (builder: java.lang.StringBuilder, context?: FinallyBlockContext,
        extra?: string): void => {
        if (!context) {
            return;
        }

        this.processBlock(builder, context.block(), extra);
    };

    private processCatchClauses = (builder: java.lang.StringBuilder, contexts: CatchClauseContext[]): void => {
        if (contexts.length === 0) {
            return;
        }

        // Construct a unique name from all catch error names.
        const names = new Set<string>();
        contexts.forEach((context) => {
            names.add(context.identifier().text);
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
                let qualifiedName = name.text;
                const info = this.resolveType(context, qualifiedName);
                if (typeof info !== "string") {
                    qualifiedName = info.qualifiedName;
                }

                return `${catchName} instanceof ${qualifiedName}`;
            });

            this.ignoreContent(context.RPAREN());
            builder.append(`${index === 0 ? "" : "else "}if (${typeChecks.join(" || ")})`);

            const currentName = context.identifier().text;
            const assignment = currentName !== catchName ? `const ${context.identifier().text} = ${catchName};\n` : "";
            this.processBlock(builder, context.block(), assignment);
            builder.append(` else {\n\tthrow ${catchName};\n\t}\n`);
        });

        builder.append("}");
    };

    private processForControl = (builder: java.lang.StringBuilder, context?: ForControlContext): void => {
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

    private processForInit = (builder: java.lang.StringBuilder, context?: ForInitContext): void => {
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
        context?: EnhancedForControlContext): void => {
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
        context?: LocalTypeDeclarationContext): void => {
        this.getContent(builder, context, true);
    };

    private processTypeList = (builder: java.lang.StringBuilder, context?: TypeListContext): void => {
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

            if (index === context.childCount) {
                break;
            }

            // Handle the comma.
            const comma = new java.lang.StringBuilder();
            this.getContent(comma, context.getChild(index++) as TerminalNode, false);
            if (!ignoreNext) {
                list.push(comma);
            }
        }

        list.forEach((entry) => {
            builder.append(entry);
        });
    };

    private processTypeTypeOrVoid = (builder: java.lang.StringBuilder, context?: TypeTypeOrVoidContext): boolean => {
        if (!context) {
            return false;
        }

        if (context.VOID()) {
            this.getContent(builder, context.VOID());

            return true;
        }

        return this.processTypeType(builder, context.typeType());
    };

    private processTypeType = (builder: java.lang.StringBuilder, context?: TypeTypeContext): boolean => {
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
            const type = (child as PrimitiveTypeContext).start.type;
            ignoreBrackets = context.LBRACK().length > 0;

            switch (type) {
                case JavaLexer.CHAR: {
                    if (ignoreBrackets) {
                        builder.append("Uint16Array");
                    } else {
                        this.resolveType(context, "CodePoint");
                        builder.append("CodePoint");
                    }
                    break;
                }

                case JavaLexer.BYTE: {
                    if (ignoreBrackets) {
                        builder.append("Int8Array");
                    } else {
                        builder.append("number");
                    }
                    break;
                }

                case JavaLexer.SHORT: {
                    if (ignoreBrackets) {
                        builder.append("Int16Array");
                    } else {
                        builder.append("number");
                    }
                    break;
                }

                case JavaLexer.INT: {
                    if (ignoreBrackets) {
                        builder.append("Int32Array");
                    } else {
                        builder.append("number");
                    }
                    break;
                }

                case JavaLexer.LONG: {
                    if (ignoreBrackets) {
                        builder.append("Int64Array");
                    } else {
                        builder.append("bigint");
                    }
                    break;
                }

                case JavaLexer.FLOAT: {
                    if (ignoreBrackets) {
                        builder.append("Float64Array");
                    } else {
                        builder.append("number");
                    }
                    break;
                }

                case JavaLexer.DOUBLE: {
                    if (ignoreBrackets) {
                        builder.append("Float64Array");
                    } else {
                        builder.append("number");
                    }
                    break;
                }

                default: {
                    if (ignoreBrackets) {
                        builder.append("boolean[]");
                    } else {
                        builder.append("boolean");
                    }
                }
            }
        }
        ++index;

        while (index < context.childCount) {
            while (index < context.childCount && context.getChild(index) instanceof AnnotationContext) {
                this.processAnnotation(builder, context.getChild(index) as AnnotationContext);
                ++index;
            }

            // Array notation.
            if (index < context.childCount - 1) {
                if (ignoreBrackets) {
                    // Already handled above for the most inner bracket pair.
                    ignoreBrackets = false;
                    this.ignoreContent(context.getChild(index++) as TerminalNode);
                    this.ignoreContent(context.getChild(index++) as TerminalNode);
                } else {
                    this.getContent(builder, context.getChild(index++) as TerminalNode);
                    this.getContent(builder, context.getChild(index++) as TerminalNode);
                }
            }
        }

        return isPrimitiveType;
    };

    private processClassType = (builder: java.lang.StringBuilder, context?: ClassTypeContext): void => {
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
        context?: ClassOrInterfaceTypeContext): void => {
        if (!context) {
            return;
        }

        let index = 0;
        while (true) {
            const child = context.getChild(index++);

            builder.append(this.getLeadingWhiteSpaces(child as TerminalNode));

            // Only resolve the first identifier part in the qualified identifier.
            if (index === 1) {
                const info = this.resolveType(context, child.text);
                if (typeof info === "string") {
                    builder.append(info);
                } else {
                    builder.append(info.qualifiedName);
                }
            } else {
                builder.append(child.text);
            }

            if (index === context.childCount) {
                break;
            }

            if (context.getChild(index) instanceof TypeArgumentsContext) {
                this.processTypeArguments(builder, context.getChild(index++) as TypeArgumentsContext);
            }

            if (index === context.childCount) {
                break;
            }

            if (context.getChild(index) instanceof TerminalNode) {
                builder.append(this.getLeadingWhiteSpaces(context.getChild(index++) as TerminalNode) + ".");
            }

            if (index === context.childCount) {
                break;
            }
        }
    };

    private processTypeArguments = (builder: java.lang.StringBuilder, context?: TypeArgumentsContext): void => {
        if (!context) {
            return;
        }

        this.getContent(builder, context.LT());

        let index = 1;
        while (true) {
            const child = context.getChild(index++) as TypeArgumentContext;
            this.processTypeArgument(builder, child);
            if (index === context.childCount - 1) {
                break;
            }

            this.getContent(builder, context.getChild(index++) as TerminalNode); // Comma.
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
                builder.append(this.getLeadingWhiteSpaces(firstChild as TerminalNode));
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

    private processPrimitiveType = (builder: java.lang.StringBuilder, context?: PrimitiveTypeContext): void => {
        if (!context) {
            return;
        }

        builder.append(this.getLeadingWhiteSpaces(context));

        if (context.BOOLEAN()) {
            builder.append("boolean");
        } else if (context.LONG()) {
            builder.append("bigint");
        } else {
            builder.append("number"); // Use number also for the char type.
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
     */
    private processBodyMembers = (builder: java.lang.StringBuilder, members: IClassMemberDetails[]): void => {
        const pending: IClassMemberDetails[] = [];

        const generatedMembers = this.typeStack.tos?.generatedMembers ?? [];

        // See if we need the special TS error suppression for our unusual `super()` calls.
        let needSuperCallSuppression = false;
        const info = this.source.resolveType(this.typeStack.tos?.name ?? "");
        if (info && (info.symbol instanceof ClassSymbol) &&
            (info.symbol.extends.length > 0 || info.symbol.implements.length > 0)) {
            needSuperCallSuppression = true;
        }

        while (true) {
            const member = members.shift();
            if (!member) {
                break;
            }

            switch (member.type) {
                case MemberType.Constructor:
                case MemberType.Method: {
                    members = this.processConstructorAndMethodMembers(builder, member, members,
                        needSuperCallSuppression, generatedMembers);
                    break;
                }

                case MemberType.Static: {
                    // Not strictly required, but standard eslint ordering rules for members require static blocks
                    // to be after all other members.
                    pending.push(member);
                    break;
                }

                case MemberType.Abstract: {
                    builder.append(member.leadingWhitespace);
                    builder.append(member.modifier);
                    builder.append(member.nameWhitespace ?? "");
                    builder.append(member.name ?? "unknown");
                    builder.append(member.signatureContent ?? "");
                    builder.append(member.bodyContent);

                    break;
                }

                case MemberType.Class: {
                    // Class definitions already have whitespaces and modifiers applied to their content.
                    builder.append(member.bodyContent);

                    break;
                }

                default: {
                    builder.append(member.leadingWhitespace);
                    builder.append(member.modifier);
                    builder.append(member.bodyContent);

                    break;
                }
            }
        }

        pending.forEach((member) => {
            builder.append(member.leadingWhitespace);
            builder.append(member.name ?? "unknown");
            builder.append(member.signatureContent ?? "");
            builder.append(member.bodyContent);
        });

        // Finally add any other generated member.
        generatedMembers.forEach((member) => {
            if (member.type === MemberType.Initializer) {
                // If there's still instance initializer code in the list then it means we have no explicit constructor
                // declaration. So, add one here.
                builder.append(`\npublic constructor() {\n\tsuper();\n"${member.bodyContent.toString()}\n}`);
            } else {
                builder.append(member.leadingWhitespace);
                builder.append(member.modifier);
                builder.append(member.nameWhitespace ?? "");
                builder.append(member.name ?? "");
                builder.append(member.signatureContent ?? "");
                builder.append(member.bodyContent);
            }
        });
    };

    private processConstructorAndMethodMembers(builder: java.lang.StringBuilder, member: IClassMemberDetails,
        members: IClassMemberDetails[], needSuperCallSuppression: boolean, generatedMembers: IClassMemberDetails[]) {
        const name = member.name;

        // Certain methods cannot be overloaded. Static and non-static cannot be mixed and
        // abstract methods are not changed, as they have no body.
        const overloads = members.filter((candidate) => {
            return candidate.name === name && !candidate.modifier.includes("abstract");
        });

        if (overloads.length > 0) {
            overloads.unshift(member);

            let staticCount = 0;
            overloads.forEach((candidate) => {
                if (candidate.modifier.includes("static")) {
                    ++staticCount;
                }
            });

            // All static overloads or no static overload.
            if (staticCount === 0 || staticCount === overloads.length) {
                // Remove the found overloads from the members list.
                members = members.filter((candidate) => {
                    return candidate.name !== name;
                });

                // Constructors which call each other (explicit constructor invocation, aka. constructor
                // chaining) need a special construct (a closure and certain TS/ESlint error suppressions).
                let needClosure = false;
                overloads.forEach((overload) => {
                    if (overload.type === MemberType.Constructor && overload.containsThisCall) {
                        needClosure = true;
                    }
                });

                if (needClosure && needSuperCallSuppression) {
                    // ESlint error suppression is done for the entire constructor block.
                    builder.append(overloads[0].leadingWhitespace);
                    overloads[0].leadingWhitespace = "";
                    builder.append(
                        "/* eslint-disable constructor-super, @typescript-eslint/no-unsafe-call */\n",
                    );
                }

                // Sort the overloads by increasing parameter count.
                overloads.sort((a, b) => {
                    return (a.signature ?? []).length - (b.signature ?? []).length;
                });

                // Write the overload signatures.
                overloads.forEach((overload) => {
                    builder.append(overload.leadingWhitespace);
                    builder.append(overload.modifier);

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

                if (needClosure && this.configuration.options.suppressTSErrorsForECI
                    && needSuperCallSuppression) {
                    // Now one of the TS error suppressions, which we have done for ESlint above.
                    builder.append("\n/* @ts-expect-error, because of the super() call in the closure. */");
                }

                // Construct the implementation signature and get the set of possible return types.
                const returnTypes = new Set<string>();
                overloads.forEach((overload) => {
                    if (member.type === MemberType.Method && overload.returnType) {
                        returnTypes.add(overload.returnType);
                    }
                });

                const combinedParameters: Array<IParameterInfo & { optional: boolean; needTypeCheck: boolean; }> = [];
                let combinedParameterString = "";

                const maxParamCount = (overloads[overloads.length - 1].signature ?? []).length;
                if (maxParamCount > 0) {
                    for (let i = 0; i < maxParamCount; ++i) {
                        // These are sets to ignore duplicates.
                        const names = new Set<string>();
                        const types = new Set<string>();

                        let optional = false;
                        let rest = false;
                        let nullable = false;
                        overloads.forEach((overload) => {
                            if (overload.signature && i < overload.signature.length) {
                                names.add(overload.signature[i].name);
                                types.add(overload.signature[i].type);
                                if (overload.signature[i].nullable) {
                                    nullable = true;
                                }

                                if (overload.signature[i].rest) {
                                    rest = true;
                                }
                            } else {
                                optional = true;
                            }
                        });

                        // Convert the found names (w/o duplicates) to an array to join them, after
                        // converting all names to title case (except the first one).
                        const nameArray = Array.from(names);
                        nameArray.forEach((name, index) => {
                            if (index > 0) {
                                nameArray[index] = name[0].toUpperCase() + name.substring(1);
                            }
                        });
                        const parameterName = nameArray.join("Or");

                        // Next construct a union type out of the found types or a generic rest parameter.
                        let parameterType;
                        if (rest) {
                            parameterType = `unknown[]`;
                        } else {
                            const typeArray = Array.from(types);
                            if (nullable) {
                                // Append the null at the end.
                                typeArray.push("null");
                            }
                            parameterType = typeArray.join(" | ");
                        }

                        combinedParameters.push({
                            name: (rest ? "..." : "") + parameterName,
                            type: parameterType,
                            nullable,
                            optional,
                            rest,
                            needTypeCheck: optional || types.size > 1,
                        });
                    }

                    // Construct the implementation signature from the combined parameters.
                    combinedParameters.forEach((parameter, index) => {
                        if (index > 0) {
                            combinedParameterString += ", ";
                        }

                        if (parameter.optional) {
                            combinedParameterString += parameter.name + "?: " + parameter.type;
                        } else {
                            combinedParameterString += parameter.name + ": " + parameter.type;
                        }
                    });
                }

                // Check the combined parameters list to see if we really need a type check for the individual
                // parameters. If a parameter exists in all overloads with the same name then there's no need to
                // check its type.
                if (member.type === MemberType.Constructor) {
                    builder.append(`\n${member.modifier} constructor(${combinedParameterString}) {\n`);
                } else {
                    const combinedReturnTypeString = Array.from(returnTypes).join(" | ");
                    builder.append(`\n${member.leadingWhitespace}${member.modifier}` +
                        `${member.nameWhitespace ?? ""}${member.name ?? "unknown"}${member.typeParameters ?? ""}(` +
                        `${combinedParameterString}): ${combinedReturnTypeString} {\n`);
                }

                // Add collected instance initializer code now, if there's any.
                if (member.type === MemberType.Constructor) {
                    // There can only be one initializer entry.
                    const index = generatedMembers.findIndex((candidate) => {
                        return candidate.type === MemberType.Initializer;
                    });

                    if (index > -1) {
                        const member = generatedMembers[index];
                        generatedMembers.splice(index, 1);
                        builder.append(`${member.bodyContent.toString()}\n`);
                    }
                }

                // Add the body code for each overload, depending on the overload parameters.
                const bodyBuilder = new java.lang.StringBuilder();
                overloads.forEach((overload, index) => {
                    if (index > 0) {
                        bodyBuilder.append(" else ");
                    }

                    const nameAssignments: string[] = [];
                    if (overload.signature) {
                        // The nameAssignments list gets the helper assignments used to access the original parameter
                        // name in the overload body code. Remember, the implementation signature uses parameter names
                        // constructed from all param names at a given position in the parameter list of each overload.
                        if (index < overloads.length - 1) {
                            let condition = "";
                            for (let i = 0; i < maxParamCount; ++i) {
                                if (i < overload.signature.length) {
                                    // There's a parameter at this position. Add a check for it, if needed.
                                    if (combinedParameters[i].needTypeCheck) {
                                        if (condition.length > 0) {
                                            condition += " && ";
                                        }

                                        const typeParts = overload.signature[i].type.split(".");
                                        const typeName = typeParts.length === 1
                                            ? typeParts[0]
                                            : typeParts[typeParts.length - 1];

                                        const isClass = typeName[0] === typeName[0].toUpperCase();
                                        const isArray = typeName.endsWith("[]");

                                        if (isClass && !isArray) {
                                            let type = overload.signature[i].type.trim();
                                            const typeParamsCheck = type.match(/^[A-Z_.]+[ \t]*(<.+>)/i);
                                            if (typeParamsCheck) {
                                                type = type.substring(0, type.length - typeParamsCheck[1].length);
                                            }

                                            condition += `${combinedParameters[i].name} instanceof ${type}`;
                                        } else if (isArray) {
                                            condition += `Array.isArray(${combinedParameters[i].name})`;
                                        } else {
                                            condition += `typeof ${combinedParameters[i].name} === ` +
                                                `"${overload.signature[i].type}"`;
                                        }

                                        if (overload.signature[i].name !== combinedParameters[i].name) {
                                            nameAssignments.push(`const ${overload.signature[i].name} = ` +
                                                `${combinedParameters[i].name} as ${overload.signature[i].type};`);
                                        }
                                    }
                                } else {
                                    // Overload parameter list exhausted. Add a check for the current parameter
                                    // and stop the loop. After an optional parameter there can't be a
                                    // non-optional one.
                                    if (condition.length > 0) {
                                        condition += " && ";
                                    }

                                    condition += `${combinedParameters[i].name} === undefined`;

                                    break;
                                }
                            }

                            bodyBuilder.append(`if (${condition})`);
                        } else {
                            // This is the last overload branch. No need for a condition, but we still need
                            // the name assignments.
                            for (let i = 0; i < overload.signature.length; ++i) {
                                if (overload.signature[i].name !== combinedParameters[i].name) {
                                    // Intentionally using "let" here.
                                    // Linters can convert to const, if required.
                                    nameAssignments.push(`let ${overload.signature[i].name} = ` +
                                        `${combinedParameters[i].name} as ${overload.signature[i].type};`);
                                }
                            }
                        }
                    }

                    let innerTSSuppression = "";
                    if (needClosure && !overload.containsThisCall
                        && this.configuration.options.suppressTSErrorsForECI
                        && needSuperCallSuppression) {
                        // Because of the use of the constructor chain emulation closure we will end
                        // with `super()` calls in that closure, for which TS issues an error.
                        // This has to be suppressed.
                        // Note: the suppression does not work if the block contains code before the super()
                        //       call. This must be solved manually, by moving the suppression line.
                        innerTSSuppression =
                            "\n/* @ts-expect-error, because of the super() call in the closure. */";
                    }

                    // Before writing the body content, we also have to inject assignments with the original
                    // parameter name (+ a cast), if it differs from the combined name, to allow using the
                    // body content without change.
                    let block = `${overload.bodyContent.toString()}`;
                    if (nameAssignments.length > 0) {
                        const openCurlyIndex = block.indexOf("{");
                        if (openCurlyIndex > -1) { // Should always be true.
                            block = block.substring(0, openCurlyIndex + 1) + "\n" +
                                nameAssignments.join("\n") + innerTSSuppression +
                                block.substring(openCurlyIndex + 1);
                        }
                    } else if (innerTSSuppression.length > 0) { // Only for constructors.
                        const openCurlyIndex = block.indexOf("{");
                        if (openCurlyIndex > -1) { // Should always be true.
                            block = block.substring(0, openCurlyIndex + 1) + "\n" + innerTSSuppression +
                                block.substring(openCurlyIndex + 1);
                        }

                    }
                    bodyBuilder.append(`${block}\n`);
                });

                if (needClosure) {
                    // Create the closure and use the constructor body content as its body.
                    builder.append(`const $this = (${combinedParameterString}): void => {\n`);
                    builder.append(bodyBuilder);
                    builder.append("};\n\n");

                    // This call triggers the constructor chain.
                    builder.append("$this(");
                    combinedParameters.forEach((parameter, index) => {
                        if (index > 0) {
                            builder.append(", ");
                        }
                        builder.append(parameter.name);
                    });

                    builder.append(");\n");
                } else {
                    builder.append(bodyBuilder);
                }

                builder.append("\n}\n");

                if (needClosure && needSuperCallSuppression) {
                    // Re-enable the suppressed ESlint error.
                    builder.append(
                        "/* eslint-enable constructor-super, @typescript-eslint/no-unsafe-call */");
                }
            }

        } else {
            builder.append(member.leadingWhitespace);
            builder.append(member.modifier);
            builder.append(member.nameWhitespace ?? "");
            builder.append(member.name ?? "");
            builder.append(member.signatureContent ?? "");
            builder.append(member.bodyContent);
        }

        return members;
    }

    /**
     * Returns all white spaces (including comments) between the current white space anchor and the first character
     * covered by the target.
     * The white space anchor is then set to the position directly following the target.
     *
     * @param target A parse tree for which to return the leading white spaces.
     *
     * @returns The original white space text between tokens.
     */
    private getLeadingWhiteSpaces = (target?: ParserRuleContext | TerminalNode): string => {
        if (!target) {
            return "";
        }

        const startIndex = target instanceof TerminalNode ? target.symbol.startIndex : target.start.startIndex;
        const stopIndex = target instanceof TerminalNode ? target.symbol.stopIndex : target.stop?.stopIndex;
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
    private getContent = (builder: java.lang.StringBuilder, target?: ParserRuleContext | TerminalNode,
        commented = false): void => {
        if (!target) {
            return;
        }

        const startIndex = target instanceof TerminalNode ? target.symbol.startIndex : target.start.startIndex;
        const stopIndex = target instanceof TerminalNode ? target.symbol.stopIndex : target.stop?.stopIndex;
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
    private ignoreContent = (target?: ParserRuleContext | TerminalNode): void => {
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

        const startIndex = start instanceof TerminalNode ? start.symbol.startIndex : start.start.startIndex;
        const stopIndex = stop instanceof TerminalNode ? stop.symbol.stopIndex : (stop.stop?.stopIndex ?? startIndex);
        const interval = Interval.of(startIndex, stopIndex);

        const ws = this.getLeadingWhiteSpaces(start);
        this.whiteSpaceAnchor = stopIndex + 1;

        builder.append(`${ws}/* ${this.source.getText(interval)} */`);
    };

    /**
     * Called when a class or interface body construction was finished. It takes all nested declarations for the
     * current type java.util.stack TOS and constructs a namespace declaration of it.
     * Also removes the TOS.
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
    private resolveType = (context: ParseTree | undefined, name: string): ISymbolInfo | string => {
        if (!context) {
            return name;
        }

        // 1. The application can force a remap of types to something else.
        const forClass = this.classResolver.get(name);
        if (forClass) {
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
        for (const source of this.source.importList) {
            const info = source.resolveType(name);
            if (info) {
                return info;
            }
        }

        return name;
    };
}
