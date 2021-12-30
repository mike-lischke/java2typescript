/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import fs from "fs";
import path from "path";

import { ParserRuleContext } from "antlr4ts";
import { TerminalNode } from "antlr4ts/tree";
import { Interval } from "antlr4ts/misc/Interval";

import { JavaLexer } from "../../java/generated/JavaLexer";

import { Stack } from "../../lib/ContainerSupport";
import { StringBuilder } from "../StringSupport";

import {
    CompilationUnitContext, JavaParser, TypeDeclarationContext,
    ClassOrInterfaceModifierContext, AnnotationContext, ClassDeclarationContext, InterfaceDeclarationContext,
    EnumDeclarationContext, TypeTypeContext, ClassOrInterfaceTypeContext, PrimitiveTypeContext, TypeArgumentContext,
    TypeArgumentsContext, TypeListContext, ClassBodyContext, ClassBodyDeclarationContext, ModifierContext,
    MemberDeclarationContext, BlockContext, AnnotationTypeDeclarationContext, ConstructorDeclarationContext,
    FieldDeclarationContext, GenericConstructorDeclarationContext, MethodDeclarationContext, TypeTypeOrVoidContext,
    MethodBodyContext, FormalParametersContext, FormalParameterContext, LastFormalParameterContext,
    BlockStatementContext, LocalTypeDeclarationContext, LocalVariableDeclarationContext, StatementContext,
    VariableModifierContext, VariableDeclaratorsContext, VariableDeclaratorContext, VariableInitializerContext,
    ArrayInitializerContext, ExpressionContext, GenericMethodDeclarationContext, PrimaryContext, CreatorContext,
    CreatedNameContext, MethodCallContext, ExpressionListContext, LambdaExpressionContext, LambdaParametersContext,
    FormalParameterListContext, ClassTypeContext, NonWildcardTypeArgumentsContext, InnerCreatorContext,
    NonWildcardTypeArgumentsOrDiamondContext, ClassCreatorRestContext, ArgumentsContext, SuperSuffixContext,
    ExplicitGenericInvocationContext, ParExpressionContext, ForControlContext, EnhancedForControlContext,
    VariableDeclaratorIdContext, ForInitContext, CatchClauseContext, CatchTypeContext, FinallyBlockContext,
    SwitchBlockStatementGroupContext, SwitchLabelContext, TypeArgumentsOrDiamondContext, TypeParametersContext,
    TypeParameterContext, TypeBoundContext, InterfaceBodyContext, InterfaceBodyDeclarationContext,
    InterfaceMemberDeclarationContext, ConstDeclarationContext, InterfaceMethodDeclarationContext,
    GenericInterfaceMethodDeclarationContext, ConstantDeclaratorContext, EnumConstantsContext, EnumConstantContext,
} from "../../java/generated/JavaParser";

import { IConverterConfiguration } from "./JavaToTypeScript";
import { printParseTreeStack } from "../Utilities";
import { PackageSource } from "../PackageSource";

interface IModifierInfo {
    isPublic?: boolean;
    isProtected?: boolean;
    isPrivate?: boolean;
    isStatic?: boolean;
    isAbstract?: boolean;
    isFinal?: boolean;
    isStrictFp?: boolean;
    isSynchronized?: boolean;

    // For annotations or anything else we cannot handle.
    text: StringBuilder;
}

enum RelatedElement {
    Irrelevant,
    Class,
    Method,
    Enum,
    Interface
}

// A description of a type for nested structures.
interface ITypeInfo {
    // The name of the type.
    name: string;

    // Static initialization code.
    init: StringBuilder;

    // Types declared within a class or interface must be converted to a module declaration with the same name
    // as the class or interface type.
    nestedDeclarations: StringBuilder;
}

// Converts the given Java file to Typescript.
export class FileProcessor {
    private static typeMap = new Map<string, string>([
        ["String", "string"],
        ["Character", "string"],
    ]);

    private static knownExceptions = new Set([
        "IllegalArgumentException",
    ]);

    private whiteSpaceAnchor = 0;

    private needDecorators?: boolean;

    private stringSupport = new Set<string>();
    private containerSupport = new Set<string>();
    private exceptionSupport = new Set<string>();

    // Keeps names of classes for which inner processing is going on. Sometimes it is necessary to know the name
    // for special processing (e.g. auto creating static initializer functions).
    private typeStack: Stack<ITypeInfo> = new Stack();

    // A list of strings that must be added at the end of the generated file (usually for static initialization).
    private initializerCalls: string[] = [];

    private packageSource: PackageSource;

    public constructor(private configuration: IConverterConfiguration) { }

    /**
     * Converts the Java file whose path is given by `source` to Typescript and writes the generated content
     * to the file given by `target`;
     *
     * @param source The original Java file.
     * @param target The new Typescript file.
     */
    public convertFile = (source: string, target: string): void => {
        process.stdout.write(`Converting: ${source}...`);

        this.packageSource = PackageSource.fromFile(source, this.configuration.packageRoot);
        if (this.packageSource.fileParseInfo.tree) {
            if (this.configuration.debug?.pathForPosition
                && source.match(this.configuration.debug.pathForPosition.filePattern)) {
                printParseTreeStack(source, this.packageSource.fileParseInfo.tree,
                    this.packageSource.fileParseInfo.parser.ruleNames,
                    this.configuration.debug.pathForPosition.position);
            }

            const libPath = path.relative(target, this.configuration.options.lib ?? "./");
            const builder = new StringBuilder();
            this.processCompilationUnit(builder, source, libPath, this.packageSource.fileParseInfo.tree);

            fs.mkdirSync(path.dirname(target), { recursive: true });
            fs.writeFileSync(target, builder.buffer);

            console.log(" done");
        } else {
            console.log("Ignored, because of errors.");
        }
    };

    private processCompilationUnit = (builder: StringBuilder, source: string, libPath: string,
        context: CompilationUnitContext): void => {
        this.typeStack.push({
            name: "file",
            init: new StringBuilder(),
            nestedDeclarations: new StringBuilder(),
        });

        const firstChild = context.getChild(0);
        const imports = new StringBuilder();
        if (firstChild instanceof ParserRuleContext) {
            imports.append(this.getLeadingWhiteSpaces(firstChild));

            if (this.configuration.options.prefix) {
                imports.append(this.configuration.options.prefix);
            }

            if (context.packageDeclaration()) {
                this.ignoreContent(context.packageDeclaration());
            }

            context.importDeclaration().forEach((entry) => {
                this.ignoreContent(entry);
            });

            this.processTypeDeclaration(builder, context.typeDeclaration());
            builder.append(this.typeStack.tos.nestedDeclarations);

            this.packageSource.generateImportStatements(source).forEach((statement) => {
                imports.appendLine(statement);
            });

            imports.append("\n");
        }

        this.getContent(builder, context.EOF());

        imports.append("\n");
        if (this.needDecorators) {
            const decorators = path.join(libPath, "Decorators");
            imports.append(`${this.getLeadingWhiteSpaces(context)}import { final } from "${decorators}";\n`);
        }

        if (this.stringSupport.size > 0) {
            const stringSupport = path.join(libPath, "StringSupport");
            const list = Array.from(this.stringSupport.values());
            imports.append(`import { ${list.join(", ")} } from "${stringSupport}"\n`);
        }

        if (this.containerSupport.size > 0) {
            const containerSupport = path.join(libPath, "ContainerSupport");
            const list = Array.from(this.containerSupport.values());
            imports.append(`import { ${list.join(", ")} } from "${containerSupport}"\n`);
        }

        if (this.exceptionSupport.size > 0) {
            const exceptionSupport = path.join(libPath, "ExceptionSupport");
            const list = Array.from(this.exceptionSupport.values());
            imports.append(`import { ${list.join(", ")} } from "${exceptionSupport}"\n`);
        }

        if (this.initializerCalls.length > 0) {
            builder.append("\n\n");
            this.initializerCalls.forEach((call) => {
                builder.append(call + "\n");
            });
        }

        builder.prepend(imports);
    };

    private processTypeDeclaration = (builder: StringBuilder, list: TypeDeclarationContext[]): void => {
        list.forEach((context) => {
            const modifierInfo = this.processClassOrInterfaceModifier(context.classOrInterfaceModifier());

            if (context.classDeclaration()) {
                this.constructModifierString(modifierInfo, RelatedElement.Class);
                builder.append(modifierInfo.text);
                this.processClassDeclaration(builder, context.classDeclaration(), modifierInfo.isPublic);
            } else if (context.enumDeclaration()) {
                this.constructModifierString(modifierInfo, RelatedElement.Enum);
                builder.append(modifierInfo.text);
                this.processEnumDeclaration(builder, context.enumDeclaration());
            } else if (context.interfaceDeclaration()) {
                this.processInterfaceDeclaration(builder, context.interfaceDeclaration(), modifierInfo.isPublic);
            } else { // annotationTypeDeclaration
                this.getContent(builder, context, true);
            }
        });
    };

    /**
     * A bit different compared to other processing functions. Here we don't directly create the result code
     * but return flags as we can multiple mentions of the same modifier and some may make sense only in certain
     * places.
     *
     * That means however that we cannot restore the exact same white spaces.
     *
     * @param list The list of contexts with modifier info in random order.
     *
     * @returns A set of flags comprising the extracted info.
     */
    private processClassOrInterfaceModifier = (list: ClassOrInterfaceModifierContext[]): IModifierInfo => {
        const result: IModifierInfo = {
            text: new StringBuilder(),
        };

        list.forEach((context) => {
            const element = context.getChild(0);
            if (element instanceof TerminalNode) {
                result.text.append(this.getLeadingWhiteSpaces(element));

                switch (element.symbol.type) {
                    case JavaParser.PUBLIC: {
                        result.isPublic = true;

                        break;
                    }

                    case JavaParser.PROTECTED: {
                        result.isProtected = true;

                        break;
                    }

                    case JavaParser.PRIVATE: {
                        result.isPrivate = true;

                        break;
                    }

                    case JavaParser.STATIC: {
                        result.isStatic = true;

                        break;
                    }

                    case JavaParser.ABSTRACT: {
                        result.isAbstract = true;

                        break;
                    }

                    case JavaParser.FINAL: {
                        result.isFinal = true;

                        break;
                    }

                    default: {
                        break;
                    }
                }
            } else if (this.configuration.options.convertAnnotations) {
                this.processAnnotation(result.text, context.annotation());
            }
        });

        return result;
    };

    private processAnnotation = (builder: StringBuilder, context: AnnotationContext): void => {
        this.getContent(builder, context, true);
    };

    private processClassDeclaration = (builder: StringBuilder, context: ClassDeclarationContext,
        doExport: boolean): void => {
        this.typeStack.push({
            name: context.IDENTIFIER().text,
            init: new StringBuilder(),
            nestedDeclarations: new StringBuilder(),
        });

        const localBuilder = new StringBuilder();

        this.getContent(localBuilder, context.CLASS());
        this.getContent(localBuilder, context.IDENTIFIER());

        if (context.typeParameters()) {
            this.processTypeParameters(localBuilder, context.typeParameters());
        }

        if (context.EXTENDS()) {
            this.getContent(localBuilder, context.EXTENDS());
            this.processTypeType(localBuilder, context.typeType());
        }

        if (context.IMPLEMENTS()) {
            // Even though we have to convert Java interfaces to abstract classes in TS, we still can use the
            // IMPLEMENTS keyword, because it is possible that a class implements another class.
            // The only disadvantage with that approach is that we cannot use `this` or `super` to access members
            // from the parent type.
            this.getContent(localBuilder, context.IMPLEMENTS());
            this.processTypeList(localBuilder, context.typeList());
        }

        this.processClassBody(localBuilder, context.classBody());
        const nested = this.processNestedContent(doExport);
        this.typeStack.tos.nestedDeclarations.append(nested);
        if (this.typeStack.length > 1) {
            this.typeStack.tos.nestedDeclarations.append(doExport ? "export " : "", localBuilder);
        } else {
            builder.append(localBuilder);
        }
    };

    private processClassBody = (builder: StringBuilder, context: ClassBodyContext): void => {
        this.getContent(builder, context.LBRACE());
        this.processClassBodyDeclaration(builder, context.classBodyDeclaration());

        this.getContent(builder, context.RBRACE());
    };

    private processClassBodyDeclaration = (builder: StringBuilder, list: ClassBodyDeclarationContext[]): void => {
        list.forEach((context) => {
            if (context.SEMI()) {
                // Empty body.
                this.getContent(builder, context, true);
            } else if (context.block()) {
                // Static or instance initializer.
                if (context.STATIC()) {
                    const typeInfo = this.typeStack.tos;

                    builder.append(this.getLeadingWhiteSpaces(context.STATIC()));
                    builder.append(`public static initialize${typeInfo.name}()`);
                    this.processBlock(builder, context.block());

                    // Add a call to this special function at the end of the file.
                    this.initializerCalls.push(`${typeInfo.name}.initialize${typeInfo.name}();`);
                } else {
                    // Code in instance initializers is added to the class' constructor.
                    this.processBlock(this.typeStack.tos.init, context.block());
                }
            } else {
                const modifierInfo = this.processModifier(context.modifier());
                const doExport = modifierInfo.isPublic;
                this.constructModifierString(modifierInfo, RelatedElement.Irrelevant);

                const declaration = new StringBuilder();
                this.processMemberDeclaration(declaration, context.memberDeclaration(), doExport);

                if (declaration.buffer.length > 0) {
                    // The declaration is empty if it was converted to a (nested) namespace.
                    builder.append(modifierInfo.text);
                    builder.append(declaration);
                }
            }
        });
    };

    private processModifier = (list: ModifierContext[]): IModifierInfo => {
        const text = new StringBuilder();

        if (list.length === 0) {
            return { text };
        }

        text.append(this.getLeadingWhiteSpaces(list[0]));

        // We have to collect all modifier contexts together for processing, to allow consolidation.
        const contexts: ClassOrInterfaceModifierContext[] = [];

        let isSynchronized: boolean | undefined;
        list.forEach((child) => {
            if (child.classOrInterfaceModifier()) {
                contexts.push(child.classOrInterfaceModifier());
            } else {
                if (child.SYNCHRONIZED()) {
                    isSynchronized = true;
                    this.getContent(text, child, false);
                } else {
                    this.getContent(text, child, true);
                }
            }
        });

        const result = this.processClassOrInterfaceModifier(contexts);
        result.text.prepend(text);
        result.isSynchronized = isSynchronized;

        return result;
    };

    private processMemberDeclaration = (builder: StringBuilder, context: MemberDeclarationContext,
        doExport: boolean): void => {
        const firstChild = context.getChild(0) as ParserRuleContext;
        switch (firstChild.ruleIndex) {
            case JavaParser.RULE_methodDeclaration: {
                return this.processMethodDeclaration(builder, context.methodDeclaration());
            }

            case JavaParser.RULE_genericMethodDeclaration: {
                return this.processGenericMethodDeclaration(builder, context.genericMethodDeclaration());
            }

            case JavaParser.RULE_fieldDeclaration: {
                return this.processFieldDeclaration(builder, context.fieldDeclaration());
            }

            case JavaParser.RULE_constructorDeclaration: {
                return this.processConstructorDeclaration(builder, context.constructorDeclaration());
            }

            case JavaParser.RULE_genericConstructorDeclaration: {
                return this.processGenericConstructorDeclaration(builder, context.genericConstructorDeclaration());
            }

            case JavaParser.RULE_interfaceDeclaration: {
                return this.processInterfaceDeclaration(builder, context.interfaceDeclaration(), doExport);
            }

            case JavaParser.RULE_annotationTypeDeclaration: {
                return this.processAnnotationTypeDeclaration(builder, context.annotationTypeDeclaration());
            }

            case JavaParser.RULE_classDeclaration: {
                return this.processClassDeclaration(builder, context.classDeclaration(), doExport);
            }

            case JavaParser.RULE_enumDeclaration: {
                return this.processEnumDeclaration(builder, context.enumDeclaration());
            }

            default: {
                break;
            }
        }
    };

    private processMethodDeclaration = (builder: StringBuilder, context: MethodDeclarationContext,
        genericParams?: StringBuilder): void => {
        const returnType = new StringBuilder();
        this.processTypeTypeOrVoid(returnType, context.typeTypeOrVoid());

        this.getContent(builder, context.IDENTIFIER());

        if (this.configuration.options.preferArrowFunctions) {
            builder.append(" = ");
        }

        if (genericParams) {
            builder.append(genericParams);
        }

        this.processFormalParameters(builder, context.formalParameters());

        // TODO: move brackets to the type string.
        if (context.LBRACK().length > 0) {
            builder.append(this.getLeadingWhiteSpaces(context.LBRACK(0)));

            const rightBrackets = context.RBRACK();
            this.whiteSpaceAnchor = rightBrackets[rightBrackets.length - 1].symbol.stopIndex + 1;

        }

        builder.append(":", returnType, " ", this.configuration.options.preferArrowFunctions ? "=>" : "");

        if (context.THROWS()) {
            this.getRangeCommented(builder, context.THROWS(), context.qualifiedNameList());
        }

        this.processMethodBody(builder, context.methodBody());
    };

    private processFormalParameters = (builder: StringBuilder, context: FormalParametersContext): void => {
        this.getContent(builder, context.LPAREN());

        if (context.formalParameterList()) {
            this.processFormalParameterList(builder, context.formalParameterList());
        }

        this.getContent(builder, context.RPAREN());
    };

    private processFormalParameterList = (builder: StringBuilder, context: FormalParameterListContext): void => {
        let index = 0;
        let child = context.getChild(index);
        while (true) {
            if (!(child instanceof FormalParameterContext)) {
                break;
            }

            this.processFormalParameter(builder, child);
            if (++index === context.childCount) {
                break;
            }

            child = context.getChild(index);
            if (!(child instanceof TerminalNode)) {
                break;
            }

            this.getContent(builder, child);

            if (++index === context.childCount) {
                break;
            }

            child = context.getChild(index);
        }

        if (child instanceof LastFormalParameterContext) {
            this.processFormalParameter(builder, child);
        }
    };

    private processFormalParameter = (builder: StringBuilder,
        context: FormalParameterContext | LastFormalParameterContext): void => {

        context.variableModifier().forEach((modifier) => {
            this.getContent(builder, modifier, true);
        });

        const ws = this.getLeadingWhiteSpaces(context.typeType());

        const type = new StringBuilder();
        this.processTypeType(type, context.typeType());

        if (context instanceof LastFormalParameterContext) {
            context.annotation().forEach((annotation) => {
                this.processAnnotation(builder, annotation);
            });
            this.getContent(builder, context.ELLIPSIS());
        }

        builder.append(ws);
        this.getContent(builder, context.variableDeclaratorId().IDENTIFIER());
        builder.append(":");
        builder.append(type);

        if (context.variableDeclaratorId().LBRACK().length > 0) {
            // Old array style given.
            let index = 1;
            const children = context.variableDeclaratorId().children;
            while (index < children.length) {
                this.getContent(builder, children[index++] as TerminalNode);
            }
        }
    };

    private processMethodBody = (builder: StringBuilder, context: MethodBodyContext): void => {
        if (context.block()) {
            this.processBlock(builder, context.block());
        }

        builder.append(";");
    };

    private processGenericMethodDeclaration = (builder: StringBuilder,
        context: GenericMethodDeclarationContext): void => {
        const params = new StringBuilder();
        this.processTypeParameters(params, context.typeParameters());

        return this.processMethodDeclaration(builder, context.methodDeclaration(), params);
    };

    private processFieldDeclaration = (builder: StringBuilder, context: FieldDeclarationContext): void => {
        const type = new StringBuilder();
        this.processTypeType(type, context.typeType());
        this.processVariableDeclarators(builder, context.variableDeclarators(), type.text);
    };

    private processConstructorDeclaration = (builder: StringBuilder, context: ConstructorDeclarationContext): void => {
        builder.append(this.getLeadingWhiteSpaces(context.IDENTIFIER()) + "constructor");
        this.processFormalParameters(builder, context.formalParameters());

        if (context.THROWS()) {
            this.getRangeCommented(builder, context.THROWS(), context.qualifiedNameList());
        }
        this.processBlock(builder, context.block());
    };

    private processGenericConstructorDeclaration = (builder: StringBuilder,
        context: GenericConstructorDeclarationContext): void => {
        this.processTypeParameters(builder, context.typeParameters());
        this.processConstructorDeclaration(builder, context.constructorDeclaration());
    };

    private processTypeParameters = (builder: StringBuilder, context: TypeParametersContext): void => {
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

    private processTypeParameter = (builder: StringBuilder, context: TypeParameterContext): void => {
        let index = 0;
        while (true) {
            const child = context.getChild(index);
            if (child instanceof TerminalNode) {
                // The identifier.
                break;
            }

            this.processAnnotation(builder, child as AnnotationContext);
            ++index;
        }

        this.getContent(builder, context.IDENTIFIER());
        ++index;

        if (context.EXTENDS()) {
            ++index;
            this.getContent(builder, context.EXTENDS());

            while (true) {
                const child = context.getChild(index);
                if (child instanceof TypeBoundContext) {
                    // End of the annotations.
                    break;
                }

                this.processAnnotation(builder, child as AnnotationContext);
                ++index;
            }

            this.processTypeBound(builder, context.typeBound());
        }
    };

    private processTypeBound = (builder: StringBuilder, context: TypeBoundContext): void => {
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

    private processInterfaceDeclaration = (builder: StringBuilder, context: InterfaceDeclarationContext,
        doExport: boolean): void => {
        this.typeStack.push({
            name: context.IDENTIFIER().text,
            init: new StringBuilder(),
            nestedDeclarations: new StringBuilder(),
        });

        const localBuilder = new StringBuilder();

        // Java interfaces are not directly convertible. Since they can contain initialized fields (which TS interfaces
        // cannot), we have to treat them like abstract classes (a pure abstract class is essentially an interface in
        // typescript).
        this.ignoreContent(context.INTERFACE());
        localBuilder.append(doExport ? "export " : "", "abstract class");
        this.getContent(localBuilder, context.IDENTIFIER());

        if (context.typeParameters()) {
            this.processTypeParameters(localBuilder, context.typeParameters());
        }

        if (context.EXTENDS()) {
            this.getContent(localBuilder, context.EXTENDS());
            this.processTypeList(localBuilder, context.typeList());
        }

        this.processInterfaceBody(localBuilder, context.interfaceBody());
        if (this.typeStack.length > 1) {
            const nested = this.processNestedContent(doExport);
            this.typeStack.tos.nestedDeclarations.append(nested);
            this.typeStack.tos.nestedDeclarations.append(localBuilder);
        } else {
            builder.append(localBuilder);
        }
    };

    private processInterfaceBody = (builder: StringBuilder, context: InterfaceBodyContext): void => {
        this.getContent(builder, context.LBRACE());

        context.interfaceBodyDeclaration().forEach((declaration) => {
            this.processInterfaceBodyDeclaration(builder, declaration);
        });

        this.getContent(builder, context.RBRACE());
    };

    private processInterfaceBodyDeclaration = (builder: StringBuilder,
        context: InterfaceBodyDeclarationContext): void => {
        if (!context.SEMI()) { // If not an empty interface.
            const modifierInfo = this.processModifier(context.modifier());
            this.constructModifierString(modifierInfo, RelatedElement.Irrelevant);
            const doExport = modifierInfo.isPublic;

            const declaration = new StringBuilder();
            this.processInterfaceMemberDeclaration(declaration, context.interfaceMemberDeclaration(), doExport);

            if (declaration.buffer.length > 0) {
                // The declaration is empty if it was converted to a (nested) namespace.
                builder.append(modifierInfo.text);
                builder.append(declaration);
            }
        }
    };

    private processInterfaceMemberDeclaration = (builder: StringBuilder, context: InterfaceMemberDeclarationContext,
        doExport: boolean): void => {
        const firstChild = context.getChild(0) as ParserRuleContext;
        switch (firstChild.ruleIndex) {
            case JavaParser.RULE_constDeclaration: {
                this.processConstDeclaration(builder, firstChild as ConstDeclarationContext);

                break;
            }

            case JavaParser.RULE_interfaceMethodDeclaration: {
                this.processInterfaceMethodDeclaration(builder, firstChild as InterfaceMethodDeclarationContext);

                break;
            }

            case JavaParser.RULE_genericInterfaceMethodDeclaration: {
                this.processGenericInterfaceMethodDeclaration(builder,
                    firstChild as GenericInterfaceMethodDeclarationContext);

                break;
            }

            case JavaParser.RULE_interfaceDeclaration: {
                this.processInterfaceDeclaration(builder, firstChild as InterfaceDeclarationContext, doExport);

                break;
            }

            case JavaParser.RULE_annotationTypeDeclaration: {
                this.processAnnotationTypeDeclaration(builder, firstChild as AnnotationTypeDeclarationContext);

                break;
            }

            case JavaParser.RULE_classDeclaration: {
                this.processClassDeclaration(builder, firstChild as ClassDeclarationContext, doExport);

                break;
            }

            case JavaParser.RULE_enumDeclaration: {
                this.processEnumDeclaration(builder, firstChild as EnumDeclarationContext);

                break;
            }

            default: {
                break;
            }
        }
    };

    private processConstDeclaration = (builder: StringBuilder, context: ConstDeclarationContext): void => {
        const type = new StringBuilder();
        this.processTypeType(type, context.typeType());

        let index = 1;
        while (true) {
            let child = context.getChild(index++);
            this.processConstantDeclarator(builder, child as ConstantDeclaratorContext, type);

            child = context.getChild(index++);
            this.getContent(builder, child as TerminalNode); // Comma or semicolon.
            if (child.text === ";") {
                break;
            }
        }
    };

    private processConstantDeclarator = (builder: StringBuilder, context: ConstantDeclaratorContext,
        type: StringBuilder): void => {

        const ws = this.getLeadingWhiteSpaces(context.IDENTIFIER());
        this.getContent(builder, context.IDENTIFIER());

        if (!this.configuration.options.ignoreExplicitTypeForInitializers) {
            builder.append(`:${ws}`);
            builder.append(type);
        } else {
            builder.append(ws);
        }

        context.RBRACK().forEach((bracket) => {
            this.getContent(builder, bracket);
        });

        this.getContent(builder, context.ASSIGN());
        this.processVariableInitializer(builder, context.variableInitializer());
    };

    private processInterfaceMethodDeclaration = (builder: StringBuilder,
        context: InterfaceMethodDeclarationContext): void => {
        const list = context.interfaceMethodModifier();
        if (list.length > 0) {
            this.getRangeCommented(builder, list[0], list[list.length - 1]);
        }

        // For old style square brackets (after the method parameters) collect them and add them to the type.
        const brackets = new StringBuilder();
        context.RBRACK().forEach((bracket) => {
            this.getContent(brackets, bracket);
        });

        if (context.typeParameters()) {
            const typeParameters = new StringBuilder();
            this.processTypeParameters(typeParameters, context.typeParameters());
            context.annotation().forEach((annotation) => {
                this.processAnnotation(builder, annotation);
            });

            const type = new StringBuilder();
            this.processTypeTypeOrVoid(type, context.typeTypeOrVoid());
            type.append(typeParameters);
            type.append(brackets);

            const ws = this.getLeadingWhiteSpaces(context.IDENTIFIER());
            this.getContent(builder, context.IDENTIFIER());
            builder.append(":");
            builder.append(ws);
            builder.append(type);
        } else {
            const type = new StringBuilder();

            this.processTypeTypeOrVoid(type, context.typeTypeOrVoid());
            type.append(brackets);

            const ws = this.getLeadingWhiteSpaces(context.IDENTIFIER());
            this.getContent(builder, context.IDENTIFIER());
            builder.append(":");
            builder.append(ws);
            builder.append(type);
        }

        this.processFormalParameters(builder, context.formalParameters());

        if (context.THROWS()) {
            this.getRangeCommented(builder, context.THROWS(), context.qualifiedNameList());
        }

        this.processMethodBody(builder, context.methodBody());
    };

    private processGenericInterfaceMethodDeclaration = (builder: StringBuilder,
        context: GenericInterfaceMethodDeclarationContext): void => {
        // Unclear handling ahead! The generic variant uses type parameters, but they are already handled in the
        // "non-generic" method declaration. Or in other words: if the grammar is correct we would have 2 sets of
        // type parameters, which seems not correct, so I ignore those here for now.
        this.processInterfaceMethodDeclaration(builder, context.interfaceMethodDeclaration());
    };

    private processAnnotationTypeDeclaration = (builder: StringBuilder,
        context: AnnotationTypeDeclarationContext): void => {
        this.getContent(builder, context, true); // Not supported in T.
    };

    private processEnumDeclaration = (builder: StringBuilder, context: EnumDeclarationContext): void => {
        this.getContent(builder, context.IDENTIFIER());

        if (context.IMPLEMENTS()) {
            this.getRangeCommented(builder, context.IMPLEMENTS(), context.typeList());
        }

        this.getContent(builder, context.LBRACE());
        if (context.enumConstants()) {
            this.processEnumConstants(builder, context.enumConstants());
        }

        if (context.COMMA()) {
            this.getContent(builder, context.COMMA());
        }

        if (context.enumBodyDeclarations()) {
            this.getContent(builder, context.enumBodyDeclarations(), true);
        }

        this.getContent(builder, context.RBRACE());
    };

    private processEnumConstants = (builder: StringBuilder, context: EnumConstantsContext): void => {
        context.enumConstant().forEach((constant, index) => {
            if (index > 0) {
                this.getContent(builder, context.COMMA(index - 1));
            }

            this.processEnumConstant(builder, constant);
        });

    };

    private processEnumConstant = (builder: StringBuilder, context: EnumConstantContext): void => {
        if (context.classBody()) {
            // An enum method -> unsupported.
            this.getContent(builder, context, true);
        } else {
            const list = context.annotation();
            if (list.length > 0) {
                this.getRangeCommented(builder, list[0], list[list.length - 1]);
            }

            this.getContent(builder, context.IDENTIFIER());

            if (context.arguments()) {
                // The Java way of defining explicit values. Can use only one of them per entry, though.
                const count = context.arguments().expressionList()?.expression().length ?? 0;
                if (count === 1) {
                    builder.append(" = ");
                    this.processExpression(builder, context.arguments().expressionList()?.expression(0));
                } else {
                    this.getContent(builder, context.arguments(), true);
                }
            }
        }
    };

    private processBlock = (builder: StringBuilder, context: BlockContext): void => {
        this.getContent(builder, context.LBRACE());

        context.blockStatement().forEach((child) => {
            this.processBlockStatement(builder, child);
        });

        this.getContent(builder, context.RBRACE());
    };

    private processBlockStatement = (builder: StringBuilder, context: BlockStatementContext): void => {
        if (context.localVariableDeclaration()) {
            this.processLocalVariableDeclaration(builder, context.localVariableDeclaration());
        } else if (context.statement()) {
            this.processStatement(builder, context.statement());
        } else {
            this.processLocalTypeDeclaration(builder, context.localTypeDeclaration());
        }
    };

    private processLocalVariableDeclaration = (builder: StringBuilder,
        context: LocalVariableDeclarationContext): void => {
        context.variableModifier().forEach((modifier) => {
            this.processVariableModifier(builder, modifier);
        });

        const type = new StringBuilder();
        this.processTypeType(type, context.typeType());

        let typeString = type.text;

        // Often there's a comment above a variable declaration, which would be taken to the wrong place
        // when we move the type in the text.
        // So separate multiple lines so that we keep the original comments above the new var declaration.
        const parts = typeString.split("\n");
        if (parts.length > 0) {
            typeString = parts.pop();

            builder.append(parts.join("\n") + (parts.length > 0 ? "\n" : ""));
        }

        const trimmed = typeString.trimStart();
        if (trimmed.length < typeString.length) {
            builder.append(typeString.substring(0, typeString.length - trimmed.length));
            typeString = trimmed;
        }

        this.processVariableDeclarators(builder, context.variableDeclarators(), typeString);
    };

    private processVariableModifier = (builder: StringBuilder, context: VariableModifierContext): void => {
        if (context.FINAL()) {
            builder.append(this.getLeadingWhiteSpaces(context.FINAL()) + "readonly");
        }

        this.getContent(builder, context, true);
    };

    private processVariableDeclarators = (builder: StringBuilder, context: VariableDeclaratorsContext,
        type: string): void => {
        context.variableDeclarator().forEach((declarator, index) => {
            // Add a line break between var declarations.
            if (index > 0) {
                builder.append("\n");
            }

            this.processVariableDeclarator(builder, declarator, type);
        });
    };

    private processVariableDeclarator = (builder: StringBuilder, context: VariableDeclaratorContext,
        type: string): void => {
        const ws = this.getLeadingWhiteSpaces(context.variableDeclaratorId());

        const localBuilder = new StringBuilder();
        this.getContent(localBuilder, context.variableDeclaratorId().IDENTIFIER());
        const name = localBuilder.text;

        if (context.parent.parent instanceof LocalVariableDeclarationContext) {
            builder.append("let ");
        }
        builder.append(`${ws}${name}: ${type}`);

        if (context.variableDeclaratorId().LBRACK().length > 0) {
            let index = 1;
            const children = context.variableDeclaratorId().children;
            while (index < children.length) {
                this.getContent(builder, children[index++] as TerminalNode);
            }
        }

        if (context.ASSIGN()) {
            this.getContent(builder, context.ASSIGN());
            this.processVariableInitializer(builder, context.variableInitializer());
        }
    };

    private processVariableInitializer = (builder: StringBuilder, context: VariableInitializerContext): void => {
        if (context.arrayInitializer()) {
            this.processArrayInitializer(builder, context.arrayInitializer());
        } else {
            const localBuilder = new StringBuilder();
            const ws = this.getLeadingWhiteSpaces(context.expression());
            this.processExpression(localBuilder, context.expression());

            builder.append(ws, this.checkTypeNameOrApiCall(localBuilder.text));
        }
    };

    private processArrayInitializer = (builder: StringBuilder, context: ArrayInitializerContext): void => {
        builder.append(this.getLeadingWhiteSpaces(context.LBRACE()) + "[");

        context.variableInitializer().forEach((child) => {
            this.processVariableInitializer(builder, child);
        });

        builder.append(this.getLeadingWhiteSpaces(context.RBRACE()) + "]");
    };

    private processParExpression = (builder: StringBuilder, context: ParExpressionContext): void => {
        this.getContent(builder, context.LPAREN());
        this.processExpression(builder, context.expression());
        this.getContent(builder, context.RPAREN());
    };

    private processExpression = (builder: StringBuilder, context: ExpressionContext): void => {
        const firstChild = context.getChild(0);
        if (firstChild instanceof TerminalNode) {
            switch (firstChild.symbol.type) {
                case JavaLexer.NEW: {
                    this.getContent(builder, context.NEW());
                    this.processCreator(builder, context.creator());

                    break;
                }

                case JavaLexer.LPAREN: { // A type cast.
                    const leftWs = this.getLeadingWhiteSpaces(context.LPAREN());
                    const left = new StringBuilder();
                    this.getContent(left, context.LPAREN());

                    const type = new StringBuilder();
                    context.annotation().forEach((annotation) => {
                        this.processAnnotation(type, annotation);
                    });

                    context.typeType().forEach((child) => {
                        // This will automatically include embedded & chars.
                        this.processTypeType(type, child);
                    });

                    // Replace casts that can be better expressed.
                    switch (type.text) {
                        case "string": {
                            const rightWs = this.getLeadingWhiteSpaces(context.RPAREN());
                            const expression = new StringBuilder();
                            this.processExpression(expression, context.expression(0));
                            builder.append(leftWs, "String(", expression, ")", rightWs);

                            break;
                        }

                        case "number": {
                            const rightWs = this.getLeadingWhiteSpaces(context.RPAREN());
                            const expression = new StringBuilder();
                            this.processExpression(expression, context.expression(0));
                            builder.append(leftWs, "Number(", expression, ")", rightWs);

                            break;
                        }

                        default: {
                            const temp = new StringBuilder();
                            this.getContent(temp, context.RPAREN());
                            builder.append(leftWs, left, type, temp);
                            this.processExpression(builder, context.expression(0));

                            break;
                        }
                    }

                    break;
                }

                default: {
                    // eslint-disable-next-line no-underscore-dangle
                    if (context._prefix) {
                        this.processExpression(builder, context.expression(0));
                    } else {
                        this.getContent(builder, context);
                    }
                }
            }
        } else {
            const firstChild = context.getChild(0) as ParserRuleContext;
            switch (firstChild.ruleIndex) {
                case JavaParser.RULE_primary: {
                    this.processPrimary(builder, context.primary());
                    break;
                }

                case JavaParser.RULE_expression: {
                    this.processExpression(builder, context.expression(0));

                    // eslint-disable-next-line no-underscore-dangle
                    const operator = context._bop;
                    if (operator) {
                        switch (operator.type) {
                            case JavaLexer.INSTANCEOF: {
                                this.processTypeType(builder, context.typeType(0));
                                break;
                            }

                            case JavaLexer.DOT: {
                                if (context.getChild(2) instanceof TerminalNode) {
                                    const node = context.getChild(2) as TerminalNode;
                                    switch (node.symbol.type) {
                                        case JavaLexer.IDENTIFIER:
                                        case JavaLexer.THIS: {
                                            this.getContent(builder, node);
                                            break;
                                        }

                                        case JavaLexer.NEW: {
                                            if (context.nonWildcardTypeArguments()) {
                                                this.processNonWildcardTypeArguments(builder,
                                                    context.nonWildcardTypeArguments());
                                            }
                                            this.processInnerCreator(builder, context.innerCreator());

                                            break;
                                        }

                                        case JavaLexer.SUPER: {
                                            this.processSuperSuffix(builder, context.superSuffix());
                                            break;
                                        }

                                        default: {
                                            break;
                                        }
                                    }
                                } else {
                                    this.getContent(builder, context.DOT());
                                    if (context.methodCall()) {
                                        const temp = new StringBuilder();
                                        const ws = this.getLeadingWhiteSpaces(context.methodCall());
                                        this.processMethodCall(temp, context.methodCall());
                                        builder.append(ws, this.checkTypeNameOrApiCall(temp.text));
                                    } else {
                                        this.processExplicitGenericInvocation(builder,
                                            context.explicitGenericInvocation());
                                    }
                                }

                                break;
                            }

                            case JavaLexer.LBRACK: {
                                this.processExpression(builder, context.expression(0));
                                this.processExpression(builder, context.expression(1));
                                this.getContent(builder, context.RBRACK());

                                break;
                            }

                            default: {
                                // A binary expression (or trinary in case of the ?: statement);
                                // Replace certain comparison operators with the safe type.
                                let usedOperator = operator.text;
                                if (operator.type === JavaLexer.EQUAL) {
                                    usedOperator = "===";
                                } else if (operator.type === JavaLexer.NOTEQUAL) {
                                    usedOperator = "!==";
                                }
                                builder.append(this.getLeadingWhiteSpaces(context.getChild(1) as TerminalNode));
                                builder.append(usedOperator);

                                this.processExpression(builder, context.expression(1));

                                if (operator.type === JavaLexer.QUESTION) {
                                    this.processExpression(builder, context.expression(2));
                                }
                                break;
                            }
                        }

                    }

                    break;
                }

                case JavaParser.RULE_methodCall: {
                    if (context.methodCall().IDENTIFIER()) {
                        const qualifier = this.packageSource.symbolTable
                            .getSymbolQualifier(context, context.methodCall().IDENTIFIER().text);
                        builder.append(this.getLeadingWhiteSpaces(context.methodCall()));
                        builder.append(qualifier);
                    }

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
                        this.getContent(builder, context.IDENTIFIER());
                    } else {
                        this.getContent(builder, context.NEW());
                    }

                    break;
                }

                case JavaParser.RULE_classType: {
                    // Method reference.
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
    };

    private processExplicitGenericInvocation = (builder: StringBuilder,
        context: ExplicitGenericInvocationContext): void => {
        this.getContent(builder, context);
    };

    private processSuperSuffix = (builder: StringBuilder, context: SuperSuffixContext): void => {
        if (context.arguments()) {
            this.processArguments(builder, context.arguments());
        } else {
            this.getContent(builder, context);
        }
    };

    private processNonWildcardTypeArguments = (builder: StringBuilder, context:
    NonWildcardTypeArgumentsContext): void => {
        this.processTypeList(builder, context.typeList());
        this.getContent(builder, context.GT());
    };

    private processInnerCreator = (builder: StringBuilder, context: InnerCreatorContext): void => {
        if (context.nonWildcardTypeArgumentsOrDiamond()) {
            this.processNonWildcardTypeArgumentsOrDiamond(builder, context.nonWildcardTypeArgumentsOrDiamond());
        }
        this.processClassCreatorRest(builder, context.classCreatorRest());
    };

    private processClassCreatorRest = (builder: StringBuilder, context: ClassCreatorRestContext): void => {
        this.processArguments(builder, context.arguments());

        if (context.classBody()) {
            this.processClassBody(builder, context.classBody());
        }
    };

    private processArguments = (builder: StringBuilder, context: ArgumentsContext): void => {
        if (context.expressionList()) {
            this.processExpressionList(builder, context.expressionList());
        } else {
            this.getContent(builder, context);
        }
    };

    private processNonWildcardTypeArgumentsOrDiamond = (builder: StringBuilder,
        context: NonWildcardTypeArgumentsOrDiamondContext): void => {
        if (context.nonWildcardTypeArguments()) {
            this.processNonWildcardTypeArguments(builder, context.nonWildcardTypeArguments());
        } else {
            this.getContent(builder, context);
        }
    };

    private processLambdaExpression = (builder: StringBuilder, context: LambdaExpressionContext): void => {
        this.processLambdaParameters(builder, context.lambdaParameters());
        builder.append(this.getLeadingWhiteSpaces(context.ARROW()));
        builder.append("=>");

        if (context.lambdaBody().expression()) {
            this.processExpression(builder, context.lambdaBody().expression());
        } else {
            this.processBlock(builder, context.lambdaBody().block());
        }
    };

    private processLambdaParameters = (builder: StringBuilder, context: LambdaParametersContext): void => {
        if (context.IDENTIFIER().length > 0) {
            context.IDENTIFIER().forEach((identifier) => {
                this.getContent(builder, identifier);
            });
        } else if (context.formalParameterList()) {
            this.processFormalParameterList(builder, context.formalParameterList());
        }

        if (context.RPAREN()) {
            this.getContent(builder, context.RPAREN());
        }
    };

    private processMethodCall = (builder: StringBuilder, context: MethodCallContext): void => {
        const firstChild = context.getChild(0) as TerminalNode;
        builder.append(this.getLeadingWhiteSpaces(firstChild));

        if (context.IDENTIFIER()) {
            builder.append(this.checkTypeNameOrApiCall(context.IDENTIFIER().text));
        } else {
            this.getContent(builder, firstChild);
        }

        this.getContent(builder, context.LPAREN());

        if (context.expressionList()) {
            this.processExpressionList(builder, context.expressionList());
        }

        this.getContent(builder, context.RPAREN());
    };

    private processExpressionList = (builder: StringBuilder, context: ExpressionListContext): void => {
        context.expression().forEach((expression) => {
            this.processExpression(builder, expression);
        });
    };

    private processCreator = (builder: StringBuilder, context: CreatorContext): void => {
        builder.append(this.getLeadingWhiteSpaces(context));

        if (context.nonWildcardTypeArguments()) {
            // Generic creator.
            this.processNonWildcardTypeArguments(builder, context.nonWildcardTypeArguments());
            this.processCreatedName(builder, context.createdName());
            this.processClassCreatorRest(builder, context.classCreatorRest());
        } else {
            // Non-generic creator.
            if (context.arrayCreatorRest()) {
                // Array initializer. Convert to a generic TS array creator. For now only one dimensional arrays.
                // Other creators are copied in original form.
                if (context.arrayCreatorRest().LBRACK().length === 1) {
                    const temp = new StringBuilder();
                    this.processCreatedName(temp, context.createdName());
                    builder.append(" Array<", temp, ">");

                    builder.append(this.getLeadingWhiteSpaces(context.arrayCreatorRest().LBRACK(0)));

                    if (context.arrayCreatorRest().expression().length > 0) {
                        // This specifies an array size.
                        temp.clear();
                        this.processExpression(temp, context.arrayCreatorRest().expression(0));
                        builder.append("(", temp, ")");
                    } else {
                        builder.append("()");
                    }

                    builder.append(this.getLeadingWhiteSpaces(context.arrayCreatorRest().RBRACK(0)));

                    if (context.arrayCreatorRest().arrayInitializer()) {
                        this.processArrayInitializer(builder, context.arrayCreatorRest().arrayInitializer());
                    }
                } else {
                    this.getContent(builder, context);
                }
            } else {
                this.processCreatedName(builder, context.createdName());
                this.processClassCreatorRest(builder, context.classCreatorRest());
            }
        }
    };

    private processCreatedName = (builder: StringBuilder, context: CreatedNameContext): void => {
        if (context.primitiveType()) {
            this.processPrimitiveType(builder, context.primitiveType());

            return;
        }

        let index = 0;
        while (index < context.childCount) {
            const identifier = context.getChild(index++) as TerminalNode;
            const ws = this.getLeadingWhiteSpaces(identifier);
            builder.append(`${ws}${this.checkTypeNameOrApiCall(identifier.text)}`);

            if (index === context.childCount) {
                break;
            }

            if (context.getChild(index) instanceof ParserRuleContext) {
                const args = context.getChild(index++) as TypeArgumentsOrDiamondContext;
                builder.append(this.getLeadingWhiteSpaces(args));
                if (args.text !== "<>") { // Using .text here, as that leaves out all white spaces.
                    this.processTypeArguments(builder, args.typeArguments());
                }
            }
        }

    };

    private processPrimary = (builder: StringBuilder, context: PrimaryContext): void => {
        if (context.IDENTIFIER()) {
            const ws = this.getLeadingWhiteSpaces(context.IDENTIFIER());
            builder.append(ws);

            const name = context.IDENTIFIER().text;
            const qualifier = this.packageSource.symbolTable.getSymbolQualifier(context.parent, name);
            builder.append(qualifier);
            builder.append(name);
        } else {
            this.getContent(builder, context);
        }
    };

    private processStatement = (builder: StringBuilder, context: StatementContext): void => {
        let id: number;
        const firstChild = context.getChild(0);
        if (firstChild instanceof TerminalNode) {
            id = firstChild.symbol.type;
        } else {
            id = (firstChild as ParserRuleContext).ruleIndex;
        }

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
                this.processStatement(builder, context.statement(0));

                if (context.statement().length > 1) {
                    this.processStatement(builder, context.statement(1));
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
                this.getContent(builder, context.TRY());
                this.processBlock(builder, context.block());

                context.catchClause().forEach((clause) => {
                    this.processCatchClause(builder, clause);
                });

                if (context.finallyBlock()) {
                    this.processFinallyBlock(builder, context.finallyBlock());
                }

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
                this.getContent(builder, context.SYNCHRONIZED());
                this.processParExpression(builder, context.parExpression());
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
    };

    private processSwitchBlockStatementGroup = (builder: StringBuilder,
        context: SwitchBlockStatementGroupContext): boolean => {

        let hasDefault = false;
        context.switchLabel().forEach((label) => {
            hasDefault ||= this.processSwitchLabel(builder, label);
        });

        context.blockStatement().forEach((block) => {
            this.processBlockStatement(builder, block);
        });

        return hasDefault;
    };

    private processSwitchLabel = (builder: StringBuilder, context: SwitchLabelContext): boolean => {
        let hasDefault = false;
        if (context.DEFAULT()) {
            hasDefault = true;
            this.getContent(builder, context);
        } else if (context.expression()) {
            this.processExpression(builder, context.expression());
        } else {
            this.getContent(builder, context.IDENTIFIER());
        }

        this.getContent(builder, context.COLON());

        return hasDefault;
    };

    private processFinallyBlock = (builder: StringBuilder, context: FinallyBlockContext): void => {
        this.processBlock(builder, context.block());
    };

    private processCatchClause = (builder: StringBuilder, context: CatchClauseContext): void => {
        this.getContent(builder, context.LPAREN());
        context.variableModifier().forEach((modifier) => {
            this.processVariableModifier(builder, modifier);
        });

        const type = new StringBuilder();
        this.processCatchType(type, context.catchType());
        builder.append(this.checkExceptionType(type.text));

        const ws = this.getLeadingWhiteSpaces(context.IDENTIFIER());
        this.getContent(builder, context.IDENTIFIER());
        builder.append(":", ws, "unknown");
        this.processBlock(builder, context.block());
    };

    private processCatchType = (builder: StringBuilder, context: CatchTypeContext): void => {
        context.qualifiedName().forEach((name) => {
            this.getContent(builder, name);
        });
    };

    private processForControl = (builder: StringBuilder, context: ForControlContext): void => {
        if (context.enhancedForControl()) {
            this.processEnhancedForControl(builder, context.enhancedForControl());

            return;
        }

        if (context.forInit()) {
            this.processForInit(builder, context.forInit());
        }

        this.getContent(builder, context.SEMI(0));

        if (context.expression()) {
            this.processExpression(builder, context.expression());
        }

        this.getContent(builder, context.SEMI(1));

        if (context.expressionList()) {
            this.processExpressionList(builder, context.expressionList());
        }
    };

    private processForInit = (builder: StringBuilder, context: ForInitContext): void => {
        if (context.localVariableDeclaration()) {
            this.processLocalVariableDeclaration(builder, context.localVariableDeclaration());
        } else {
            this.processExpressionList(builder, context.expressionList());
        }
    };

    private processEnhancedForControl = (builder: StringBuilder, context: EnhancedForControlContext): void => {
        context.variableModifier().forEach((modifier) => {
            this.processVariableModifier(builder, modifier);
        });

        const temp = new StringBuilder();
        this.processTypeType(temp, context.typeType()); // Ignore the type.

        builder.append("let");
        this.processVariableDeclaratorId(builder, context.variableDeclaratorId());
        builder.append(this.getLeadingWhiteSpaces(context.COLON()) + "of");
        this.processExpression(builder, context.expression());
    };

    private processVariableDeclaratorId = (builder: StringBuilder, context: VariableDeclaratorIdContext): void => {
        this.getContent(builder, context);
    };

    private processLocalTypeDeclaration = (builder: StringBuilder, context: LocalTypeDeclarationContext): void => {
        this.getContent(builder, context, true);
    };

    private processTypeList = (builder: StringBuilder, context: TypeListContext): void => {
        let index = 0;
        while (true) {
            this.processTypeType(builder, context.getChild(index++) as TypeTypeContext);

            if (index === context.childCount) {
                break;
            }

            // Handle the comma.
            this.getContent(builder, context.getChild(index++) as TerminalNode, false);
        }
    };

    private processTypeTypeOrVoid = (builder: StringBuilder, context: TypeTypeOrVoidContext): void => {
        if (context.VOID()) {
            this.getContent(builder, context.VOID());
        } else {
            this.processTypeType(builder, context.typeType());
        }
    };

    private processTypeType = (builder: StringBuilder, context: TypeTypeContext): void => {
        builder.append(this.getLeadingWhiteSpaces(context));

        // Processing annotations here is a bit complicated, because there are two places where annotations
        // can appear, in 3 loops.
        let index = 0;
        while (context.getChild(index) instanceof AnnotationContext) {
            this.processAnnotation(builder, context.getChild(index) as AnnotationContext);
            ++index;
        }

        const child = context.getChild(index);
        if (child instanceof ClassOrInterfaceTypeContext) {
            const primitive = new StringBuilder();
            const ws = this.getLeadingWhiteSpaces(child);
            this.processClassOrInterfaceType(primitive, child);
            builder.append(ws, this.checkTypeNameOrApiCall(primitive.text));
        } else {
            this.processPrimitiveType(builder, context.getChild(index) as PrimitiveTypeContext);
        }
        ++index;

        while (index < context.childCount) {
            while (index < context.childCount && context.getChild(index) instanceof AnnotationContext) {
                this.processAnnotation(builder, context.getChild(index) as AnnotationContext);
                ++index;
            }

            // Optional square brackets.
            if (index < context.childCount - 1) {
                this.getContent(builder, context.getChild(index++) as TerminalNode);
                this.getContent(builder, context.getChild(index++) as TerminalNode);
            }
        }
    };

    private processClassType = (builder: StringBuilder, context: ClassTypeContext): void => {
        if (context.classOrInterfaceType()) {
            this.processClassOrInterfaceType(builder, context.classOrInterfaceType());
        }

        context.annotation().forEach((annotation) => {
            this.processAnnotation(builder, annotation);
        });

        if (context.typeArguments()) {
            this.processTypeArguments(builder, context.typeArguments());
        } else {
            this.getContent(builder, context.IDENTIFIER());
        }
    };

    private processClassOrInterfaceType = (builder: StringBuilder, context: ClassOrInterfaceTypeContext): void => {
        let index = 0;
        while (true) {
            const child = context.getChild(index++);

            builder.append(this.getLeadingWhiteSpaces(child as TerminalNode));
            const info = PackageSource.resolveType(child.text);
            if (info) {
                builder.append(info.qualifiedName);
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

    private processTypeArguments = (builder: StringBuilder, context: TypeArgumentsContext): void => {
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

    private processTypeArgument = (builder: StringBuilder, context: TypeArgumentContext): void => {
        builder.append(this.getLeadingWhiteSpaces(context));

        if (context.annotation().length > 0) {
            context.annotation().forEach((child) => {
                this.getContent(builder, child, true);
            });

            if (context.EXTENDS() || context.SUPER()) {
                if (context.EXTENDS()) {
                    this.getContent(builder, context.EXTENDS());
                } else {
                    this.getContent(builder, context.SUPER(), true);
                }
                this.processTypeType(builder, context.typeType());
            }
        } else if (context.typeType()) {
            this.getContent(builder, context.typeType());
        }
    };

    private processPrimitiveType = (builder: StringBuilder, context: PrimitiveTypeContext): void => {
        builder.append(this.getLeadingWhiteSpaces(context));

        if (context.BOOLEAN()) {
            builder.append("boolean");
        } else if (context.CHAR()) {
            builder.append("string");
        } else {
            builder.append("number");
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
    private getLeadingWhiteSpaces = (target: ParserRuleContext | TerminalNode): string => {
        const startIndex = target instanceof TerminalNode ? target.symbol.startIndex : target.start.startIndex;
        const stopIndex = target instanceof TerminalNode ? target.symbol.stopIndex : target.stop.stopIndex;
        const interval = Interval.of(this.whiteSpaceAnchor, startIndex - 1);
        this.whiteSpaceAnchor = stopIndex + 1;

        return this.packageSource.fileParseInfo.inputStream.getText(interval);
    };

    /**
     * Returns all white spaces (including comments) between the current white space anchor and the first character
     * covered by the target.
     * The white space anchor is then set to the position directly following the target.
     *
     * @param target A parse tree for which to return the leading white spaces.
     */
    private ignoreLeadingWhiteSpaces = (target: ParserRuleContext | TerminalNode): void => {
        this.getLeadingWhiteSpaces(target);
    };

    /**
     * Used for constructs that cannot be (fully) represented in Typescript or can simply be taken over as they are.
     *
     * @param builder The target buffer to add content to.
     * @param target A parse tree for which to get the content.
     * @param commented If true the target content is placed in a multi line comment.
     */
    private getContent = (builder: StringBuilder, target: ParserRuleContext | TerminalNode,
        commented = false): void => {
        const startIndex = target instanceof TerminalNode ? target.symbol.startIndex : target.start.startIndex;
        const stopIndex = target instanceof TerminalNode ? target.symbol.stopIndex : target.stop.stopIndex;
        const interval = Interval.of(startIndex, stopIndex);

        const ws = this.getLeadingWhiteSpaces(target);

        if (commented) {
            builder.append(ws, "/* ", this.packageSource.fileParseInfo.inputStream.getText(interval), " */");
        } else {
            builder.append(ws, this.packageSource.fileParseInfo.inputStream.getText(interval));
        }
    };

    /**
     * Ignore the content for the given target. It's usually replaced by something else or not handled at all.
     *
     * @param target A parse tree for which to get the content.
     */
    private ignoreContent = (target: ParserRuleContext | TerminalNode): void => {
        this.getContent(new StringBuilder(), target);
    };

    /**
     * Returns a range of text always commented.
     *
     * @param builder The target buffer to add content to.
     * @param start The context whose start index begins the range.
     * @param stop  The context whose stop index ends the range.
     */
    private getRangeCommented = (builder: StringBuilder, start: ParserRuleContext | TerminalNode,
        stop: ParserRuleContext | TerminalNode): void => {
        const startIndex = start instanceof TerminalNode ? start.symbol.startIndex : start.start.startIndex;
        const stopIndex = stop instanceof TerminalNode ? stop.symbol.stopIndex : stop.stop.stopIndex;
        const interval = Interval.of(startIndex, stopIndex);

        const ws = this.getLeadingWhiteSpaces(start);

        builder.append(`${ws}/* ${this.packageSource.fileParseInfo.inputStream.getText(interval)} */`);
    };

    /**
     * Checks the given type name or API call if it corresponds to certain names we can handle.
     * If specific imports are required then they are recorded here.
     *
     * @param name The name of the type to check.
     *
     * @returns Either a replacement for the given name or the name itself.
     */
    private checkTypeNameOrApiCall = (name: string): string => {
        // Next is types which just have different names but the same functionality.
        const replacement = FileProcessor.typeMap.get(name);
        if (replacement) {
            return replacement;
        }

        if (name === "put") {
            return "set";
        }

        if (name.startsWith("java.lang.")) {
            return name.substring(10);
        }

        if (name.startsWith("lang.")) {
            return name.substring(5);
        }

        // Here also types that require certain imports.
        if (name.indexOf("String.format") > -1) {
            this.stringSupport.add("StringBuilder");

            return name.replace(/String\.format/g, "StringBuilder.format");
        }

        if (name.indexOf("Character.") > -1) {
            this.stringSupport.add("Character");
        } else if (name.indexOf(" Integer.") > -1) {
            this.stringSupport.add("Integer");
        } else if (name.indexOf(".length()") > -1) {
            return name.replace(/\.length\(\)/g, ".length");
        } else if (name === "StringBuilder") {
            this.stringSupport.add("StringBuilder");
        } else if (name.startsWith("LinkedHashMap")) {
            this.containerSupport.add("LinkedHashMap");
        } else if (FileProcessor.knownExceptions.has(name)) {
            this.exceptionSupport.add(name);
        }

        return name;
    };

    private checkExceptionType = (name: string): string => {
        this.checkTypeNameOrApiCall(name);

        return name;
    };

    private constructModifierString = (modifierInfo: IModifierInfo, context: RelatedElement): void => {
        if (modifierInfo.isFinal) {
            if (context === RelatedElement.Class) {
                // Commented for now. It's not possible to use decorators and `this` for static initializers
                // at the same time.
                //this.needDecorators = true;
                modifierInfo.text.append("/* @final */\n");
            }
        }

        const useExport = context === RelatedElement.Class || context === RelatedElement.Interface
            || context === RelatedElement.Enum;
        if (modifierInfo.isPublic) {
            modifierInfo.text.append(useExport ? "export " : "public ");
        } else if (modifierInfo.isProtected) {
            modifierInfo.text.append("protected ");
        } else if (modifierInfo.isPrivate) {
            modifierInfo.text.append("private ");
        }

        if (modifierInfo.isStatic) {
            modifierInfo.text.append("static ");
        }

        if (modifierInfo.isAbstract) {
            modifierInfo.text.append("abstract ");
        }

        modifierInfo.text.append(modifierInfo.isFinal && context !== RelatedElement.Class ? "readonly " : "");
    };

    /**
     * Called when a class or interface body construction was finished. It takes all nested declarations for the
     * current type stack TOS and constructs a namespace declaration of it.
     * Also removes the TOS.
     *
     * @param doExport True if the new namespace must be exported.
     *
     * @returns A string containing the new namespace declaration.
     */
    private processNestedContent = (doExport: boolean): StringBuilder => {
        const result = new StringBuilder();

        const classInfo = this.typeStack.pop();
        if (classInfo.nestedDeclarations.buffer.length > 0) {
            result.append("\n\n");
            result.append((doExport ? "export " : "") + "namespace ");
            result.append(classInfo.name, " {\n");
            result.append(classInfo.nestedDeclarations, "}\n\n");
        }

        return result;
    };
}
