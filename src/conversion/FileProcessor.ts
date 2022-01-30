/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { ParserRuleContext } from "antlr4ts";
import { Interval } from "antlr4ts/misc/";
import { ParseTree, TerminalNode } from "antlr4ts/tree";
import fs from "fs";
import path from "path";

import { StringBuilder } from "../../lib/java/lang";

import { JavaLexer } from "../../java/generated/JavaLexer";
import {
    AnnotationContext, AnnotationTypeDeclarationContext, ArgumentsContext, ArrayInitializerContext, BlockContext,
    BlockStatementContext, CatchClauseContext, CatchTypeContext, ClassBodyContext, ClassBodyDeclarationContext,
    ClassCreatorRestContext, ClassDeclarationContext, ClassOrInterfaceModifierContext, ClassOrInterfaceTypeContext,
    ClassTypeContext, CompilationUnitContext, ConstantDeclaratorContext, ConstDeclarationContext,
    ConstructorDeclarationContext, CreatedNameContext, CreatorContext, EnhancedForControlContext, EnumConstantContext,
    EnumConstantsContext, EnumDeclarationContext, ExplicitGenericInvocationContext,
    ExplicitGenericInvocationSuffixContext, ExpressionContext, ExpressionListContext, FieldDeclarationContext,
    FinallyBlockContext, ForControlContext, ForInitContext, FormalParameterContext, FormalParameterListContext,
    FormalParametersContext, GenericConstructorDeclarationContext, GenericInterfaceMethodDeclarationContext,
    GenericMethodDeclarationContext, InnerCreatorContext, InterfaceBodyContext, InterfaceBodyDeclarationContext,
    InterfaceDeclarationContext, InterfaceMemberDeclarationContext, InterfaceMethodDeclarationContext,
    InterfaceMethodModifierContext, JavaParser, LambdaExpressionContext, LambdaParametersContext,
    LastFormalParameterContext, LiteralContext, LocalTypeDeclarationContext,
    LocalVariableDeclarationContext, MemberDeclarationContext, MethodBodyContext, MethodCallContext,
    MethodDeclarationContext, ModifierContext, NonWildcardTypeArgumentsContext,
    NonWildcardTypeArgumentsOrDiamondContext, ParExpressionContext, PrimaryContext, PrimitiveTypeContext,
    StatementContext, SuperSuffixContext, SwitchBlockStatementGroupContext, SwitchLabelContext, TypeArgumentContext,
    TypeArgumentsContext, TypeArgumentsOrDiamondContext, TypeBoundContext, TypeDeclarationContext, TypeListContext,
    TypeParameterContext, TypeParametersContext, TypeTypeContext, TypeTypeOrVoidContext, VariableDeclaratorContext,
    VariableDeclaratorIdContext, VariableDeclaratorsContext, VariableInitializerContext, VariableModifierContext,
} from "../../java/generated/JavaParser";

import { PackageSource } from "../PackageSource";
import { PackageSourceManager } from "../PackageSourceManager";
import { IClassResolver, IConverterConfiguration } from "./JavaToTypeScript";
import { Stack } from "../../lib/java/util";
import { ClassSymbol, InterfaceSymbol } from "antlr4-c3";
import { EnumSymbol } from "../parsing/JavaParseTreeWalker";
import { ImportSymbol } from "../parsing/ImportSymbol";

enum Modifier {
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
}

enum RelatedElement {
    Class,
    Method,
    Enum,
    Interface,
    File,
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

    private whiteSpaceAnchor = 0;

    private needDecorators?: boolean;

    // Keeps names of classes for which inner processing is going on. Sometimes it is necessary to know the name
    // for special processing (e.g. auto creating static initializer functions).
    private typeStack: Stack<ITypeInfo> = new Stack();

    // A list of strings that must be added at the end of the generated file (usually for static initialization).
    private initializerCalls: string[] = [];

    private classResolver: Map<string, IClassResolver>;

    // Nested symbols from this file.
    private localSymbols = new Map<string, string>();

    // The class that were resolved by the class resolver and must be listed in the imports.
    private resolvedClasses = new Set<string>();

    // The list of sources that were included by this file.
    private imports = new Set<PackageSource>();

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
        if (fs.existsSync(this.source.targetFile)) {
            // If the target file already exists, check if it is marked to keep it (not overwrite).
            const stream = fs.createReadStream(this.source.targetFile, { encoding: "utf-8", start: 0, end: 18 });
            const firstByte = await stream[Symbol.asyncIterator]().next();
            if (firstByte.value === "/* java2ts: keep */") {
                console.log(`Keeping ${this.source.targetFile}`);

                return;
            }
        }

        if (this.source.parseTree) {
            process.stdout.write(`Converting: ${this.source.sourceFile}...`);

            // Collect nested object definitions for name resolution.
            const symbols = this.source.symbolTable.getAllNestedSymbolsSync();
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

            // Collect all imported package sources.
            const importSymbols = this.source.symbolTable.getNestedSymbolsOfTypeSync(ImportSymbol);
            importSymbols.forEach((symbol) => {
                symbol.importedSources.forEach((source) => {
                    this.imports.add(source);
                });
            });

            let fileMatched = true;
            if (this.configuration.debug?.pathForPosition.filePattern) {
                fileMatched = this.source.sourceFile.match(
                    this.configuration.debug.pathForPosition.filePattern) !== null;
            }

            if (this.configuration.debug?.pathForPosition && fileMatched) {
                this.source.printParseTreeForPosition(this.configuration.debug.pathForPosition.position);
            }

            const libPath = path.relative(path.dirname(this.source.targetFile), this.configuration.options.lib ?? "./");
            const builder = new StringBuilder();
            this.processCompilationUnit(builder, this.source.targetFile, libPath, this.source.parseTree);

            fs.mkdirSync(path.dirname(this.source.targetFile), { recursive: true });
            fs.writeFileSync(this.source.targetFile, builder.buffer);

            console.log(" done");
        } else {
            console.log(`Ignoring: ${this.source.sourceFile}`);
        }
    };

    private processCompilationUnit = (builder: StringBuilder, target: string, libPath: string,
        context: CompilationUnitContext): void => {
        this.typeStack.push({
            name: "file",
            init: new StringBuilder(),
            nestedDeclarations: new StringBuilder(),
        });

        const firstChild = context.getChild(0);
        const header = new StringBuilder();
        if (firstChild instanceof ParserRuleContext) {
            header.append(this.getLeadingWhiteSpaces(firstChild));

            if (this.configuration.options.prefix) {
                header.append(this.configuration.options.prefix);
            }

            if (context.packageDeclaration()) {
                this.ignoreContent(context.packageDeclaration());
            }

            context.importDeclaration().forEach((entry, index) => {
                if (index === 0) {
                    header.append(this.getLeadingWhiteSpaces(entry));
                }

                const packageId = entry.qualifiedName().text;
                const sources = PackageSourceManager.fromPackageId(packageId, this.configuration.packageRoot,
                    entry.MUL() !== undefined);
                sources.forEach((source) => {
                    return this.imports.add(source);
                });

                this.ignoreContent(entry);
            });

            this.processTypeDeclaration(builder, context.typeDeclaration());
            builder.append(this.typeStack.tos.nestedDeclarations);

            this.imports.forEach((source) => {
                const info = source.getImportInfo(target);
                if (info[0].length > 0) {
                    header.appendLine(`import { ${info[0].join(",")} } from "${info[1]}";`);
                }
            });

            // Class mappings. These can contain multiple entries that are loaded from the same module, so we have
            // to group by import path and create an import list from the types we collected per import.
            const consolidatedImports = new Map<string, string[]>();
            this.resolvedClasses.forEach((entry) => {
                const resolver = this.classResolver.get(entry);
                const importEntry = consolidatedImports.get(resolver.importPath);

                const importName = entry + (resolver.alias ? " as " + resolver.alias : "");
                if (importEntry) {
                    importEntry.push(importName);
                } else {
                    consolidatedImports.set(resolver.importPath, [importName]);
                }
            });

            consolidatedImports.forEach((entry, key) => {
                header.appendLine(`import { ${entry.join(", ")} } from "${key}";`);
            });

            header.append("\n");
        }

        this.getContent(builder, context.EOF());

        header.append("\n");
        if (this.needDecorators) {
            const decorators = path.join(libPath, "Decorators");
            header.append(`${this.getLeadingWhiteSpaces(context)}import { final } from "${decorators}";\n`);
        }

        if (this.initializerCalls.length > 0) {
            builder.append("\n\n");
            this.initializerCalls.forEach((call) => {
                builder.append(call + "\n");
            });
        }

        builder.prepend(header);
    };

    private processTypeDeclaration = (builder: StringBuilder, list: TypeDeclarationContext[]): void => {
        list.forEach((context) => {
            let doExport = false;
            let hasVisibility = false;
            context.classOrInterfaceModifier().forEach((context) => {
                switch (this.processClassOrInterfaceModifier(builder, context, RelatedElement.File)) {
                    case Modifier.Public: {
                        doExport = true;
                        hasVisibility = true;
                        break;
                    }

                    case Modifier.Protected:
                    case Modifier.Private: {
                        hasVisibility = true;
                        break;
                    }

                    default:
                }
            });

            if (!hasVisibility) {
                // No modifier means: export.
                builder.append("export ");
                doExport = true;
            }

            if (context.classDeclaration()) {
                this.processClassDeclaration(builder, context.classDeclaration(), doExport);
            } else if (context.enumDeclaration()) {
                this.processEnumDeclaration(builder, context.enumDeclaration(), doExport);
            } else if (context.interfaceDeclaration()) {
                this.processInterfaceDeclaration(builder, context.interfaceDeclaration(), doExport);
            } else { // annotationTypeDeclaration
                this.getContent(builder, context, true);
            }
        });
    };

    private processClassOrInterfaceModifier = (builder: StringBuilder,
        context: ClassOrInterfaceModifierContext, parentType: RelatedElement): Modifier => {

        let result = Modifier.None;

        const element = context.getChild(0);
        if (element instanceof TerminalNode) {
            builder.append(this.getLeadingWhiteSpaces(element));

            switch (element.symbol.type) {
                case JavaParser.PUBLIC: {
                    result = Modifier.Public;
                    if (parentType === RelatedElement.File) {
                        this.ignoreContent(element);
                        builder.append("export ");
                    } else {
                        this.getContent(builder, element);
                    }

                    break;
                }

                case JavaParser.PROTECTED: {
                    result = Modifier.Protected;
                    this.getContent(builder, element);

                    break;
                }

                case JavaParser.PRIVATE: {
                    result = Modifier.Private;
                    this.getContent(builder, element);

                    break;
                }

                case JavaParser.STATIC:
                case JavaParser.ABSTRACT: {
                    this.getContent(builder, element);

                    break;
                }

                default: {
                    this.ignoreContent(element);

                    break;
                }
            }
        } else if (this.configuration.options.convertAnnotations) {
            this.processAnnotation(builder, context.annotation());
        } else {
            this.ignoreContent(context.annotation());
        }

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

        // JS/TS can extend only a single class, but implement multiple classes. Due to the fact that we have to convert
        // Java interfaces to (abstract) classes in TS, we have a problem with inheritance then, if we would generally
        // convert the `implements` clause to `extends`.
        // Fortunately, TS allows that a class implements a class (not only interfaces), which is what we use here.
        // Sometimes this causes extra work after conversion, so we check the special case that a class only implements
        // one interface and extends no other class, in which case we can convert the `implements` clause to `extends`.
        if (context.EXTENDS()) {
            this.getContent(localBuilder, context.EXTENDS());
            this.processTypeType(localBuilder, context.typeType());
        }

        if (context.IMPLEMENTS()) {
            if (!context.EXTENDS() && context.typeList().typeType().length === 1) {
                localBuilder.append(this.getLeadingWhiteSpaces(context.IMPLEMENTS()), "extends ");
                this.processTypeList(localBuilder, context.typeList());
            } else {
                this.getContent(localBuilder, context.IMPLEMENTS());
                this.processTypeList(localBuilder, context.typeList());
            }
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

        if (this.typeStack.tos.init.length > 0) {
            // Instance initializer code was found. Add it to a dummy constructor, which the user has to merge
            // manually with other constructors.
            builder.append("\npublic constructor() {\n// auto generated for instance initializer code\nsuper();\n",
                this.typeStack.tos.init, "\n}\n");

            this.typeStack.tos.init.clear();
        }

        this.getContent(builder, context.RBRACE());
    };

    private processClassBodyDeclaration = (builder: StringBuilder,
        list: ClassBodyDeclarationContext[]): void => {
        list.forEach((context) => {
            if (context.SEMI()) {
                // Empty body.
                this.getContent(builder, context, true);
            } else if (context.block()) {
                // Static or instance initializer.
                if (context.STATIC()) {
                    const typeInfo = this.typeStack.tos;

                    builder.append(this.getLeadingWhiteSpaces(context.STATIC()));
                    builder.append(`public static initialize${typeInfo.name}(): void`);
                    this.processBlock(builder, context.block());

                    // Add a call to this special function at the end of the file.
                    this.initializerCalls.push(`${typeInfo.name}.initialize${typeInfo.name}();`);
                } else {
                    // Code in instance initializers is added to the class' constructor.
                    this.ignoreContent(context.block().LBRACE());
                    context.block().blockStatement().forEach((statement) => {
                        this.processBlockStatement(this.typeStack.tos.init, statement);
                    });
                    this.ignoreContent(context.block().RBRACE());
                }
            } else {
                let hasVisibility = false;
                const modifierBuilder = new StringBuilder();
                context.modifier().forEach((context) => {
                    switch (this.processModifier(modifierBuilder, context)) {
                        case Modifier.Public:
                        case Modifier.Protected:
                        case Modifier.Private: {
                            hasVisibility = true;

                            break;
                        }

                        default:
                    }
                });

                if (!hasVisibility) {
                    // No modifier means: public.
                    modifierBuilder.append("public");
                    builder.append(this.getLeadingWhiteSpaces(context.memberDeclaration()));
                }

                const declaration = new StringBuilder();
                this.processMemberDeclaration(declaration, context.memberDeclaration(), modifierBuilder.text);

                if (declaration.length > 0) {
                    // The declaration is empty if it was converted to a (nested) namespace.
                    builder.append(modifierBuilder, declaration);
                }
            }
        });
    };

    private processModifier = (builder: StringBuilder, context: ModifierContext): Modifier => {
        builder.append(this.getLeadingWhiteSpaces(context));

        let result = Modifier.None;
        if (context.classOrInterfaceModifier()) {
            result = this.processClassOrInterfaceModifier(builder, context.classOrInterfaceModifier(),
                RelatedElement.Class);
        } else {
            this.ignoreContent(context);
        }

        return result;
    };

    private processMemberDeclaration = (builder: StringBuilder, context: MemberDeclarationContext,
        modifier: string): void => {
        const firstChild = context.getChild(0) as ParserRuleContext;
        switch (firstChild.ruleIndex) {
            case JavaParser.RULE_methodDeclaration: {
                return this.processMethodDeclaration(builder, context.methodDeclaration());
            }

            case JavaParser.RULE_genericMethodDeclaration: {
                return this.processGenericMethodDeclaration(builder, context.genericMethodDeclaration());
            }

            case JavaParser.RULE_fieldDeclaration: {
                return this.processFieldDeclaration(builder, context.fieldDeclaration(), modifier);
            }

            case JavaParser.RULE_constructorDeclaration: {
                return this.processConstructorDeclaration(builder, context.constructorDeclaration());
            }

            case JavaParser.RULE_genericConstructorDeclaration: {
                return this.processGenericConstructorDeclaration(builder, context.genericConstructorDeclaration());
            }

            case JavaParser.RULE_interfaceDeclaration: {
                return this.processInterfaceDeclaration(builder, context.interfaceDeclaration(),
                    modifier.endsWith("public"));
            }

            case JavaParser.RULE_annotationTypeDeclaration: {
                return this.processAnnotationTypeDeclaration(builder, context.annotationTypeDeclaration());
            }

            case JavaParser.RULE_classDeclaration: {
                return this.processClassDeclaration(builder, context.classDeclaration(), modifier.endsWith("public"));
            }

            case JavaParser.RULE_enumDeclaration: {
                return this.processEnumDeclaration(builder, context.enumDeclaration(), modifier.endsWith("public"));
            }

            default:
        }
    };

    private processMethodDeclaration = (builder: StringBuilder, context: MethodDeclarationContext,
        genericParams?: StringBuilder): void => {
        const returnType = new StringBuilder();
        const isPrimitiveType = this.processTypeTypeOrVoid(returnType, context.typeTypeOrVoid());

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

        builder.append(":", returnType);
        if (!isPrimitiveType) {
            builder.append(" | undefined");
        }
        builder.append(" ", this.configuration.options.preferArrowFunctions ? "=>" : "");

        if (context.THROWS()) {
            this.ignoreContent(context.qualifiedNameList());
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

        const typeWs = this.getLeadingWhiteSpaces(context.typeType());

        const type = new StringBuilder();
        const isPrimitiveType = this.processTypeType(type, context.typeType());

        if (context instanceof LastFormalParameterContext) {
            context.annotation().forEach((annotation) => {
                this.processAnnotation(builder, annotation);
            });
            this.getContent(builder, context.ELLIPSIS());
        }

        const nameWs = this.getLeadingWhiteSpaces(context.variableDeclaratorId().IDENTIFIER());

        builder.append(typeWs);
        this.getContent(builder, context.variableDeclaratorId().IDENTIFIER());
        builder.append(":", nameWs);
        builder.append(type);
        if (!isPrimitiveType) {
            builder.append(" | undefined");
        }

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
        } else {
            this.getContent(builder, context.SEMI());
        }
    };

    private processGenericMethodDeclaration = (builder: StringBuilder,
        context: GenericMethodDeclarationContext): void => {
        const params = new StringBuilder();
        this.processTypeParameters(params, context.typeParameters());

        return this.processMethodDeclaration(builder, context.methodDeclaration(), params);
    };

    private processFieldDeclaration = (builder: StringBuilder, context: FieldDeclarationContext,
        modifier: string): void => {
        const type = new StringBuilder();
        const isPrimitiveType = this.processTypeType(type, context.typeType());
        this.processVariableDeclarators(builder, context.variableDeclarators(), type.text, modifier, !isPrimitiveType);
        this.getContent(builder, context.SEMI());
    };

    private processConstructorDeclaration = (builder: StringBuilder, context: ConstructorDeclarationContext): void => {
        builder.append(this.getLeadingWhiteSpaces(context.IDENTIFIER()) + "constructor");
        this.processFormalParameters(builder, context.formalParameters());

        if (context.THROWS()) {
            this.ignoreContent(context.qualifiedNameList());
        }

        // See if we should automatically add a call to super. Only if none exists yet and this class extends another.
        const info = this.source.resolveType(context.IDENTIFIER().text);
        let needSuperCall = false;
        if (info && info.symbol instanceof ClassSymbol) {
            if (info.symbol.extends.length > 0 || info.symbol.implements.length > 0) {
                needSuperCall = true;
                for (const blockStatement of context.block().blockStatement()) {
                    if (blockStatement.statement() && blockStatement.statement().expression().length > 0) {
                        const expression = blockStatement.statement().expression(0);
                        if (expression.methodCall()?.SUPER()) {
                            needSuperCall = false;

                            break;
                        }
                    }
                }
            }
        }

        this.processBlock(builder, context.block(), needSuperCall);
    };

    private processGenericConstructorDeclaration = (builder: StringBuilder,
        context: GenericConstructorDeclarationContext): void => {

        // Constructors cannot have type parameters.
        this.getContent(builder, context.typeParameters(), true);
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
        localBuilder.append("abstract class");
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
            this.typeStack.tos.nestedDeclarations.append(nested, localBuilder);
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
            let hasVisibility = false;
            const modifierBuilder = new StringBuilder();
            context.modifier().forEach((context) => {
                switch (this.processModifier(modifierBuilder, context)) {
                    case Modifier.Public:
                    case Modifier.Protected:
                    case Modifier.Private: {
                        hasVisibility = true;
                        break;
                    }

                    default:
                }
            });

            if (!hasVisibility) {
                // No modifier means: public.
                modifierBuilder.append("public");
                builder.append(this.getLeadingWhiteSpaces(context.interfaceMemberDeclaration()));
            }

            const declaration = new StringBuilder();
            this.processInterfaceMemberDeclaration(declaration, context.interfaceMemberDeclaration(),
                modifierBuilder.text);

            if (declaration.length > 0) {
                // The declaration is empty if it was converted to a (nested) namespace.
                builder.append(modifierBuilder, declaration);
            }
        }
    };

    private processInterfaceMemberDeclaration = (builder: StringBuilder, context: InterfaceMemberDeclarationContext,
        modifier: string): void => {
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
                this.processInterfaceDeclaration(builder, firstChild as InterfaceDeclarationContext,
                    modifier.endsWith("public"));

                break;
            }

            case JavaParser.RULE_annotationTypeDeclaration: {
                this.processAnnotationTypeDeclaration(builder, firstChild as AnnotationTypeDeclarationContext);

                break;
            }

            case JavaParser.RULE_classDeclaration: {
                this.processClassDeclaration(builder, firstChild as ClassDeclarationContext,
                    modifier.endsWith("public"));

                break;
            }

            case JavaParser.RULE_enumDeclaration: {
                this.processEnumDeclaration(builder, firstChild as EnumDeclarationContext, modifier.endsWith("public"));

                break;
            }

            default:
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
        let index = 0;

        let child = context.getChild(index++);
        const ws = this.getLeadingWhiteSpaces(child as ParserRuleContext);
        if (child instanceof InterfaceMethodModifierContext) {
            const list = context.interfaceMethodModifier();
            this.getRangeCommented(builder, list[0], list[list.length - 1]);

            index += list.length;

            child = context.getChild(index++);
        }

        const type = new StringBuilder();
        if (child instanceof TypeTypeOrVoidContext) {
            this.processTypeTypeOrVoid(type, child);
        } else {
            this.processTypeParameters(type, child as TypeParametersContext);

            child = context.getChild(index++);
            if (child instanceof AnnotationContext) {
                const list = context.annotation();
                list.forEach((annotation) => {
                    this.processAnnotation(type, annotation);
                });

                index += list.length;

                child = context.getChild(index++);
            }

            this.processTypeTypeOrVoid(type, child as TypeTypeOrVoidContext);
        }

        builder.append(ws);

        const isAbstract = context.methodBody().SEMI() !== void 0;
        if (isAbstract) {
            builder.append("abstract ");
        }

        this.getContent(builder, context.IDENTIFIER());
        if (this.configuration.options.preferArrowFunctions) {
            builder.append(isAbstract ? ": " : " = ");
        }
        this.processFormalParameters(builder, context.formalParameters());

        // For old style square brackets (after the method parameters) collect them and add them to the type.
        context.RBRACK().forEach((bracket) => {
            this.getContent(type, bracket);
        });

        if (context.THROWS()) {
            this.ignoreContent(context.qualifiedNameList());
        }

        builder.append(this.configuration.options.preferArrowFunctions ? " => " : ": ", type);

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
        this.getContent(builder, context, true); // Not supported in TS.
    };

    private processEnumDeclaration = (builder: StringBuilder, context: EnumDeclarationContext,
        doExport: boolean): void => {
        // Enum declarations always must be moved to an outer namespace.
        const localBuilder = new StringBuilder();
        this.getContent(localBuilder, context.IDENTIFIER());

        if (context.IMPLEMENTS()) {
            this.getRangeCommented(localBuilder, context.IMPLEMENTS(), context.typeList());
        }

        this.getContent(localBuilder, context.LBRACE());
        if (context.enumConstants()) {
            this.processEnumConstants(localBuilder, context.enumConstants());
        }

        if (context.COMMA()) {
            this.getContent(localBuilder, context.COMMA());
        }

        if (context.enumBodyDeclarations()) {
            this.getContent(localBuilder, context.enumBodyDeclarations(), true);
        }

        this.getContent(localBuilder, context.RBRACE());
        this.typeStack.tos.nestedDeclarations.append(doExport ? "export " : "", localBuilder);
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

    private processBlock = (builder: StringBuilder, context: BlockContext, addSuperCall = false): void => {
        this.getContent(builder, context.LBRACE());

        if (addSuperCall) {
            // This flag is set when we come here from a constructor declaration and did not find
            // an existing `super()` call.
            if (context.blockStatement().length > 0) {
                builder.append(this.getLeadingWhiteSpaces(context.blockStatement(0)));
            } else {
                builder.append(this.getLeadingWhiteSpaces(context.RBRACE()));
            }
            builder.append("super();\n");
        }

        context.blockStatement().forEach((child) => {
            this.processBlockStatement(builder, child);
        });

        this.getContent(builder, context.RBRACE());
    };

    private processBlockStatement = (builder: StringBuilder, context: BlockStatementContext): void => {
        if (context.localVariableDeclaration()) {
            this.processLocalVariableDeclaration(builder, context.localVariableDeclaration());
            this.getContent(builder, context.SEMI());
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

        this.processVariableDeclarators(builder, context.variableDeclarators(), typeString, "", false);
    };

    private processVariableModifier = (builder: StringBuilder, context: VariableModifierContext): void => {
        if (context.FINAL()) {
            builder.append(this.getLeadingWhiteSpaces(context.FINAL()) + "readonly");
        }

        this.getContent(builder, context, true);
    };

    private processVariableDeclarators = (builder: StringBuilder, context: VariableDeclaratorsContext,
        type: string, modifier: string, makeOptional: boolean): void => {
        let index = 0;

        while (true) {
            const child = context.getChild(index++);

            this.processVariableDeclarator(builder, child as VariableDeclaratorContext, type, makeOptional);
            if (index === context.childCount) {
                break;
            }

            // Separate each declarator and add type and modifier again.
            const comma = context.getChild(index++) as TerminalNode;
            builder.append(";", this.getLeadingWhiteSpaces(comma), "\n", modifier);
            this.ignoreContent(comma);
        }
    };

    private processVariableDeclarator = (builder: StringBuilder, context: VariableDeclaratorContext,
        type: string, makeOptional): void => {
        const ws = this.getLeadingWhiteSpaces(context.variableDeclaratorId());

        const localBuilder = new StringBuilder();
        this.getContent(localBuilder, context.variableDeclaratorId().IDENTIFIER());
        const name = localBuilder.text;

        if (context.parent.parent instanceof LocalVariableDeclarationContext) {
            builder.append("let ");
        }

        if (this.configuration.options.ignoreExplicitTypeForInitializers && context.ASSIGN()) {
            builder.append(`${ws}${name}`);
        } else {
            builder.append(`${ws}${name}${makeOptional ? "?" : ""}: ${type}`);
        }

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
            this.processExpression(builder, context.expression());
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
                    builder.append(this.getLeadingWhiteSpaces(context.NEW()));
                    this.ignoreContent(context.NEW());

                    const temp = new StringBuilder();
                    const useNew = this.processCreator(temp, context.creator());
                    builder.append(useNew ? "new " : "", temp);

                    break;
                }

                case JavaLexer.LPAREN: { // A type cast.
                    const leftWs = this.getLeadingWhiteSpaces(context.LPAREN());
                    this.ignoreContent(context.LPAREN());

                    const type = new StringBuilder();
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
                    switch (type.text) {
                        case "string": {
                            const expression = new StringBuilder();
                            this.processExpression(expression, context.expression(0));
                            builder.append(leftWs, "String(", expression, ")", rightWs);

                            break;
                        }

                        case "number": {
                            const expression = new StringBuilder();
                            this.processExpression(expression, context.expression(0));
                            builder.append(leftWs, "Number(", expression, ")", rightWs);

                            break;
                        }

                        default: {
                            const temp = new StringBuilder();
                            builder.append(leftWs);
                            this.processExpression(builder, context.expression(0));
                            builder.append(temp, " as ", type);

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
                    this.processPrimary(builder, context.primary());
                    break;
                }

                case JavaParser.RULE_expression: {
                    builder.append(this.getLeadingWhiteSpaces(context.expression(0)));

                    const firstExpression = new StringBuilder();
                    this.processExpression(firstExpression, context.expression(0));

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
                                if (context.getChild(2) instanceof TerminalNode) {
                                    builder.append(firstExpression);
                                    this.getContent(builder, context.DOT());

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

                                        default:
                                    }
                                } else {
                                    builder.append(firstExpression);
                                    this.getContent(builder, context.DOT());
                                    if (context.methodCall()) {
                                        this.processMethodCall(builder, context.methodCall());
                                    } else {
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
                                builder.append(usedOperator);

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
                                    if (context.typeArguments()) {
                                        this.processTypeArguments(builder, context.typeArguments());
                                    }
                                    this.getContent(builder, context.IDENTIFIER());

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
                    if (context.methodCall().IDENTIFIER()) {
                        const qualifier = this.source.getSymbolQualifier(context,
                            context.methodCall().IDENTIFIER().text);
                        builder.append(this.getLeadingWhiteSpaces(context.methodCall()));
                        if (qualifier) {
                            builder.append(qualifier);
                        }
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
        if (context.classBody()) {
            // This is an anonymous inner class, which gets converted to a class expression.
            const localBuilder = new StringBuilder();
            this.processArguments(localBuilder, context.arguments());
            this.processClassBody(builder, context.classBody());
            builder.append(localBuilder);
        } else {
            this.processArguments(builder, context.arguments());
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

        this.getContent(builder, firstChild);

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

    /**
     * Processes a creator rule for `new` expressions.
     *
     * @param builder The build for the output.
     * @param context The creator context to process.
     *
     * @returns true if the caller should use the `new` operator, otherwise false (e.g. for array initializers).
     */
    private processCreator = (builder: StringBuilder, context: CreatorContext): boolean => {
        builder.append(this.getLeadingWhiteSpaces(context));

        // Check if this is an anonymous inner class. If so prepare the class expression we have to create.
        if (context.classCreatorRest() && context.classCreatorRest().classBody()) {
            builder.append("class extends ");
        }

        if (context.nonWildcardTypeArguments()) {
            // Generic creator.
            this.processNonWildcardTypeArguments(builder, context.nonWildcardTypeArguments());
            this.processCreatedName(builder, context.createdName());
            this.processClassCreatorRest(builder, context.classCreatorRest());
        } else {
            // Non-generic creator.
            if (context.arrayCreatorRest()) {
                // Array size or initializer. Convert that to a generic TS array creator.
                if (context.arrayCreatorRest().arrayInitializer()) {
                    // An initializer doesn't need a `new something[]` expression. Instead we can directly use
                    // the initializer, after converting braces to brackets.
                    this.processArrayInitializer(builder, context.arrayCreatorRest().arrayInitializer());

                    return false;
                } else {
                    // Not data, but array sizes. If there's more than a single dimension, we have to leave out the
                    // sizes, however, as they are not supported.
                    const count = context.arrayCreatorRest().expression().length;
                    if (count === 1) {
                        const temp = new StringBuilder();
                        this.processCreatedName(temp, context.createdName());
                        builder.append(" Array<", temp, ">");

                        builder.append(this.getLeadingWhiteSpaces(context.arrayCreatorRest().LBRACK(0)));

                        temp.clear();
                        this.processExpression(temp, context.arrayCreatorRest().expression(0));
                        builder.append("(", temp, ")");

                        builder.append(this.getLeadingWhiteSpaces(context.arrayCreatorRest().RBRACK(0)));
                    } else {
                        builder.append("[".repeat(count), "]".repeat(count));
                    }
                }
            } else {
                this.processCreatedName(builder, context.createdName());
                this.processClassCreatorRest(builder, context.classCreatorRest());
            }
        }

        return true;
    };

    private processCreatedName = (builder: StringBuilder, context: CreatedNameContext): void => {
        if (context.primitiveType()) {
            this.processPrimitiveType(builder, context.primitiveType());

            return;
        }

        let index = 0;
        while (index < context.childCount) {
            let child = context.getChild(index++);
            if (index === 1) {
                const ws = this.getLeadingWhiteSpaces(child as TerminalNode);
                builder.append(`${ws}${this.resolveTypeName(context, child.text)}`);
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

    private processPrimary = (builder: StringBuilder, context: PrimaryContext): void => {
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
                    const ws = this.getLeadingWhiteSpaces(context.IDENTIFIER());
                    builder.append(ws);

                    let name = context.IDENTIFIER().text;
                    const qualifier = this.source.getSymbolQualifier(context.parent, name);

                    if (qualifier === undefined) {
                        name = this.resolveTypeName(context, name);
                    } else if (qualifier.length > 0) {
                        const parts = qualifier.split(".");
                        parts[0] = this.resolveTypeName(context, parts[0]);
                        builder.append(parts.join("."));
                    }
                    builder.append(name);
                }
            }
        } else {
            switch ((firstChild as ParserRuleContext).ruleIndex) {
                case JavaParser.RULE_typeTypeOrVoid: {
                    this.processTypeTypeOrVoid(builder, context.typeTypeOrVoid());
                    this.getContent(builder, context.DOT());
                    this.ignoreContent(context.CLASS());
                    builder.append("name"); // Replaces ".class" appendix.

                    break;
                }

                case JavaParser.RULE_literal: {
                    this.processLiteral(builder, context.literal());
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
    };

    private processLiteral = (builder: StringBuilder, context: LiteralContext): void => {
        builder.append(this.getLeadingWhiteSpaces(context));

        if (context.integerLiteral()) {
            // Long integer literals can be converted to big int.
            const value = context.integerLiteral().text;
            if (value.endsWith("l") || value.endsWith("L")) {
                builder.append(value.substring(0, value.length - 1), "n");
            } else {
                builder.append(value);
            }
        } else if (context.floatLiteral()) {
            // Double float literals have no expression in JS/TS, so we just remove the suffix.
            const value = context.floatLiteral().text;
            if (value.endsWith("f") || value.endsWith("F") || value.endsWith("d") || value.endsWith("D")) {
                builder.append(value.substring(0, value.length - 1));
            } else {
                builder.append(value);
            }
        } else if (context.NULL_LITERAL()) {
            builder.append(this.getLeadingWhiteSpaces(context.NULL_LITERAL()), "undefined");
        } else {
            this.getContent(builder, context);
        }
    };

    private processExplicitGenericInvocationSuffix = (builder: StringBuilder,
        context: ExplicitGenericInvocationSuffixContext): void => {
        if (context.SUPER()) {
            this.getContent(builder, context.SUPER());
            this.processSuperSuffix(builder, context.superSuffix());
        } else {
            this.getContent(builder, context.IDENTIFIER());
            this.processArguments(builder, context.arguments());
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
                const ws = this.getLeadingWhiteSpaces(context.IF());

                builder.append(ws);
                this.getContent(builder, context.IF());
                this.processParExpression(builder, context.parExpression());

                let statement = context.statement(0);
                const addBraces = !statement.block() && this.configuration.options.autoAddBraces;

                if (addBraces) {
                    builder.append(" {\n", ws);
                }
                this.processStatement(builder, statement);
                if (addBraces) {
                    builder.append("\n", ws, "}\n");
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
        builder.append(this.checkExceptionType(context, type.text));

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
        const list: StringBuilder[] = [];

        let index = 0;
        while (true) {
            const type = new StringBuilder();
            this.processTypeType(type, context.getChild(index++) as TypeTypeContext);

            let ignoreNext = false;
            if (type.text.trim() !== "Serializable") {
                list.push(type);
            } else {
                // Remove the last added builder too (which must be comma text).
                ignoreNext = list.pop() === undefined;
            }

            if (index === context.childCount) {
                break;
            }

            // Handle the comma.
            const comma = new StringBuilder();
            this.getContent(comma, context.getChild(index++) as TerminalNode, false);
            if (!ignoreNext) {
                list.push(comma);
            }
        }

        builder.append(...list);
    };

    private processTypeTypeOrVoid = (builder: StringBuilder, context: TypeTypeOrVoidContext): boolean => {
        if (context.VOID()) {
            this.getContent(builder, context.VOID());

            return true;
        }

        return this.processTypeType(builder, context.typeType());
    };

    private processTypeType = (builder: StringBuilder, context: TypeTypeContext): boolean => {
        builder.append(this.getLeadingWhiteSpaces(context.getChild(0) as ParserRuleContext));

        // Processing annotations here is a bit complicated, because there are two places where annotations
        // can appear, in 3 loops.
        let index = 0;
        while (context.getChild(index) instanceof AnnotationContext) {
            this.processAnnotation(builder, context.getChild(index) as AnnotationContext);
            ++index;
        }

        let isPrimitiveType = false;
        const child = context.getChild(index);
        if (child instanceof ClassOrInterfaceTypeContext) {
            this.processClassOrInterfaceType(builder, child);
        } else {
            isPrimitiveType = true;
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

        return isPrimitiveType;
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

            // Only resolve the first identifier part in the qualified identifier.
            if (index === 1) {
                builder.append(this.resolveTypeName(context, child.text));
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
                this.getContent(builder, context.QUESTION());
            }
        }
    };

    private processPrimitiveType = (builder: StringBuilder, context: PrimitiveTypeContext): void => {
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

        return this.source.getText(interval);
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
            builder.append(ws, "/* ", this.source.getText(interval), " */ ");
        } else {
            builder.append(ws, this.source.getText(interval));
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
        this.whiteSpaceAnchor = stopIndex + 1;

        builder.append(`${ws}/* ${this.source.getText(interval)} */`);
    };

    private checkExceptionType = (context: ParseTree, name: string): string => {
        this.resolveTypeName(context, name);

        return name;
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
        if (classInfo.nestedDeclarations.length > 0) {
            result.append("\n\n");
            result.append((doExport ? "export " : "") + "namespace ");
            result.append(classInfo.name, " {\n");
            result.append(classInfo.nestedDeclarations, "}\n\n");
        }

        return result;
    };

    /**
     * This is the central method to resolve all types that can occur in the source code.
     * Resolving a symbol involves a number of steps:
     *
     * 1. Find a configured replacement via the class resolver, or
     * 2. Convert certain known types to other types (usually ones from Typescript/Javascript), or
     * 3. Find the type in the current file and add certain prefixes, if necessary (e.g. `this.`), or
     * 4. Find the type in the exported type list of any of the imported packages.
     *
     * @param context A parse tree to start searching from for local symbols.
     * @param name The name of the type to check.
     *
     * @returns Either a replacement for the given name or the name itself.
     */
    private resolveTypeName = (context: ParseTree, name: string): string => {
        // 1. The application can force a remap of types to something else.
        const forClass = this.classResolver.get(name);
        if (forClass) {
            this.resolvedClasses.add(name);

            return name;
        }

        // 2. Replace primitive and certain other types to native JS/TS types.
        switch (name) {
            case "String": {
                return "string";
            }

            case "Object": {
                return "object";
            }

            case "List":
            case "ArrayList":
            case "Collection": {
                return "Array";
            }

            case "Integer": {
                return "number";
            }

            case "HashSet": {
                return "Set";
            }

            case "HashMap": {
                return "Map";
            }

            default:
        }

        /* No lookup if `name` is not a type name (must start with upper case letter).
        if (name[0].toLocaleUpperCase() !== name[0]) {
            return name;
        }*/

        // 3. Is it a symbol from this file?
        const qualifier = this.source.getSymbolQualifier(context, name);
        if (qualifier) {
            return qualifier + name;
        }

        // 4. Is it an imported type?
        this.imports.forEach((source) => {
            const info = source.resolveType(name);
            if (info) {
                return info.qualifiedName;
            }
        });

        return name;
    };

}
