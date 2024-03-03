// Generated from ./parser/JavaParser.g4 by ANTLR 4.13.1

import * as antlr from "antlr4ng";
import { Token } from "antlr4ng";

import { JavaParserListener } from "./JavaParserListener.js";
import { JavaParserVisitor } from "./JavaParserVisitor.js";

// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;


export class JavaParser extends antlr.Parser {
    public static readonly ABSTRACT = 1;
    public static readonly ASSERT = 2;
    public static readonly BOOLEAN = 3;
    public static readonly BREAK = 4;
    public static readonly BYTE = 5;
    public static readonly CASE = 6;
    public static readonly CATCH = 7;
    public static readonly CHAR = 8;
    public static readonly CLASS = 9;
    public static readonly CONST = 10;
    public static readonly CONTINUE = 11;
    public static readonly DEFAULT = 12;
    public static readonly DO = 13;
    public static readonly DOUBLE = 14;
    public static readonly ELSE = 15;
    public static readonly ENUM = 16;
    public static readonly EXTENDS = 17;
    public static readonly FINAL = 18;
    public static readonly FINALLY = 19;
    public static readonly FLOAT = 20;
    public static readonly FOR = 21;
    public static readonly IF = 22;
    public static readonly GOTO = 23;
    public static readonly IMPLEMENTS = 24;
    public static readonly IMPORT = 25;
    public static readonly INSTANCEOF = 26;
    public static readonly INT = 27;
    public static readonly INTERFACE = 28;
    public static readonly LONG = 29;
    public static readonly NATIVE = 30;
    public static readonly NEW = 31;
    public static readonly PACKAGE = 32;
    public static readonly PRIVATE = 33;
    public static readonly PROTECTED = 34;
    public static readonly PUBLIC = 35;
    public static readonly RETURN = 36;
    public static readonly SHORT = 37;
    public static readonly STATIC = 38;
    public static readonly STRICTFP = 39;
    public static readonly SUPER = 40;
    public static readonly SWITCH = 41;
    public static readonly SYNCHRONIZED = 42;
    public static readonly THIS = 43;
    public static readonly THROW = 44;
    public static readonly THROWS = 45;
    public static readonly TRANSIENT = 46;
    public static readonly TRY = 47;
    public static readonly VOID = 48;
    public static readonly VOLATILE = 49;
    public static readonly WHILE = 50;
    public static readonly MODULE = 51;
    public static readonly OPEN = 52;
    public static readonly REQUIRES = 53;
    public static readonly EXPORTS = 54;
    public static readonly OPENS = 55;
    public static readonly TO = 56;
    public static readonly USES = 57;
    public static readonly PROVIDES = 58;
    public static readonly WITH = 59;
    public static readonly TRANSITIVE = 60;
    public static readonly VAR = 61;
    public static readonly YIELD = 62;
    public static readonly RECORD = 63;
    public static readonly SEALED = 64;
    public static readonly PERMITS = 65;
    public static readonly NON_SEALED = 66;
    public static readonly DECIMAL_LITERAL = 67;
    public static readonly HEX_LITERAL = 68;
    public static readonly OCT_LITERAL = 69;
    public static readonly BINARY_LITERAL = 70;
    public static readonly FLOAT_LITERAL = 71;
    public static readonly HEX_FLOAT_LITERAL = 72;
    public static readonly BOOL_LITERAL = 73;
    public static readonly CHAR_LITERAL = 74;
    public static readonly STRING_LITERAL = 75;
    public static readonly TEXT_BLOCK = 76;
    public static readonly NULL_LITERAL = 77;
    public static readonly LPAREN = 78;
    public static readonly RPAREN = 79;
    public static readonly LBRACE = 80;
    public static readonly RBRACE = 81;
    public static readonly LBRACK = 82;
    public static readonly RBRACK = 83;
    public static readonly SEMI = 84;
    public static readonly COMMA = 85;
    public static readonly DOT = 86;
    public static readonly ASSIGN = 87;
    public static readonly GT = 88;
    public static readonly LT = 89;
    public static readonly BANG = 90;
    public static readonly TILDE = 91;
    public static readonly QUESTION = 92;
    public static readonly COLON = 93;
    public static readonly EQUAL = 94;
    public static readonly LE = 95;
    public static readonly GE = 96;
    public static readonly NOTEQUAL = 97;
    public static readonly AND = 98;
    public static readonly OR = 99;
    public static readonly INC = 100;
    public static readonly DEC = 101;
    public static readonly ADD = 102;
    public static readonly SUB = 103;
    public static readonly MUL = 104;
    public static readonly DIV = 105;
    public static readonly BITAND = 106;
    public static readonly BITOR = 107;
    public static readonly CARET = 108;
    public static readonly MOD = 109;
    public static readonly ADD_ASSIGN = 110;
    public static readonly SUB_ASSIGN = 111;
    public static readonly MUL_ASSIGN = 112;
    public static readonly DIV_ASSIGN = 113;
    public static readonly AND_ASSIGN = 114;
    public static readonly OR_ASSIGN = 115;
    public static readonly XOR_ASSIGN = 116;
    public static readonly MOD_ASSIGN = 117;
    public static readonly LSHIFT_ASSIGN = 118;
    public static readonly RSHIFT_ASSIGN = 119;
    public static readonly URSHIFT_ASSIGN = 120;
    public static readonly ARROW = 121;
    public static readonly COLONCOLON = 122;
    public static readonly AT = 123;
    public static readonly ELLIPSIS = 124;
    public static readonly WS = 125;
    public static readonly COMMENT = 126;
    public static readonly LINE_COMMENT = 127;
    public static readonly IDENTIFIER = 128;
    public static readonly RULE_compilationUnit = 0;
    public static readonly RULE_packageDeclaration = 1;
    public static readonly RULE_importDeclaration = 2;
    public static readonly RULE_typeDeclaration = 3;
    public static readonly RULE_modifier = 4;
    public static readonly RULE_classOrInterfaceModifier = 5;
    public static readonly RULE_variableModifier = 6;
    public static readonly RULE_classDeclaration = 7;
    public static readonly RULE_typeParameters = 8;
    public static readonly RULE_typeParameter = 9;
    public static readonly RULE_typeBound = 10;
    public static readonly RULE_enumDeclaration = 11;
    public static readonly RULE_enumConstants = 12;
    public static readonly RULE_enumConstant = 13;
    public static readonly RULE_enumBodyDeclarations = 14;
    public static readonly RULE_interfaceDeclaration = 15;
    public static readonly RULE_classBody = 16;
    public static readonly RULE_interfaceBody = 17;
    public static readonly RULE_classBodyDeclaration = 18;
    public static readonly RULE_memberDeclaration = 19;
    public static readonly RULE_methodDeclaration = 20;
    public static readonly RULE_methodBody = 21;
    public static readonly RULE_typeTypeOrVoid = 22;
    public static readonly RULE_genericMethodDeclaration = 23;
    public static readonly RULE_genericConstructorDeclaration = 24;
    public static readonly RULE_constructorDeclaration = 25;
    public static readonly RULE_fieldDeclaration = 26;
    public static readonly RULE_interfaceBodyDeclaration = 27;
    public static readonly RULE_interfaceMemberDeclaration = 28;
    public static readonly RULE_constDeclaration = 29;
    public static readonly RULE_constantDeclarator = 30;
    public static readonly RULE_interfaceMethodDeclaration = 31;
    public static readonly RULE_interfaceMethodModifier = 32;
    public static readonly RULE_genericInterfaceMethodDeclaration = 33;
    public static readonly RULE_interfaceCommonBodyDeclaration = 34;
    public static readonly RULE_variableDeclarators = 35;
    public static readonly RULE_variableDeclarator = 36;
    public static readonly RULE_variableDeclaratorId = 37;
    public static readonly RULE_variableInitializer = 38;
    public static readonly RULE_arrayInitializer = 39;
    public static readonly RULE_classOrInterfaceType = 40;
    public static readonly RULE_typeArgument = 41;
    public static readonly RULE_qualifiedNameList = 42;
    public static readonly RULE_formalParameters = 43;
    public static readonly RULE_receiverParameter = 44;
    public static readonly RULE_formalParameterList = 45;
    public static readonly RULE_formalParameter = 46;
    public static readonly RULE_lastFormalParameter = 47;
    public static readonly RULE_lambdaLVTIList = 48;
    public static readonly RULE_lambdaLVTIParameter = 49;
    public static readonly RULE_qualifiedName = 50;
    public static readonly RULE_literal = 51;
    public static readonly RULE_integerLiteral = 52;
    public static readonly RULE_floatLiteral = 53;
    public static readonly RULE_altAnnotationQualifiedName = 54;
    public static readonly RULE_annotation = 55;
    public static readonly RULE_elementValuePairs = 56;
    public static readonly RULE_elementValuePair = 57;
    public static readonly RULE_elementValue = 58;
    public static readonly RULE_elementValueArrayInitializer = 59;
    public static readonly RULE_annotationTypeDeclaration = 60;
    public static readonly RULE_annotationTypeBody = 61;
    public static readonly RULE_annotationTypeElementDeclaration = 62;
    public static readonly RULE_annotationTypeElementRest = 63;
    public static readonly RULE_annotationMethodOrConstantRest = 64;
    public static readonly RULE_annotationMethodRest = 65;
    public static readonly RULE_annotationConstantRest = 66;
    public static readonly RULE_defaultValue = 67;
    public static readonly RULE_moduleDeclaration = 68;
    public static readonly RULE_moduleBody = 69;
    public static readonly RULE_moduleDirective = 70;
    public static readonly RULE_requiresModifier = 71;
    public static readonly RULE_recordDeclaration = 72;
    public static readonly RULE_recordHeader = 73;
    public static readonly RULE_recordComponentList = 74;
    public static readonly RULE_recordComponent = 75;
    public static readonly RULE_recordBody = 76;
    public static readonly RULE_block = 77;
    public static readonly RULE_blockStatement = 78;
    public static readonly RULE_localVariableDeclaration = 79;
    public static readonly RULE_identifier = 80;
    public static readonly RULE_localTypeDeclaration = 81;
    public static readonly RULE_statement = 82;
    public static readonly RULE_catchClause = 83;
    public static readonly RULE_catchType = 84;
    public static readonly RULE_finallyBlock = 85;
    public static readonly RULE_resourceSpecification = 86;
    public static readonly RULE_resources = 87;
    public static readonly RULE_resource = 88;
    public static readonly RULE_switchBlockStatementGroup = 89;
    public static readonly RULE_switchLabel = 90;
    public static readonly RULE_forControl = 91;
    public static readonly RULE_forInit = 92;
    public static readonly RULE_enhancedForControl = 93;
    public static readonly RULE_parExpression = 94;
    public static readonly RULE_expressionList = 95;
    public static readonly RULE_methodCall = 96;
    public static readonly RULE_expression = 97;
    public static readonly RULE_pattern = 98;
    public static readonly RULE_lambdaExpression = 99;
    public static readonly RULE_lambdaParameters = 100;
    public static readonly RULE_lambdaBody = 101;
    public static readonly RULE_primary = 102;
    public static readonly RULE_switchExpression = 103;
    public static readonly RULE_switchLabeledRule = 104;
    public static readonly RULE_guardedPattern = 105;
    public static readonly RULE_switchRuleOutcome = 106;
    public static readonly RULE_classType = 107;
    public static readonly RULE_creator = 108;
    public static readonly RULE_createdName = 109;
    public static readonly RULE_innerCreator = 110;
    public static readonly RULE_arrayCreatorRest = 111;
    public static readonly RULE_classCreatorRest = 112;
    public static readonly RULE_explicitGenericInvocation = 113;
    public static readonly RULE_typeArgumentsOrDiamond = 114;
    public static readonly RULE_nonWildcardTypeArgumentsOrDiamond = 115;
    public static readonly RULE_nonWildcardTypeArguments = 116;
    public static readonly RULE_typeList = 117;
    public static readonly RULE_typeType = 118;
    public static readonly RULE_primitiveType = 119;
    public static readonly RULE_typeArguments = 120;
    public static readonly RULE_superSuffix = 121;
    public static readonly RULE_explicitGenericInvocationSuffix = 122;
    public static readonly RULE_arguments = 123;

    public static readonly literalNames = [
        null, "'abstract'", "'assert'", "'boolean'", "'break'", "'byte'", 
        "'case'", "'catch'", "'char'", "'class'", "'const'", "'continue'", 
        "'default'", "'do'", "'double'", "'else'", "'enum'", "'extends'", 
        "'final'", "'finally'", "'float'", "'for'", "'if'", "'goto'", "'implements'", 
        "'import'", "'instanceof'", "'int'", "'interface'", "'long'", "'native'", 
        "'new'", "'package'", "'private'", "'protected'", "'public'", "'return'", 
        "'short'", "'static'", "'strictfp'", "'super'", "'switch'", "'synchronized'", 
        "'this'", "'throw'", "'throws'", "'transient'", "'try'", "'void'", 
        "'volatile'", "'while'", "'module'", "'open'", "'requires'", "'exports'", 
        "'opens'", "'to'", "'uses'", "'provides'", "'with'", "'transitive'", 
        "'var'", "'yield'", "'record'", "'sealed'", "'permits'", "'non-sealed'", 
        null, null, null, null, null, null, null, null, null, null, "'null'", 
        "'('", "')'", "'{'", "'}'", "'['", "']'", "';'", "','", "'.'", "'='", 
        "'>'", "'<'", "'!'", "'~'", "'?'", "':'", "'=='", "'<='", "'>='", 
        "'!='", "'&&'", "'||'", "'++'", "'--'", "'+'", "'-'", "'*'", "'/'", 
        "'&'", "'|'", "'^'", "'%'", "'+='", "'-='", "'*='", "'/='", "'&='", 
        "'|='", "'^='", "'%='", "'<<='", "'>>='", "'>>>='", "'->'", "'::'", 
        "'@'", "'...'"
    ];

    public static readonly symbolicNames = [
        null, "ABSTRACT", "ASSERT", "BOOLEAN", "BREAK", "BYTE", "CASE", 
        "CATCH", "CHAR", "CLASS", "CONST", "CONTINUE", "DEFAULT", "DO", 
        "DOUBLE", "ELSE", "ENUM", "EXTENDS", "FINAL", "FINALLY", "FLOAT", 
        "FOR", "IF", "GOTO", "IMPLEMENTS", "IMPORT", "INSTANCEOF", "INT", 
        "INTERFACE", "LONG", "NATIVE", "NEW", "PACKAGE", "PRIVATE", "PROTECTED", 
        "PUBLIC", "RETURN", "SHORT", "STATIC", "STRICTFP", "SUPER", "SWITCH", 
        "SYNCHRONIZED", "THIS", "THROW", "THROWS", "TRANSIENT", "TRY", "VOID", 
        "VOLATILE", "WHILE", "MODULE", "OPEN", "REQUIRES", "EXPORTS", "OPENS", 
        "TO", "USES", "PROVIDES", "WITH", "TRANSITIVE", "VAR", "YIELD", 
        "RECORD", "SEALED", "PERMITS", "NON_SEALED", "DECIMAL_LITERAL", 
        "HEX_LITERAL", "OCT_LITERAL", "BINARY_LITERAL", "FLOAT_LITERAL", 
        "HEX_FLOAT_LITERAL", "BOOL_LITERAL", "CHAR_LITERAL", "STRING_LITERAL", 
        "TEXT_BLOCK", "NULL_LITERAL", "LPAREN", "RPAREN", "LBRACE", "RBRACE", 
        "LBRACK", "RBRACK", "SEMI", "COMMA", "DOT", "ASSIGN", "GT", "LT", 
        "BANG", "TILDE", "QUESTION", "COLON", "EQUAL", "LE", "GE", "NOTEQUAL", 
        "AND", "OR", "INC", "DEC", "ADD", "SUB", "MUL", "DIV", "BITAND", 
        "BITOR", "CARET", "MOD", "ADD_ASSIGN", "SUB_ASSIGN", "MUL_ASSIGN", 
        "DIV_ASSIGN", "AND_ASSIGN", "OR_ASSIGN", "XOR_ASSIGN", "MOD_ASSIGN", 
        "LSHIFT_ASSIGN", "RSHIFT_ASSIGN", "URSHIFT_ASSIGN", "ARROW", "COLONCOLON", 
        "AT", "ELLIPSIS", "WS", "COMMENT", "LINE_COMMENT", "IDENTIFIER"
    ];
    public static readonly ruleNames = [
        "compilationUnit", "packageDeclaration", "importDeclaration", "typeDeclaration", 
        "modifier", "classOrInterfaceModifier", "variableModifier", "classDeclaration", 
        "typeParameters", "typeParameter", "typeBound", "enumDeclaration", 
        "enumConstants", "enumConstant", "enumBodyDeclarations", "interfaceDeclaration", 
        "classBody", "interfaceBody", "classBodyDeclaration", "memberDeclaration", 
        "methodDeclaration", "methodBody", "typeTypeOrVoid", "genericMethodDeclaration", 
        "genericConstructorDeclaration", "constructorDeclaration", "fieldDeclaration", 
        "interfaceBodyDeclaration", "interfaceMemberDeclaration", "constDeclaration", 
        "constantDeclarator", "interfaceMethodDeclaration", "interfaceMethodModifier", 
        "genericInterfaceMethodDeclaration", "interfaceCommonBodyDeclaration", 
        "variableDeclarators", "variableDeclarator", "variableDeclaratorId", 
        "variableInitializer", "arrayInitializer", "classOrInterfaceType", 
        "typeArgument", "qualifiedNameList", "formalParameters", "receiverParameter", 
        "formalParameterList", "formalParameter", "lastFormalParameter", 
        "lambdaLVTIList", "lambdaLVTIParameter", "qualifiedName", "literal", 
        "integerLiteral", "floatLiteral", "altAnnotationQualifiedName", 
        "annotation", "elementValuePairs", "elementValuePair", "elementValue", 
        "elementValueArrayInitializer", "annotationTypeDeclaration", "annotationTypeBody", 
        "annotationTypeElementDeclaration", "annotationTypeElementRest", 
        "annotationMethodOrConstantRest", "annotationMethodRest", "annotationConstantRest", 
        "defaultValue", "moduleDeclaration", "moduleBody", "moduleDirective", 
        "requiresModifier", "recordDeclaration", "recordHeader", "recordComponentList", 
        "recordComponent", "recordBody", "block", "blockStatement", "localVariableDeclaration", 
        "identifier", "localTypeDeclaration", "statement", "catchClause", 
        "catchType", "finallyBlock", "resourceSpecification", "resources", 
        "resource", "switchBlockStatementGroup", "switchLabel", "forControl", 
        "forInit", "enhancedForControl", "parExpression", "expressionList", 
        "methodCall", "expression", "pattern", "lambdaExpression", "lambdaParameters", 
        "lambdaBody", "primary", "switchExpression", "switchLabeledRule", 
        "guardedPattern", "switchRuleOutcome", "classType", "creator", "createdName", 
        "innerCreator", "arrayCreatorRest", "classCreatorRest", "explicitGenericInvocation", 
        "typeArgumentsOrDiamond", "nonWildcardTypeArgumentsOrDiamond", "nonWildcardTypeArguments", 
        "typeList", "typeType", "primitiveType", "typeArguments", "superSuffix", 
        "explicitGenericInvocationSuffix", "arguments",
    ];

    public get grammarFileName(): string { return "JavaParser.g4"; }
    public get literalNames(): (string | null)[] { return JavaParser.literalNames; }
    public get symbolicNames(): (string | null)[] { return JavaParser.symbolicNames; }
    public get ruleNames(): string[] { return JavaParser.ruleNames; }
    public get serializedATN(): number[] { return JavaParser._serializedATN; }

    protected createFailedPredicateException(predicate?: string, message?: string): antlr.FailedPredicateException {
        return new antlr.FailedPredicateException(this, predicate, message);
    }

    public constructor(input: antlr.TokenStream) {
        super(input);
        this.interpreter = new antlr.ParserATNSimulator(this, JavaParser._ATN, JavaParser.decisionsToDFA, new antlr.PredictionContextCache());
    }
    public compilationUnit(): CompilationUnitContext {
        let localContext = new CompilationUnitContext(this.context, this.state);
        this.enterRule(localContext, 0, JavaParser.RULE_compilationUnit);
        let _la: number;
        try {
            this.state = 267;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 3, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 249;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 0, this.context) ) {
                case 1:
                    {
                    this.state = 248;
                    this.packageDeclaration();
                    }
                    break;
                }
                this.state = 254;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 25) {
                    {
                    {
                    this.state = 251;
                    this.importDeclaration();
                    }
                    }
                    this.state = 256;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 260;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 268763650) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & 4294705255) !== 0) || ((((_la - 65)) & ~0x1F) === 0 && ((1 << (_la - 65)) & 524291) !== 0) || _la === 123 || _la === 128) {
                    {
                    {
                    this.state = 257;
                    this.typeDeclaration();
                    }
                    }
                    this.state = 262;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 263;
                this.match(JavaParser.EOF);
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 264;
                this.moduleDeclaration();
                this.state = 265;
                this.match(JavaParser.EOF);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public packageDeclaration(): PackageDeclarationContext {
        let localContext = new PackageDeclarationContext(this.context, this.state);
        this.enterRule(localContext, 2, JavaParser.RULE_packageDeclaration);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 272;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (((((_la - 51)) & ~0x1F) === 0 && ((1 << (_la - 51)) & 32767) !== 0) || _la === 123 || _la === 128) {
                {
                {
                this.state = 269;
                this.annotation();
                }
                }
                this.state = 274;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 275;
            this.match(JavaParser.PACKAGE);
            this.state = 276;
            this.qualifiedName();
            this.state = 277;
            this.match(JavaParser.SEMI);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public importDeclaration(): ImportDeclarationContext {
        let localContext = new ImportDeclarationContext(this.context, this.state);
        this.enterRule(localContext, 4, JavaParser.RULE_importDeclaration);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 279;
            this.match(JavaParser.IMPORT);
            this.state = 281;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 38) {
                {
                this.state = 280;
                this.match(JavaParser.STATIC);
                }
            }

            this.state = 283;
            this.qualifiedName();
            this.state = 286;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 86) {
                {
                this.state = 284;
                this.match(JavaParser.DOT);
                this.state = 285;
                this.match(JavaParser.MUL);
                }
            }

            this.state = 288;
            this.match(JavaParser.SEMI);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public typeDeclaration(): TypeDeclarationContext {
        let localContext = new TypeDeclarationContext(this.context, this.state);
        this.enterRule(localContext, 6, JavaParser.RULE_typeDeclaration);
        try {
            let alternative: number;
            this.state = 304;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case JavaParser.ABSTRACT:
            case JavaParser.CLASS:
            case JavaParser.ENUM:
            case JavaParser.FINAL:
            case JavaParser.INTERFACE:
            case JavaParser.PRIVATE:
            case JavaParser.PROTECTED:
            case JavaParser.PUBLIC:
            case JavaParser.STATIC:
            case JavaParser.STRICTFP:
            case JavaParser.MODULE:
            case JavaParser.OPEN:
            case JavaParser.REQUIRES:
            case JavaParser.EXPORTS:
            case JavaParser.OPENS:
            case JavaParser.TO:
            case JavaParser.USES:
            case JavaParser.PROVIDES:
            case JavaParser.WITH:
            case JavaParser.TRANSITIVE:
            case JavaParser.VAR:
            case JavaParser.YIELD:
            case JavaParser.RECORD:
            case JavaParser.SEALED:
            case JavaParser.PERMITS:
            case JavaParser.NON_SEALED:
            case JavaParser.AT:
            case JavaParser.IDENTIFIER:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 293;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 7, this.context);
                while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1) {
                        {
                        {
                        this.state = 290;
                        this.classOrInterfaceModifier();
                        }
                        }
                    }
                    this.state = 295;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 7, this.context);
                }
                this.state = 301;
                this.errorHandler.sync(this);
                switch (this.tokenStream.LA(1)) {
                case JavaParser.CLASS:
                    {
                    this.state = 296;
                    this.classDeclaration();
                    }
                    break;
                case JavaParser.ENUM:
                    {
                    this.state = 297;
                    this.enumDeclaration();
                    }
                    break;
                case JavaParser.INTERFACE:
                    {
                    this.state = 298;
                    this.interfaceDeclaration();
                    }
                    break;
                case JavaParser.AT:
                    {
                    this.state = 299;
                    this.annotationTypeDeclaration();
                    }
                    break;
                case JavaParser.RECORD:
                    {
                    this.state = 300;
                    this.recordDeclaration();
                    }
                    break;
                default:
                    throw new antlr.NoViableAltException(this);
                }
                }
                break;
            case JavaParser.SEMI:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 303;
                this.match(JavaParser.SEMI);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public modifier(): ModifierContext {
        let localContext = new ModifierContext(this.context, this.state);
        this.enterRule(localContext, 8, JavaParser.RULE_modifier);
        try {
            this.state = 311;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case JavaParser.ABSTRACT:
            case JavaParser.FINAL:
            case JavaParser.PRIVATE:
            case JavaParser.PROTECTED:
            case JavaParser.PUBLIC:
            case JavaParser.STATIC:
            case JavaParser.STRICTFP:
            case JavaParser.MODULE:
            case JavaParser.OPEN:
            case JavaParser.REQUIRES:
            case JavaParser.EXPORTS:
            case JavaParser.OPENS:
            case JavaParser.TO:
            case JavaParser.USES:
            case JavaParser.PROVIDES:
            case JavaParser.WITH:
            case JavaParser.TRANSITIVE:
            case JavaParser.VAR:
            case JavaParser.YIELD:
            case JavaParser.RECORD:
            case JavaParser.SEALED:
            case JavaParser.PERMITS:
            case JavaParser.NON_SEALED:
            case JavaParser.AT:
            case JavaParser.IDENTIFIER:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 306;
                this.classOrInterfaceModifier();
                }
                break;
            case JavaParser.NATIVE:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 307;
                this.match(JavaParser.NATIVE);
                }
                break;
            case JavaParser.SYNCHRONIZED:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 308;
                this.match(JavaParser.SYNCHRONIZED);
                }
                break;
            case JavaParser.TRANSIENT:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 309;
                this.match(JavaParser.TRANSIENT);
                }
                break;
            case JavaParser.VOLATILE:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 310;
                this.match(JavaParser.VOLATILE);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public classOrInterfaceModifier(): ClassOrInterfaceModifierContext {
        let localContext = new ClassOrInterfaceModifierContext(this.context, this.state);
        this.enterRule(localContext, 10, JavaParser.RULE_classOrInterfaceModifier);
        try {
            this.state = 323;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 11, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 313;
                this.annotation();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 314;
                this.match(JavaParser.PUBLIC);
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 315;
                this.match(JavaParser.PROTECTED);
                }
                break;
            case 4:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 316;
                this.match(JavaParser.PRIVATE);
                }
                break;
            case 5:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 317;
                this.match(JavaParser.STATIC);
                }
                break;
            case 6:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 318;
                this.match(JavaParser.ABSTRACT);
                }
                break;
            case 7:
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 319;
                this.match(JavaParser.FINAL);
                }
                break;
            case 8:
                this.enterOuterAlt(localContext, 8);
                {
                this.state = 320;
                this.match(JavaParser.STRICTFP);
                }
                break;
            case 9:
                this.enterOuterAlt(localContext, 9);
                {
                this.state = 321;
                this.match(JavaParser.SEALED);
                }
                break;
            case 10:
                this.enterOuterAlt(localContext, 10);
                {
                this.state = 322;
                this.match(JavaParser.NON_SEALED);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public variableModifier(): VariableModifierContext {
        let localContext = new VariableModifierContext(this.context, this.state);
        this.enterRule(localContext, 12, JavaParser.RULE_variableModifier);
        try {
            this.state = 327;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case JavaParser.FINAL:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 325;
                this.match(JavaParser.FINAL);
                }
                break;
            case JavaParser.MODULE:
            case JavaParser.OPEN:
            case JavaParser.REQUIRES:
            case JavaParser.EXPORTS:
            case JavaParser.OPENS:
            case JavaParser.TO:
            case JavaParser.USES:
            case JavaParser.PROVIDES:
            case JavaParser.WITH:
            case JavaParser.TRANSITIVE:
            case JavaParser.VAR:
            case JavaParser.YIELD:
            case JavaParser.RECORD:
            case JavaParser.SEALED:
            case JavaParser.PERMITS:
            case JavaParser.AT:
            case JavaParser.IDENTIFIER:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 326;
                this.annotation();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public classDeclaration(): ClassDeclarationContext {
        let localContext = new ClassDeclarationContext(this.context, this.state);
        this.enterRule(localContext, 14, JavaParser.RULE_classDeclaration);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 329;
            this.match(JavaParser.CLASS);
            this.state = 330;
            this.identifier();
            this.state = 332;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 89) {
                {
                this.state = 331;
                this.typeParameters();
                }
            }

            this.state = 336;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 17) {
                {
                this.state = 334;
                this.match(JavaParser.EXTENDS);
                this.state = 335;
                this.typeType();
                }
            }

            this.state = 340;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 24) {
                {
                this.state = 338;
                this.match(JavaParser.IMPLEMENTS);
                this.state = 339;
                this.typeList();
                }
            }

            this.state = 344;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 65) {
                {
                this.state = 342;
                this.match(JavaParser.PERMITS);
                this.state = 343;
                this.typeList();
                }
            }

            this.state = 346;
            this.classBody();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public typeParameters(): TypeParametersContext {
        let localContext = new TypeParametersContext(this.context, this.state);
        this.enterRule(localContext, 16, JavaParser.RULE_typeParameters);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 348;
            this.match(JavaParser.LT);
            this.state = 349;
            this.typeParameter();
            this.state = 354;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 85) {
                {
                {
                this.state = 350;
                this.match(JavaParser.COMMA);
                this.state = 351;
                this.typeParameter();
                }
                }
                this.state = 356;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 357;
            this.match(JavaParser.GT);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public typeParameter(): TypeParameterContext {
        let localContext = new TypeParameterContext(this.context, this.state);
        this.enterRule(localContext, 18, JavaParser.RULE_typeParameter);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 362;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 18, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 359;
                    this.annotation();
                    }
                    }
                }
                this.state = 364;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 18, this.context);
            }
            this.state = 365;
            this.identifier();
            this.state = 374;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 17) {
                {
                this.state = 366;
                this.match(JavaParser.EXTENDS);
                this.state = 370;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 19, this.context);
                while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1) {
                        {
                        {
                        this.state = 367;
                        this.annotation();
                        }
                        }
                    }
                    this.state = 372;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 19, this.context);
                }
                this.state = 373;
                this.typeBound();
                }
            }

            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public typeBound(): TypeBoundContext {
        let localContext = new TypeBoundContext(this.context, this.state);
        this.enterRule(localContext, 20, JavaParser.RULE_typeBound);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 376;
            this.typeType();
            this.state = 381;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 106) {
                {
                {
                this.state = 377;
                this.match(JavaParser.BITAND);
                this.state = 378;
                this.typeType();
                }
                }
                this.state = 383;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public enumDeclaration(): EnumDeclarationContext {
        let localContext = new EnumDeclarationContext(this.context, this.state);
        this.enterRule(localContext, 22, JavaParser.RULE_enumDeclaration);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 384;
            this.match(JavaParser.ENUM);
            this.state = 385;
            this.identifier();
            this.state = 388;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 24) {
                {
                this.state = 386;
                this.match(JavaParser.IMPLEMENTS);
                this.state = 387;
                this.typeList();
                }
            }

            this.state = 390;
            this.match(JavaParser.LBRACE);
            this.state = 392;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (((((_la - 51)) & ~0x1F) === 0 && ((1 << (_la - 51)) & 32767) !== 0) || _la === 123 || _la === 128) {
                {
                this.state = 391;
                this.enumConstants();
                }
            }

            this.state = 395;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 85) {
                {
                this.state = 394;
                this.match(JavaParser.COMMA);
                }
            }

            this.state = 398;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 84) {
                {
                this.state = 397;
                this.enumBodyDeclarations();
                }
            }

            this.state = 400;
            this.match(JavaParser.RBRACE);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public enumConstants(): EnumConstantsContext {
        let localContext = new EnumConstantsContext(this.context, this.state);
        this.enterRule(localContext, 24, JavaParser.RULE_enumConstants);
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 402;
            this.enumConstant();
            this.state = 407;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 26, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 403;
                    this.match(JavaParser.COMMA);
                    this.state = 404;
                    this.enumConstant();
                    }
                    }
                }
                this.state = 409;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 26, this.context);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public enumConstant(): EnumConstantContext {
        let localContext = new EnumConstantContext(this.context, this.state);
        this.enterRule(localContext, 26, JavaParser.RULE_enumConstant);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 413;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 27, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 410;
                    this.annotation();
                    }
                    }
                }
                this.state = 415;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 27, this.context);
            }
            this.state = 416;
            this.identifier();
            this.state = 418;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 78) {
                {
                this.state = 417;
                this.arguments();
                }
            }

            this.state = 421;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 80) {
                {
                this.state = 420;
                this.classBody();
                }
            }

            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public enumBodyDeclarations(): EnumBodyDeclarationsContext {
        let localContext = new EnumBodyDeclarationsContext(this.context, this.state);
        this.enterRule(localContext, 28, JavaParser.RULE_enumBodyDeclarations);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 423;
            this.match(JavaParser.SEMI);
            this.state = 427;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 2014659370) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & 4294812279) !== 0) || ((((_la - 65)) & ~0x1F) === 0 && ((1 << (_la - 65)) & 17334275) !== 0) || _la === 123 || _la === 128) {
                {
                {
                this.state = 424;
                this.classBodyDeclaration();
                }
                }
                this.state = 429;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public interfaceDeclaration(): InterfaceDeclarationContext {
        let localContext = new InterfaceDeclarationContext(this.context, this.state);
        this.enterRule(localContext, 30, JavaParser.RULE_interfaceDeclaration);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 430;
            this.match(JavaParser.INTERFACE);
            this.state = 431;
            this.identifier();
            this.state = 433;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 89) {
                {
                this.state = 432;
                this.typeParameters();
                }
            }

            this.state = 437;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 17) {
                {
                this.state = 435;
                this.match(JavaParser.EXTENDS);
                this.state = 436;
                this.typeList();
                }
            }

            this.state = 439;
            this.interfaceBody();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public classBody(): ClassBodyContext {
        let localContext = new ClassBodyContext(this.context, this.state);
        this.enterRule(localContext, 32, JavaParser.RULE_classBody);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 441;
            this.match(JavaParser.LBRACE);
            this.state = 445;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 2014659370) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & 4294812279) !== 0) || ((((_la - 65)) & ~0x1F) === 0 && ((1 << (_la - 65)) & 17334275) !== 0) || _la === 123 || _la === 128) {
                {
                {
                this.state = 442;
                this.classBodyDeclaration();
                }
                }
                this.state = 447;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 448;
            this.match(JavaParser.RBRACE);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public interfaceBody(): InterfaceBodyContext {
        let localContext = new InterfaceBodyContext(this.context, this.state);
        this.enterRule(localContext, 34, JavaParser.RULE_interfaceBody);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 450;
            this.match(JavaParser.LBRACE);
            this.state = 454;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 2014663466) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & 4294812279) !== 0) || ((((_la - 65)) & ~0x1F) === 0 && ((1 << (_la - 65)) & 17301507) !== 0) || _la === 123 || _la === 128) {
                {
                {
                this.state = 451;
                this.interfaceBodyDeclaration();
                }
                }
                this.state = 456;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 457;
            this.match(JavaParser.RBRACE);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public classBodyDeclaration(): ClassBodyDeclarationContext {
        let localContext = new ClassBodyDeclarationContext(this.context, this.state);
        this.enterRule(localContext, 36, JavaParser.RULE_classBodyDeclaration);
        let _la: number;
        try {
            let alternative: number;
            this.state = 471;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 37, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 459;
                this.match(JavaParser.SEMI);
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 461;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 38) {
                    {
                    this.state = 460;
                    this.match(JavaParser.STATIC);
                    }
                }

                this.state = 463;
                this.block();
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 467;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 36, this.context);
                while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1) {
                        {
                        {
                        this.state = 464;
                        this.modifier();
                        }
                        }
                    }
                    this.state = 469;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 36, this.context);
                }
                this.state = 470;
                this.memberDeclaration();
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public memberDeclaration(): MemberDeclarationContext {
        let localContext = new MemberDeclarationContext(this.context, this.state);
        this.enterRule(localContext, 38, JavaParser.RULE_memberDeclaration);
        try {
            this.state = 483;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 38, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 473;
                this.methodDeclaration();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 474;
                this.genericMethodDeclaration();
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 475;
                this.fieldDeclaration();
                }
                break;
            case 4:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 476;
                this.constructorDeclaration();
                }
                break;
            case 5:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 477;
                this.genericConstructorDeclaration();
                }
                break;
            case 6:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 478;
                this.interfaceDeclaration();
                }
                break;
            case 7:
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 479;
                this.annotationTypeDeclaration();
                }
                break;
            case 8:
                this.enterOuterAlt(localContext, 8);
                {
                this.state = 480;
                this.classDeclaration();
                }
                break;
            case 9:
                this.enterOuterAlt(localContext, 9);
                {
                this.state = 481;
                this.enumDeclaration();
                }
                break;
            case 10:
                this.enterOuterAlt(localContext, 10);
                {
                this.state = 482;
                this.recordDeclaration();
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public methodDeclaration(): MethodDeclarationContext {
        let localContext = new MethodDeclarationContext(this.context, this.state);
        this.enterRule(localContext, 40, JavaParser.RULE_methodDeclaration);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 485;
            this.typeTypeOrVoid();
            this.state = 486;
            this.identifier();
            this.state = 487;
            this.formalParameters();
            this.state = 492;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 82) {
                {
                {
                this.state = 488;
                this.match(JavaParser.LBRACK);
                this.state = 489;
                this.match(JavaParser.RBRACK);
                }
                }
                this.state = 494;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 497;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 45) {
                {
                this.state = 495;
                this.match(JavaParser.THROWS);
                this.state = 496;
                this.qualifiedNameList();
                }
            }

            this.state = 499;
            this.methodBody();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public methodBody(): MethodBodyContext {
        let localContext = new MethodBodyContext(this.context, this.state);
        this.enterRule(localContext, 42, JavaParser.RULE_methodBody);
        try {
            this.state = 503;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case JavaParser.LBRACE:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 501;
                this.block();
                }
                break;
            case JavaParser.SEMI:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 502;
                this.match(JavaParser.SEMI);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public typeTypeOrVoid(): TypeTypeOrVoidContext {
        let localContext = new TypeTypeOrVoidContext(this.context, this.state);
        this.enterRule(localContext, 44, JavaParser.RULE_typeTypeOrVoid);
        try {
            this.state = 507;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case JavaParser.BOOLEAN:
            case JavaParser.BYTE:
            case JavaParser.CHAR:
            case JavaParser.DOUBLE:
            case JavaParser.FLOAT:
            case JavaParser.INT:
            case JavaParser.LONG:
            case JavaParser.SHORT:
            case JavaParser.MODULE:
            case JavaParser.OPEN:
            case JavaParser.REQUIRES:
            case JavaParser.EXPORTS:
            case JavaParser.OPENS:
            case JavaParser.TO:
            case JavaParser.USES:
            case JavaParser.PROVIDES:
            case JavaParser.WITH:
            case JavaParser.TRANSITIVE:
            case JavaParser.VAR:
            case JavaParser.YIELD:
            case JavaParser.RECORD:
            case JavaParser.SEALED:
            case JavaParser.PERMITS:
            case JavaParser.AT:
            case JavaParser.IDENTIFIER:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 505;
                this.typeType();
                }
                break;
            case JavaParser.VOID:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 506;
                this.match(JavaParser.VOID);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public genericMethodDeclaration(): GenericMethodDeclarationContext {
        let localContext = new GenericMethodDeclarationContext(this.context, this.state);
        this.enterRule(localContext, 46, JavaParser.RULE_genericMethodDeclaration);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 509;
            this.typeParameters();
            this.state = 510;
            this.methodDeclaration();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public genericConstructorDeclaration(): GenericConstructorDeclarationContext {
        let localContext = new GenericConstructorDeclarationContext(this.context, this.state);
        this.enterRule(localContext, 48, JavaParser.RULE_genericConstructorDeclaration);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 512;
            this.typeParameters();
            this.state = 513;
            this.constructorDeclaration();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public constructorDeclaration(): ConstructorDeclarationContext {
        let localContext = new ConstructorDeclarationContext(this.context, this.state);
        this.enterRule(localContext, 50, JavaParser.RULE_constructorDeclaration);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 515;
            this.identifier();
            this.state = 516;
            this.formalParameters();
            this.state = 519;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 45) {
                {
                this.state = 517;
                this.match(JavaParser.THROWS);
                this.state = 518;
                this.qualifiedNameList();
                }
            }

            this.state = 521;
            localContext._constructorBody = this.block();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public fieldDeclaration(): FieldDeclarationContext {
        let localContext = new FieldDeclarationContext(this.context, this.state);
        this.enterRule(localContext, 52, JavaParser.RULE_fieldDeclaration);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 523;
            this.typeType();
            this.state = 524;
            this.variableDeclarators();
            this.state = 525;
            this.match(JavaParser.SEMI);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public interfaceBodyDeclaration(): InterfaceBodyDeclarationContext {
        let localContext = new InterfaceBodyDeclarationContext(this.context, this.state);
        this.enterRule(localContext, 54, JavaParser.RULE_interfaceBodyDeclaration);
        try {
            let alternative: number;
            this.state = 535;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case JavaParser.ABSTRACT:
            case JavaParser.BOOLEAN:
            case JavaParser.BYTE:
            case JavaParser.CHAR:
            case JavaParser.CLASS:
            case JavaParser.DEFAULT:
            case JavaParser.DOUBLE:
            case JavaParser.ENUM:
            case JavaParser.FINAL:
            case JavaParser.FLOAT:
            case JavaParser.INT:
            case JavaParser.INTERFACE:
            case JavaParser.LONG:
            case JavaParser.NATIVE:
            case JavaParser.PRIVATE:
            case JavaParser.PROTECTED:
            case JavaParser.PUBLIC:
            case JavaParser.SHORT:
            case JavaParser.STATIC:
            case JavaParser.STRICTFP:
            case JavaParser.SYNCHRONIZED:
            case JavaParser.TRANSIENT:
            case JavaParser.VOID:
            case JavaParser.VOLATILE:
            case JavaParser.MODULE:
            case JavaParser.OPEN:
            case JavaParser.REQUIRES:
            case JavaParser.EXPORTS:
            case JavaParser.OPENS:
            case JavaParser.TO:
            case JavaParser.USES:
            case JavaParser.PROVIDES:
            case JavaParser.WITH:
            case JavaParser.TRANSITIVE:
            case JavaParser.VAR:
            case JavaParser.YIELD:
            case JavaParser.RECORD:
            case JavaParser.SEALED:
            case JavaParser.PERMITS:
            case JavaParser.NON_SEALED:
            case JavaParser.LT:
            case JavaParser.AT:
            case JavaParser.IDENTIFIER:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 530;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 44, this.context);
                while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1) {
                        {
                        {
                        this.state = 527;
                        this.modifier();
                        }
                        }
                    }
                    this.state = 532;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 44, this.context);
                }
                this.state = 533;
                this.interfaceMemberDeclaration();
                }
                break;
            case JavaParser.SEMI:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 534;
                this.match(JavaParser.SEMI);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public interfaceMemberDeclaration(): InterfaceMemberDeclarationContext {
        let localContext = new InterfaceMemberDeclarationContext(this.context, this.state);
        this.enterRule(localContext, 56, JavaParser.RULE_interfaceMemberDeclaration);
        try {
            this.state = 545;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 46, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 537;
                this.constDeclaration();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 538;
                this.interfaceMethodDeclaration();
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 539;
                this.genericInterfaceMethodDeclaration();
                }
                break;
            case 4:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 540;
                this.interfaceDeclaration();
                }
                break;
            case 5:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 541;
                this.annotationTypeDeclaration();
                }
                break;
            case 6:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 542;
                this.classDeclaration();
                }
                break;
            case 7:
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 543;
                this.enumDeclaration();
                }
                break;
            case 8:
                this.enterOuterAlt(localContext, 8);
                {
                this.state = 544;
                this.recordDeclaration();
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public constDeclaration(): ConstDeclarationContext {
        let localContext = new ConstDeclarationContext(this.context, this.state);
        this.enterRule(localContext, 58, JavaParser.RULE_constDeclaration);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 547;
            this.typeType();
            this.state = 548;
            this.constantDeclarator();
            this.state = 553;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 85) {
                {
                {
                this.state = 549;
                this.match(JavaParser.COMMA);
                this.state = 550;
                this.constantDeclarator();
                }
                }
                this.state = 555;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 556;
            this.match(JavaParser.SEMI);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public constantDeclarator(): ConstantDeclaratorContext {
        let localContext = new ConstantDeclaratorContext(this.context, this.state);
        this.enterRule(localContext, 60, JavaParser.RULE_constantDeclarator);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 558;
            this.identifier();
            this.state = 563;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 82) {
                {
                {
                this.state = 559;
                this.match(JavaParser.LBRACK);
                this.state = 560;
                this.match(JavaParser.RBRACK);
                }
                }
                this.state = 565;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 566;
            this.match(JavaParser.ASSIGN);
            this.state = 567;
            this.variableInitializer();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public interfaceMethodDeclaration(): InterfaceMethodDeclarationContext {
        let localContext = new InterfaceMethodDeclarationContext(this.context, this.state);
        this.enterRule(localContext, 62, JavaParser.RULE_interfaceMethodDeclaration);
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 572;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 49, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 569;
                    this.interfaceMethodModifier();
                    }
                    }
                }
                this.state = 574;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 49, this.context);
            }
            this.state = 575;
            this.interfaceCommonBodyDeclaration();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public interfaceMethodModifier(): InterfaceMethodModifierContext {
        let localContext = new InterfaceMethodModifierContext(this.context, this.state);
        this.enterRule(localContext, 64, JavaParser.RULE_interfaceMethodModifier);
        try {
            this.state = 583;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case JavaParser.MODULE:
            case JavaParser.OPEN:
            case JavaParser.REQUIRES:
            case JavaParser.EXPORTS:
            case JavaParser.OPENS:
            case JavaParser.TO:
            case JavaParser.USES:
            case JavaParser.PROVIDES:
            case JavaParser.WITH:
            case JavaParser.TRANSITIVE:
            case JavaParser.VAR:
            case JavaParser.YIELD:
            case JavaParser.RECORD:
            case JavaParser.SEALED:
            case JavaParser.PERMITS:
            case JavaParser.AT:
            case JavaParser.IDENTIFIER:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 577;
                this.annotation();
                }
                break;
            case JavaParser.PUBLIC:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 578;
                this.match(JavaParser.PUBLIC);
                }
                break;
            case JavaParser.ABSTRACT:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 579;
                this.match(JavaParser.ABSTRACT);
                }
                break;
            case JavaParser.DEFAULT:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 580;
                this.match(JavaParser.DEFAULT);
                }
                break;
            case JavaParser.STATIC:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 581;
                this.match(JavaParser.STATIC);
                }
                break;
            case JavaParser.STRICTFP:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 582;
                this.match(JavaParser.STRICTFP);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public genericInterfaceMethodDeclaration(): GenericInterfaceMethodDeclarationContext {
        let localContext = new GenericInterfaceMethodDeclarationContext(this.context, this.state);
        this.enterRule(localContext, 66, JavaParser.RULE_genericInterfaceMethodDeclaration);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 588;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 1 || _la === 12 || ((((_la - 35)) & ~0x1F) === 0 && ((1 << (_la - 35)) & 2147418137) !== 0) || _la === 123 || _la === 128) {
                {
                {
                this.state = 585;
                this.interfaceMethodModifier();
                }
                }
                this.state = 590;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 591;
            this.typeParameters();
            this.state = 592;
            this.interfaceCommonBodyDeclaration();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public interfaceCommonBodyDeclaration(): InterfaceCommonBodyDeclarationContext {
        let localContext = new InterfaceCommonBodyDeclarationContext(this.context, this.state);
        this.enterRule(localContext, 68, JavaParser.RULE_interfaceCommonBodyDeclaration);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 597;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 52, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 594;
                    this.annotation();
                    }
                    }
                }
                this.state = 599;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 52, this.context);
            }
            this.state = 600;
            this.typeTypeOrVoid();
            this.state = 601;
            this.identifier();
            this.state = 602;
            this.formalParameters();
            this.state = 607;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 82) {
                {
                {
                this.state = 603;
                this.match(JavaParser.LBRACK);
                this.state = 604;
                this.match(JavaParser.RBRACK);
                }
                }
                this.state = 609;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 612;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 45) {
                {
                this.state = 610;
                this.match(JavaParser.THROWS);
                this.state = 611;
                this.qualifiedNameList();
                }
            }

            this.state = 614;
            this.methodBody();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public variableDeclarators(): VariableDeclaratorsContext {
        let localContext = new VariableDeclaratorsContext(this.context, this.state);
        this.enterRule(localContext, 70, JavaParser.RULE_variableDeclarators);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 616;
            this.variableDeclarator();
            this.state = 621;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 85) {
                {
                {
                this.state = 617;
                this.match(JavaParser.COMMA);
                this.state = 618;
                this.variableDeclarator();
                }
                }
                this.state = 623;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public variableDeclarator(): VariableDeclaratorContext {
        let localContext = new VariableDeclaratorContext(this.context, this.state);
        this.enterRule(localContext, 72, JavaParser.RULE_variableDeclarator);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 624;
            this.variableDeclaratorId();
            this.state = 627;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 87) {
                {
                this.state = 625;
                this.match(JavaParser.ASSIGN);
                this.state = 626;
                this.variableInitializer();
                }
            }

            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public variableDeclaratorId(): VariableDeclaratorIdContext {
        let localContext = new VariableDeclaratorIdContext(this.context, this.state);
        this.enterRule(localContext, 74, JavaParser.RULE_variableDeclaratorId);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 629;
            this.identifier();
            this.state = 634;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 82) {
                {
                {
                this.state = 630;
                this.match(JavaParser.LBRACK);
                this.state = 631;
                this.match(JavaParser.RBRACK);
                }
                }
                this.state = 636;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public variableInitializer(): VariableInitializerContext {
        let localContext = new VariableInitializerContext(this.context, this.state);
        this.enterRule(localContext, 76, JavaParser.RULE_variableInitializer);
        try {
            this.state = 639;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case JavaParser.LBRACE:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 637;
                this.arrayInitializer();
                }
                break;
            case JavaParser.BOOLEAN:
            case JavaParser.BYTE:
            case JavaParser.CHAR:
            case JavaParser.DOUBLE:
            case JavaParser.FLOAT:
            case JavaParser.INT:
            case JavaParser.LONG:
            case JavaParser.NEW:
            case JavaParser.SHORT:
            case JavaParser.SUPER:
            case JavaParser.SWITCH:
            case JavaParser.THIS:
            case JavaParser.VOID:
            case JavaParser.MODULE:
            case JavaParser.OPEN:
            case JavaParser.REQUIRES:
            case JavaParser.EXPORTS:
            case JavaParser.OPENS:
            case JavaParser.TO:
            case JavaParser.USES:
            case JavaParser.PROVIDES:
            case JavaParser.WITH:
            case JavaParser.TRANSITIVE:
            case JavaParser.VAR:
            case JavaParser.YIELD:
            case JavaParser.RECORD:
            case JavaParser.SEALED:
            case JavaParser.PERMITS:
            case JavaParser.DECIMAL_LITERAL:
            case JavaParser.HEX_LITERAL:
            case JavaParser.OCT_LITERAL:
            case JavaParser.BINARY_LITERAL:
            case JavaParser.FLOAT_LITERAL:
            case JavaParser.HEX_FLOAT_LITERAL:
            case JavaParser.BOOL_LITERAL:
            case JavaParser.CHAR_LITERAL:
            case JavaParser.STRING_LITERAL:
            case JavaParser.TEXT_BLOCK:
            case JavaParser.NULL_LITERAL:
            case JavaParser.LPAREN:
            case JavaParser.LT:
            case JavaParser.BANG:
            case JavaParser.TILDE:
            case JavaParser.INC:
            case JavaParser.DEC:
            case JavaParser.ADD:
            case JavaParser.SUB:
            case JavaParser.AT:
            case JavaParser.IDENTIFIER:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 638;
                this.expression(0);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public arrayInitializer(): ArrayInitializerContext {
        let localContext = new ArrayInitializerContext(this.context, this.state);
        this.enterRule(localContext, 78, JavaParser.RULE_arrayInitializer);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 641;
            this.match(JavaParser.LBRACE);
            this.state = 653;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 2819637544) !== 0) || ((((_la - 37)) & ~0x1F) === 0 && ((1 << (_la - 37)) & 3758082137) !== 0) || ((((_la - 69)) & ~0x1F) === 0 && ((1 << (_la - 69)) & 2154826751) !== 0) || ((((_la - 101)) & ~0x1F) === 0 && ((1 << (_la - 101)) & 138412039) !== 0)) {
                {
                this.state = 642;
                this.variableInitializer();
                this.state = 647;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 59, this.context);
                while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1) {
                        {
                        {
                        this.state = 643;
                        this.match(JavaParser.COMMA);
                        this.state = 644;
                        this.variableInitializer();
                        }
                        }
                    }
                    this.state = 649;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 59, this.context);
                }
                this.state = 651;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 85) {
                    {
                    this.state = 650;
                    this.match(JavaParser.COMMA);
                    }
                }

                }
            }

            this.state = 655;
            this.match(JavaParser.RBRACE);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public classOrInterfaceType(): ClassOrInterfaceTypeContext {
        let localContext = new ClassOrInterfaceTypeContext(this.context, this.state);
        this.enterRule(localContext, 80, JavaParser.RULE_classOrInterfaceType);
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 657;
            this.identifier();
            this.state = 659;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 62, this.context) ) {
            case 1:
                {
                this.state = 658;
                this.typeArguments();
                }
                break;
            }
            this.state = 668;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 64, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 661;
                    this.match(JavaParser.DOT);
                    this.state = 662;
                    this.identifier();
                    this.state = 664;
                    this.errorHandler.sync(this);
                    switch (this.interpreter.adaptivePredict(this.tokenStream, 63, this.context) ) {
                    case 1:
                        {
                        this.state = 663;
                        this.typeArguments();
                        }
                        break;
                    }
                    }
                    }
                }
                this.state = 670;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 64, this.context);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public typeArgument(): TypeArgumentContext {
        let localContext = new TypeArgumentContext(this.context, this.state);
        this.enterRule(localContext, 82, JavaParser.RULE_typeArgument);
        let _la: number;
        try {
            this.state = 683;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 67, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 671;
                this.typeType();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 675;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (((((_la - 51)) & ~0x1F) === 0 && ((1 << (_la - 51)) & 32767) !== 0) || _la === 123 || _la === 128) {
                    {
                    {
                    this.state = 672;
                    this.annotation();
                    }
                    }
                    this.state = 677;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 678;
                this.match(JavaParser.QUESTION);
                this.state = 681;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 17 || _la === 40) {
                    {
                    this.state = 679;
                    _la = this.tokenStream.LA(1);
                    if(!(_la === 17 || _la === 40)) {
                    this.errorHandler.recoverInline(this);
                    }
                    else {
                        this.errorHandler.reportMatch(this);
                        this.consume();
                    }
                    this.state = 680;
                    this.typeType();
                    }
                }

                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public qualifiedNameList(): QualifiedNameListContext {
        let localContext = new QualifiedNameListContext(this.context, this.state);
        this.enterRule(localContext, 84, JavaParser.RULE_qualifiedNameList);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 685;
            this.qualifiedName();
            this.state = 690;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 85) {
                {
                {
                this.state = 686;
                this.match(JavaParser.COMMA);
                this.state = 687;
                this.qualifiedName();
                }
                }
                this.state = 692;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public formalParameters(): FormalParametersContext {
        let localContext = new FormalParametersContext(this.context, this.state);
        this.enterRule(localContext, 86, JavaParser.RULE_formalParameters);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 693;
            this.match(JavaParser.LPAREN);
            this.state = 705;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 72, this.context) ) {
            case 1:
                {
                this.state = 695;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 672153896) !== 0) || ((((_la - 37)) & ~0x1F) === 0 && ((1 << (_la - 37)) & 536854529) !== 0) || _la === 123 || _la === 128) {
                    {
                    this.state = 694;
                    this.receiverParameter();
                    }
                }

                }
                break;
            case 2:
                {
                this.state = 697;
                this.receiverParameter();
                this.state = 700;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 85) {
                    {
                    this.state = 698;
                    this.match(JavaParser.COMMA);
                    this.state = 699;
                    this.formalParameterList();
                    }
                }

                }
                break;
            case 3:
                {
                this.state = 703;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 672416040) !== 0) || ((((_la - 37)) & ~0x1F) === 0 && ((1 << (_la - 37)) & 536854529) !== 0) || _la === 123 || _la === 128) {
                    {
                    this.state = 702;
                    this.formalParameterList();
                    }
                }

                }
                break;
            }
            this.state = 707;
            this.match(JavaParser.RPAREN);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public receiverParameter(): ReceiverParameterContext {
        let localContext = new ReceiverParameterContext(this.context, this.state);
        this.enterRule(localContext, 88, JavaParser.RULE_receiverParameter);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 709;
            this.typeType();
            this.state = 715;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (((((_la - 51)) & ~0x1F) === 0 && ((1 << (_la - 51)) & 32767) !== 0) || _la === 128) {
                {
                {
                this.state = 710;
                this.identifier();
                this.state = 711;
                this.match(JavaParser.DOT);
                }
                }
                this.state = 717;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 718;
            this.match(JavaParser.THIS);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public formalParameterList(): FormalParameterListContext {
        let localContext = new FormalParameterListContext(this.context, this.state);
        this.enterRule(localContext, 90, JavaParser.RULE_formalParameterList);
        let _la: number;
        try {
            let alternative: number;
            this.state = 733;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 76, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 720;
                this.formalParameter();
                this.state = 725;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 74, this.context);
                while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1) {
                        {
                        {
                        this.state = 721;
                        this.match(JavaParser.COMMA);
                        this.state = 722;
                        this.formalParameter();
                        }
                        }
                    }
                    this.state = 727;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 74, this.context);
                }
                this.state = 730;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 85) {
                    {
                    this.state = 728;
                    this.match(JavaParser.COMMA);
                    this.state = 729;
                    this.lastFormalParameter();
                    }
                }

                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 732;
                this.lastFormalParameter();
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public formalParameter(): FormalParameterContext {
        let localContext = new FormalParameterContext(this.context, this.state);
        this.enterRule(localContext, 92, JavaParser.RULE_formalParameter);
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 738;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 77, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 735;
                    this.variableModifier();
                    }
                    }
                }
                this.state = 740;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 77, this.context);
            }
            this.state = 741;
            this.typeType();
            this.state = 742;
            this.variableDeclaratorId();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public lastFormalParameter(): LastFormalParameterContext {
        let localContext = new LastFormalParameterContext(this.context, this.state);
        this.enterRule(localContext, 94, JavaParser.RULE_lastFormalParameter);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 747;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 78, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 744;
                    this.variableModifier();
                    }
                    }
                }
                this.state = 749;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 78, this.context);
            }
            this.state = 750;
            this.typeType();
            this.state = 754;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (((((_la - 51)) & ~0x1F) === 0 && ((1 << (_la - 51)) & 32767) !== 0) || _la === 123 || _la === 128) {
                {
                {
                this.state = 751;
                this.annotation();
                }
                }
                this.state = 756;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 757;
            this.match(JavaParser.ELLIPSIS);
            this.state = 758;
            this.variableDeclaratorId();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public lambdaLVTIList(): LambdaLVTIListContext {
        let localContext = new LambdaLVTIListContext(this.context, this.state);
        this.enterRule(localContext, 96, JavaParser.RULE_lambdaLVTIList);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 760;
            this.lambdaLVTIParameter();
            this.state = 765;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 85) {
                {
                {
                this.state = 761;
                this.match(JavaParser.COMMA);
                this.state = 762;
                this.lambdaLVTIParameter();
                }
                }
                this.state = 767;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public lambdaLVTIParameter(): LambdaLVTIParameterContext {
        let localContext = new LambdaLVTIParameterContext(this.context, this.state);
        this.enterRule(localContext, 98, JavaParser.RULE_lambdaLVTIParameter);
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 771;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 81, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 768;
                    this.variableModifier();
                    }
                    }
                }
                this.state = 773;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 81, this.context);
            }
            this.state = 774;
            this.match(JavaParser.VAR);
            this.state = 775;
            this.identifier();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public qualifiedName(): QualifiedNameContext {
        let localContext = new QualifiedNameContext(this.context, this.state);
        this.enterRule(localContext, 100, JavaParser.RULE_qualifiedName);
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 777;
            this.identifier();
            this.state = 782;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 82, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 778;
                    this.match(JavaParser.DOT);
                    this.state = 779;
                    this.identifier();
                    }
                    }
                }
                this.state = 784;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 82, this.context);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public literal(): LiteralContext {
        let localContext = new LiteralContext(this.context, this.state);
        this.enterRule(localContext, 102, JavaParser.RULE_literal);
        try {
            this.state = 792;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case JavaParser.DECIMAL_LITERAL:
            case JavaParser.HEX_LITERAL:
            case JavaParser.OCT_LITERAL:
            case JavaParser.BINARY_LITERAL:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 785;
                this.integerLiteral();
                }
                break;
            case JavaParser.FLOAT_LITERAL:
            case JavaParser.HEX_FLOAT_LITERAL:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 786;
                this.floatLiteral();
                }
                break;
            case JavaParser.CHAR_LITERAL:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 787;
                this.match(JavaParser.CHAR_LITERAL);
                }
                break;
            case JavaParser.STRING_LITERAL:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 788;
                this.match(JavaParser.STRING_LITERAL);
                }
                break;
            case JavaParser.BOOL_LITERAL:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 789;
                this.match(JavaParser.BOOL_LITERAL);
                }
                break;
            case JavaParser.NULL_LITERAL:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 790;
                this.match(JavaParser.NULL_LITERAL);
                }
                break;
            case JavaParser.TEXT_BLOCK:
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 791;
                this.match(JavaParser.TEXT_BLOCK);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public integerLiteral(): IntegerLiteralContext {
        let localContext = new IntegerLiteralContext(this.context, this.state);
        this.enterRule(localContext, 104, JavaParser.RULE_integerLiteral);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 794;
            _la = this.tokenStream.LA(1);
            if(!(((((_la - 67)) & ~0x1F) === 0 && ((1 << (_la - 67)) & 15) !== 0))) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public floatLiteral(): FloatLiteralContext {
        let localContext = new FloatLiteralContext(this.context, this.state);
        this.enterRule(localContext, 106, JavaParser.RULE_floatLiteral);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 796;
            _la = this.tokenStream.LA(1);
            if(!(_la === 71 || _la === 72)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public altAnnotationQualifiedName(): AltAnnotationQualifiedNameContext {
        let localContext = new AltAnnotationQualifiedNameContext(this.context, this.state);
        this.enterRule(localContext, 108, JavaParser.RULE_altAnnotationQualifiedName);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 803;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (((((_la - 51)) & ~0x1F) === 0 && ((1 << (_la - 51)) & 32767) !== 0) || _la === 128) {
                {
                {
                this.state = 798;
                this.identifier();
                this.state = 799;
                this.match(JavaParser.DOT);
                }
                }
                this.state = 805;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 806;
            this.match(JavaParser.AT);
            this.state = 807;
            this.identifier();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public annotation(): AnnotationContext {
        let localContext = new AnnotationContext(this.context, this.state);
        this.enterRule(localContext, 110, JavaParser.RULE_annotation);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 812;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 85, this.context) ) {
            case 1:
                {
                this.state = 809;
                this.match(JavaParser.AT);
                this.state = 810;
                this.qualifiedName();
                }
                break;
            case 2:
                {
                this.state = 811;
                this.altAnnotationQualifiedName();
                }
                break;
            }
            this.state = 820;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 78) {
                {
                this.state = 814;
                this.match(JavaParser.LPAREN);
                this.state = 817;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 86, this.context) ) {
                case 1:
                    {
                    this.state = 815;
                    this.elementValuePairs();
                    }
                    break;
                case 2:
                    {
                    this.state = 816;
                    this.elementValue();
                    }
                    break;
                }
                this.state = 819;
                this.match(JavaParser.RPAREN);
                }
            }

            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public elementValuePairs(): ElementValuePairsContext {
        let localContext = new ElementValuePairsContext(this.context, this.state);
        this.enterRule(localContext, 112, JavaParser.RULE_elementValuePairs);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 822;
            this.elementValuePair();
            this.state = 827;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 85) {
                {
                {
                this.state = 823;
                this.match(JavaParser.COMMA);
                this.state = 824;
                this.elementValuePair();
                }
                }
                this.state = 829;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public elementValuePair(): ElementValuePairContext {
        let localContext = new ElementValuePairContext(this.context, this.state);
        this.enterRule(localContext, 114, JavaParser.RULE_elementValuePair);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 830;
            this.identifier();
            this.state = 831;
            this.match(JavaParser.ASSIGN);
            this.state = 832;
            this.elementValue();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public elementValue(): ElementValueContext {
        let localContext = new ElementValueContext(this.context, this.state);
        this.enterRule(localContext, 116, JavaParser.RULE_elementValue);
        try {
            this.state = 837;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 89, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 834;
                this.expression(0);
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 835;
                this.annotation();
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 836;
                this.elementValueArrayInitializer();
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public elementValueArrayInitializer(): ElementValueArrayInitializerContext {
        let localContext = new ElementValueArrayInitializerContext(this.context, this.state);
        this.enterRule(localContext, 118, JavaParser.RULE_elementValueArrayInitializer);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 839;
            this.match(JavaParser.LBRACE);
            this.state = 848;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 2819637544) !== 0) || ((((_la - 37)) & ~0x1F) === 0 && ((1 << (_la - 37)) & 3758082137) !== 0) || ((((_la - 69)) & ~0x1F) === 0 && ((1 << (_la - 69)) & 2154826751) !== 0) || ((((_la - 101)) & ~0x1F) === 0 && ((1 << (_la - 101)) & 138412039) !== 0)) {
                {
                this.state = 840;
                this.elementValue();
                this.state = 845;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 90, this.context);
                while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1) {
                        {
                        {
                        this.state = 841;
                        this.match(JavaParser.COMMA);
                        this.state = 842;
                        this.elementValue();
                        }
                        }
                    }
                    this.state = 847;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 90, this.context);
                }
                }
            }

            this.state = 851;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 85) {
                {
                this.state = 850;
                this.match(JavaParser.COMMA);
                }
            }

            this.state = 853;
            this.match(JavaParser.RBRACE);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public annotationTypeDeclaration(): AnnotationTypeDeclarationContext {
        let localContext = new AnnotationTypeDeclarationContext(this.context, this.state);
        this.enterRule(localContext, 120, JavaParser.RULE_annotationTypeDeclaration);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 855;
            this.match(JavaParser.AT);
            this.state = 856;
            this.match(JavaParser.INTERFACE);
            this.state = 857;
            this.identifier();
            this.state = 858;
            this.annotationTypeBody();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public annotationTypeBody(): AnnotationTypeBodyContext {
        let localContext = new AnnotationTypeBodyContext(this.context, this.state);
        this.enterRule(localContext, 122, JavaParser.RULE_annotationTypeBody);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 860;
            this.match(JavaParser.LBRACE);
            this.state = 864;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 2014659370) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & 4294779511) !== 0) || ((((_la - 65)) & ~0x1F) === 0 && ((1 << (_la - 65)) & 524291) !== 0) || _la === 123 || _la === 128) {
                {
                {
                this.state = 861;
                this.annotationTypeElementDeclaration();
                }
                }
                this.state = 866;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 867;
            this.match(JavaParser.RBRACE);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public annotationTypeElementDeclaration(): AnnotationTypeElementDeclarationContext {
        let localContext = new AnnotationTypeElementDeclarationContext(this.context, this.state);
        this.enterRule(localContext, 124, JavaParser.RULE_annotationTypeElementDeclaration);
        try {
            let alternative: number;
            this.state = 877;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case JavaParser.ABSTRACT:
            case JavaParser.BOOLEAN:
            case JavaParser.BYTE:
            case JavaParser.CHAR:
            case JavaParser.CLASS:
            case JavaParser.DOUBLE:
            case JavaParser.ENUM:
            case JavaParser.FINAL:
            case JavaParser.FLOAT:
            case JavaParser.INT:
            case JavaParser.INTERFACE:
            case JavaParser.LONG:
            case JavaParser.NATIVE:
            case JavaParser.PRIVATE:
            case JavaParser.PROTECTED:
            case JavaParser.PUBLIC:
            case JavaParser.SHORT:
            case JavaParser.STATIC:
            case JavaParser.STRICTFP:
            case JavaParser.SYNCHRONIZED:
            case JavaParser.TRANSIENT:
            case JavaParser.VOLATILE:
            case JavaParser.MODULE:
            case JavaParser.OPEN:
            case JavaParser.REQUIRES:
            case JavaParser.EXPORTS:
            case JavaParser.OPENS:
            case JavaParser.TO:
            case JavaParser.USES:
            case JavaParser.PROVIDES:
            case JavaParser.WITH:
            case JavaParser.TRANSITIVE:
            case JavaParser.VAR:
            case JavaParser.YIELD:
            case JavaParser.RECORD:
            case JavaParser.SEALED:
            case JavaParser.PERMITS:
            case JavaParser.NON_SEALED:
            case JavaParser.AT:
            case JavaParser.IDENTIFIER:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 872;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 94, this.context);
                while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1) {
                        {
                        {
                        this.state = 869;
                        this.modifier();
                        }
                        }
                    }
                    this.state = 874;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 94, this.context);
                }
                this.state = 875;
                this.annotationTypeElementRest();
                }
                break;
            case JavaParser.SEMI:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 876;
                this.match(JavaParser.SEMI);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public annotationTypeElementRest(): AnnotationTypeElementRestContext {
        let localContext = new AnnotationTypeElementRestContext(this.context, this.state);
        this.enterRule(localContext, 126, JavaParser.RULE_annotationTypeElementRest);
        try {
            this.state = 903;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 101, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 879;
                this.typeType();
                this.state = 880;
                this.annotationMethodOrConstantRest();
                this.state = 881;
                this.match(JavaParser.SEMI);
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 883;
                this.classDeclaration();
                this.state = 885;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 96, this.context) ) {
                case 1:
                    {
                    this.state = 884;
                    this.match(JavaParser.SEMI);
                    }
                    break;
                }
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 887;
                this.interfaceDeclaration();
                this.state = 889;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 97, this.context) ) {
                case 1:
                    {
                    this.state = 888;
                    this.match(JavaParser.SEMI);
                    }
                    break;
                }
                }
                break;
            case 4:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 891;
                this.enumDeclaration();
                this.state = 893;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 98, this.context) ) {
                case 1:
                    {
                    this.state = 892;
                    this.match(JavaParser.SEMI);
                    }
                    break;
                }
                }
                break;
            case 5:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 895;
                this.annotationTypeDeclaration();
                this.state = 897;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 99, this.context) ) {
                case 1:
                    {
                    this.state = 896;
                    this.match(JavaParser.SEMI);
                    }
                    break;
                }
                }
                break;
            case 6:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 899;
                this.recordDeclaration();
                this.state = 901;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 100, this.context) ) {
                case 1:
                    {
                    this.state = 900;
                    this.match(JavaParser.SEMI);
                    }
                    break;
                }
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public annotationMethodOrConstantRest(): AnnotationMethodOrConstantRestContext {
        let localContext = new AnnotationMethodOrConstantRestContext(this.context, this.state);
        this.enterRule(localContext, 128, JavaParser.RULE_annotationMethodOrConstantRest);
        try {
            this.state = 907;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 102, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 905;
                this.annotationMethodRest();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 906;
                this.annotationConstantRest();
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public annotationMethodRest(): AnnotationMethodRestContext {
        let localContext = new AnnotationMethodRestContext(this.context, this.state);
        this.enterRule(localContext, 130, JavaParser.RULE_annotationMethodRest);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 909;
            this.identifier();
            this.state = 910;
            this.match(JavaParser.LPAREN);
            this.state = 911;
            this.match(JavaParser.RPAREN);
            this.state = 913;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 12) {
                {
                this.state = 912;
                this.defaultValue();
                }
            }

            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public annotationConstantRest(): AnnotationConstantRestContext {
        let localContext = new AnnotationConstantRestContext(this.context, this.state);
        this.enterRule(localContext, 132, JavaParser.RULE_annotationConstantRest);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 915;
            this.variableDeclarators();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public defaultValue(): DefaultValueContext {
        let localContext = new DefaultValueContext(this.context, this.state);
        this.enterRule(localContext, 134, JavaParser.RULE_defaultValue);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 917;
            this.match(JavaParser.DEFAULT);
            this.state = 918;
            this.elementValue();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public moduleDeclaration(): ModuleDeclarationContext {
        let localContext = new ModuleDeclarationContext(this.context, this.state);
        this.enterRule(localContext, 136, JavaParser.RULE_moduleDeclaration);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 921;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 52) {
                {
                this.state = 920;
                this.match(JavaParser.OPEN);
                }
            }

            this.state = 923;
            this.match(JavaParser.MODULE);
            this.state = 924;
            this.qualifiedName();
            this.state = 925;
            this.moduleBody();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public moduleBody(): ModuleBodyContext {
        let localContext = new ModuleBodyContext(this.context, this.state);
        this.enterRule(localContext, 138, JavaParser.RULE_moduleBody);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 927;
            this.match(JavaParser.LBRACE);
            this.state = 931;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (((((_la - 53)) & ~0x1F) === 0 && ((1 << (_la - 53)) & 55) !== 0)) {
                {
                {
                this.state = 928;
                this.moduleDirective();
                }
                }
                this.state = 933;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 934;
            this.match(JavaParser.RBRACE);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public moduleDirective(): ModuleDirectiveContext {
        let localContext = new ModuleDirectiveContext(this.context, this.state);
        this.enterRule(localContext, 140, JavaParser.RULE_moduleDirective);
        let _la: number;
        try {
            let alternative: number;
            this.state = 972;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case JavaParser.REQUIRES:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 936;
                this.match(JavaParser.REQUIRES);
                this.state = 940;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 106, this.context);
                while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1) {
                        {
                        {
                        this.state = 937;
                        this.requiresModifier();
                        }
                        }
                    }
                    this.state = 942;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 106, this.context);
                }
                this.state = 943;
                this.qualifiedName();
                this.state = 944;
                this.match(JavaParser.SEMI);
                }
                break;
            case JavaParser.EXPORTS:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 946;
                this.match(JavaParser.EXPORTS);
                this.state = 947;
                this.qualifiedName();
                this.state = 950;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 56) {
                    {
                    this.state = 948;
                    this.match(JavaParser.TO);
                    this.state = 949;
                    this.qualifiedName();
                    }
                }

                this.state = 952;
                this.match(JavaParser.SEMI);
                }
                break;
            case JavaParser.OPENS:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 954;
                this.match(JavaParser.OPENS);
                this.state = 955;
                this.qualifiedName();
                this.state = 958;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 56) {
                    {
                    this.state = 956;
                    this.match(JavaParser.TO);
                    this.state = 957;
                    this.qualifiedName();
                    }
                }

                this.state = 960;
                this.match(JavaParser.SEMI);
                }
                break;
            case JavaParser.USES:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 962;
                this.match(JavaParser.USES);
                this.state = 963;
                this.qualifiedName();
                this.state = 964;
                this.match(JavaParser.SEMI);
                }
                break;
            case JavaParser.PROVIDES:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 966;
                this.match(JavaParser.PROVIDES);
                this.state = 967;
                this.qualifiedName();
                this.state = 968;
                this.match(JavaParser.WITH);
                this.state = 969;
                this.qualifiedName();
                this.state = 970;
                this.match(JavaParser.SEMI);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public requiresModifier(): RequiresModifierContext {
        let localContext = new RequiresModifierContext(this.context, this.state);
        this.enterRule(localContext, 142, JavaParser.RULE_requiresModifier);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 974;
            _la = this.tokenStream.LA(1);
            if(!(_la === 38 || _la === 60)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public recordDeclaration(): RecordDeclarationContext {
        let localContext = new RecordDeclarationContext(this.context, this.state);
        this.enterRule(localContext, 144, JavaParser.RULE_recordDeclaration);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 976;
            this.match(JavaParser.RECORD);
            this.state = 977;
            this.identifier();
            this.state = 979;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 89) {
                {
                this.state = 978;
                this.typeParameters();
                }
            }

            this.state = 981;
            this.recordHeader();
            this.state = 984;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 24) {
                {
                this.state = 982;
                this.match(JavaParser.IMPLEMENTS);
                this.state = 983;
                this.typeList();
                }
            }

            this.state = 986;
            this.recordBody();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public recordHeader(): RecordHeaderContext {
        let localContext = new RecordHeaderContext(this.context, this.state);
        this.enterRule(localContext, 146, JavaParser.RULE_recordHeader);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 988;
            this.match(JavaParser.LPAREN);
            this.state = 990;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 672153896) !== 0) || ((((_la - 37)) & ~0x1F) === 0 && ((1 << (_la - 37)) & 536854529) !== 0) || _la === 123 || _la === 128) {
                {
                this.state = 989;
                this.recordComponentList();
                }
            }

            this.state = 992;
            this.match(JavaParser.RPAREN);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public recordComponentList(): RecordComponentListContext {
        let localContext = new RecordComponentListContext(this.context, this.state);
        this.enterRule(localContext, 148, JavaParser.RULE_recordComponentList);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 994;
            this.recordComponent();
            this.state = 999;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 85) {
                {
                {
                this.state = 995;
                this.match(JavaParser.COMMA);
                this.state = 996;
                this.recordComponent();
                }
                }
                this.state = 1001;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public recordComponent(): RecordComponentContext {
        let localContext = new RecordComponentContext(this.context, this.state);
        this.enterRule(localContext, 150, JavaParser.RULE_recordComponent);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1002;
            this.typeType();
            this.state = 1003;
            this.identifier();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public recordBody(): RecordBodyContext {
        let localContext = new RecordBodyContext(this.context, this.state);
        this.enterRule(localContext, 152, JavaParser.RULE_recordBody);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1005;
            this.match(JavaParser.LBRACE);
            this.state = 1009;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 2014659370) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & 4294812279) !== 0) || ((((_la - 65)) & ~0x1F) === 0 && ((1 << (_la - 65)) & 17334275) !== 0) || _la === 123 || _la === 128) {
                {
                {
                this.state = 1006;
                this.classBodyDeclaration();
                }
                }
                this.state = 1011;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 1012;
            this.match(JavaParser.RBRACE);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public block(): BlockContext {
        let localContext = new BlockContext(this.context, this.state);
        this.enterRule(localContext, 154, JavaParser.RULE_block);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1014;
            this.match(JavaParser.LBRACE);
            this.state = 1018;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 3094637374) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & 4294889471) !== 0) || ((((_la - 65)) & ~0x1F) === 0 && ((1 << (_la - 65)) & 118013951) !== 0) || ((((_la - 100)) & ~0x1F) === 0 && ((1 << (_la - 100)) & 276824079) !== 0)) {
                {
                {
                this.state = 1015;
                this.blockStatement();
                }
                }
                this.state = 1020;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 1021;
            this.match(JavaParser.RBRACE);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public blockStatement(): BlockStatementContext {
        let localContext = new BlockStatementContext(this.context, this.state);
        this.enterRule(localContext, 156, JavaParser.RULE_blockStatement);
        try {
            this.state = 1028;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 116, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 1023;
                this.localVariableDeclaration();
                this.state = 1024;
                this.match(JavaParser.SEMI);
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 1026;
                this.statement();
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 1027;
                this.localTypeDeclaration();
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public localVariableDeclaration(): LocalVariableDeclarationContext {
        let localContext = new LocalVariableDeclarationContext(this.context, this.state);
        this.enterRule(localContext, 158, JavaParser.RULE_localVariableDeclaration);
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1033;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 117, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 1030;
                    this.variableModifier();
                    }
                    }
                }
                this.state = 1035;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 117, this.context);
            }
            this.state = 1036;
            this.typeType();
            this.state = 1037;
            this.variableDeclarators();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public identifier(): IdentifierContext {
        let localContext = new IdentifierContext(this.context, this.state);
        this.enterRule(localContext, 160, JavaParser.RULE_identifier);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1039;
            _la = this.tokenStream.LA(1);
            if(!(((((_la - 51)) & ~0x1F) === 0 && ((1 << (_la - 51)) & 32767) !== 0) || _la === 128)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public localTypeDeclaration(): LocalTypeDeclarationContext {
        let localContext = new LocalTypeDeclarationContext(this.context, this.state);
        this.enterRule(localContext, 162, JavaParser.RULE_localTypeDeclaration);
        try {
            let alternative: number;
            this.state = 1053;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case JavaParser.ABSTRACT:
            case JavaParser.CLASS:
            case JavaParser.FINAL:
            case JavaParser.INTERFACE:
            case JavaParser.PRIVATE:
            case JavaParser.PROTECTED:
            case JavaParser.PUBLIC:
            case JavaParser.STATIC:
            case JavaParser.STRICTFP:
            case JavaParser.MODULE:
            case JavaParser.OPEN:
            case JavaParser.REQUIRES:
            case JavaParser.EXPORTS:
            case JavaParser.OPENS:
            case JavaParser.TO:
            case JavaParser.USES:
            case JavaParser.PROVIDES:
            case JavaParser.WITH:
            case JavaParser.TRANSITIVE:
            case JavaParser.VAR:
            case JavaParser.YIELD:
            case JavaParser.RECORD:
            case JavaParser.SEALED:
            case JavaParser.PERMITS:
            case JavaParser.NON_SEALED:
            case JavaParser.AT:
            case JavaParser.IDENTIFIER:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 1044;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 118, this.context);
                while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1) {
                        {
                        {
                        this.state = 1041;
                        this.classOrInterfaceModifier();
                        }
                        }
                    }
                    this.state = 1046;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 118, this.context);
                }
                this.state = 1050;
                this.errorHandler.sync(this);
                switch (this.tokenStream.LA(1)) {
                case JavaParser.CLASS:
                    {
                    this.state = 1047;
                    this.classDeclaration();
                    }
                    break;
                case JavaParser.INTERFACE:
                    {
                    this.state = 1048;
                    this.interfaceDeclaration();
                    }
                    break;
                case JavaParser.RECORD:
                    {
                    this.state = 1049;
                    this.recordDeclaration();
                    }
                    break;
                default:
                    throw new antlr.NoViableAltException(this);
                }
                }
                break;
            case JavaParser.SEMI:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 1052;
                this.match(JavaParser.SEMI);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public statement(): StatementContext {
        let localContext = new StatementContext(this.context, this.state);
        this.enterRule(localContext, 164, JavaParser.RULE_statement);
        let _la: number;
        try {
            let alternative: number;
            this.state = 1168;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 134, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 1055;
                localContext._blockLabel = this.block();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 1056;
                this.match(JavaParser.ASSERT);
                this.state = 1057;
                this.expression(0);
                this.state = 1060;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 93) {
                    {
                    this.state = 1058;
                    this.match(JavaParser.COLON);
                    this.state = 1059;
                    this.expression(0);
                    }
                }

                this.state = 1062;
                this.match(JavaParser.SEMI);
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 1064;
                this.match(JavaParser.IF);
                this.state = 1065;
                this.parExpression();
                this.state = 1066;
                this.statement();
                this.state = 1069;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 122, this.context) ) {
                case 1:
                    {
                    this.state = 1067;
                    this.match(JavaParser.ELSE);
                    this.state = 1068;
                    this.statement();
                    }
                    break;
                }
                }
                break;
            case 4:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 1071;
                this.match(JavaParser.FOR);
                this.state = 1072;
                this.match(JavaParser.LPAREN);
                this.state = 1073;
                this.forControl();
                this.state = 1074;
                this.match(JavaParser.RPAREN);
                this.state = 1075;
                this.statement();
                }
                break;
            case 5:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 1077;
                this.match(JavaParser.WHILE);
                this.state = 1078;
                this.parExpression();
                this.state = 1079;
                this.statement();
                }
                break;
            case 6:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 1081;
                this.match(JavaParser.DO);
                this.state = 1082;
                this.statement();
                this.state = 1083;
                this.match(JavaParser.WHILE);
                this.state = 1084;
                this.parExpression();
                this.state = 1085;
                this.match(JavaParser.SEMI);
                }
                break;
            case 7:
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 1087;
                this.match(JavaParser.TRY);
                this.state = 1088;
                this.block();
                this.state = 1098;
                this.errorHandler.sync(this);
                switch (this.tokenStream.LA(1)) {
                case JavaParser.CATCH:
                    {
                    this.state = 1090;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    do {
                        {
                        {
                        this.state = 1089;
                        this.catchClause();
                        }
                        }
                        this.state = 1092;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                    } while (_la === 7);
                    this.state = 1095;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    if (_la === 19) {
                        {
                        this.state = 1094;
                        this.finallyBlock();
                        }
                    }

                    }
                    break;
                case JavaParser.FINALLY:
                    {
                    this.state = 1097;
                    this.finallyBlock();
                    }
                    break;
                default:
                    throw new antlr.NoViableAltException(this);
                }
                }
                break;
            case 8:
                this.enterOuterAlt(localContext, 8);
                {
                this.state = 1100;
                this.match(JavaParser.TRY);
                this.state = 1101;
                this.resourceSpecification();
                this.state = 1102;
                this.block();
                this.state = 1106;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 7) {
                    {
                    {
                    this.state = 1103;
                    this.catchClause();
                    }
                    }
                    this.state = 1108;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 1110;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 19) {
                    {
                    this.state = 1109;
                    this.finallyBlock();
                    }
                }

                }
                break;
            case 9:
                this.enterOuterAlt(localContext, 9);
                {
                this.state = 1112;
                this.match(JavaParser.SWITCH);
                this.state = 1113;
                this.parExpression();
                this.state = 1114;
                this.match(JavaParser.LBRACE);
                this.state = 1118;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 128, this.context);
                while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1) {
                        {
                        {
                        this.state = 1115;
                        this.switchBlockStatementGroup();
                        }
                        }
                    }
                    this.state = 1120;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 128, this.context);
                }
                this.state = 1124;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 6 || _la === 12) {
                    {
                    {
                    this.state = 1121;
                    this.switchLabel();
                    }
                    }
                    this.state = 1126;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 1127;
                this.match(JavaParser.RBRACE);
                }
                break;
            case 10:
                this.enterOuterAlt(localContext, 10);
                {
                this.state = 1129;
                this.match(JavaParser.SYNCHRONIZED);
                this.state = 1130;
                this.parExpression();
                this.state = 1131;
                this.block();
                }
                break;
            case 11:
                this.enterOuterAlt(localContext, 11);
                {
                this.state = 1133;
                this.match(JavaParser.RETURN);
                this.state = 1135;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 2819637544) !== 0) || ((((_la - 37)) & ~0x1F) === 0 && ((1 << (_la - 37)) & 3758082137) !== 0) || ((((_la - 69)) & ~0x1F) === 0 && ((1 << (_la - 69)) & 2154824703) !== 0) || ((((_la - 101)) & ~0x1F) === 0 && ((1 << (_la - 101)) & 138412039) !== 0)) {
                    {
                    this.state = 1134;
                    this.expression(0);
                    }
                }

                this.state = 1137;
                this.match(JavaParser.SEMI);
                }
                break;
            case 12:
                this.enterOuterAlt(localContext, 12);
                {
                this.state = 1138;
                this.match(JavaParser.THROW);
                this.state = 1139;
                this.expression(0);
                this.state = 1140;
                this.match(JavaParser.SEMI);
                }
                break;
            case 13:
                this.enterOuterAlt(localContext, 13);
                {
                this.state = 1142;
                this.match(JavaParser.BREAK);
                this.state = 1144;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (((((_la - 51)) & ~0x1F) === 0 && ((1 << (_la - 51)) & 32767) !== 0) || _la === 128) {
                    {
                    this.state = 1143;
                    this.identifier();
                    }
                }

                this.state = 1146;
                this.match(JavaParser.SEMI);
                }
                break;
            case 14:
                this.enterOuterAlt(localContext, 14);
                {
                this.state = 1147;
                this.match(JavaParser.CONTINUE);
                this.state = 1149;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (((((_la - 51)) & ~0x1F) === 0 && ((1 << (_la - 51)) & 32767) !== 0) || _la === 128) {
                    {
                    this.state = 1148;
                    this.identifier();
                    }
                }

                this.state = 1151;
                this.match(JavaParser.SEMI);
                }
                break;
            case 15:
                this.enterOuterAlt(localContext, 15);
                {
                this.state = 1152;
                this.match(JavaParser.YIELD);
                this.state = 1153;
                this.expression(0);
                this.state = 1154;
                this.match(JavaParser.SEMI);
                }
                break;
            case 16:
                this.enterOuterAlt(localContext, 16);
                {
                this.state = 1156;
                this.match(JavaParser.SEMI);
                }
                break;
            case 17:
                this.enterOuterAlt(localContext, 17);
                {
                this.state = 1157;
                localContext._statementExpression = this.expression(0);
                this.state = 1158;
                this.match(JavaParser.SEMI);
                }
                break;
            case 18:
                this.enterOuterAlt(localContext, 18);
                {
                this.state = 1160;
                this.switchExpression();
                this.state = 1162;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 133, this.context) ) {
                case 1:
                    {
                    this.state = 1161;
                    this.match(JavaParser.SEMI);
                    }
                    break;
                }
                }
                break;
            case 19:
                this.enterOuterAlt(localContext, 19);
                {
                this.state = 1164;
                localContext._identifierLabel = this.identifier();
                this.state = 1165;
                this.match(JavaParser.COLON);
                this.state = 1166;
                this.statement();
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public catchClause(): CatchClauseContext {
        let localContext = new CatchClauseContext(this.context, this.state);
        this.enterRule(localContext, 166, JavaParser.RULE_catchClause);
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1170;
            this.match(JavaParser.CATCH);
            this.state = 1171;
            this.match(JavaParser.LPAREN);
            this.state = 1175;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 135, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 1172;
                    this.variableModifier();
                    }
                    }
                }
                this.state = 1177;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 135, this.context);
            }
            this.state = 1178;
            this.catchType();
            this.state = 1179;
            this.identifier();
            this.state = 1180;
            this.match(JavaParser.RPAREN);
            this.state = 1181;
            this.block();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public catchType(): CatchTypeContext {
        let localContext = new CatchTypeContext(this.context, this.state);
        this.enterRule(localContext, 168, JavaParser.RULE_catchType);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1183;
            this.qualifiedName();
            this.state = 1188;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 107) {
                {
                {
                this.state = 1184;
                this.match(JavaParser.BITOR);
                this.state = 1185;
                this.qualifiedName();
                }
                }
                this.state = 1190;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public finallyBlock(): FinallyBlockContext {
        let localContext = new FinallyBlockContext(this.context, this.state);
        this.enterRule(localContext, 170, JavaParser.RULE_finallyBlock);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1191;
            this.match(JavaParser.FINALLY);
            this.state = 1192;
            this.block();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public resourceSpecification(): ResourceSpecificationContext {
        let localContext = new ResourceSpecificationContext(this.context, this.state);
        this.enterRule(localContext, 172, JavaParser.RULE_resourceSpecification);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1194;
            this.match(JavaParser.LPAREN);
            this.state = 1195;
            this.resources();
            this.state = 1197;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 84) {
                {
                this.state = 1196;
                this.match(JavaParser.SEMI);
                }
            }

            this.state = 1199;
            this.match(JavaParser.RPAREN);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public resources(): ResourcesContext {
        let localContext = new ResourcesContext(this.context, this.state);
        this.enterRule(localContext, 174, JavaParser.RULE_resources);
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1201;
            this.resource();
            this.state = 1206;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 138, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 1202;
                    this.match(JavaParser.SEMI);
                    this.state = 1203;
                    this.resource();
                    }
                    }
                }
                this.state = 1208;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 138, this.context);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public resource(): ResourceContext {
        let localContext = new ResourceContext(this.context, this.state);
        this.enterRule(localContext, 176, JavaParser.RULE_resource);
        try {
            let alternative: number;
            this.state = 1226;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 141, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 1212;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 139, this.context);
                while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1) {
                        {
                        {
                        this.state = 1209;
                        this.variableModifier();
                        }
                        }
                    }
                    this.state = 1214;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 139, this.context);
                }
                this.state = 1220;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 140, this.context) ) {
                case 1:
                    {
                    this.state = 1215;
                    this.classOrInterfaceType();
                    this.state = 1216;
                    this.variableDeclaratorId();
                    }
                    break;
                case 2:
                    {
                    this.state = 1218;
                    this.match(JavaParser.VAR);
                    this.state = 1219;
                    this.identifier();
                    }
                    break;
                }
                this.state = 1222;
                this.match(JavaParser.ASSIGN);
                this.state = 1223;
                this.expression(0);
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 1225;
                this.identifier();
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public switchBlockStatementGroup(): SwitchBlockStatementGroupContext {
        let localContext = new SwitchBlockStatementGroupContext(this.context, this.state);
        this.enterRule(localContext, 178, JavaParser.RULE_switchBlockStatementGroup);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1229;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 1228;
                this.switchLabel();
                }
                }
                this.state = 1231;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 6 || _la === 12);
            this.state = 1234;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 1233;
                this.blockStatement();
                }
                }
                this.state = 1236;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 3094637374) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & 4294889471) !== 0) || ((((_la - 65)) & ~0x1F) === 0 && ((1 << (_la - 65)) & 118013951) !== 0) || ((((_la - 100)) & ~0x1F) === 0 && ((1 << (_la - 100)) & 276824079) !== 0));
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public switchLabel(): SwitchLabelContext {
        let localContext = new SwitchLabelContext(this.context, this.state);
        this.enterRule(localContext, 180, JavaParser.RULE_switchLabel);
        try {
            this.state = 1249;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case JavaParser.CASE:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 1238;
                this.match(JavaParser.CASE);
                this.state = 1244;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 144, this.context) ) {
                case 1:
                    {
                    this.state = 1239;
                    localContext._constantExpression = this.expression(0);
                    }
                    break;
                case 2:
                    {
                    this.state = 1240;
                    localContext._enumConstantName = this.match(JavaParser.IDENTIFIER);
                    }
                    break;
                case 3:
                    {
                    this.state = 1241;
                    this.typeType();
                    this.state = 1242;
                    localContext._varName = this.identifier();
                    }
                    break;
                }
                this.state = 1246;
                this.match(JavaParser.COLON);
                }
                break;
            case JavaParser.DEFAULT:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 1247;
                this.match(JavaParser.DEFAULT);
                this.state = 1248;
                this.match(JavaParser.COLON);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public forControl(): ForControlContext {
        let localContext = new ForControlContext(this.context, this.state);
        this.enterRule(localContext, 182, JavaParser.RULE_forControl);
        let _la: number;
        try {
            this.state = 1263;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 149, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 1251;
                this.enhancedForControl();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 1253;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 2819899688) !== 0) || ((((_la - 37)) & ~0x1F) === 0 && ((1 << (_la - 37)) & 3758082137) !== 0) || ((((_la - 69)) & ~0x1F) === 0 && ((1 << (_la - 69)) & 2154824703) !== 0) || ((((_la - 101)) & ~0x1F) === 0 && ((1 << (_la - 101)) & 138412039) !== 0)) {
                    {
                    this.state = 1252;
                    this.forInit();
                    }
                }

                this.state = 1255;
                this.match(JavaParser.SEMI);
                this.state = 1257;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 2819637544) !== 0) || ((((_la - 37)) & ~0x1F) === 0 && ((1 << (_la - 37)) & 3758082137) !== 0) || ((((_la - 69)) & ~0x1F) === 0 && ((1 << (_la - 69)) & 2154824703) !== 0) || ((((_la - 101)) & ~0x1F) === 0 && ((1 << (_la - 101)) & 138412039) !== 0)) {
                    {
                    this.state = 1256;
                    this.expression(0);
                    }
                }

                this.state = 1259;
                this.match(JavaParser.SEMI);
                this.state = 1261;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 2819637544) !== 0) || ((((_la - 37)) & ~0x1F) === 0 && ((1 << (_la - 37)) & 3758082137) !== 0) || ((((_la - 69)) & ~0x1F) === 0 && ((1 << (_la - 69)) & 2154824703) !== 0) || ((((_la - 101)) & ~0x1F) === 0 && ((1 << (_la - 101)) & 138412039) !== 0)) {
                    {
                    this.state = 1260;
                    localContext._forUpdate = this.expressionList();
                    }
                }

                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public forInit(): ForInitContext {
        let localContext = new ForInitContext(this.context, this.state);
        this.enterRule(localContext, 184, JavaParser.RULE_forInit);
        try {
            this.state = 1267;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 150, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 1265;
                this.localVariableDeclaration();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 1266;
                this.expressionList();
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public enhancedForControl(): EnhancedForControlContext {
        let localContext = new EnhancedForControlContext(this.context, this.state);
        this.enterRule(localContext, 186, JavaParser.RULE_enhancedForControl);
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1272;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 151, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 1269;
                    this.variableModifier();
                    }
                    }
                }
                this.state = 1274;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 151, this.context);
            }
            this.state = 1277;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 152, this.context) ) {
            case 1:
                {
                this.state = 1275;
                this.typeType();
                }
                break;
            case 2:
                {
                this.state = 1276;
                this.match(JavaParser.VAR);
                }
                break;
            }
            this.state = 1279;
            this.variableDeclaratorId();
            this.state = 1280;
            this.match(JavaParser.COLON);
            this.state = 1281;
            this.expression(0);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public parExpression(): ParExpressionContext {
        let localContext = new ParExpressionContext(this.context, this.state);
        this.enterRule(localContext, 188, JavaParser.RULE_parExpression);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1283;
            this.match(JavaParser.LPAREN);
            this.state = 1284;
            this.expression(0);
            this.state = 1285;
            this.match(JavaParser.RPAREN);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public expressionList(): ExpressionListContext {
        let localContext = new ExpressionListContext(this.context, this.state);
        this.enterRule(localContext, 190, JavaParser.RULE_expressionList);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1287;
            this.expression(0);
            this.state = 1292;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 85) {
                {
                {
                this.state = 1288;
                this.match(JavaParser.COMMA);
                this.state = 1289;
                this.expression(0);
                }
                }
                this.state = 1294;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public methodCall(): MethodCallContext {
        let localContext = new MethodCallContext(this.context, this.state);
        this.enterRule(localContext, 192, JavaParser.RULE_methodCall);
        let _la: number;
        try {
            this.state = 1314;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case JavaParser.MODULE:
            case JavaParser.OPEN:
            case JavaParser.REQUIRES:
            case JavaParser.EXPORTS:
            case JavaParser.OPENS:
            case JavaParser.TO:
            case JavaParser.USES:
            case JavaParser.PROVIDES:
            case JavaParser.WITH:
            case JavaParser.TRANSITIVE:
            case JavaParser.VAR:
            case JavaParser.YIELD:
            case JavaParser.RECORD:
            case JavaParser.SEALED:
            case JavaParser.PERMITS:
            case JavaParser.IDENTIFIER:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 1295;
                this.identifier();
                this.state = 1296;
                this.match(JavaParser.LPAREN);
                this.state = 1298;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 2819637544) !== 0) || ((((_la - 37)) & ~0x1F) === 0 && ((1 << (_la - 37)) & 3758082137) !== 0) || ((((_la - 69)) & ~0x1F) === 0 && ((1 << (_la - 69)) & 2154824703) !== 0) || ((((_la - 101)) & ~0x1F) === 0 && ((1 << (_la - 101)) & 138412039) !== 0)) {
                    {
                    this.state = 1297;
                    this.expressionList();
                    }
                }

                this.state = 1300;
                this.match(JavaParser.RPAREN);
                }
                break;
            case JavaParser.THIS:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 1302;
                this.match(JavaParser.THIS);
                this.state = 1303;
                this.match(JavaParser.LPAREN);
                this.state = 1305;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 2819637544) !== 0) || ((((_la - 37)) & ~0x1F) === 0 && ((1 << (_la - 37)) & 3758082137) !== 0) || ((((_la - 69)) & ~0x1F) === 0 && ((1 << (_la - 69)) & 2154824703) !== 0) || ((((_la - 101)) & ~0x1F) === 0 && ((1 << (_la - 101)) & 138412039) !== 0)) {
                    {
                    this.state = 1304;
                    this.expressionList();
                    }
                }

                this.state = 1307;
                this.match(JavaParser.RPAREN);
                }
                break;
            case JavaParser.SUPER:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 1308;
                this.match(JavaParser.SUPER);
                this.state = 1309;
                this.match(JavaParser.LPAREN);
                this.state = 1311;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 2819637544) !== 0) || ((((_la - 37)) & ~0x1F) === 0 && ((1 << (_la - 37)) & 3758082137) !== 0) || ((((_la - 69)) & ~0x1F) === 0 && ((1 << (_la - 69)) & 2154824703) !== 0) || ((((_la - 101)) & ~0x1F) === 0 && ((1 << (_la - 101)) & 138412039) !== 0)) {
                    {
                    this.state = 1310;
                    this.expressionList();
                    }
                }

                this.state = 1313;
                this.match(JavaParser.RPAREN);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }

    public expression(): ExpressionContext;
    public expression(_p: number): ExpressionContext;
    public expression(_p?: number): ExpressionContext {
        if (_p === undefined) {
            _p = 0;
        }

        let parentContext = this.context;
        let parentState = this.state;
        let localContext = new ExpressionContext(this.context, parentState);
        let previousContext = localContext;
        let _startState = 194;
        this.enterRecursionRule(localContext, 194, JavaParser.RULE_expression, _p);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1361;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 163, this.context) ) {
            case 1:
                {
                this.state = 1317;
                this.primary();
                }
                break;
            case 2:
                {
                this.state = 1318;
                this.methodCall();
                }
                break;
            case 3:
                {
                this.state = 1319;
                this.match(JavaParser.NEW);
                this.state = 1320;
                this.creator();
                }
                break;
            case 4:
                {
                this.state = 1321;
                this.match(JavaParser.LPAREN);
                this.state = 1325;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 158, this.context);
                while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1) {
                        {
                        {
                        this.state = 1322;
                        this.annotation();
                        }
                        }
                    }
                    this.state = 1327;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 158, this.context);
                }
                this.state = 1328;
                this.typeType();
                this.state = 1333;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 106) {
                    {
                    {
                    this.state = 1329;
                    this.match(JavaParser.BITAND);
                    this.state = 1330;
                    this.typeType();
                    }
                    }
                    this.state = 1335;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 1336;
                this.match(JavaParser.RPAREN);
                this.state = 1337;
                this.expression(22);
                }
                break;
            case 5:
                {
                this.state = 1339;
                localContext._prefix = this.tokenStream.LT(1);
                _la = this.tokenStream.LA(1);
                if(!(((((_la - 100)) & ~0x1F) === 0 && ((1 << (_la - 100)) & 15) !== 0))) {
                    localContext._prefix = this.errorHandler.recoverInline(this);
                }
                else {
                    this.errorHandler.reportMatch(this);
                    this.consume();
                }
                this.state = 1340;
                this.expression(20);
                }
                break;
            case 6:
                {
                this.state = 1341;
                localContext._prefix = this.tokenStream.LT(1);
                _la = this.tokenStream.LA(1);
                if(!(_la === 90 || _la === 91)) {
                    localContext._prefix = this.errorHandler.recoverInline(this);
                }
                else {
                    this.errorHandler.reportMatch(this);
                    this.consume();
                }
                this.state = 1342;
                this.expression(19);
                }
                break;
            case 7:
                {
                this.state = 1343;
                this.lambdaExpression();
                }
                break;
            case 8:
                {
                this.state = 1344;
                this.switchExpression();
                }
                break;
            case 9:
                {
                this.state = 1345;
                this.typeType();
                this.state = 1346;
                this.match(JavaParser.COLONCOLON);
                this.state = 1352;
                this.errorHandler.sync(this);
                switch (this.tokenStream.LA(1)) {
                case JavaParser.MODULE:
                case JavaParser.OPEN:
                case JavaParser.REQUIRES:
                case JavaParser.EXPORTS:
                case JavaParser.OPENS:
                case JavaParser.TO:
                case JavaParser.USES:
                case JavaParser.PROVIDES:
                case JavaParser.WITH:
                case JavaParser.TRANSITIVE:
                case JavaParser.VAR:
                case JavaParser.YIELD:
                case JavaParser.RECORD:
                case JavaParser.SEALED:
                case JavaParser.PERMITS:
                case JavaParser.LT:
                case JavaParser.IDENTIFIER:
                    {
                    this.state = 1348;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    if (_la === 89) {
                        {
                        this.state = 1347;
                        this.typeArguments();
                        }
                    }

                    this.state = 1350;
                    this.identifier();
                    }
                    break;
                case JavaParser.NEW:
                    {
                    this.state = 1351;
                    this.match(JavaParser.NEW);
                    }
                    break;
                default:
                    throw new antlr.NoViableAltException(this);
                }
                }
                break;
            case 10:
                {
                this.state = 1354;
                this.classType();
                this.state = 1355;
                this.match(JavaParser.COLONCOLON);
                this.state = 1357;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 89) {
                    {
                    this.state = 1356;
                    this.typeArguments();
                    }
                }

                this.state = 1359;
                this.match(JavaParser.NEW);
                }
                break;
            }
            this.context!.stop = this.tokenStream.LT(-1);
            this.state = 1446;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 170, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    if (this.parseListeners != null) {
                        this.triggerExitRuleEvent();
                    }
                    previousContext = localContext;
                    {
                    this.state = 1444;
                    this.errorHandler.sync(this);
                    switch (this.interpreter.adaptivePredict(this.tokenStream, 169, this.context) ) {
                    case 1:
                        {
                        localContext = new ExpressionContext(parentContext, parentState);
                        this.pushNewRecursionContext(localContext, _startState, JavaParser.RULE_expression);
                        this.state = 1363;
                        if (!(this.precpred(this.context, 18))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 18)");
                        }
                        this.state = 1364;
                        localContext._bop = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(((((_la - 104)) & ~0x1F) === 0 && ((1 << (_la - 104)) & 35) !== 0))) {
                            localContext._bop = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 1365;
                        this.expression(19);
                        }
                        break;
                    case 2:
                        {
                        localContext = new ExpressionContext(parentContext, parentState);
                        this.pushNewRecursionContext(localContext, _startState, JavaParser.RULE_expression);
                        this.state = 1366;
                        if (!(this.precpred(this.context, 17))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 17)");
                        }
                        this.state = 1367;
                        localContext._bop = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 102 || _la === 103)) {
                            localContext._bop = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 1368;
                        this.expression(18);
                        }
                        break;
                    case 3:
                        {
                        localContext = new ExpressionContext(parentContext, parentState);
                        this.pushNewRecursionContext(localContext, _startState, JavaParser.RULE_expression);
                        this.state = 1369;
                        if (!(this.precpred(this.context, 16))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 16)");
                        }
                        this.state = 1377;
                        this.errorHandler.sync(this);
                        switch (this.interpreter.adaptivePredict(this.tokenStream, 164, this.context) ) {
                        case 1:
                            {
                            this.state = 1370;
                            this.match(JavaParser.LT);
                            this.state = 1371;
                            this.match(JavaParser.LT);
                            }
                            break;
                        case 2:
                            {
                            this.state = 1372;
                            this.match(JavaParser.GT);
                            this.state = 1373;
                            this.match(JavaParser.GT);
                            this.state = 1374;
                            this.match(JavaParser.GT);
                            }
                            break;
                        case 3:
                            {
                            this.state = 1375;
                            this.match(JavaParser.GT);
                            this.state = 1376;
                            this.match(JavaParser.GT);
                            }
                            break;
                        }
                        this.state = 1379;
                        this.expression(17);
                        }
                        break;
                    case 4:
                        {
                        localContext = new ExpressionContext(parentContext, parentState);
                        this.pushNewRecursionContext(localContext, _startState, JavaParser.RULE_expression);
                        this.state = 1380;
                        if (!(this.precpred(this.context, 15))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 15)");
                        }
                        this.state = 1381;
                        localContext._bop = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(((((_la - 88)) & ~0x1F) === 0 && ((1 << (_la - 88)) & 387) !== 0))) {
                            localContext._bop = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 1382;
                        this.expression(16);
                        }
                        break;
                    case 5:
                        {
                        localContext = new ExpressionContext(parentContext, parentState);
                        this.pushNewRecursionContext(localContext, _startState, JavaParser.RULE_expression);
                        this.state = 1383;
                        if (!(this.precpred(this.context, 13))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 13)");
                        }
                        this.state = 1384;
                        localContext._bop = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 94 || _la === 97)) {
                            localContext._bop = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 1385;
                        this.expression(14);
                        }
                        break;
                    case 6:
                        {
                        localContext = new ExpressionContext(parentContext, parentState);
                        this.pushNewRecursionContext(localContext, _startState, JavaParser.RULE_expression);
                        this.state = 1386;
                        if (!(this.precpred(this.context, 12))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 12)");
                        }
                        this.state = 1387;
                        localContext._bop = this.match(JavaParser.BITAND);
                        this.state = 1388;
                        this.expression(13);
                        }
                        break;
                    case 7:
                        {
                        localContext = new ExpressionContext(parentContext, parentState);
                        this.pushNewRecursionContext(localContext, _startState, JavaParser.RULE_expression);
                        this.state = 1389;
                        if (!(this.precpred(this.context, 11))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 11)");
                        }
                        this.state = 1390;
                        localContext._bop = this.match(JavaParser.CARET);
                        this.state = 1391;
                        this.expression(12);
                        }
                        break;
                    case 8:
                        {
                        localContext = new ExpressionContext(parentContext, parentState);
                        this.pushNewRecursionContext(localContext, _startState, JavaParser.RULE_expression);
                        this.state = 1392;
                        if (!(this.precpred(this.context, 10))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 10)");
                        }
                        this.state = 1393;
                        localContext._bop = this.match(JavaParser.BITOR);
                        this.state = 1394;
                        this.expression(11);
                        }
                        break;
                    case 9:
                        {
                        localContext = new ExpressionContext(parentContext, parentState);
                        this.pushNewRecursionContext(localContext, _startState, JavaParser.RULE_expression);
                        this.state = 1395;
                        if (!(this.precpred(this.context, 9))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 9)");
                        }
                        this.state = 1396;
                        localContext._bop = this.match(JavaParser.AND);
                        this.state = 1397;
                        this.expression(10);
                        }
                        break;
                    case 10:
                        {
                        localContext = new ExpressionContext(parentContext, parentState);
                        this.pushNewRecursionContext(localContext, _startState, JavaParser.RULE_expression);
                        this.state = 1398;
                        if (!(this.precpred(this.context, 8))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 8)");
                        }
                        this.state = 1399;
                        localContext._bop = this.match(JavaParser.OR);
                        this.state = 1400;
                        this.expression(9);
                        }
                        break;
                    case 11:
                        {
                        localContext = new ExpressionContext(parentContext, parentState);
                        this.pushNewRecursionContext(localContext, _startState, JavaParser.RULE_expression);
                        this.state = 1401;
                        if (!(this.precpred(this.context, 7))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 7)");
                        }
                        this.state = 1402;
                        localContext._bop = this.match(JavaParser.QUESTION);
                        this.state = 1403;
                        this.expression(0);
                        this.state = 1404;
                        this.match(JavaParser.COLON);
                        this.state = 1405;
                        this.expression(7);
                        }
                        break;
                    case 12:
                        {
                        localContext = new ExpressionContext(parentContext, parentState);
                        this.pushNewRecursionContext(localContext, _startState, JavaParser.RULE_expression);
                        this.state = 1407;
                        if (!(this.precpred(this.context, 6))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 6)");
                        }
                        this.state = 1408;
                        localContext._bop = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(((((_la - 87)) & ~0x1F) === 0 && ((1 << (_la - 87)) & 4286578689) !== 0) || _la === 119 || _la === 120)) {
                            localContext._bop = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 1409;
                        this.expression(6);
                        }
                        break;
                    case 13:
                        {
                        localContext = new ExpressionContext(parentContext, parentState);
                        this.pushNewRecursionContext(localContext, _startState, JavaParser.RULE_expression);
                        this.state = 1410;
                        if (!(this.precpred(this.context, 26))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 26)");
                        }
                        this.state = 1411;
                        localContext._bop = this.match(JavaParser.DOT);
                        this.state = 1423;
                        this.errorHandler.sync(this);
                        switch (this.interpreter.adaptivePredict(this.tokenStream, 166, this.context) ) {
                        case 1:
                            {
                            this.state = 1412;
                            this.identifier();
                            }
                            break;
                        case 2:
                            {
                            this.state = 1413;
                            this.methodCall();
                            }
                            break;
                        case 3:
                            {
                            this.state = 1414;
                            this.match(JavaParser.THIS);
                            }
                            break;
                        case 4:
                            {
                            this.state = 1415;
                            this.match(JavaParser.NEW);
                            this.state = 1417;
                            this.errorHandler.sync(this);
                            _la = this.tokenStream.LA(1);
                            if (_la === 89) {
                                {
                                this.state = 1416;
                                this.nonWildcardTypeArguments();
                                }
                            }

                            this.state = 1419;
                            this.innerCreator();
                            }
                            break;
                        case 5:
                            {
                            this.state = 1420;
                            this.match(JavaParser.SUPER);
                            this.state = 1421;
                            this.superSuffix();
                            }
                            break;
                        case 6:
                            {
                            this.state = 1422;
                            this.explicitGenericInvocation();
                            }
                            break;
                        }
                        }
                        break;
                    case 14:
                        {
                        localContext = new ExpressionContext(parentContext, parentState);
                        this.pushNewRecursionContext(localContext, _startState, JavaParser.RULE_expression);
                        this.state = 1425;
                        if (!(this.precpred(this.context, 25))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 25)");
                        }
                        this.state = 1426;
                        this.match(JavaParser.LBRACK);
                        this.state = 1427;
                        this.expression(0);
                        this.state = 1428;
                        this.match(JavaParser.RBRACK);
                        }
                        break;
                    case 15:
                        {
                        localContext = new ExpressionContext(parentContext, parentState);
                        this.pushNewRecursionContext(localContext, _startState, JavaParser.RULE_expression);
                        this.state = 1430;
                        if (!(this.precpred(this.context, 21))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 21)");
                        }
                        this.state = 1431;
                        localContext._postfix = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 100 || _la === 101)) {
                            localContext._postfix = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        }
                        break;
                    case 16:
                        {
                        localContext = new ExpressionContext(parentContext, parentState);
                        this.pushNewRecursionContext(localContext, _startState, JavaParser.RULE_expression);
                        this.state = 1432;
                        if (!(this.precpred(this.context, 14))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 14)");
                        }
                        this.state = 1433;
                        localContext._bop = this.match(JavaParser.INSTANCEOF);
                        this.state = 1436;
                        this.errorHandler.sync(this);
                        switch (this.interpreter.adaptivePredict(this.tokenStream, 167, this.context) ) {
                        case 1:
                            {
                            this.state = 1434;
                            this.typeType();
                            }
                            break;
                        case 2:
                            {
                            this.state = 1435;
                            this.pattern();
                            }
                            break;
                        }
                        }
                        break;
                    case 17:
                        {
                        localContext = new ExpressionContext(parentContext, parentState);
                        this.pushNewRecursionContext(localContext, _startState, JavaParser.RULE_expression);
                        this.state = 1438;
                        if (!(this.precpred(this.context, 3))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 3)");
                        }
                        this.state = 1439;
                        this.match(JavaParser.COLONCOLON);
                        this.state = 1441;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                        if (_la === 89) {
                            {
                            this.state = 1440;
                            this.typeArguments();
                            }
                        }

                        this.state = 1443;
                        this.identifier();
                        }
                        break;
                    }
                    }
                }
                this.state = 1448;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 170, this.context);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.unrollRecursionContexts(parentContext);
        }
        return localContext;
    }
    public pattern(): PatternContext {
        let localContext = new PatternContext(this.context, this.state);
        this.enterRule(localContext, 196, JavaParser.RULE_pattern);
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1452;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 171, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 1449;
                    this.variableModifier();
                    }
                    }
                }
                this.state = 1454;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 171, this.context);
            }
            this.state = 1455;
            this.typeType();
            this.state = 1459;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 172, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 1456;
                    this.annotation();
                    }
                    }
                }
                this.state = 1461;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 172, this.context);
            }
            this.state = 1462;
            this.identifier();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public lambdaExpression(): LambdaExpressionContext {
        let localContext = new LambdaExpressionContext(this.context, this.state);
        this.enterRule(localContext, 198, JavaParser.RULE_lambdaExpression);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1464;
            this.lambdaParameters();
            this.state = 1465;
            this.match(JavaParser.ARROW);
            this.state = 1466;
            this.lambdaBody();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public lambdaParameters(): LambdaParametersContext {
        let localContext = new LambdaParametersContext(this.context, this.state);
        this.enterRule(localContext, 200, JavaParser.RULE_lambdaParameters);
        let _la: number;
        try {
            this.state = 1490;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 176, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 1468;
                this.identifier();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 1469;
                this.match(JavaParser.LPAREN);
                this.state = 1471;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 672416040) !== 0) || ((((_la - 37)) & ~0x1F) === 0 && ((1 << (_la - 37)) & 536854529) !== 0) || _la === 123 || _la === 128) {
                    {
                    this.state = 1470;
                    this.formalParameterList();
                    }
                }

                this.state = 1473;
                this.match(JavaParser.RPAREN);
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 1474;
                this.match(JavaParser.LPAREN);
                this.state = 1475;
                this.identifier();
                this.state = 1480;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 85) {
                    {
                    {
                    this.state = 1476;
                    this.match(JavaParser.COMMA);
                    this.state = 1477;
                    this.identifier();
                    }
                    }
                    this.state = 1482;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 1483;
                this.match(JavaParser.RPAREN);
                }
                break;
            case 4:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 1485;
                this.match(JavaParser.LPAREN);
                this.state = 1487;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 18 || ((((_la - 51)) & ~0x1F) === 0 && ((1 << (_la - 51)) & 32767) !== 0) || _la === 123 || _la === 128) {
                    {
                    this.state = 1486;
                    this.lambdaLVTIList();
                    }
                }

                this.state = 1489;
                this.match(JavaParser.RPAREN);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public lambdaBody(): LambdaBodyContext {
        let localContext = new LambdaBodyContext(this.context, this.state);
        this.enterRule(localContext, 202, JavaParser.RULE_lambdaBody);
        try {
            this.state = 1494;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case JavaParser.BOOLEAN:
            case JavaParser.BYTE:
            case JavaParser.CHAR:
            case JavaParser.DOUBLE:
            case JavaParser.FLOAT:
            case JavaParser.INT:
            case JavaParser.LONG:
            case JavaParser.NEW:
            case JavaParser.SHORT:
            case JavaParser.SUPER:
            case JavaParser.SWITCH:
            case JavaParser.THIS:
            case JavaParser.VOID:
            case JavaParser.MODULE:
            case JavaParser.OPEN:
            case JavaParser.REQUIRES:
            case JavaParser.EXPORTS:
            case JavaParser.OPENS:
            case JavaParser.TO:
            case JavaParser.USES:
            case JavaParser.PROVIDES:
            case JavaParser.WITH:
            case JavaParser.TRANSITIVE:
            case JavaParser.VAR:
            case JavaParser.YIELD:
            case JavaParser.RECORD:
            case JavaParser.SEALED:
            case JavaParser.PERMITS:
            case JavaParser.DECIMAL_LITERAL:
            case JavaParser.HEX_LITERAL:
            case JavaParser.OCT_LITERAL:
            case JavaParser.BINARY_LITERAL:
            case JavaParser.FLOAT_LITERAL:
            case JavaParser.HEX_FLOAT_LITERAL:
            case JavaParser.BOOL_LITERAL:
            case JavaParser.CHAR_LITERAL:
            case JavaParser.STRING_LITERAL:
            case JavaParser.TEXT_BLOCK:
            case JavaParser.NULL_LITERAL:
            case JavaParser.LPAREN:
            case JavaParser.LT:
            case JavaParser.BANG:
            case JavaParser.TILDE:
            case JavaParser.INC:
            case JavaParser.DEC:
            case JavaParser.ADD:
            case JavaParser.SUB:
            case JavaParser.AT:
            case JavaParser.IDENTIFIER:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 1492;
                this.expression(0);
                }
                break;
            case JavaParser.LBRACE:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 1493;
                this.block();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public primary(): PrimaryContext {
        let localContext = new PrimaryContext(this.context, this.state);
        this.enterRule(localContext, 204, JavaParser.RULE_primary);
        try {
            this.state = 1514;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 179, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 1496;
                this.match(JavaParser.LPAREN);
                this.state = 1497;
                this.expression(0);
                this.state = 1498;
                this.match(JavaParser.RPAREN);
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 1500;
                this.match(JavaParser.THIS);
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 1501;
                this.match(JavaParser.SUPER);
                }
                break;
            case 4:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 1502;
                this.literal();
                }
                break;
            case 5:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 1503;
                this.identifier();
                }
                break;
            case 6:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 1504;
                this.typeTypeOrVoid();
                this.state = 1505;
                this.match(JavaParser.DOT);
                this.state = 1506;
                this.match(JavaParser.CLASS);
                }
                break;
            case 7:
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 1508;
                this.nonWildcardTypeArguments();
                this.state = 1512;
                this.errorHandler.sync(this);
                switch (this.tokenStream.LA(1)) {
                case JavaParser.SUPER:
                case JavaParser.MODULE:
                case JavaParser.OPEN:
                case JavaParser.REQUIRES:
                case JavaParser.EXPORTS:
                case JavaParser.OPENS:
                case JavaParser.TO:
                case JavaParser.USES:
                case JavaParser.PROVIDES:
                case JavaParser.WITH:
                case JavaParser.TRANSITIVE:
                case JavaParser.VAR:
                case JavaParser.YIELD:
                case JavaParser.RECORD:
                case JavaParser.SEALED:
                case JavaParser.PERMITS:
                case JavaParser.IDENTIFIER:
                    {
                    this.state = 1509;
                    this.explicitGenericInvocationSuffix();
                    }
                    break;
                case JavaParser.THIS:
                    {
                    this.state = 1510;
                    this.match(JavaParser.THIS);
                    this.state = 1511;
                    this.arguments();
                    }
                    break;
                default:
                    throw new antlr.NoViableAltException(this);
                }
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public switchExpression(): SwitchExpressionContext {
        let localContext = new SwitchExpressionContext(this.context, this.state);
        this.enterRule(localContext, 206, JavaParser.RULE_switchExpression);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1516;
            this.match(JavaParser.SWITCH);
            this.state = 1517;
            this.parExpression();
            this.state = 1518;
            this.match(JavaParser.LBRACE);
            this.state = 1522;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 6 || _la === 12) {
                {
                {
                this.state = 1519;
                this.switchLabeledRule();
                }
                }
                this.state = 1524;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 1525;
            this.match(JavaParser.RBRACE);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public switchLabeledRule(): SwitchLabeledRuleContext {
        let localContext = new SwitchLabeledRuleContext(this.context, this.state);
        this.enterRule(localContext, 208, JavaParser.RULE_switchLabeledRule);
        let _la: number;
        try {
            this.state = 1538;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case JavaParser.CASE:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 1527;
                this.match(JavaParser.CASE);
                this.state = 1531;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 181, this.context) ) {
                case 1:
                    {
                    this.state = 1528;
                    this.expressionList();
                    }
                    break;
                case 2:
                    {
                    this.state = 1529;
                    this.match(JavaParser.NULL_LITERAL);
                    }
                    break;
                case 3:
                    {
                    this.state = 1530;
                    this.guardedPattern(0);
                    }
                    break;
                }
                this.state = 1533;
                _la = this.tokenStream.LA(1);
                if(!(_la === 93 || _la === 121)) {
                this.errorHandler.recoverInline(this);
                }
                else {
                    this.errorHandler.reportMatch(this);
                    this.consume();
                }
                this.state = 1534;
                this.switchRuleOutcome();
                }
                break;
            case JavaParser.DEFAULT:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 1535;
                this.match(JavaParser.DEFAULT);
                this.state = 1536;
                _la = this.tokenStream.LA(1);
                if(!(_la === 93 || _la === 121)) {
                this.errorHandler.recoverInline(this);
                }
                else {
                    this.errorHandler.reportMatch(this);
                    this.consume();
                }
                this.state = 1537;
                this.switchRuleOutcome();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }

    public guardedPattern(): GuardedPatternContext;
    public guardedPattern(_p: number): GuardedPatternContext;
    public guardedPattern(_p?: number): GuardedPatternContext {
        if (_p === undefined) {
            _p = 0;
        }

        let parentContext = this.context;
        let parentState = this.state;
        let localContext = new GuardedPatternContext(this.context, parentState);
        let previousContext = localContext;
        let _startState = 210;
        this.enterRecursionRule(localContext, 210, JavaParser.RULE_guardedPattern, _p);
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1566;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case JavaParser.LPAREN:
                {
                this.state = 1541;
                this.match(JavaParser.LPAREN);
                this.state = 1542;
                this.guardedPattern(0);
                this.state = 1543;
                this.match(JavaParser.RPAREN);
                }
                break;
            case JavaParser.BOOLEAN:
            case JavaParser.BYTE:
            case JavaParser.CHAR:
            case JavaParser.DOUBLE:
            case JavaParser.FINAL:
            case JavaParser.FLOAT:
            case JavaParser.INT:
            case JavaParser.LONG:
            case JavaParser.SHORT:
            case JavaParser.MODULE:
            case JavaParser.OPEN:
            case JavaParser.REQUIRES:
            case JavaParser.EXPORTS:
            case JavaParser.OPENS:
            case JavaParser.TO:
            case JavaParser.USES:
            case JavaParser.PROVIDES:
            case JavaParser.WITH:
            case JavaParser.TRANSITIVE:
            case JavaParser.VAR:
            case JavaParser.YIELD:
            case JavaParser.RECORD:
            case JavaParser.SEALED:
            case JavaParser.PERMITS:
            case JavaParser.AT:
            case JavaParser.IDENTIFIER:
                {
                this.state = 1548;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 183, this.context);
                while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1) {
                        {
                        {
                        this.state = 1545;
                        this.variableModifier();
                        }
                        }
                    }
                    this.state = 1550;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 183, this.context);
                }
                this.state = 1551;
                this.typeType();
                this.state = 1555;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 184, this.context);
                while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1) {
                        {
                        {
                        this.state = 1552;
                        this.annotation();
                        }
                        }
                    }
                    this.state = 1557;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 184, this.context);
                }
                this.state = 1558;
                this.identifier();
                this.state = 1563;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 185, this.context);
                while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1) {
                        {
                        {
                        this.state = 1559;
                        this.match(JavaParser.AND);
                        this.state = 1560;
                        this.expression(0);
                        }
                        }
                    }
                    this.state = 1565;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 185, this.context);
                }
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
            this.context!.stop = this.tokenStream.LT(-1);
            this.state = 1573;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 187, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    if (this.parseListeners != null) {
                        this.triggerExitRuleEvent();
                    }
                    previousContext = localContext;
                    {
                    {
                    localContext = new GuardedPatternContext(parentContext, parentState);
                    this.pushNewRecursionContext(localContext, _startState, JavaParser.RULE_guardedPattern);
                    this.state = 1568;
                    if (!(this.precpred(this.context, 1))) {
                        throw this.createFailedPredicateException("this.precpred(this.context, 1)");
                    }
                    this.state = 1569;
                    this.match(JavaParser.AND);
                    this.state = 1570;
                    this.expression(0);
                    }
                    }
                }
                this.state = 1575;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 187, this.context);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.unrollRecursionContexts(parentContext);
        }
        return localContext;
    }
    public switchRuleOutcome(): SwitchRuleOutcomeContext {
        let localContext = new SwitchRuleOutcomeContext(this.context, this.state);
        this.enterRule(localContext, 212, JavaParser.RULE_switchRuleOutcome);
        let _la: number;
        try {
            this.state = 1583;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 189, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 1576;
                this.block();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 1580;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 3094637374) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & 4294889471) !== 0) || ((((_la - 65)) & ~0x1F) === 0 && ((1 << (_la - 65)) & 118013951) !== 0) || ((((_la - 100)) & ~0x1F) === 0 && ((1 << (_la - 100)) & 276824079) !== 0)) {
                    {
                    {
                    this.state = 1577;
                    this.blockStatement();
                    }
                    }
                    this.state = 1582;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public classType(): ClassTypeContext {
        let localContext = new ClassTypeContext(this.context, this.state);
        this.enterRule(localContext, 214, JavaParser.RULE_classType);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1588;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 190, this.context) ) {
            case 1:
                {
                this.state = 1585;
                this.classOrInterfaceType();
                this.state = 1586;
                this.match(JavaParser.DOT);
                }
                break;
            }
            this.state = 1593;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 191, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 1590;
                    this.annotation();
                    }
                    }
                }
                this.state = 1595;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 191, this.context);
            }
            this.state = 1596;
            this.identifier();
            this.state = 1598;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 89) {
                {
                this.state = 1597;
                this.typeArguments();
                }
            }

            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public creator(): CreatorContext {
        let localContext = new CreatorContext(this.context, this.state);
        this.enterRule(localContext, 216, JavaParser.RULE_creator);
        try {
            this.state = 1609;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case JavaParser.LT:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 1600;
                this.nonWildcardTypeArguments();
                this.state = 1601;
                this.createdName();
                this.state = 1602;
                this.classCreatorRest();
                }
                break;
            case JavaParser.BOOLEAN:
            case JavaParser.BYTE:
            case JavaParser.CHAR:
            case JavaParser.DOUBLE:
            case JavaParser.FLOAT:
            case JavaParser.INT:
            case JavaParser.LONG:
            case JavaParser.SHORT:
            case JavaParser.MODULE:
            case JavaParser.OPEN:
            case JavaParser.REQUIRES:
            case JavaParser.EXPORTS:
            case JavaParser.OPENS:
            case JavaParser.TO:
            case JavaParser.USES:
            case JavaParser.PROVIDES:
            case JavaParser.WITH:
            case JavaParser.TRANSITIVE:
            case JavaParser.VAR:
            case JavaParser.YIELD:
            case JavaParser.RECORD:
            case JavaParser.SEALED:
            case JavaParser.PERMITS:
            case JavaParser.IDENTIFIER:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 1604;
                this.createdName();
                this.state = 1607;
                this.errorHandler.sync(this);
                switch (this.tokenStream.LA(1)) {
                case JavaParser.LBRACK:
                    {
                    this.state = 1605;
                    this.arrayCreatorRest();
                    }
                    break;
                case JavaParser.LPAREN:
                    {
                    this.state = 1606;
                    this.classCreatorRest();
                    }
                    break;
                default:
                    throw new antlr.NoViableAltException(this);
                }
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public createdName(): CreatedNameContext {
        let localContext = new CreatedNameContext(this.context, this.state);
        this.enterRule(localContext, 218, JavaParser.RULE_createdName);
        let _la: number;
        try {
            this.state = 1626;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case JavaParser.MODULE:
            case JavaParser.OPEN:
            case JavaParser.REQUIRES:
            case JavaParser.EXPORTS:
            case JavaParser.OPENS:
            case JavaParser.TO:
            case JavaParser.USES:
            case JavaParser.PROVIDES:
            case JavaParser.WITH:
            case JavaParser.TRANSITIVE:
            case JavaParser.VAR:
            case JavaParser.YIELD:
            case JavaParser.RECORD:
            case JavaParser.SEALED:
            case JavaParser.PERMITS:
            case JavaParser.IDENTIFIER:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 1611;
                this.identifier();
                this.state = 1613;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 89) {
                    {
                    this.state = 1612;
                    this.typeArgumentsOrDiamond();
                    }
                }

                this.state = 1622;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 86) {
                    {
                    {
                    this.state = 1615;
                    this.match(JavaParser.DOT);
                    this.state = 1616;
                    this.identifier();
                    this.state = 1618;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    if (_la === 89) {
                        {
                        this.state = 1617;
                        this.typeArgumentsOrDiamond();
                        }
                    }

                    }
                    }
                    this.state = 1624;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                }
                break;
            case JavaParser.BOOLEAN:
            case JavaParser.BYTE:
            case JavaParser.CHAR:
            case JavaParser.DOUBLE:
            case JavaParser.FLOAT:
            case JavaParser.INT:
            case JavaParser.LONG:
            case JavaParser.SHORT:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 1625;
                this.primitiveType();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public innerCreator(): InnerCreatorContext {
        let localContext = new InnerCreatorContext(this.context, this.state);
        this.enterRule(localContext, 220, JavaParser.RULE_innerCreator);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1628;
            this.identifier();
            this.state = 1630;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 89) {
                {
                this.state = 1629;
                this.nonWildcardTypeArgumentsOrDiamond();
                }
            }

            this.state = 1632;
            this.classCreatorRest();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public arrayCreatorRest(): ArrayCreatorRestContext {
        let localContext = new ArrayCreatorRestContext(this.context, this.state);
        this.enterRule(localContext, 222, JavaParser.RULE_arrayCreatorRest);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1634;
            this.match(JavaParser.LBRACK);
            this.state = 1662;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case JavaParser.RBRACK:
                {
                this.state = 1635;
                this.match(JavaParser.RBRACK);
                this.state = 1640;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 82) {
                    {
                    {
                    this.state = 1636;
                    this.match(JavaParser.LBRACK);
                    this.state = 1637;
                    this.match(JavaParser.RBRACK);
                    }
                    }
                    this.state = 1642;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 1643;
                this.arrayInitializer();
                }
                break;
            case JavaParser.BOOLEAN:
            case JavaParser.BYTE:
            case JavaParser.CHAR:
            case JavaParser.DOUBLE:
            case JavaParser.FLOAT:
            case JavaParser.INT:
            case JavaParser.LONG:
            case JavaParser.NEW:
            case JavaParser.SHORT:
            case JavaParser.SUPER:
            case JavaParser.SWITCH:
            case JavaParser.THIS:
            case JavaParser.VOID:
            case JavaParser.MODULE:
            case JavaParser.OPEN:
            case JavaParser.REQUIRES:
            case JavaParser.EXPORTS:
            case JavaParser.OPENS:
            case JavaParser.TO:
            case JavaParser.USES:
            case JavaParser.PROVIDES:
            case JavaParser.WITH:
            case JavaParser.TRANSITIVE:
            case JavaParser.VAR:
            case JavaParser.YIELD:
            case JavaParser.RECORD:
            case JavaParser.SEALED:
            case JavaParser.PERMITS:
            case JavaParser.DECIMAL_LITERAL:
            case JavaParser.HEX_LITERAL:
            case JavaParser.OCT_LITERAL:
            case JavaParser.BINARY_LITERAL:
            case JavaParser.FLOAT_LITERAL:
            case JavaParser.HEX_FLOAT_LITERAL:
            case JavaParser.BOOL_LITERAL:
            case JavaParser.CHAR_LITERAL:
            case JavaParser.STRING_LITERAL:
            case JavaParser.TEXT_BLOCK:
            case JavaParser.NULL_LITERAL:
            case JavaParser.LPAREN:
            case JavaParser.LT:
            case JavaParser.BANG:
            case JavaParser.TILDE:
            case JavaParser.INC:
            case JavaParser.DEC:
            case JavaParser.ADD:
            case JavaParser.SUB:
            case JavaParser.AT:
            case JavaParser.IDENTIFIER:
                {
                this.state = 1644;
                this.expression(0);
                this.state = 1645;
                this.match(JavaParser.RBRACK);
                this.state = 1652;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 201, this.context);
                while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1) {
                        {
                        {
                        this.state = 1646;
                        this.match(JavaParser.LBRACK);
                        this.state = 1647;
                        this.expression(0);
                        this.state = 1648;
                        this.match(JavaParser.RBRACK);
                        }
                        }
                    }
                    this.state = 1654;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 201, this.context);
                }
                this.state = 1659;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 202, this.context);
                while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1) {
                        {
                        {
                        this.state = 1655;
                        this.match(JavaParser.LBRACK);
                        this.state = 1656;
                        this.match(JavaParser.RBRACK);
                        }
                        }
                    }
                    this.state = 1661;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 202, this.context);
                }
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public classCreatorRest(): ClassCreatorRestContext {
        let localContext = new ClassCreatorRestContext(this.context, this.state);
        this.enterRule(localContext, 224, JavaParser.RULE_classCreatorRest);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1664;
            this.arguments();
            this.state = 1666;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 204, this.context) ) {
            case 1:
                {
                this.state = 1665;
                this.classBody();
                }
                break;
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public explicitGenericInvocation(): ExplicitGenericInvocationContext {
        let localContext = new ExplicitGenericInvocationContext(this.context, this.state);
        this.enterRule(localContext, 226, JavaParser.RULE_explicitGenericInvocation);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1668;
            this.nonWildcardTypeArguments();
            this.state = 1669;
            this.explicitGenericInvocationSuffix();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public typeArgumentsOrDiamond(): TypeArgumentsOrDiamondContext {
        let localContext = new TypeArgumentsOrDiamondContext(this.context, this.state);
        this.enterRule(localContext, 228, JavaParser.RULE_typeArgumentsOrDiamond);
        try {
            this.state = 1674;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 205, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 1671;
                this.match(JavaParser.LT);
                this.state = 1672;
                this.match(JavaParser.GT);
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 1673;
                this.typeArguments();
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public nonWildcardTypeArgumentsOrDiamond(): NonWildcardTypeArgumentsOrDiamondContext {
        let localContext = new NonWildcardTypeArgumentsOrDiamondContext(this.context, this.state);
        this.enterRule(localContext, 230, JavaParser.RULE_nonWildcardTypeArgumentsOrDiamond);
        try {
            this.state = 1679;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 206, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 1676;
                this.match(JavaParser.LT);
                this.state = 1677;
                this.match(JavaParser.GT);
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 1678;
                this.nonWildcardTypeArguments();
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public nonWildcardTypeArguments(): NonWildcardTypeArgumentsContext {
        let localContext = new NonWildcardTypeArgumentsContext(this.context, this.state);
        this.enterRule(localContext, 232, JavaParser.RULE_nonWildcardTypeArguments);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1681;
            this.match(JavaParser.LT);
            this.state = 1682;
            this.typeList();
            this.state = 1683;
            this.match(JavaParser.GT);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public typeList(): TypeListContext {
        let localContext = new TypeListContext(this.context, this.state);
        this.enterRule(localContext, 234, JavaParser.RULE_typeList);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1685;
            this.typeType();
            this.state = 1690;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 85) {
                {
                {
                this.state = 1686;
                this.match(JavaParser.COMMA);
                this.state = 1687;
                this.typeType();
                }
                }
                this.state = 1692;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public typeType(): TypeTypeContext {
        let localContext = new TypeTypeContext(this.context, this.state);
        this.enterRule(localContext, 236, JavaParser.RULE_typeType);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1696;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 208, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 1693;
                    this.annotation();
                    }
                    }
                }
                this.state = 1698;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 208, this.context);
            }
            this.state = 1701;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case JavaParser.MODULE:
            case JavaParser.OPEN:
            case JavaParser.REQUIRES:
            case JavaParser.EXPORTS:
            case JavaParser.OPENS:
            case JavaParser.TO:
            case JavaParser.USES:
            case JavaParser.PROVIDES:
            case JavaParser.WITH:
            case JavaParser.TRANSITIVE:
            case JavaParser.VAR:
            case JavaParser.YIELD:
            case JavaParser.RECORD:
            case JavaParser.SEALED:
            case JavaParser.PERMITS:
            case JavaParser.IDENTIFIER:
                {
                this.state = 1699;
                this.classOrInterfaceType();
                }
                break;
            case JavaParser.BOOLEAN:
            case JavaParser.BYTE:
            case JavaParser.CHAR:
            case JavaParser.DOUBLE:
            case JavaParser.FLOAT:
            case JavaParser.INT:
            case JavaParser.LONG:
            case JavaParser.SHORT:
                {
                this.state = 1700;
                this.primitiveType();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
            this.state = 1713;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 211, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 1706;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    while (((((_la - 51)) & ~0x1F) === 0 && ((1 << (_la - 51)) & 32767) !== 0) || _la === 123 || _la === 128) {
                        {
                        {
                        this.state = 1703;
                        this.annotation();
                        }
                        }
                        this.state = 1708;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                    }
                    this.state = 1709;
                    this.match(JavaParser.LBRACK);
                    this.state = 1710;
                    this.match(JavaParser.RBRACK);
                    }
                    }
                }
                this.state = 1715;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 211, this.context);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public primitiveType(): PrimitiveTypeContext {
        let localContext = new PrimitiveTypeContext(this.context, this.state);
        this.enterRule(localContext, 238, JavaParser.RULE_primitiveType);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1716;
            _la = this.tokenStream.LA(1);
            if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 672153896) !== 0) || _la === 37)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public typeArguments(): TypeArgumentsContext {
        let localContext = new TypeArgumentsContext(this.context, this.state);
        this.enterRule(localContext, 240, JavaParser.RULE_typeArguments);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1718;
            this.match(JavaParser.LT);
            this.state = 1719;
            this.typeArgument();
            this.state = 1724;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 85) {
                {
                {
                this.state = 1720;
                this.match(JavaParser.COMMA);
                this.state = 1721;
                this.typeArgument();
                }
                }
                this.state = 1726;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 1727;
            this.match(JavaParser.GT);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public superSuffix(): SuperSuffixContext {
        let localContext = new SuperSuffixContext(this.context, this.state);
        this.enterRule(localContext, 242, JavaParser.RULE_superSuffix);
        let _la: number;
        try {
            this.state = 1738;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case JavaParser.LPAREN:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 1729;
                this.arguments();
                }
                break;
            case JavaParser.DOT:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 1730;
                this.match(JavaParser.DOT);
                this.state = 1732;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 89) {
                    {
                    this.state = 1731;
                    this.typeArguments();
                    }
                }

                this.state = 1734;
                this.identifier();
                this.state = 1736;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 214, this.context) ) {
                case 1:
                    {
                    this.state = 1735;
                    this.arguments();
                    }
                    break;
                }
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public explicitGenericInvocationSuffix(): ExplicitGenericInvocationSuffixContext {
        let localContext = new ExplicitGenericInvocationSuffixContext(this.context, this.state);
        this.enterRule(localContext, 244, JavaParser.RULE_explicitGenericInvocationSuffix);
        try {
            this.state = 1745;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case JavaParser.SUPER:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 1740;
                this.match(JavaParser.SUPER);
                this.state = 1741;
                this.superSuffix();
                }
                break;
            case JavaParser.MODULE:
            case JavaParser.OPEN:
            case JavaParser.REQUIRES:
            case JavaParser.EXPORTS:
            case JavaParser.OPENS:
            case JavaParser.TO:
            case JavaParser.USES:
            case JavaParser.PROVIDES:
            case JavaParser.WITH:
            case JavaParser.TRANSITIVE:
            case JavaParser.VAR:
            case JavaParser.YIELD:
            case JavaParser.RECORD:
            case JavaParser.SEALED:
            case JavaParser.PERMITS:
            case JavaParser.IDENTIFIER:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 1742;
                this.identifier();
                this.state = 1743;
                this.arguments();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public arguments(): ArgumentsContext {
        let localContext = new ArgumentsContext(this.context, this.state);
        this.enterRule(localContext, 246, JavaParser.RULE_arguments);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1747;
            this.match(JavaParser.LPAREN);
            this.state = 1749;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 2819637544) !== 0) || ((((_la - 37)) & ~0x1F) === 0 && ((1 << (_la - 37)) & 3758082137) !== 0) || ((((_la - 69)) & ~0x1F) === 0 && ((1 << (_la - 69)) & 2154824703) !== 0) || ((((_la - 101)) & ~0x1F) === 0 && ((1 << (_la - 101)) & 138412039) !== 0)) {
                {
                this.state = 1748;
                this.expressionList();
                }
            }

            this.state = 1751;
            this.match(JavaParser.RPAREN);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }

    public override sempred(localContext: antlr.ParserRuleContext | null, ruleIndex: number, predIndex: number): boolean {
        switch (ruleIndex) {
        case 97:
            return this.expression_sempred(localContext as ExpressionContext, predIndex);
        case 105:
            return this.guardedPattern_sempred(localContext as GuardedPatternContext, predIndex);
        }
        return true;
    }
    private expression_sempred(localContext: ExpressionContext | null, predIndex: number): boolean {
        switch (predIndex) {
        case 0:
            return this.precpred(this.context, 18);
        case 1:
            return this.precpred(this.context, 17);
        case 2:
            return this.precpred(this.context, 16);
        case 3:
            return this.precpred(this.context, 15);
        case 4:
            return this.precpred(this.context, 13);
        case 5:
            return this.precpred(this.context, 12);
        case 6:
            return this.precpred(this.context, 11);
        case 7:
            return this.precpred(this.context, 10);
        case 8:
            return this.precpred(this.context, 9);
        case 9:
            return this.precpred(this.context, 8);
        case 10:
            return this.precpred(this.context, 7);
        case 11:
            return this.precpred(this.context, 6);
        case 12:
            return this.precpred(this.context, 26);
        case 13:
            return this.precpred(this.context, 25);
        case 14:
            return this.precpred(this.context, 21);
        case 15:
            return this.precpred(this.context, 14);
        case 16:
            return this.precpred(this.context, 3);
        }
        return true;
    }
    private guardedPattern_sempred(localContext: GuardedPatternContext | null, predIndex: number): boolean {
        switch (predIndex) {
        case 17:
            return this.precpred(this.context, 1);
        }
        return true;
    }

    public static readonly _serializedATN: number[] = [
        4,1,128,1754,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,
        7,6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,2,13,7,
        13,2,14,7,14,2,15,7,15,2,16,7,16,2,17,7,17,2,18,7,18,2,19,7,19,2,
        20,7,20,2,21,7,21,2,22,7,22,2,23,7,23,2,24,7,24,2,25,7,25,2,26,7,
        26,2,27,7,27,2,28,7,28,2,29,7,29,2,30,7,30,2,31,7,31,2,32,7,32,2,
        33,7,33,2,34,7,34,2,35,7,35,2,36,7,36,2,37,7,37,2,38,7,38,2,39,7,
        39,2,40,7,40,2,41,7,41,2,42,7,42,2,43,7,43,2,44,7,44,2,45,7,45,2,
        46,7,46,2,47,7,47,2,48,7,48,2,49,7,49,2,50,7,50,2,51,7,51,2,52,7,
        52,2,53,7,53,2,54,7,54,2,55,7,55,2,56,7,56,2,57,7,57,2,58,7,58,2,
        59,7,59,2,60,7,60,2,61,7,61,2,62,7,62,2,63,7,63,2,64,7,64,2,65,7,
        65,2,66,7,66,2,67,7,67,2,68,7,68,2,69,7,69,2,70,7,70,2,71,7,71,2,
        72,7,72,2,73,7,73,2,74,7,74,2,75,7,75,2,76,7,76,2,77,7,77,2,78,7,
        78,2,79,7,79,2,80,7,80,2,81,7,81,2,82,7,82,2,83,7,83,2,84,7,84,2,
        85,7,85,2,86,7,86,2,87,7,87,2,88,7,88,2,89,7,89,2,90,7,90,2,91,7,
        91,2,92,7,92,2,93,7,93,2,94,7,94,2,95,7,95,2,96,7,96,2,97,7,97,2,
        98,7,98,2,99,7,99,2,100,7,100,2,101,7,101,2,102,7,102,2,103,7,103,
        2,104,7,104,2,105,7,105,2,106,7,106,2,107,7,107,2,108,7,108,2,109,
        7,109,2,110,7,110,2,111,7,111,2,112,7,112,2,113,7,113,2,114,7,114,
        2,115,7,115,2,116,7,116,2,117,7,117,2,118,7,118,2,119,7,119,2,120,
        7,120,2,121,7,121,2,122,7,122,2,123,7,123,1,0,3,0,250,8,0,1,0,5,
        0,253,8,0,10,0,12,0,256,9,0,1,0,5,0,259,8,0,10,0,12,0,262,9,0,1,
        0,1,0,1,0,1,0,3,0,268,8,0,1,1,5,1,271,8,1,10,1,12,1,274,9,1,1,1,
        1,1,1,1,1,1,1,2,1,2,3,2,282,8,2,1,2,1,2,1,2,3,2,287,8,2,1,2,1,2,
        1,3,5,3,292,8,3,10,3,12,3,295,9,3,1,3,1,3,1,3,1,3,1,3,3,3,302,8,
        3,1,3,3,3,305,8,3,1,4,1,4,1,4,1,4,1,4,3,4,312,8,4,1,5,1,5,1,5,1,
        5,1,5,1,5,1,5,1,5,1,5,1,5,3,5,324,8,5,1,6,1,6,3,6,328,8,6,1,7,1,
        7,1,7,3,7,333,8,7,1,7,1,7,3,7,337,8,7,1,7,1,7,3,7,341,8,7,1,7,1,
        7,3,7,345,8,7,1,7,1,7,1,8,1,8,1,8,1,8,5,8,353,8,8,10,8,12,8,356,
        9,8,1,8,1,8,1,9,5,9,361,8,9,10,9,12,9,364,9,9,1,9,1,9,1,9,5,9,369,
        8,9,10,9,12,9,372,9,9,1,9,3,9,375,8,9,1,10,1,10,1,10,5,10,380,8,
        10,10,10,12,10,383,9,10,1,11,1,11,1,11,1,11,3,11,389,8,11,1,11,1,
        11,3,11,393,8,11,1,11,3,11,396,8,11,1,11,3,11,399,8,11,1,11,1,11,
        1,12,1,12,1,12,5,12,406,8,12,10,12,12,12,409,9,12,1,13,5,13,412,
        8,13,10,13,12,13,415,9,13,1,13,1,13,3,13,419,8,13,1,13,3,13,422,
        8,13,1,14,1,14,5,14,426,8,14,10,14,12,14,429,9,14,1,15,1,15,1,15,
        3,15,434,8,15,1,15,1,15,3,15,438,8,15,1,15,1,15,1,16,1,16,5,16,444,
        8,16,10,16,12,16,447,9,16,1,16,1,16,1,17,1,17,5,17,453,8,17,10,17,
        12,17,456,9,17,1,17,1,17,1,18,1,18,3,18,462,8,18,1,18,1,18,5,18,
        466,8,18,10,18,12,18,469,9,18,1,18,3,18,472,8,18,1,19,1,19,1,19,
        1,19,1,19,1,19,1,19,1,19,1,19,1,19,3,19,484,8,19,1,20,1,20,1,20,
        1,20,1,20,5,20,491,8,20,10,20,12,20,494,9,20,1,20,1,20,3,20,498,
        8,20,1,20,1,20,1,21,1,21,3,21,504,8,21,1,22,1,22,3,22,508,8,22,1,
        23,1,23,1,23,1,24,1,24,1,24,1,25,1,25,1,25,1,25,3,25,520,8,25,1,
        25,1,25,1,26,1,26,1,26,1,26,1,27,5,27,529,8,27,10,27,12,27,532,9,
        27,1,27,1,27,3,27,536,8,27,1,28,1,28,1,28,1,28,1,28,1,28,1,28,1,
        28,3,28,546,8,28,1,29,1,29,1,29,1,29,5,29,552,8,29,10,29,12,29,555,
        9,29,1,29,1,29,1,30,1,30,1,30,5,30,562,8,30,10,30,12,30,565,9,30,
        1,30,1,30,1,30,1,31,5,31,571,8,31,10,31,12,31,574,9,31,1,31,1,31,
        1,32,1,32,1,32,1,32,1,32,1,32,3,32,584,8,32,1,33,5,33,587,8,33,10,
        33,12,33,590,9,33,1,33,1,33,1,33,1,34,5,34,596,8,34,10,34,12,34,
        599,9,34,1,34,1,34,1,34,1,34,1,34,5,34,606,8,34,10,34,12,34,609,
        9,34,1,34,1,34,3,34,613,8,34,1,34,1,34,1,35,1,35,1,35,5,35,620,8,
        35,10,35,12,35,623,9,35,1,36,1,36,1,36,3,36,628,8,36,1,37,1,37,1,
        37,5,37,633,8,37,10,37,12,37,636,9,37,1,38,1,38,3,38,640,8,38,1,
        39,1,39,1,39,1,39,5,39,646,8,39,10,39,12,39,649,9,39,1,39,3,39,652,
        8,39,3,39,654,8,39,1,39,1,39,1,40,1,40,3,40,660,8,40,1,40,1,40,1,
        40,3,40,665,8,40,5,40,667,8,40,10,40,12,40,670,9,40,1,41,1,41,5,
        41,674,8,41,10,41,12,41,677,9,41,1,41,1,41,1,41,3,41,682,8,41,3,
        41,684,8,41,1,42,1,42,1,42,5,42,689,8,42,10,42,12,42,692,9,42,1,
        43,1,43,3,43,696,8,43,1,43,1,43,1,43,3,43,701,8,43,1,43,3,43,704,
        8,43,3,43,706,8,43,1,43,1,43,1,44,1,44,1,44,1,44,5,44,714,8,44,10,
        44,12,44,717,9,44,1,44,1,44,1,45,1,45,1,45,5,45,724,8,45,10,45,12,
        45,727,9,45,1,45,1,45,3,45,731,8,45,1,45,3,45,734,8,45,1,46,5,46,
        737,8,46,10,46,12,46,740,9,46,1,46,1,46,1,46,1,47,5,47,746,8,47,
        10,47,12,47,749,9,47,1,47,1,47,5,47,753,8,47,10,47,12,47,756,9,47,
        1,47,1,47,1,47,1,48,1,48,1,48,5,48,764,8,48,10,48,12,48,767,9,48,
        1,49,5,49,770,8,49,10,49,12,49,773,9,49,1,49,1,49,1,49,1,50,1,50,
        1,50,5,50,781,8,50,10,50,12,50,784,9,50,1,51,1,51,1,51,1,51,1,51,
        1,51,1,51,3,51,793,8,51,1,52,1,52,1,53,1,53,1,54,1,54,1,54,5,54,
        802,8,54,10,54,12,54,805,9,54,1,54,1,54,1,54,1,55,1,55,1,55,3,55,
        813,8,55,1,55,1,55,1,55,3,55,818,8,55,1,55,3,55,821,8,55,1,56,1,
        56,1,56,5,56,826,8,56,10,56,12,56,829,9,56,1,57,1,57,1,57,1,57,1,
        58,1,58,1,58,3,58,838,8,58,1,59,1,59,1,59,1,59,5,59,844,8,59,10,
        59,12,59,847,9,59,3,59,849,8,59,1,59,3,59,852,8,59,1,59,1,59,1,60,
        1,60,1,60,1,60,1,60,1,61,1,61,5,61,863,8,61,10,61,12,61,866,9,61,
        1,61,1,61,1,62,5,62,871,8,62,10,62,12,62,874,9,62,1,62,1,62,3,62,
        878,8,62,1,63,1,63,1,63,1,63,1,63,1,63,3,63,886,8,63,1,63,1,63,3,
        63,890,8,63,1,63,1,63,3,63,894,8,63,1,63,1,63,3,63,898,8,63,1,63,
        1,63,3,63,902,8,63,3,63,904,8,63,1,64,1,64,3,64,908,8,64,1,65,1,
        65,1,65,1,65,3,65,914,8,65,1,66,1,66,1,67,1,67,1,67,1,68,3,68,922,
        8,68,1,68,1,68,1,68,1,68,1,69,1,69,5,69,930,8,69,10,69,12,69,933,
        9,69,1,69,1,69,1,70,1,70,5,70,939,8,70,10,70,12,70,942,9,70,1,70,
        1,70,1,70,1,70,1,70,1,70,1,70,3,70,951,8,70,1,70,1,70,1,70,1,70,
        1,70,1,70,3,70,959,8,70,1,70,1,70,1,70,1,70,1,70,1,70,1,70,1,70,
        1,70,1,70,1,70,1,70,3,70,973,8,70,1,71,1,71,1,72,1,72,1,72,3,72,
        980,8,72,1,72,1,72,1,72,3,72,985,8,72,1,72,1,72,1,73,1,73,3,73,991,
        8,73,1,73,1,73,1,74,1,74,1,74,5,74,998,8,74,10,74,12,74,1001,9,74,
        1,75,1,75,1,75,1,76,1,76,5,76,1008,8,76,10,76,12,76,1011,9,76,1,
        76,1,76,1,77,1,77,5,77,1017,8,77,10,77,12,77,1020,9,77,1,77,1,77,
        1,78,1,78,1,78,1,78,1,78,3,78,1029,8,78,1,79,5,79,1032,8,79,10,79,
        12,79,1035,9,79,1,79,1,79,1,79,1,80,1,80,1,81,5,81,1043,8,81,10,
        81,12,81,1046,9,81,1,81,1,81,1,81,3,81,1051,8,81,1,81,3,81,1054,
        8,81,1,82,1,82,1,82,1,82,1,82,3,82,1061,8,82,1,82,1,82,1,82,1,82,
        1,82,1,82,1,82,3,82,1070,8,82,1,82,1,82,1,82,1,82,1,82,1,82,1,82,
        1,82,1,82,1,82,1,82,1,82,1,82,1,82,1,82,1,82,1,82,1,82,1,82,4,82,
        1091,8,82,11,82,12,82,1092,1,82,3,82,1096,8,82,1,82,3,82,1099,8,
        82,1,82,1,82,1,82,1,82,5,82,1105,8,82,10,82,12,82,1108,9,82,1,82,
        3,82,1111,8,82,1,82,1,82,1,82,1,82,5,82,1117,8,82,10,82,12,82,1120,
        9,82,1,82,5,82,1123,8,82,10,82,12,82,1126,9,82,1,82,1,82,1,82,1,
        82,1,82,1,82,1,82,1,82,3,82,1136,8,82,1,82,1,82,1,82,1,82,1,82,1,
        82,1,82,3,82,1145,8,82,1,82,1,82,1,82,3,82,1150,8,82,1,82,1,82,1,
        82,1,82,1,82,1,82,1,82,1,82,1,82,1,82,1,82,3,82,1163,8,82,1,82,1,
        82,1,82,1,82,3,82,1169,8,82,1,83,1,83,1,83,5,83,1174,8,83,10,83,
        12,83,1177,9,83,1,83,1,83,1,83,1,83,1,83,1,84,1,84,1,84,5,84,1187,
        8,84,10,84,12,84,1190,9,84,1,85,1,85,1,85,1,86,1,86,1,86,3,86,1198,
        8,86,1,86,1,86,1,87,1,87,1,87,5,87,1205,8,87,10,87,12,87,1208,9,
        87,1,88,5,88,1211,8,88,10,88,12,88,1214,9,88,1,88,1,88,1,88,1,88,
        1,88,3,88,1221,8,88,1,88,1,88,1,88,1,88,3,88,1227,8,88,1,89,4,89,
        1230,8,89,11,89,12,89,1231,1,89,4,89,1235,8,89,11,89,12,89,1236,
        1,90,1,90,1,90,1,90,1,90,1,90,3,90,1245,8,90,1,90,1,90,1,90,3,90,
        1250,8,90,1,91,1,91,3,91,1254,8,91,1,91,1,91,3,91,1258,8,91,1,91,
        1,91,3,91,1262,8,91,3,91,1264,8,91,1,92,1,92,3,92,1268,8,92,1,93,
        5,93,1271,8,93,10,93,12,93,1274,9,93,1,93,1,93,3,93,1278,8,93,1,
        93,1,93,1,93,1,93,1,94,1,94,1,94,1,94,1,95,1,95,1,95,5,95,1291,8,
        95,10,95,12,95,1294,9,95,1,96,1,96,1,96,3,96,1299,8,96,1,96,1,96,
        1,96,1,96,1,96,3,96,1306,8,96,1,96,1,96,1,96,1,96,3,96,1312,8,96,
        1,96,3,96,1315,8,96,1,97,1,97,1,97,1,97,1,97,1,97,1,97,5,97,1324,
        8,97,10,97,12,97,1327,9,97,1,97,1,97,1,97,5,97,1332,8,97,10,97,12,
        97,1335,9,97,1,97,1,97,1,97,1,97,1,97,1,97,1,97,1,97,1,97,1,97,1,
        97,1,97,3,97,1349,8,97,1,97,1,97,3,97,1353,8,97,1,97,1,97,1,97,3,
        97,1358,8,97,1,97,1,97,3,97,1362,8,97,1,97,1,97,1,97,1,97,1,97,1,
        97,1,97,1,97,1,97,1,97,1,97,1,97,1,97,1,97,3,97,1378,8,97,1,97,1,
        97,1,97,1,97,1,97,1,97,1,97,1,97,1,97,1,97,1,97,1,97,1,97,1,97,1,
        97,1,97,1,97,1,97,1,97,1,97,1,97,1,97,1,97,1,97,1,97,1,97,1,97,1,
        97,1,97,1,97,1,97,1,97,1,97,1,97,1,97,1,97,1,97,1,97,3,97,1418,8,
        97,1,97,1,97,1,97,1,97,3,97,1424,8,97,1,97,1,97,1,97,1,97,1,97,1,
        97,1,97,1,97,1,97,1,97,1,97,3,97,1437,8,97,1,97,1,97,1,97,3,97,1442,
        8,97,1,97,5,97,1445,8,97,10,97,12,97,1448,9,97,1,98,5,98,1451,8,
        98,10,98,12,98,1454,9,98,1,98,1,98,5,98,1458,8,98,10,98,12,98,1461,
        9,98,1,98,1,98,1,99,1,99,1,99,1,99,1,100,1,100,1,100,3,100,1472,
        8,100,1,100,1,100,1,100,1,100,1,100,5,100,1479,8,100,10,100,12,100,
        1482,9,100,1,100,1,100,1,100,1,100,3,100,1488,8,100,1,100,3,100,
        1491,8,100,1,101,1,101,3,101,1495,8,101,1,102,1,102,1,102,1,102,
        1,102,1,102,1,102,1,102,1,102,1,102,1,102,1,102,1,102,1,102,1,102,
        1,102,3,102,1513,8,102,3,102,1515,8,102,1,103,1,103,1,103,1,103,
        5,103,1521,8,103,10,103,12,103,1524,9,103,1,103,1,103,1,104,1,104,
        1,104,1,104,3,104,1532,8,104,1,104,1,104,1,104,1,104,1,104,3,104,
        1539,8,104,1,105,1,105,1,105,1,105,1,105,1,105,5,105,1547,8,105,
        10,105,12,105,1550,9,105,1,105,1,105,5,105,1554,8,105,10,105,12,
        105,1557,9,105,1,105,1,105,1,105,5,105,1562,8,105,10,105,12,105,
        1565,9,105,3,105,1567,8,105,1,105,1,105,1,105,5,105,1572,8,105,10,
        105,12,105,1575,9,105,1,106,1,106,5,106,1579,8,106,10,106,12,106,
        1582,9,106,3,106,1584,8,106,1,107,1,107,1,107,3,107,1589,8,107,1,
        107,5,107,1592,8,107,10,107,12,107,1595,9,107,1,107,1,107,3,107,
        1599,8,107,1,108,1,108,1,108,1,108,1,108,1,108,1,108,3,108,1608,
        8,108,3,108,1610,8,108,1,109,1,109,3,109,1614,8,109,1,109,1,109,
        1,109,3,109,1619,8,109,5,109,1621,8,109,10,109,12,109,1624,9,109,
        1,109,3,109,1627,8,109,1,110,1,110,3,110,1631,8,110,1,110,1,110,
        1,111,1,111,1,111,1,111,5,111,1639,8,111,10,111,12,111,1642,9,111,
        1,111,1,111,1,111,1,111,1,111,1,111,1,111,5,111,1651,8,111,10,111,
        12,111,1654,9,111,1,111,1,111,5,111,1658,8,111,10,111,12,111,1661,
        9,111,3,111,1663,8,111,1,112,1,112,3,112,1667,8,112,1,113,1,113,
        1,113,1,114,1,114,1,114,3,114,1675,8,114,1,115,1,115,1,115,3,115,
        1680,8,115,1,116,1,116,1,116,1,116,1,117,1,117,1,117,5,117,1689,
        8,117,10,117,12,117,1692,9,117,1,118,5,118,1695,8,118,10,118,12,
        118,1698,9,118,1,118,1,118,3,118,1702,8,118,1,118,5,118,1705,8,118,
        10,118,12,118,1708,9,118,1,118,1,118,5,118,1712,8,118,10,118,12,
        118,1715,9,118,1,119,1,119,1,120,1,120,1,120,1,120,5,120,1723,8,
        120,10,120,12,120,1726,9,120,1,120,1,120,1,121,1,121,1,121,3,121,
        1733,8,121,1,121,1,121,3,121,1737,8,121,3,121,1739,8,121,1,122,1,
        122,1,122,1,122,1,122,3,122,1746,8,122,1,123,1,123,3,123,1750,8,
        123,1,123,1,123,1,123,0,2,194,210,124,0,2,4,6,8,10,12,14,16,18,20,
        22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,62,64,
        66,68,70,72,74,76,78,80,82,84,86,88,90,92,94,96,98,100,102,104,106,
        108,110,112,114,116,118,120,122,124,126,128,130,132,134,136,138,
        140,142,144,146,148,150,152,154,156,158,160,162,164,166,168,170,
        172,174,176,178,180,182,184,186,188,190,192,194,196,198,200,202,
        204,206,208,210,212,214,216,218,220,222,224,226,228,230,232,234,
        236,238,240,242,244,246,0,15,2,0,17,17,40,40,1,0,67,70,1,0,71,72,
        2,0,38,38,60,60,2,0,51,65,128,128,1,0,100,103,1,0,90,91,2,0,104,
        105,109,109,1,0,102,103,2,0,88,89,95,96,2,0,94,94,97,97,2,0,87,87,
        110,120,1,0,100,101,2,0,93,93,121,121,8,0,3,3,5,5,8,8,14,14,20,20,
        27,27,29,29,37,37,1952,0,267,1,0,0,0,2,272,1,0,0,0,4,279,1,0,0,0,
        6,304,1,0,0,0,8,311,1,0,0,0,10,323,1,0,0,0,12,327,1,0,0,0,14,329,
        1,0,0,0,16,348,1,0,0,0,18,362,1,0,0,0,20,376,1,0,0,0,22,384,1,0,
        0,0,24,402,1,0,0,0,26,413,1,0,0,0,28,423,1,0,0,0,30,430,1,0,0,0,
        32,441,1,0,0,0,34,450,1,0,0,0,36,471,1,0,0,0,38,483,1,0,0,0,40,485,
        1,0,0,0,42,503,1,0,0,0,44,507,1,0,0,0,46,509,1,0,0,0,48,512,1,0,
        0,0,50,515,1,0,0,0,52,523,1,0,0,0,54,535,1,0,0,0,56,545,1,0,0,0,
        58,547,1,0,0,0,60,558,1,0,0,0,62,572,1,0,0,0,64,583,1,0,0,0,66,588,
        1,0,0,0,68,597,1,0,0,0,70,616,1,0,0,0,72,624,1,0,0,0,74,629,1,0,
        0,0,76,639,1,0,0,0,78,641,1,0,0,0,80,657,1,0,0,0,82,683,1,0,0,0,
        84,685,1,0,0,0,86,693,1,0,0,0,88,709,1,0,0,0,90,733,1,0,0,0,92,738,
        1,0,0,0,94,747,1,0,0,0,96,760,1,0,0,0,98,771,1,0,0,0,100,777,1,0,
        0,0,102,792,1,0,0,0,104,794,1,0,0,0,106,796,1,0,0,0,108,803,1,0,
        0,0,110,812,1,0,0,0,112,822,1,0,0,0,114,830,1,0,0,0,116,837,1,0,
        0,0,118,839,1,0,0,0,120,855,1,0,0,0,122,860,1,0,0,0,124,877,1,0,
        0,0,126,903,1,0,0,0,128,907,1,0,0,0,130,909,1,0,0,0,132,915,1,0,
        0,0,134,917,1,0,0,0,136,921,1,0,0,0,138,927,1,0,0,0,140,972,1,0,
        0,0,142,974,1,0,0,0,144,976,1,0,0,0,146,988,1,0,0,0,148,994,1,0,
        0,0,150,1002,1,0,0,0,152,1005,1,0,0,0,154,1014,1,0,0,0,156,1028,
        1,0,0,0,158,1033,1,0,0,0,160,1039,1,0,0,0,162,1053,1,0,0,0,164,1168,
        1,0,0,0,166,1170,1,0,0,0,168,1183,1,0,0,0,170,1191,1,0,0,0,172,1194,
        1,0,0,0,174,1201,1,0,0,0,176,1226,1,0,0,0,178,1229,1,0,0,0,180,1249,
        1,0,0,0,182,1263,1,0,0,0,184,1267,1,0,0,0,186,1272,1,0,0,0,188,1283,
        1,0,0,0,190,1287,1,0,0,0,192,1314,1,0,0,0,194,1361,1,0,0,0,196,1452,
        1,0,0,0,198,1464,1,0,0,0,200,1490,1,0,0,0,202,1494,1,0,0,0,204,1514,
        1,0,0,0,206,1516,1,0,0,0,208,1538,1,0,0,0,210,1566,1,0,0,0,212,1583,
        1,0,0,0,214,1588,1,0,0,0,216,1609,1,0,0,0,218,1626,1,0,0,0,220,1628,
        1,0,0,0,222,1634,1,0,0,0,224,1664,1,0,0,0,226,1668,1,0,0,0,228,1674,
        1,0,0,0,230,1679,1,0,0,0,232,1681,1,0,0,0,234,1685,1,0,0,0,236,1696,
        1,0,0,0,238,1716,1,0,0,0,240,1718,1,0,0,0,242,1738,1,0,0,0,244,1745,
        1,0,0,0,246,1747,1,0,0,0,248,250,3,2,1,0,249,248,1,0,0,0,249,250,
        1,0,0,0,250,254,1,0,0,0,251,253,3,4,2,0,252,251,1,0,0,0,253,256,
        1,0,0,0,254,252,1,0,0,0,254,255,1,0,0,0,255,260,1,0,0,0,256,254,
        1,0,0,0,257,259,3,6,3,0,258,257,1,0,0,0,259,262,1,0,0,0,260,258,
        1,0,0,0,260,261,1,0,0,0,261,263,1,0,0,0,262,260,1,0,0,0,263,268,
        5,0,0,1,264,265,3,136,68,0,265,266,5,0,0,1,266,268,1,0,0,0,267,249,
        1,0,0,0,267,264,1,0,0,0,268,1,1,0,0,0,269,271,3,110,55,0,270,269,
        1,0,0,0,271,274,1,0,0,0,272,270,1,0,0,0,272,273,1,0,0,0,273,275,
        1,0,0,0,274,272,1,0,0,0,275,276,5,32,0,0,276,277,3,100,50,0,277,
        278,5,84,0,0,278,3,1,0,0,0,279,281,5,25,0,0,280,282,5,38,0,0,281,
        280,1,0,0,0,281,282,1,0,0,0,282,283,1,0,0,0,283,286,3,100,50,0,284,
        285,5,86,0,0,285,287,5,104,0,0,286,284,1,0,0,0,286,287,1,0,0,0,287,
        288,1,0,0,0,288,289,5,84,0,0,289,5,1,0,0,0,290,292,3,10,5,0,291,
        290,1,0,0,0,292,295,1,0,0,0,293,291,1,0,0,0,293,294,1,0,0,0,294,
        301,1,0,0,0,295,293,1,0,0,0,296,302,3,14,7,0,297,302,3,22,11,0,298,
        302,3,30,15,0,299,302,3,120,60,0,300,302,3,144,72,0,301,296,1,0,
        0,0,301,297,1,0,0,0,301,298,1,0,0,0,301,299,1,0,0,0,301,300,1,0,
        0,0,302,305,1,0,0,0,303,305,5,84,0,0,304,293,1,0,0,0,304,303,1,0,
        0,0,305,7,1,0,0,0,306,312,3,10,5,0,307,312,5,30,0,0,308,312,5,42,
        0,0,309,312,5,46,0,0,310,312,5,49,0,0,311,306,1,0,0,0,311,307,1,
        0,0,0,311,308,1,0,0,0,311,309,1,0,0,0,311,310,1,0,0,0,312,9,1,0,
        0,0,313,324,3,110,55,0,314,324,5,35,0,0,315,324,5,34,0,0,316,324,
        5,33,0,0,317,324,5,38,0,0,318,324,5,1,0,0,319,324,5,18,0,0,320,324,
        5,39,0,0,321,324,5,64,0,0,322,324,5,66,0,0,323,313,1,0,0,0,323,314,
        1,0,0,0,323,315,1,0,0,0,323,316,1,0,0,0,323,317,1,0,0,0,323,318,
        1,0,0,0,323,319,1,0,0,0,323,320,1,0,0,0,323,321,1,0,0,0,323,322,
        1,0,0,0,324,11,1,0,0,0,325,328,5,18,0,0,326,328,3,110,55,0,327,325,
        1,0,0,0,327,326,1,0,0,0,328,13,1,0,0,0,329,330,5,9,0,0,330,332,3,
        160,80,0,331,333,3,16,8,0,332,331,1,0,0,0,332,333,1,0,0,0,333,336,
        1,0,0,0,334,335,5,17,0,0,335,337,3,236,118,0,336,334,1,0,0,0,336,
        337,1,0,0,0,337,340,1,0,0,0,338,339,5,24,0,0,339,341,3,234,117,0,
        340,338,1,0,0,0,340,341,1,0,0,0,341,344,1,0,0,0,342,343,5,65,0,0,
        343,345,3,234,117,0,344,342,1,0,0,0,344,345,1,0,0,0,345,346,1,0,
        0,0,346,347,3,32,16,0,347,15,1,0,0,0,348,349,5,89,0,0,349,354,3,
        18,9,0,350,351,5,85,0,0,351,353,3,18,9,0,352,350,1,0,0,0,353,356,
        1,0,0,0,354,352,1,0,0,0,354,355,1,0,0,0,355,357,1,0,0,0,356,354,
        1,0,0,0,357,358,5,88,0,0,358,17,1,0,0,0,359,361,3,110,55,0,360,359,
        1,0,0,0,361,364,1,0,0,0,362,360,1,0,0,0,362,363,1,0,0,0,363,365,
        1,0,0,0,364,362,1,0,0,0,365,374,3,160,80,0,366,370,5,17,0,0,367,
        369,3,110,55,0,368,367,1,0,0,0,369,372,1,0,0,0,370,368,1,0,0,0,370,
        371,1,0,0,0,371,373,1,0,0,0,372,370,1,0,0,0,373,375,3,20,10,0,374,
        366,1,0,0,0,374,375,1,0,0,0,375,19,1,0,0,0,376,381,3,236,118,0,377,
        378,5,106,0,0,378,380,3,236,118,0,379,377,1,0,0,0,380,383,1,0,0,
        0,381,379,1,0,0,0,381,382,1,0,0,0,382,21,1,0,0,0,383,381,1,0,0,0,
        384,385,5,16,0,0,385,388,3,160,80,0,386,387,5,24,0,0,387,389,3,234,
        117,0,388,386,1,0,0,0,388,389,1,0,0,0,389,390,1,0,0,0,390,392,5,
        80,0,0,391,393,3,24,12,0,392,391,1,0,0,0,392,393,1,0,0,0,393,395,
        1,0,0,0,394,396,5,85,0,0,395,394,1,0,0,0,395,396,1,0,0,0,396,398,
        1,0,0,0,397,399,3,28,14,0,398,397,1,0,0,0,398,399,1,0,0,0,399,400,
        1,0,0,0,400,401,5,81,0,0,401,23,1,0,0,0,402,407,3,26,13,0,403,404,
        5,85,0,0,404,406,3,26,13,0,405,403,1,0,0,0,406,409,1,0,0,0,407,405,
        1,0,0,0,407,408,1,0,0,0,408,25,1,0,0,0,409,407,1,0,0,0,410,412,3,
        110,55,0,411,410,1,0,0,0,412,415,1,0,0,0,413,411,1,0,0,0,413,414,
        1,0,0,0,414,416,1,0,0,0,415,413,1,0,0,0,416,418,3,160,80,0,417,419,
        3,246,123,0,418,417,1,0,0,0,418,419,1,0,0,0,419,421,1,0,0,0,420,
        422,3,32,16,0,421,420,1,0,0,0,421,422,1,0,0,0,422,27,1,0,0,0,423,
        427,5,84,0,0,424,426,3,36,18,0,425,424,1,0,0,0,426,429,1,0,0,0,427,
        425,1,0,0,0,427,428,1,0,0,0,428,29,1,0,0,0,429,427,1,0,0,0,430,431,
        5,28,0,0,431,433,3,160,80,0,432,434,3,16,8,0,433,432,1,0,0,0,433,
        434,1,0,0,0,434,437,1,0,0,0,435,436,5,17,0,0,436,438,3,234,117,0,
        437,435,1,0,0,0,437,438,1,0,0,0,438,439,1,0,0,0,439,440,3,34,17,
        0,440,31,1,0,0,0,441,445,5,80,0,0,442,444,3,36,18,0,443,442,1,0,
        0,0,444,447,1,0,0,0,445,443,1,0,0,0,445,446,1,0,0,0,446,448,1,0,
        0,0,447,445,1,0,0,0,448,449,5,81,0,0,449,33,1,0,0,0,450,454,5,80,
        0,0,451,453,3,54,27,0,452,451,1,0,0,0,453,456,1,0,0,0,454,452,1,
        0,0,0,454,455,1,0,0,0,455,457,1,0,0,0,456,454,1,0,0,0,457,458,5,
        81,0,0,458,35,1,0,0,0,459,472,5,84,0,0,460,462,5,38,0,0,461,460,
        1,0,0,0,461,462,1,0,0,0,462,463,1,0,0,0,463,472,3,154,77,0,464,466,
        3,8,4,0,465,464,1,0,0,0,466,469,1,0,0,0,467,465,1,0,0,0,467,468,
        1,0,0,0,468,470,1,0,0,0,469,467,1,0,0,0,470,472,3,38,19,0,471,459,
        1,0,0,0,471,461,1,0,0,0,471,467,1,0,0,0,472,37,1,0,0,0,473,484,3,
        40,20,0,474,484,3,46,23,0,475,484,3,52,26,0,476,484,3,50,25,0,477,
        484,3,48,24,0,478,484,3,30,15,0,479,484,3,120,60,0,480,484,3,14,
        7,0,481,484,3,22,11,0,482,484,3,144,72,0,483,473,1,0,0,0,483,474,
        1,0,0,0,483,475,1,0,0,0,483,476,1,0,0,0,483,477,1,0,0,0,483,478,
        1,0,0,0,483,479,1,0,0,0,483,480,1,0,0,0,483,481,1,0,0,0,483,482,
        1,0,0,0,484,39,1,0,0,0,485,486,3,44,22,0,486,487,3,160,80,0,487,
        492,3,86,43,0,488,489,5,82,0,0,489,491,5,83,0,0,490,488,1,0,0,0,
        491,494,1,0,0,0,492,490,1,0,0,0,492,493,1,0,0,0,493,497,1,0,0,0,
        494,492,1,0,0,0,495,496,5,45,0,0,496,498,3,84,42,0,497,495,1,0,0,
        0,497,498,1,0,0,0,498,499,1,0,0,0,499,500,3,42,21,0,500,41,1,0,0,
        0,501,504,3,154,77,0,502,504,5,84,0,0,503,501,1,0,0,0,503,502,1,
        0,0,0,504,43,1,0,0,0,505,508,3,236,118,0,506,508,5,48,0,0,507,505,
        1,0,0,0,507,506,1,0,0,0,508,45,1,0,0,0,509,510,3,16,8,0,510,511,
        3,40,20,0,511,47,1,0,0,0,512,513,3,16,8,0,513,514,3,50,25,0,514,
        49,1,0,0,0,515,516,3,160,80,0,516,519,3,86,43,0,517,518,5,45,0,0,
        518,520,3,84,42,0,519,517,1,0,0,0,519,520,1,0,0,0,520,521,1,0,0,
        0,521,522,3,154,77,0,522,51,1,0,0,0,523,524,3,236,118,0,524,525,
        3,70,35,0,525,526,5,84,0,0,526,53,1,0,0,0,527,529,3,8,4,0,528,527,
        1,0,0,0,529,532,1,0,0,0,530,528,1,0,0,0,530,531,1,0,0,0,531,533,
        1,0,0,0,532,530,1,0,0,0,533,536,3,56,28,0,534,536,5,84,0,0,535,530,
        1,0,0,0,535,534,1,0,0,0,536,55,1,0,0,0,537,546,3,58,29,0,538,546,
        3,62,31,0,539,546,3,66,33,0,540,546,3,30,15,0,541,546,3,120,60,0,
        542,546,3,14,7,0,543,546,3,22,11,0,544,546,3,144,72,0,545,537,1,
        0,0,0,545,538,1,0,0,0,545,539,1,0,0,0,545,540,1,0,0,0,545,541,1,
        0,0,0,545,542,1,0,0,0,545,543,1,0,0,0,545,544,1,0,0,0,546,57,1,0,
        0,0,547,548,3,236,118,0,548,553,3,60,30,0,549,550,5,85,0,0,550,552,
        3,60,30,0,551,549,1,0,0,0,552,555,1,0,0,0,553,551,1,0,0,0,553,554,
        1,0,0,0,554,556,1,0,0,0,555,553,1,0,0,0,556,557,5,84,0,0,557,59,
        1,0,0,0,558,563,3,160,80,0,559,560,5,82,0,0,560,562,5,83,0,0,561,
        559,1,0,0,0,562,565,1,0,0,0,563,561,1,0,0,0,563,564,1,0,0,0,564,
        566,1,0,0,0,565,563,1,0,0,0,566,567,5,87,0,0,567,568,3,76,38,0,568,
        61,1,0,0,0,569,571,3,64,32,0,570,569,1,0,0,0,571,574,1,0,0,0,572,
        570,1,0,0,0,572,573,1,0,0,0,573,575,1,0,0,0,574,572,1,0,0,0,575,
        576,3,68,34,0,576,63,1,0,0,0,577,584,3,110,55,0,578,584,5,35,0,0,
        579,584,5,1,0,0,580,584,5,12,0,0,581,584,5,38,0,0,582,584,5,39,0,
        0,583,577,1,0,0,0,583,578,1,0,0,0,583,579,1,0,0,0,583,580,1,0,0,
        0,583,581,1,0,0,0,583,582,1,0,0,0,584,65,1,0,0,0,585,587,3,64,32,
        0,586,585,1,0,0,0,587,590,1,0,0,0,588,586,1,0,0,0,588,589,1,0,0,
        0,589,591,1,0,0,0,590,588,1,0,0,0,591,592,3,16,8,0,592,593,3,68,
        34,0,593,67,1,0,0,0,594,596,3,110,55,0,595,594,1,0,0,0,596,599,1,
        0,0,0,597,595,1,0,0,0,597,598,1,0,0,0,598,600,1,0,0,0,599,597,1,
        0,0,0,600,601,3,44,22,0,601,602,3,160,80,0,602,607,3,86,43,0,603,
        604,5,82,0,0,604,606,5,83,0,0,605,603,1,0,0,0,606,609,1,0,0,0,607,
        605,1,0,0,0,607,608,1,0,0,0,608,612,1,0,0,0,609,607,1,0,0,0,610,
        611,5,45,0,0,611,613,3,84,42,0,612,610,1,0,0,0,612,613,1,0,0,0,613,
        614,1,0,0,0,614,615,3,42,21,0,615,69,1,0,0,0,616,621,3,72,36,0,617,
        618,5,85,0,0,618,620,3,72,36,0,619,617,1,0,0,0,620,623,1,0,0,0,621,
        619,1,0,0,0,621,622,1,0,0,0,622,71,1,0,0,0,623,621,1,0,0,0,624,627,
        3,74,37,0,625,626,5,87,0,0,626,628,3,76,38,0,627,625,1,0,0,0,627,
        628,1,0,0,0,628,73,1,0,0,0,629,634,3,160,80,0,630,631,5,82,0,0,631,
        633,5,83,0,0,632,630,1,0,0,0,633,636,1,0,0,0,634,632,1,0,0,0,634,
        635,1,0,0,0,635,75,1,0,0,0,636,634,1,0,0,0,637,640,3,78,39,0,638,
        640,3,194,97,0,639,637,1,0,0,0,639,638,1,0,0,0,640,77,1,0,0,0,641,
        653,5,80,0,0,642,647,3,76,38,0,643,644,5,85,0,0,644,646,3,76,38,
        0,645,643,1,0,0,0,646,649,1,0,0,0,647,645,1,0,0,0,647,648,1,0,0,
        0,648,651,1,0,0,0,649,647,1,0,0,0,650,652,5,85,0,0,651,650,1,0,0,
        0,651,652,1,0,0,0,652,654,1,0,0,0,653,642,1,0,0,0,653,654,1,0,0,
        0,654,655,1,0,0,0,655,656,5,81,0,0,656,79,1,0,0,0,657,659,3,160,
        80,0,658,660,3,240,120,0,659,658,1,0,0,0,659,660,1,0,0,0,660,668,
        1,0,0,0,661,662,5,86,0,0,662,664,3,160,80,0,663,665,3,240,120,0,
        664,663,1,0,0,0,664,665,1,0,0,0,665,667,1,0,0,0,666,661,1,0,0,0,
        667,670,1,0,0,0,668,666,1,0,0,0,668,669,1,0,0,0,669,81,1,0,0,0,670,
        668,1,0,0,0,671,684,3,236,118,0,672,674,3,110,55,0,673,672,1,0,0,
        0,674,677,1,0,0,0,675,673,1,0,0,0,675,676,1,0,0,0,676,678,1,0,0,
        0,677,675,1,0,0,0,678,681,5,92,0,0,679,680,7,0,0,0,680,682,3,236,
        118,0,681,679,1,0,0,0,681,682,1,0,0,0,682,684,1,0,0,0,683,671,1,
        0,0,0,683,675,1,0,0,0,684,83,1,0,0,0,685,690,3,100,50,0,686,687,
        5,85,0,0,687,689,3,100,50,0,688,686,1,0,0,0,689,692,1,0,0,0,690,
        688,1,0,0,0,690,691,1,0,0,0,691,85,1,0,0,0,692,690,1,0,0,0,693,705,
        5,78,0,0,694,696,3,88,44,0,695,694,1,0,0,0,695,696,1,0,0,0,696,706,
        1,0,0,0,697,700,3,88,44,0,698,699,5,85,0,0,699,701,3,90,45,0,700,
        698,1,0,0,0,700,701,1,0,0,0,701,706,1,0,0,0,702,704,3,90,45,0,703,
        702,1,0,0,0,703,704,1,0,0,0,704,706,1,0,0,0,705,695,1,0,0,0,705,
        697,1,0,0,0,705,703,1,0,0,0,706,707,1,0,0,0,707,708,5,79,0,0,708,
        87,1,0,0,0,709,715,3,236,118,0,710,711,3,160,80,0,711,712,5,86,0,
        0,712,714,1,0,0,0,713,710,1,0,0,0,714,717,1,0,0,0,715,713,1,0,0,
        0,715,716,1,0,0,0,716,718,1,0,0,0,717,715,1,0,0,0,718,719,5,43,0,
        0,719,89,1,0,0,0,720,725,3,92,46,0,721,722,5,85,0,0,722,724,3,92,
        46,0,723,721,1,0,0,0,724,727,1,0,0,0,725,723,1,0,0,0,725,726,1,0,
        0,0,726,730,1,0,0,0,727,725,1,0,0,0,728,729,5,85,0,0,729,731,3,94,
        47,0,730,728,1,0,0,0,730,731,1,0,0,0,731,734,1,0,0,0,732,734,3,94,
        47,0,733,720,1,0,0,0,733,732,1,0,0,0,734,91,1,0,0,0,735,737,3,12,
        6,0,736,735,1,0,0,0,737,740,1,0,0,0,738,736,1,0,0,0,738,739,1,0,
        0,0,739,741,1,0,0,0,740,738,1,0,0,0,741,742,3,236,118,0,742,743,
        3,74,37,0,743,93,1,0,0,0,744,746,3,12,6,0,745,744,1,0,0,0,746,749,
        1,0,0,0,747,745,1,0,0,0,747,748,1,0,0,0,748,750,1,0,0,0,749,747,
        1,0,0,0,750,754,3,236,118,0,751,753,3,110,55,0,752,751,1,0,0,0,753,
        756,1,0,0,0,754,752,1,0,0,0,754,755,1,0,0,0,755,757,1,0,0,0,756,
        754,1,0,0,0,757,758,5,124,0,0,758,759,3,74,37,0,759,95,1,0,0,0,760,
        765,3,98,49,0,761,762,5,85,0,0,762,764,3,98,49,0,763,761,1,0,0,0,
        764,767,1,0,0,0,765,763,1,0,0,0,765,766,1,0,0,0,766,97,1,0,0,0,767,
        765,1,0,0,0,768,770,3,12,6,0,769,768,1,0,0,0,770,773,1,0,0,0,771,
        769,1,0,0,0,771,772,1,0,0,0,772,774,1,0,0,0,773,771,1,0,0,0,774,
        775,5,61,0,0,775,776,3,160,80,0,776,99,1,0,0,0,777,782,3,160,80,
        0,778,779,5,86,0,0,779,781,3,160,80,0,780,778,1,0,0,0,781,784,1,
        0,0,0,782,780,1,0,0,0,782,783,1,0,0,0,783,101,1,0,0,0,784,782,1,
        0,0,0,785,793,3,104,52,0,786,793,3,106,53,0,787,793,5,74,0,0,788,
        793,5,75,0,0,789,793,5,73,0,0,790,793,5,77,0,0,791,793,5,76,0,0,
        792,785,1,0,0,0,792,786,1,0,0,0,792,787,1,0,0,0,792,788,1,0,0,0,
        792,789,1,0,0,0,792,790,1,0,0,0,792,791,1,0,0,0,793,103,1,0,0,0,
        794,795,7,1,0,0,795,105,1,0,0,0,796,797,7,2,0,0,797,107,1,0,0,0,
        798,799,3,160,80,0,799,800,5,86,0,0,800,802,1,0,0,0,801,798,1,0,
        0,0,802,805,1,0,0,0,803,801,1,0,0,0,803,804,1,0,0,0,804,806,1,0,
        0,0,805,803,1,0,0,0,806,807,5,123,0,0,807,808,3,160,80,0,808,109,
        1,0,0,0,809,810,5,123,0,0,810,813,3,100,50,0,811,813,3,108,54,0,
        812,809,1,0,0,0,812,811,1,0,0,0,813,820,1,0,0,0,814,817,5,78,0,0,
        815,818,3,112,56,0,816,818,3,116,58,0,817,815,1,0,0,0,817,816,1,
        0,0,0,817,818,1,0,0,0,818,819,1,0,0,0,819,821,5,79,0,0,820,814,1,
        0,0,0,820,821,1,0,0,0,821,111,1,0,0,0,822,827,3,114,57,0,823,824,
        5,85,0,0,824,826,3,114,57,0,825,823,1,0,0,0,826,829,1,0,0,0,827,
        825,1,0,0,0,827,828,1,0,0,0,828,113,1,0,0,0,829,827,1,0,0,0,830,
        831,3,160,80,0,831,832,5,87,0,0,832,833,3,116,58,0,833,115,1,0,0,
        0,834,838,3,194,97,0,835,838,3,110,55,0,836,838,3,118,59,0,837,834,
        1,0,0,0,837,835,1,0,0,0,837,836,1,0,0,0,838,117,1,0,0,0,839,848,
        5,80,0,0,840,845,3,116,58,0,841,842,5,85,0,0,842,844,3,116,58,0,
        843,841,1,0,0,0,844,847,1,0,0,0,845,843,1,0,0,0,845,846,1,0,0,0,
        846,849,1,0,0,0,847,845,1,0,0,0,848,840,1,0,0,0,848,849,1,0,0,0,
        849,851,1,0,0,0,850,852,5,85,0,0,851,850,1,0,0,0,851,852,1,0,0,0,
        852,853,1,0,0,0,853,854,5,81,0,0,854,119,1,0,0,0,855,856,5,123,0,
        0,856,857,5,28,0,0,857,858,3,160,80,0,858,859,3,122,61,0,859,121,
        1,0,0,0,860,864,5,80,0,0,861,863,3,124,62,0,862,861,1,0,0,0,863,
        866,1,0,0,0,864,862,1,0,0,0,864,865,1,0,0,0,865,867,1,0,0,0,866,
        864,1,0,0,0,867,868,5,81,0,0,868,123,1,0,0,0,869,871,3,8,4,0,870,
        869,1,0,0,0,871,874,1,0,0,0,872,870,1,0,0,0,872,873,1,0,0,0,873,
        875,1,0,0,0,874,872,1,0,0,0,875,878,3,126,63,0,876,878,5,84,0,0,
        877,872,1,0,0,0,877,876,1,0,0,0,878,125,1,0,0,0,879,880,3,236,118,
        0,880,881,3,128,64,0,881,882,5,84,0,0,882,904,1,0,0,0,883,885,3,
        14,7,0,884,886,5,84,0,0,885,884,1,0,0,0,885,886,1,0,0,0,886,904,
        1,0,0,0,887,889,3,30,15,0,888,890,5,84,0,0,889,888,1,0,0,0,889,890,
        1,0,0,0,890,904,1,0,0,0,891,893,3,22,11,0,892,894,5,84,0,0,893,892,
        1,0,0,0,893,894,1,0,0,0,894,904,1,0,0,0,895,897,3,120,60,0,896,898,
        5,84,0,0,897,896,1,0,0,0,897,898,1,0,0,0,898,904,1,0,0,0,899,901,
        3,144,72,0,900,902,5,84,0,0,901,900,1,0,0,0,901,902,1,0,0,0,902,
        904,1,0,0,0,903,879,1,0,0,0,903,883,1,0,0,0,903,887,1,0,0,0,903,
        891,1,0,0,0,903,895,1,0,0,0,903,899,1,0,0,0,904,127,1,0,0,0,905,
        908,3,130,65,0,906,908,3,132,66,0,907,905,1,0,0,0,907,906,1,0,0,
        0,908,129,1,0,0,0,909,910,3,160,80,0,910,911,5,78,0,0,911,913,5,
        79,0,0,912,914,3,134,67,0,913,912,1,0,0,0,913,914,1,0,0,0,914,131,
        1,0,0,0,915,916,3,70,35,0,916,133,1,0,0,0,917,918,5,12,0,0,918,919,
        3,116,58,0,919,135,1,0,0,0,920,922,5,52,0,0,921,920,1,0,0,0,921,
        922,1,0,0,0,922,923,1,0,0,0,923,924,5,51,0,0,924,925,3,100,50,0,
        925,926,3,138,69,0,926,137,1,0,0,0,927,931,5,80,0,0,928,930,3,140,
        70,0,929,928,1,0,0,0,930,933,1,0,0,0,931,929,1,0,0,0,931,932,1,0,
        0,0,932,934,1,0,0,0,933,931,1,0,0,0,934,935,5,81,0,0,935,139,1,0,
        0,0,936,940,5,53,0,0,937,939,3,142,71,0,938,937,1,0,0,0,939,942,
        1,0,0,0,940,938,1,0,0,0,940,941,1,0,0,0,941,943,1,0,0,0,942,940,
        1,0,0,0,943,944,3,100,50,0,944,945,5,84,0,0,945,973,1,0,0,0,946,
        947,5,54,0,0,947,950,3,100,50,0,948,949,5,56,0,0,949,951,3,100,50,
        0,950,948,1,0,0,0,950,951,1,0,0,0,951,952,1,0,0,0,952,953,5,84,0,
        0,953,973,1,0,0,0,954,955,5,55,0,0,955,958,3,100,50,0,956,957,5,
        56,0,0,957,959,3,100,50,0,958,956,1,0,0,0,958,959,1,0,0,0,959,960,
        1,0,0,0,960,961,5,84,0,0,961,973,1,0,0,0,962,963,5,57,0,0,963,964,
        3,100,50,0,964,965,5,84,0,0,965,973,1,0,0,0,966,967,5,58,0,0,967,
        968,3,100,50,0,968,969,5,59,0,0,969,970,3,100,50,0,970,971,5,84,
        0,0,971,973,1,0,0,0,972,936,1,0,0,0,972,946,1,0,0,0,972,954,1,0,
        0,0,972,962,1,0,0,0,972,966,1,0,0,0,973,141,1,0,0,0,974,975,7,3,
        0,0,975,143,1,0,0,0,976,977,5,63,0,0,977,979,3,160,80,0,978,980,
        3,16,8,0,979,978,1,0,0,0,979,980,1,0,0,0,980,981,1,0,0,0,981,984,
        3,146,73,0,982,983,5,24,0,0,983,985,3,234,117,0,984,982,1,0,0,0,
        984,985,1,0,0,0,985,986,1,0,0,0,986,987,3,152,76,0,987,145,1,0,0,
        0,988,990,5,78,0,0,989,991,3,148,74,0,990,989,1,0,0,0,990,991,1,
        0,0,0,991,992,1,0,0,0,992,993,5,79,0,0,993,147,1,0,0,0,994,999,3,
        150,75,0,995,996,5,85,0,0,996,998,3,150,75,0,997,995,1,0,0,0,998,
        1001,1,0,0,0,999,997,1,0,0,0,999,1000,1,0,0,0,1000,149,1,0,0,0,1001,
        999,1,0,0,0,1002,1003,3,236,118,0,1003,1004,3,160,80,0,1004,151,
        1,0,0,0,1005,1009,5,80,0,0,1006,1008,3,36,18,0,1007,1006,1,0,0,0,
        1008,1011,1,0,0,0,1009,1007,1,0,0,0,1009,1010,1,0,0,0,1010,1012,
        1,0,0,0,1011,1009,1,0,0,0,1012,1013,5,81,0,0,1013,153,1,0,0,0,1014,
        1018,5,80,0,0,1015,1017,3,156,78,0,1016,1015,1,0,0,0,1017,1020,1,
        0,0,0,1018,1016,1,0,0,0,1018,1019,1,0,0,0,1019,1021,1,0,0,0,1020,
        1018,1,0,0,0,1021,1022,5,81,0,0,1022,155,1,0,0,0,1023,1024,3,158,
        79,0,1024,1025,5,84,0,0,1025,1029,1,0,0,0,1026,1029,3,164,82,0,1027,
        1029,3,162,81,0,1028,1023,1,0,0,0,1028,1026,1,0,0,0,1028,1027,1,
        0,0,0,1029,157,1,0,0,0,1030,1032,3,12,6,0,1031,1030,1,0,0,0,1032,
        1035,1,0,0,0,1033,1031,1,0,0,0,1033,1034,1,0,0,0,1034,1036,1,0,0,
        0,1035,1033,1,0,0,0,1036,1037,3,236,118,0,1037,1038,3,70,35,0,1038,
        159,1,0,0,0,1039,1040,7,4,0,0,1040,161,1,0,0,0,1041,1043,3,10,5,
        0,1042,1041,1,0,0,0,1043,1046,1,0,0,0,1044,1042,1,0,0,0,1044,1045,
        1,0,0,0,1045,1050,1,0,0,0,1046,1044,1,0,0,0,1047,1051,3,14,7,0,1048,
        1051,3,30,15,0,1049,1051,3,144,72,0,1050,1047,1,0,0,0,1050,1048,
        1,0,0,0,1050,1049,1,0,0,0,1051,1054,1,0,0,0,1052,1054,5,84,0,0,1053,
        1044,1,0,0,0,1053,1052,1,0,0,0,1054,163,1,0,0,0,1055,1169,3,154,
        77,0,1056,1057,5,2,0,0,1057,1060,3,194,97,0,1058,1059,5,93,0,0,1059,
        1061,3,194,97,0,1060,1058,1,0,0,0,1060,1061,1,0,0,0,1061,1062,1,
        0,0,0,1062,1063,5,84,0,0,1063,1169,1,0,0,0,1064,1065,5,22,0,0,1065,
        1066,3,188,94,0,1066,1069,3,164,82,0,1067,1068,5,15,0,0,1068,1070,
        3,164,82,0,1069,1067,1,0,0,0,1069,1070,1,0,0,0,1070,1169,1,0,0,0,
        1071,1072,5,21,0,0,1072,1073,5,78,0,0,1073,1074,3,182,91,0,1074,
        1075,5,79,0,0,1075,1076,3,164,82,0,1076,1169,1,0,0,0,1077,1078,5,
        50,0,0,1078,1079,3,188,94,0,1079,1080,3,164,82,0,1080,1169,1,0,0,
        0,1081,1082,5,13,0,0,1082,1083,3,164,82,0,1083,1084,5,50,0,0,1084,
        1085,3,188,94,0,1085,1086,5,84,0,0,1086,1169,1,0,0,0,1087,1088,5,
        47,0,0,1088,1098,3,154,77,0,1089,1091,3,166,83,0,1090,1089,1,0,0,
        0,1091,1092,1,0,0,0,1092,1090,1,0,0,0,1092,1093,1,0,0,0,1093,1095,
        1,0,0,0,1094,1096,3,170,85,0,1095,1094,1,0,0,0,1095,1096,1,0,0,0,
        1096,1099,1,0,0,0,1097,1099,3,170,85,0,1098,1090,1,0,0,0,1098,1097,
        1,0,0,0,1099,1169,1,0,0,0,1100,1101,5,47,0,0,1101,1102,3,172,86,
        0,1102,1106,3,154,77,0,1103,1105,3,166,83,0,1104,1103,1,0,0,0,1105,
        1108,1,0,0,0,1106,1104,1,0,0,0,1106,1107,1,0,0,0,1107,1110,1,0,0,
        0,1108,1106,1,0,0,0,1109,1111,3,170,85,0,1110,1109,1,0,0,0,1110,
        1111,1,0,0,0,1111,1169,1,0,0,0,1112,1113,5,41,0,0,1113,1114,3,188,
        94,0,1114,1118,5,80,0,0,1115,1117,3,178,89,0,1116,1115,1,0,0,0,1117,
        1120,1,0,0,0,1118,1116,1,0,0,0,1118,1119,1,0,0,0,1119,1124,1,0,0,
        0,1120,1118,1,0,0,0,1121,1123,3,180,90,0,1122,1121,1,0,0,0,1123,
        1126,1,0,0,0,1124,1122,1,0,0,0,1124,1125,1,0,0,0,1125,1127,1,0,0,
        0,1126,1124,1,0,0,0,1127,1128,5,81,0,0,1128,1169,1,0,0,0,1129,1130,
        5,42,0,0,1130,1131,3,188,94,0,1131,1132,3,154,77,0,1132,1169,1,0,
        0,0,1133,1135,5,36,0,0,1134,1136,3,194,97,0,1135,1134,1,0,0,0,1135,
        1136,1,0,0,0,1136,1137,1,0,0,0,1137,1169,5,84,0,0,1138,1139,5,44,
        0,0,1139,1140,3,194,97,0,1140,1141,5,84,0,0,1141,1169,1,0,0,0,1142,
        1144,5,4,0,0,1143,1145,3,160,80,0,1144,1143,1,0,0,0,1144,1145,1,
        0,0,0,1145,1146,1,0,0,0,1146,1169,5,84,0,0,1147,1149,5,11,0,0,1148,
        1150,3,160,80,0,1149,1148,1,0,0,0,1149,1150,1,0,0,0,1150,1151,1,
        0,0,0,1151,1169,5,84,0,0,1152,1153,5,62,0,0,1153,1154,3,194,97,0,
        1154,1155,5,84,0,0,1155,1169,1,0,0,0,1156,1169,5,84,0,0,1157,1158,
        3,194,97,0,1158,1159,5,84,0,0,1159,1169,1,0,0,0,1160,1162,3,206,
        103,0,1161,1163,5,84,0,0,1162,1161,1,0,0,0,1162,1163,1,0,0,0,1163,
        1169,1,0,0,0,1164,1165,3,160,80,0,1165,1166,5,93,0,0,1166,1167,3,
        164,82,0,1167,1169,1,0,0,0,1168,1055,1,0,0,0,1168,1056,1,0,0,0,1168,
        1064,1,0,0,0,1168,1071,1,0,0,0,1168,1077,1,0,0,0,1168,1081,1,0,0,
        0,1168,1087,1,0,0,0,1168,1100,1,0,0,0,1168,1112,1,0,0,0,1168,1129,
        1,0,0,0,1168,1133,1,0,0,0,1168,1138,1,0,0,0,1168,1142,1,0,0,0,1168,
        1147,1,0,0,0,1168,1152,1,0,0,0,1168,1156,1,0,0,0,1168,1157,1,0,0,
        0,1168,1160,1,0,0,0,1168,1164,1,0,0,0,1169,165,1,0,0,0,1170,1171,
        5,7,0,0,1171,1175,5,78,0,0,1172,1174,3,12,6,0,1173,1172,1,0,0,0,
        1174,1177,1,0,0,0,1175,1173,1,0,0,0,1175,1176,1,0,0,0,1176,1178,
        1,0,0,0,1177,1175,1,0,0,0,1178,1179,3,168,84,0,1179,1180,3,160,80,
        0,1180,1181,5,79,0,0,1181,1182,3,154,77,0,1182,167,1,0,0,0,1183,
        1188,3,100,50,0,1184,1185,5,107,0,0,1185,1187,3,100,50,0,1186,1184,
        1,0,0,0,1187,1190,1,0,0,0,1188,1186,1,0,0,0,1188,1189,1,0,0,0,1189,
        169,1,0,0,0,1190,1188,1,0,0,0,1191,1192,5,19,0,0,1192,1193,3,154,
        77,0,1193,171,1,0,0,0,1194,1195,5,78,0,0,1195,1197,3,174,87,0,1196,
        1198,5,84,0,0,1197,1196,1,0,0,0,1197,1198,1,0,0,0,1198,1199,1,0,
        0,0,1199,1200,5,79,0,0,1200,173,1,0,0,0,1201,1206,3,176,88,0,1202,
        1203,5,84,0,0,1203,1205,3,176,88,0,1204,1202,1,0,0,0,1205,1208,1,
        0,0,0,1206,1204,1,0,0,0,1206,1207,1,0,0,0,1207,175,1,0,0,0,1208,
        1206,1,0,0,0,1209,1211,3,12,6,0,1210,1209,1,0,0,0,1211,1214,1,0,
        0,0,1212,1210,1,0,0,0,1212,1213,1,0,0,0,1213,1220,1,0,0,0,1214,1212,
        1,0,0,0,1215,1216,3,80,40,0,1216,1217,3,74,37,0,1217,1221,1,0,0,
        0,1218,1219,5,61,0,0,1219,1221,3,160,80,0,1220,1215,1,0,0,0,1220,
        1218,1,0,0,0,1221,1222,1,0,0,0,1222,1223,5,87,0,0,1223,1224,3,194,
        97,0,1224,1227,1,0,0,0,1225,1227,3,160,80,0,1226,1212,1,0,0,0,1226,
        1225,1,0,0,0,1227,177,1,0,0,0,1228,1230,3,180,90,0,1229,1228,1,0,
        0,0,1230,1231,1,0,0,0,1231,1229,1,0,0,0,1231,1232,1,0,0,0,1232,1234,
        1,0,0,0,1233,1235,3,156,78,0,1234,1233,1,0,0,0,1235,1236,1,0,0,0,
        1236,1234,1,0,0,0,1236,1237,1,0,0,0,1237,179,1,0,0,0,1238,1244,5,
        6,0,0,1239,1245,3,194,97,0,1240,1245,5,128,0,0,1241,1242,3,236,118,
        0,1242,1243,3,160,80,0,1243,1245,1,0,0,0,1244,1239,1,0,0,0,1244,
        1240,1,0,0,0,1244,1241,1,0,0,0,1245,1246,1,0,0,0,1246,1250,5,93,
        0,0,1247,1248,5,12,0,0,1248,1250,5,93,0,0,1249,1238,1,0,0,0,1249,
        1247,1,0,0,0,1250,181,1,0,0,0,1251,1264,3,186,93,0,1252,1254,3,184,
        92,0,1253,1252,1,0,0,0,1253,1254,1,0,0,0,1254,1255,1,0,0,0,1255,
        1257,5,84,0,0,1256,1258,3,194,97,0,1257,1256,1,0,0,0,1257,1258,1,
        0,0,0,1258,1259,1,0,0,0,1259,1261,5,84,0,0,1260,1262,3,190,95,0,
        1261,1260,1,0,0,0,1261,1262,1,0,0,0,1262,1264,1,0,0,0,1263,1251,
        1,0,0,0,1263,1253,1,0,0,0,1264,183,1,0,0,0,1265,1268,3,158,79,0,
        1266,1268,3,190,95,0,1267,1265,1,0,0,0,1267,1266,1,0,0,0,1268,185,
        1,0,0,0,1269,1271,3,12,6,0,1270,1269,1,0,0,0,1271,1274,1,0,0,0,1272,
        1270,1,0,0,0,1272,1273,1,0,0,0,1273,1277,1,0,0,0,1274,1272,1,0,0,
        0,1275,1278,3,236,118,0,1276,1278,5,61,0,0,1277,1275,1,0,0,0,1277,
        1276,1,0,0,0,1278,1279,1,0,0,0,1279,1280,3,74,37,0,1280,1281,5,93,
        0,0,1281,1282,3,194,97,0,1282,187,1,0,0,0,1283,1284,5,78,0,0,1284,
        1285,3,194,97,0,1285,1286,5,79,0,0,1286,189,1,0,0,0,1287,1292,3,
        194,97,0,1288,1289,5,85,0,0,1289,1291,3,194,97,0,1290,1288,1,0,0,
        0,1291,1294,1,0,0,0,1292,1290,1,0,0,0,1292,1293,1,0,0,0,1293,191,
        1,0,0,0,1294,1292,1,0,0,0,1295,1296,3,160,80,0,1296,1298,5,78,0,
        0,1297,1299,3,190,95,0,1298,1297,1,0,0,0,1298,1299,1,0,0,0,1299,
        1300,1,0,0,0,1300,1301,5,79,0,0,1301,1315,1,0,0,0,1302,1303,5,43,
        0,0,1303,1305,5,78,0,0,1304,1306,3,190,95,0,1305,1304,1,0,0,0,1305,
        1306,1,0,0,0,1306,1307,1,0,0,0,1307,1315,5,79,0,0,1308,1309,5,40,
        0,0,1309,1311,5,78,0,0,1310,1312,3,190,95,0,1311,1310,1,0,0,0,1311,
        1312,1,0,0,0,1312,1313,1,0,0,0,1313,1315,5,79,0,0,1314,1295,1,0,
        0,0,1314,1302,1,0,0,0,1314,1308,1,0,0,0,1315,193,1,0,0,0,1316,1317,
        6,97,-1,0,1317,1362,3,204,102,0,1318,1362,3,192,96,0,1319,1320,5,
        31,0,0,1320,1362,3,216,108,0,1321,1325,5,78,0,0,1322,1324,3,110,
        55,0,1323,1322,1,0,0,0,1324,1327,1,0,0,0,1325,1323,1,0,0,0,1325,
        1326,1,0,0,0,1326,1328,1,0,0,0,1327,1325,1,0,0,0,1328,1333,3,236,
        118,0,1329,1330,5,106,0,0,1330,1332,3,236,118,0,1331,1329,1,0,0,
        0,1332,1335,1,0,0,0,1333,1331,1,0,0,0,1333,1334,1,0,0,0,1334,1336,
        1,0,0,0,1335,1333,1,0,0,0,1336,1337,5,79,0,0,1337,1338,3,194,97,
        22,1338,1362,1,0,0,0,1339,1340,7,5,0,0,1340,1362,3,194,97,20,1341,
        1342,7,6,0,0,1342,1362,3,194,97,19,1343,1362,3,198,99,0,1344,1362,
        3,206,103,0,1345,1346,3,236,118,0,1346,1352,5,122,0,0,1347,1349,
        3,240,120,0,1348,1347,1,0,0,0,1348,1349,1,0,0,0,1349,1350,1,0,0,
        0,1350,1353,3,160,80,0,1351,1353,5,31,0,0,1352,1348,1,0,0,0,1352,
        1351,1,0,0,0,1353,1362,1,0,0,0,1354,1355,3,214,107,0,1355,1357,5,
        122,0,0,1356,1358,3,240,120,0,1357,1356,1,0,0,0,1357,1358,1,0,0,
        0,1358,1359,1,0,0,0,1359,1360,5,31,0,0,1360,1362,1,0,0,0,1361,1316,
        1,0,0,0,1361,1318,1,0,0,0,1361,1319,1,0,0,0,1361,1321,1,0,0,0,1361,
        1339,1,0,0,0,1361,1341,1,0,0,0,1361,1343,1,0,0,0,1361,1344,1,0,0,
        0,1361,1345,1,0,0,0,1361,1354,1,0,0,0,1362,1446,1,0,0,0,1363,1364,
        10,18,0,0,1364,1365,7,7,0,0,1365,1445,3,194,97,19,1366,1367,10,17,
        0,0,1367,1368,7,8,0,0,1368,1445,3,194,97,18,1369,1377,10,16,0,0,
        1370,1371,5,89,0,0,1371,1378,5,89,0,0,1372,1373,5,88,0,0,1373,1374,
        5,88,0,0,1374,1378,5,88,0,0,1375,1376,5,88,0,0,1376,1378,5,88,0,
        0,1377,1370,1,0,0,0,1377,1372,1,0,0,0,1377,1375,1,0,0,0,1378,1379,
        1,0,0,0,1379,1445,3,194,97,17,1380,1381,10,15,0,0,1381,1382,7,9,
        0,0,1382,1445,3,194,97,16,1383,1384,10,13,0,0,1384,1385,7,10,0,0,
        1385,1445,3,194,97,14,1386,1387,10,12,0,0,1387,1388,5,106,0,0,1388,
        1445,3,194,97,13,1389,1390,10,11,0,0,1390,1391,5,108,0,0,1391,1445,
        3,194,97,12,1392,1393,10,10,0,0,1393,1394,5,107,0,0,1394,1445,3,
        194,97,11,1395,1396,10,9,0,0,1396,1397,5,98,0,0,1397,1445,3,194,
        97,10,1398,1399,10,8,0,0,1399,1400,5,99,0,0,1400,1445,3,194,97,9,
        1401,1402,10,7,0,0,1402,1403,5,92,0,0,1403,1404,3,194,97,0,1404,
        1405,5,93,0,0,1405,1406,3,194,97,7,1406,1445,1,0,0,0,1407,1408,10,
        6,0,0,1408,1409,7,11,0,0,1409,1445,3,194,97,6,1410,1411,10,26,0,
        0,1411,1423,5,86,0,0,1412,1424,3,160,80,0,1413,1424,3,192,96,0,1414,
        1424,5,43,0,0,1415,1417,5,31,0,0,1416,1418,3,232,116,0,1417,1416,
        1,0,0,0,1417,1418,1,0,0,0,1418,1419,1,0,0,0,1419,1424,3,220,110,
        0,1420,1421,5,40,0,0,1421,1424,3,242,121,0,1422,1424,3,226,113,0,
        1423,1412,1,0,0,0,1423,1413,1,0,0,0,1423,1414,1,0,0,0,1423,1415,
        1,0,0,0,1423,1420,1,0,0,0,1423,1422,1,0,0,0,1424,1445,1,0,0,0,1425,
        1426,10,25,0,0,1426,1427,5,82,0,0,1427,1428,3,194,97,0,1428,1429,
        5,83,0,0,1429,1445,1,0,0,0,1430,1431,10,21,0,0,1431,1445,7,12,0,
        0,1432,1433,10,14,0,0,1433,1436,5,26,0,0,1434,1437,3,236,118,0,1435,
        1437,3,196,98,0,1436,1434,1,0,0,0,1436,1435,1,0,0,0,1437,1445,1,
        0,0,0,1438,1439,10,3,0,0,1439,1441,5,122,0,0,1440,1442,3,240,120,
        0,1441,1440,1,0,0,0,1441,1442,1,0,0,0,1442,1443,1,0,0,0,1443,1445,
        3,160,80,0,1444,1363,1,0,0,0,1444,1366,1,0,0,0,1444,1369,1,0,0,0,
        1444,1380,1,0,0,0,1444,1383,1,0,0,0,1444,1386,1,0,0,0,1444,1389,
        1,0,0,0,1444,1392,1,0,0,0,1444,1395,1,0,0,0,1444,1398,1,0,0,0,1444,
        1401,1,0,0,0,1444,1407,1,0,0,0,1444,1410,1,0,0,0,1444,1425,1,0,0,
        0,1444,1430,1,0,0,0,1444,1432,1,0,0,0,1444,1438,1,0,0,0,1445,1448,
        1,0,0,0,1446,1444,1,0,0,0,1446,1447,1,0,0,0,1447,195,1,0,0,0,1448,
        1446,1,0,0,0,1449,1451,3,12,6,0,1450,1449,1,0,0,0,1451,1454,1,0,
        0,0,1452,1450,1,0,0,0,1452,1453,1,0,0,0,1453,1455,1,0,0,0,1454,1452,
        1,0,0,0,1455,1459,3,236,118,0,1456,1458,3,110,55,0,1457,1456,1,0,
        0,0,1458,1461,1,0,0,0,1459,1457,1,0,0,0,1459,1460,1,0,0,0,1460,1462,
        1,0,0,0,1461,1459,1,0,0,0,1462,1463,3,160,80,0,1463,197,1,0,0,0,
        1464,1465,3,200,100,0,1465,1466,5,121,0,0,1466,1467,3,202,101,0,
        1467,199,1,0,0,0,1468,1491,3,160,80,0,1469,1471,5,78,0,0,1470,1472,
        3,90,45,0,1471,1470,1,0,0,0,1471,1472,1,0,0,0,1472,1473,1,0,0,0,
        1473,1491,5,79,0,0,1474,1475,5,78,0,0,1475,1480,3,160,80,0,1476,
        1477,5,85,0,0,1477,1479,3,160,80,0,1478,1476,1,0,0,0,1479,1482,1,
        0,0,0,1480,1478,1,0,0,0,1480,1481,1,0,0,0,1481,1483,1,0,0,0,1482,
        1480,1,0,0,0,1483,1484,5,79,0,0,1484,1491,1,0,0,0,1485,1487,5,78,
        0,0,1486,1488,3,96,48,0,1487,1486,1,0,0,0,1487,1488,1,0,0,0,1488,
        1489,1,0,0,0,1489,1491,5,79,0,0,1490,1468,1,0,0,0,1490,1469,1,0,
        0,0,1490,1474,1,0,0,0,1490,1485,1,0,0,0,1491,201,1,0,0,0,1492,1495,
        3,194,97,0,1493,1495,3,154,77,0,1494,1492,1,0,0,0,1494,1493,1,0,
        0,0,1495,203,1,0,0,0,1496,1497,5,78,0,0,1497,1498,3,194,97,0,1498,
        1499,5,79,0,0,1499,1515,1,0,0,0,1500,1515,5,43,0,0,1501,1515,5,40,
        0,0,1502,1515,3,102,51,0,1503,1515,3,160,80,0,1504,1505,3,44,22,
        0,1505,1506,5,86,0,0,1506,1507,5,9,0,0,1507,1515,1,0,0,0,1508,1512,
        3,232,116,0,1509,1513,3,244,122,0,1510,1511,5,43,0,0,1511,1513,3,
        246,123,0,1512,1509,1,0,0,0,1512,1510,1,0,0,0,1513,1515,1,0,0,0,
        1514,1496,1,0,0,0,1514,1500,1,0,0,0,1514,1501,1,0,0,0,1514,1502,
        1,0,0,0,1514,1503,1,0,0,0,1514,1504,1,0,0,0,1514,1508,1,0,0,0,1515,
        205,1,0,0,0,1516,1517,5,41,0,0,1517,1518,3,188,94,0,1518,1522,5,
        80,0,0,1519,1521,3,208,104,0,1520,1519,1,0,0,0,1521,1524,1,0,0,0,
        1522,1520,1,0,0,0,1522,1523,1,0,0,0,1523,1525,1,0,0,0,1524,1522,
        1,0,0,0,1525,1526,5,81,0,0,1526,207,1,0,0,0,1527,1531,5,6,0,0,1528,
        1532,3,190,95,0,1529,1532,5,77,0,0,1530,1532,3,210,105,0,1531,1528,
        1,0,0,0,1531,1529,1,0,0,0,1531,1530,1,0,0,0,1532,1533,1,0,0,0,1533,
        1534,7,13,0,0,1534,1539,3,212,106,0,1535,1536,5,12,0,0,1536,1537,
        7,13,0,0,1537,1539,3,212,106,0,1538,1527,1,0,0,0,1538,1535,1,0,0,
        0,1539,209,1,0,0,0,1540,1541,6,105,-1,0,1541,1542,5,78,0,0,1542,
        1543,3,210,105,0,1543,1544,5,79,0,0,1544,1567,1,0,0,0,1545,1547,
        3,12,6,0,1546,1545,1,0,0,0,1547,1550,1,0,0,0,1548,1546,1,0,0,0,1548,
        1549,1,0,0,0,1549,1551,1,0,0,0,1550,1548,1,0,0,0,1551,1555,3,236,
        118,0,1552,1554,3,110,55,0,1553,1552,1,0,0,0,1554,1557,1,0,0,0,1555,
        1553,1,0,0,0,1555,1556,1,0,0,0,1556,1558,1,0,0,0,1557,1555,1,0,0,
        0,1558,1563,3,160,80,0,1559,1560,5,98,0,0,1560,1562,3,194,97,0,1561,
        1559,1,0,0,0,1562,1565,1,0,0,0,1563,1561,1,0,0,0,1563,1564,1,0,0,
        0,1564,1567,1,0,0,0,1565,1563,1,0,0,0,1566,1540,1,0,0,0,1566,1548,
        1,0,0,0,1567,1573,1,0,0,0,1568,1569,10,1,0,0,1569,1570,5,98,0,0,
        1570,1572,3,194,97,0,1571,1568,1,0,0,0,1572,1575,1,0,0,0,1573,1571,
        1,0,0,0,1573,1574,1,0,0,0,1574,211,1,0,0,0,1575,1573,1,0,0,0,1576,
        1584,3,154,77,0,1577,1579,3,156,78,0,1578,1577,1,0,0,0,1579,1582,
        1,0,0,0,1580,1578,1,0,0,0,1580,1581,1,0,0,0,1581,1584,1,0,0,0,1582,
        1580,1,0,0,0,1583,1576,1,0,0,0,1583,1580,1,0,0,0,1584,213,1,0,0,
        0,1585,1586,3,80,40,0,1586,1587,5,86,0,0,1587,1589,1,0,0,0,1588,
        1585,1,0,0,0,1588,1589,1,0,0,0,1589,1593,1,0,0,0,1590,1592,3,110,
        55,0,1591,1590,1,0,0,0,1592,1595,1,0,0,0,1593,1591,1,0,0,0,1593,
        1594,1,0,0,0,1594,1596,1,0,0,0,1595,1593,1,0,0,0,1596,1598,3,160,
        80,0,1597,1599,3,240,120,0,1598,1597,1,0,0,0,1598,1599,1,0,0,0,1599,
        215,1,0,0,0,1600,1601,3,232,116,0,1601,1602,3,218,109,0,1602,1603,
        3,224,112,0,1603,1610,1,0,0,0,1604,1607,3,218,109,0,1605,1608,3,
        222,111,0,1606,1608,3,224,112,0,1607,1605,1,0,0,0,1607,1606,1,0,
        0,0,1608,1610,1,0,0,0,1609,1600,1,0,0,0,1609,1604,1,0,0,0,1610,217,
        1,0,0,0,1611,1613,3,160,80,0,1612,1614,3,228,114,0,1613,1612,1,0,
        0,0,1613,1614,1,0,0,0,1614,1622,1,0,0,0,1615,1616,5,86,0,0,1616,
        1618,3,160,80,0,1617,1619,3,228,114,0,1618,1617,1,0,0,0,1618,1619,
        1,0,0,0,1619,1621,1,0,0,0,1620,1615,1,0,0,0,1621,1624,1,0,0,0,1622,
        1620,1,0,0,0,1622,1623,1,0,0,0,1623,1627,1,0,0,0,1624,1622,1,0,0,
        0,1625,1627,3,238,119,0,1626,1611,1,0,0,0,1626,1625,1,0,0,0,1627,
        219,1,0,0,0,1628,1630,3,160,80,0,1629,1631,3,230,115,0,1630,1629,
        1,0,0,0,1630,1631,1,0,0,0,1631,1632,1,0,0,0,1632,1633,3,224,112,
        0,1633,221,1,0,0,0,1634,1662,5,82,0,0,1635,1640,5,83,0,0,1636,1637,
        5,82,0,0,1637,1639,5,83,0,0,1638,1636,1,0,0,0,1639,1642,1,0,0,0,
        1640,1638,1,0,0,0,1640,1641,1,0,0,0,1641,1643,1,0,0,0,1642,1640,
        1,0,0,0,1643,1663,3,78,39,0,1644,1645,3,194,97,0,1645,1652,5,83,
        0,0,1646,1647,5,82,0,0,1647,1648,3,194,97,0,1648,1649,5,83,0,0,1649,
        1651,1,0,0,0,1650,1646,1,0,0,0,1651,1654,1,0,0,0,1652,1650,1,0,0,
        0,1652,1653,1,0,0,0,1653,1659,1,0,0,0,1654,1652,1,0,0,0,1655,1656,
        5,82,0,0,1656,1658,5,83,0,0,1657,1655,1,0,0,0,1658,1661,1,0,0,0,
        1659,1657,1,0,0,0,1659,1660,1,0,0,0,1660,1663,1,0,0,0,1661,1659,
        1,0,0,0,1662,1635,1,0,0,0,1662,1644,1,0,0,0,1663,223,1,0,0,0,1664,
        1666,3,246,123,0,1665,1667,3,32,16,0,1666,1665,1,0,0,0,1666,1667,
        1,0,0,0,1667,225,1,0,0,0,1668,1669,3,232,116,0,1669,1670,3,244,122,
        0,1670,227,1,0,0,0,1671,1672,5,89,0,0,1672,1675,5,88,0,0,1673,1675,
        3,240,120,0,1674,1671,1,0,0,0,1674,1673,1,0,0,0,1675,229,1,0,0,0,
        1676,1677,5,89,0,0,1677,1680,5,88,0,0,1678,1680,3,232,116,0,1679,
        1676,1,0,0,0,1679,1678,1,0,0,0,1680,231,1,0,0,0,1681,1682,5,89,0,
        0,1682,1683,3,234,117,0,1683,1684,5,88,0,0,1684,233,1,0,0,0,1685,
        1690,3,236,118,0,1686,1687,5,85,0,0,1687,1689,3,236,118,0,1688,1686,
        1,0,0,0,1689,1692,1,0,0,0,1690,1688,1,0,0,0,1690,1691,1,0,0,0,1691,
        235,1,0,0,0,1692,1690,1,0,0,0,1693,1695,3,110,55,0,1694,1693,1,0,
        0,0,1695,1698,1,0,0,0,1696,1694,1,0,0,0,1696,1697,1,0,0,0,1697,1701,
        1,0,0,0,1698,1696,1,0,0,0,1699,1702,3,80,40,0,1700,1702,3,238,119,
        0,1701,1699,1,0,0,0,1701,1700,1,0,0,0,1702,1713,1,0,0,0,1703,1705,
        3,110,55,0,1704,1703,1,0,0,0,1705,1708,1,0,0,0,1706,1704,1,0,0,0,
        1706,1707,1,0,0,0,1707,1709,1,0,0,0,1708,1706,1,0,0,0,1709,1710,
        5,82,0,0,1710,1712,5,83,0,0,1711,1706,1,0,0,0,1712,1715,1,0,0,0,
        1713,1711,1,0,0,0,1713,1714,1,0,0,0,1714,237,1,0,0,0,1715,1713,1,
        0,0,0,1716,1717,7,14,0,0,1717,239,1,0,0,0,1718,1719,5,89,0,0,1719,
        1724,3,82,41,0,1720,1721,5,85,0,0,1721,1723,3,82,41,0,1722,1720,
        1,0,0,0,1723,1726,1,0,0,0,1724,1722,1,0,0,0,1724,1725,1,0,0,0,1725,
        1727,1,0,0,0,1726,1724,1,0,0,0,1727,1728,5,88,0,0,1728,241,1,0,0,
        0,1729,1739,3,246,123,0,1730,1732,5,86,0,0,1731,1733,3,240,120,0,
        1732,1731,1,0,0,0,1732,1733,1,0,0,0,1733,1734,1,0,0,0,1734,1736,
        3,160,80,0,1735,1737,3,246,123,0,1736,1735,1,0,0,0,1736,1737,1,0,
        0,0,1737,1739,1,0,0,0,1738,1729,1,0,0,0,1738,1730,1,0,0,0,1739,243,
        1,0,0,0,1740,1741,5,40,0,0,1741,1746,3,242,121,0,1742,1743,3,160,
        80,0,1743,1744,3,246,123,0,1744,1746,1,0,0,0,1745,1740,1,0,0,0,1745,
        1742,1,0,0,0,1746,245,1,0,0,0,1747,1749,5,78,0,0,1748,1750,3,190,
        95,0,1749,1748,1,0,0,0,1749,1750,1,0,0,0,1750,1751,1,0,0,0,1751,
        1752,5,79,0,0,1752,247,1,0,0,0,218,249,254,260,267,272,281,286,293,
        301,304,311,323,327,332,336,340,344,354,362,370,374,381,388,392,
        395,398,407,413,418,421,427,433,437,445,454,461,467,471,483,492,
        497,503,507,519,530,535,545,553,563,572,583,588,597,607,612,621,
        627,634,639,647,651,653,659,664,668,675,681,683,690,695,700,703,
        705,715,725,730,733,738,747,754,765,771,782,792,803,812,817,820,
        827,837,845,848,851,864,872,877,885,889,893,897,901,903,907,913,
        921,931,940,950,958,972,979,984,990,999,1009,1018,1028,1033,1044,
        1050,1053,1060,1069,1092,1095,1098,1106,1110,1118,1124,1135,1144,
        1149,1162,1168,1175,1188,1197,1206,1212,1220,1226,1231,1236,1244,
        1249,1253,1257,1261,1263,1267,1272,1277,1292,1298,1305,1311,1314,
        1325,1333,1348,1352,1357,1361,1377,1417,1423,1436,1441,1444,1446,
        1452,1459,1471,1480,1487,1490,1494,1512,1514,1522,1531,1538,1548,
        1555,1563,1566,1573,1580,1583,1588,1593,1598,1607,1609,1613,1618,
        1622,1626,1630,1640,1652,1659,1662,1666,1674,1679,1690,1696,1701,
        1706,1713,1724,1732,1736,1738,1745,1749
    ];

    private static __ATN: antlr.ATN;
    public static get _ATN(): antlr.ATN {
        if (!JavaParser.__ATN) {
            JavaParser.__ATN = new antlr.ATNDeserializer().deserialize(JavaParser._serializedATN);
        }

        return JavaParser.__ATN;
    }


    private static readonly vocabulary = new antlr.Vocabulary(JavaParser.literalNames, JavaParser.symbolicNames, []);

    public override get vocabulary(): antlr.Vocabulary {
        return JavaParser.vocabulary;
    }

    private static readonly decisionsToDFA = JavaParser._ATN.decisionToState.map( (ds: antlr.DecisionState, index: number) => new antlr.DFA(ds, index) );
}

export class CompilationUnitContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public EOF(): antlr.TerminalNode {
        return this.getToken(JavaParser.EOF, 0)!;
    }
    public packageDeclaration(): PackageDeclarationContext | null {
        return this.getRuleContext(0, PackageDeclarationContext);
    }
    public importDeclaration(): ImportDeclarationContext[];
    public importDeclaration(i: number): ImportDeclarationContext | null;
    public importDeclaration(i?: number): ImportDeclarationContext[] | ImportDeclarationContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ImportDeclarationContext);
        }

        return this.getRuleContext(i, ImportDeclarationContext);
    }
    public typeDeclaration(): TypeDeclarationContext[];
    public typeDeclaration(i: number): TypeDeclarationContext | null;
    public typeDeclaration(i?: number): TypeDeclarationContext[] | TypeDeclarationContext | null {
        if (i === undefined) {
            return this.getRuleContexts(TypeDeclarationContext);
        }

        return this.getRuleContext(i, TypeDeclarationContext);
    }
    public moduleDeclaration(): ModuleDeclarationContext | null {
        return this.getRuleContext(0, ModuleDeclarationContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_compilationUnit;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterCompilationUnit) {
             listener.enterCompilationUnit(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitCompilationUnit) {
             listener.exitCompilationUnit(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitCompilationUnit) {
            return visitor.visitCompilationUnit(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class PackageDeclarationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public PACKAGE(): antlr.TerminalNode {
        return this.getToken(JavaParser.PACKAGE, 0)!;
    }
    public qualifiedName(): QualifiedNameContext {
        return this.getRuleContext(0, QualifiedNameContext)!;
    }
    public SEMI(): antlr.TerminalNode {
        return this.getToken(JavaParser.SEMI, 0)!;
    }
    public annotation(): AnnotationContext[];
    public annotation(i: number): AnnotationContext | null;
    public annotation(i?: number): AnnotationContext[] | AnnotationContext | null {
        if (i === undefined) {
            return this.getRuleContexts(AnnotationContext);
        }

        return this.getRuleContext(i, AnnotationContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_packageDeclaration;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterPackageDeclaration) {
             listener.enterPackageDeclaration(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitPackageDeclaration) {
             listener.exitPackageDeclaration(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitPackageDeclaration) {
            return visitor.visitPackageDeclaration(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ImportDeclarationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public IMPORT(): antlr.TerminalNode {
        return this.getToken(JavaParser.IMPORT, 0)!;
    }
    public qualifiedName(): QualifiedNameContext {
        return this.getRuleContext(0, QualifiedNameContext)!;
    }
    public SEMI(): antlr.TerminalNode {
        return this.getToken(JavaParser.SEMI, 0)!;
    }
    public STATIC(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.STATIC, 0);
    }
    public DOT(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.DOT, 0);
    }
    public MUL(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.MUL, 0);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_importDeclaration;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterImportDeclaration) {
             listener.enterImportDeclaration(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitImportDeclaration) {
             listener.exitImportDeclaration(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitImportDeclaration) {
            return visitor.visitImportDeclaration(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class TypeDeclarationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public classDeclaration(): ClassDeclarationContext | null {
        return this.getRuleContext(0, ClassDeclarationContext);
    }
    public enumDeclaration(): EnumDeclarationContext | null {
        return this.getRuleContext(0, EnumDeclarationContext);
    }
    public interfaceDeclaration(): InterfaceDeclarationContext | null {
        return this.getRuleContext(0, InterfaceDeclarationContext);
    }
    public annotationTypeDeclaration(): AnnotationTypeDeclarationContext | null {
        return this.getRuleContext(0, AnnotationTypeDeclarationContext);
    }
    public recordDeclaration(): RecordDeclarationContext | null {
        return this.getRuleContext(0, RecordDeclarationContext);
    }
    public classOrInterfaceModifier(): ClassOrInterfaceModifierContext[];
    public classOrInterfaceModifier(i: number): ClassOrInterfaceModifierContext | null;
    public classOrInterfaceModifier(i?: number): ClassOrInterfaceModifierContext[] | ClassOrInterfaceModifierContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ClassOrInterfaceModifierContext);
        }

        return this.getRuleContext(i, ClassOrInterfaceModifierContext);
    }
    public SEMI(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.SEMI, 0);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_typeDeclaration;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterTypeDeclaration) {
             listener.enterTypeDeclaration(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitTypeDeclaration) {
             listener.exitTypeDeclaration(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitTypeDeclaration) {
            return visitor.visitTypeDeclaration(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ModifierContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public classOrInterfaceModifier(): ClassOrInterfaceModifierContext | null {
        return this.getRuleContext(0, ClassOrInterfaceModifierContext);
    }
    public NATIVE(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.NATIVE, 0);
    }
    public SYNCHRONIZED(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.SYNCHRONIZED, 0);
    }
    public TRANSIENT(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.TRANSIENT, 0);
    }
    public VOLATILE(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.VOLATILE, 0);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_modifier;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterModifier) {
             listener.enterModifier(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitModifier) {
             listener.exitModifier(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitModifier) {
            return visitor.visitModifier(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ClassOrInterfaceModifierContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public annotation(): AnnotationContext | null {
        return this.getRuleContext(0, AnnotationContext);
    }
    public PUBLIC(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.PUBLIC, 0);
    }
    public PROTECTED(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.PROTECTED, 0);
    }
    public PRIVATE(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.PRIVATE, 0);
    }
    public STATIC(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.STATIC, 0);
    }
    public ABSTRACT(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.ABSTRACT, 0);
    }
    public FINAL(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.FINAL, 0);
    }
    public STRICTFP(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.STRICTFP, 0);
    }
    public SEALED(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.SEALED, 0);
    }
    public NON_SEALED(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.NON_SEALED, 0);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_classOrInterfaceModifier;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterClassOrInterfaceModifier) {
             listener.enterClassOrInterfaceModifier(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitClassOrInterfaceModifier) {
             listener.exitClassOrInterfaceModifier(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitClassOrInterfaceModifier) {
            return visitor.visitClassOrInterfaceModifier(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class VariableModifierContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public FINAL(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.FINAL, 0);
    }
    public annotation(): AnnotationContext | null {
        return this.getRuleContext(0, AnnotationContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_variableModifier;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterVariableModifier) {
             listener.enterVariableModifier(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitVariableModifier) {
             listener.exitVariableModifier(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitVariableModifier) {
            return visitor.visitVariableModifier(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ClassDeclarationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public CLASS(): antlr.TerminalNode {
        return this.getToken(JavaParser.CLASS, 0)!;
    }
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
    }
    public classBody(): ClassBodyContext {
        return this.getRuleContext(0, ClassBodyContext)!;
    }
    public typeParameters(): TypeParametersContext | null {
        return this.getRuleContext(0, TypeParametersContext);
    }
    public EXTENDS(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.EXTENDS, 0);
    }
    public typeType(): TypeTypeContext | null {
        return this.getRuleContext(0, TypeTypeContext);
    }
    public IMPLEMENTS(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.IMPLEMENTS, 0);
    }
    public typeList(): TypeListContext[];
    public typeList(i: number): TypeListContext | null;
    public typeList(i?: number): TypeListContext[] | TypeListContext | null {
        if (i === undefined) {
            return this.getRuleContexts(TypeListContext);
        }

        return this.getRuleContext(i, TypeListContext);
    }
    public PERMITS(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.PERMITS, 0);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_classDeclaration;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterClassDeclaration) {
             listener.enterClassDeclaration(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitClassDeclaration) {
             listener.exitClassDeclaration(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitClassDeclaration) {
            return visitor.visitClassDeclaration(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class TypeParametersContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public LT(): antlr.TerminalNode {
        return this.getToken(JavaParser.LT, 0)!;
    }
    public typeParameter(): TypeParameterContext[];
    public typeParameter(i: number): TypeParameterContext | null;
    public typeParameter(i?: number): TypeParameterContext[] | TypeParameterContext | null {
        if (i === undefined) {
            return this.getRuleContexts(TypeParameterContext);
        }

        return this.getRuleContext(i, TypeParameterContext);
    }
    public GT(): antlr.TerminalNode {
        return this.getToken(JavaParser.GT, 0)!;
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.COMMA);
    	} else {
    		return this.getToken(JavaParser.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_typeParameters;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterTypeParameters) {
             listener.enterTypeParameters(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitTypeParameters) {
             listener.exitTypeParameters(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitTypeParameters) {
            return visitor.visitTypeParameters(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class TypeParameterContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
    }
    public annotation(): AnnotationContext[];
    public annotation(i: number): AnnotationContext | null;
    public annotation(i?: number): AnnotationContext[] | AnnotationContext | null {
        if (i === undefined) {
            return this.getRuleContexts(AnnotationContext);
        }

        return this.getRuleContext(i, AnnotationContext);
    }
    public EXTENDS(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.EXTENDS, 0);
    }
    public typeBound(): TypeBoundContext | null {
        return this.getRuleContext(0, TypeBoundContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_typeParameter;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterTypeParameter) {
             listener.enterTypeParameter(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitTypeParameter) {
             listener.exitTypeParameter(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitTypeParameter) {
            return visitor.visitTypeParameter(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class TypeBoundContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public typeType(): TypeTypeContext[];
    public typeType(i: number): TypeTypeContext | null;
    public typeType(i?: number): TypeTypeContext[] | TypeTypeContext | null {
        if (i === undefined) {
            return this.getRuleContexts(TypeTypeContext);
        }

        return this.getRuleContext(i, TypeTypeContext);
    }
    public BITAND(): antlr.TerminalNode[];
    public BITAND(i: number): antlr.TerminalNode | null;
    public BITAND(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.BITAND);
    	} else {
    		return this.getToken(JavaParser.BITAND, i);
    	}
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_typeBound;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterTypeBound) {
             listener.enterTypeBound(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitTypeBound) {
             listener.exitTypeBound(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitTypeBound) {
            return visitor.visitTypeBound(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class EnumDeclarationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public ENUM(): antlr.TerminalNode {
        return this.getToken(JavaParser.ENUM, 0)!;
    }
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
    }
    public LBRACE(): antlr.TerminalNode {
        return this.getToken(JavaParser.LBRACE, 0)!;
    }
    public RBRACE(): antlr.TerminalNode {
        return this.getToken(JavaParser.RBRACE, 0)!;
    }
    public IMPLEMENTS(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.IMPLEMENTS, 0);
    }
    public typeList(): TypeListContext | null {
        return this.getRuleContext(0, TypeListContext);
    }
    public enumConstants(): EnumConstantsContext | null {
        return this.getRuleContext(0, EnumConstantsContext);
    }
    public COMMA(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.COMMA, 0);
    }
    public enumBodyDeclarations(): EnumBodyDeclarationsContext | null {
        return this.getRuleContext(0, EnumBodyDeclarationsContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_enumDeclaration;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterEnumDeclaration) {
             listener.enterEnumDeclaration(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitEnumDeclaration) {
             listener.exitEnumDeclaration(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitEnumDeclaration) {
            return visitor.visitEnumDeclaration(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class EnumConstantsContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public enumConstant(): EnumConstantContext[];
    public enumConstant(i: number): EnumConstantContext | null;
    public enumConstant(i?: number): EnumConstantContext[] | EnumConstantContext | null {
        if (i === undefined) {
            return this.getRuleContexts(EnumConstantContext);
        }

        return this.getRuleContext(i, EnumConstantContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.COMMA);
    	} else {
    		return this.getToken(JavaParser.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_enumConstants;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterEnumConstants) {
             listener.enterEnumConstants(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitEnumConstants) {
             listener.exitEnumConstants(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitEnumConstants) {
            return visitor.visitEnumConstants(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class EnumConstantContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
    }
    public annotation(): AnnotationContext[];
    public annotation(i: number): AnnotationContext | null;
    public annotation(i?: number): AnnotationContext[] | AnnotationContext | null {
        if (i === undefined) {
            return this.getRuleContexts(AnnotationContext);
        }

        return this.getRuleContext(i, AnnotationContext);
    }
    public arguments(): ArgumentsContext | null {
        return this.getRuleContext(0, ArgumentsContext);
    }
    public classBody(): ClassBodyContext | null {
        return this.getRuleContext(0, ClassBodyContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_enumConstant;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterEnumConstant) {
             listener.enterEnumConstant(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitEnumConstant) {
             listener.exitEnumConstant(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitEnumConstant) {
            return visitor.visitEnumConstant(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class EnumBodyDeclarationsContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public SEMI(): antlr.TerminalNode {
        return this.getToken(JavaParser.SEMI, 0)!;
    }
    public classBodyDeclaration(): ClassBodyDeclarationContext[];
    public classBodyDeclaration(i: number): ClassBodyDeclarationContext | null;
    public classBodyDeclaration(i?: number): ClassBodyDeclarationContext[] | ClassBodyDeclarationContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ClassBodyDeclarationContext);
        }

        return this.getRuleContext(i, ClassBodyDeclarationContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_enumBodyDeclarations;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterEnumBodyDeclarations) {
             listener.enterEnumBodyDeclarations(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitEnumBodyDeclarations) {
             listener.exitEnumBodyDeclarations(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitEnumBodyDeclarations) {
            return visitor.visitEnumBodyDeclarations(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class InterfaceDeclarationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INTERFACE(): antlr.TerminalNode {
        return this.getToken(JavaParser.INTERFACE, 0)!;
    }
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
    }
    public interfaceBody(): InterfaceBodyContext {
        return this.getRuleContext(0, InterfaceBodyContext)!;
    }
    public typeParameters(): TypeParametersContext | null {
        return this.getRuleContext(0, TypeParametersContext);
    }
    public EXTENDS(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.EXTENDS, 0);
    }
    public typeList(): TypeListContext | null {
        return this.getRuleContext(0, TypeListContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_interfaceDeclaration;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterInterfaceDeclaration) {
             listener.enterInterfaceDeclaration(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitInterfaceDeclaration) {
             listener.exitInterfaceDeclaration(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitInterfaceDeclaration) {
            return visitor.visitInterfaceDeclaration(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ClassBodyContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public LBRACE(): antlr.TerminalNode {
        return this.getToken(JavaParser.LBRACE, 0)!;
    }
    public RBRACE(): antlr.TerminalNode {
        return this.getToken(JavaParser.RBRACE, 0)!;
    }
    public classBodyDeclaration(): ClassBodyDeclarationContext[];
    public classBodyDeclaration(i: number): ClassBodyDeclarationContext | null;
    public classBodyDeclaration(i?: number): ClassBodyDeclarationContext[] | ClassBodyDeclarationContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ClassBodyDeclarationContext);
        }

        return this.getRuleContext(i, ClassBodyDeclarationContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_classBody;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterClassBody) {
             listener.enterClassBody(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitClassBody) {
             listener.exitClassBody(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitClassBody) {
            return visitor.visitClassBody(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class InterfaceBodyContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public LBRACE(): antlr.TerminalNode {
        return this.getToken(JavaParser.LBRACE, 0)!;
    }
    public RBRACE(): antlr.TerminalNode {
        return this.getToken(JavaParser.RBRACE, 0)!;
    }
    public interfaceBodyDeclaration(): InterfaceBodyDeclarationContext[];
    public interfaceBodyDeclaration(i: number): InterfaceBodyDeclarationContext | null;
    public interfaceBodyDeclaration(i?: number): InterfaceBodyDeclarationContext[] | InterfaceBodyDeclarationContext | null {
        if (i === undefined) {
            return this.getRuleContexts(InterfaceBodyDeclarationContext);
        }

        return this.getRuleContext(i, InterfaceBodyDeclarationContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_interfaceBody;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterInterfaceBody) {
             listener.enterInterfaceBody(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitInterfaceBody) {
             listener.exitInterfaceBody(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitInterfaceBody) {
            return visitor.visitInterfaceBody(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ClassBodyDeclarationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public SEMI(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.SEMI, 0);
    }
    public block(): BlockContext | null {
        return this.getRuleContext(0, BlockContext);
    }
    public STATIC(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.STATIC, 0);
    }
    public memberDeclaration(): MemberDeclarationContext | null {
        return this.getRuleContext(0, MemberDeclarationContext);
    }
    public modifier(): ModifierContext[];
    public modifier(i: number): ModifierContext | null;
    public modifier(i?: number): ModifierContext[] | ModifierContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ModifierContext);
        }

        return this.getRuleContext(i, ModifierContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_classBodyDeclaration;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterClassBodyDeclaration) {
             listener.enterClassBodyDeclaration(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitClassBodyDeclaration) {
             listener.exitClassBodyDeclaration(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitClassBodyDeclaration) {
            return visitor.visitClassBodyDeclaration(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class MemberDeclarationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public methodDeclaration(): MethodDeclarationContext | null {
        return this.getRuleContext(0, MethodDeclarationContext);
    }
    public genericMethodDeclaration(): GenericMethodDeclarationContext | null {
        return this.getRuleContext(0, GenericMethodDeclarationContext);
    }
    public fieldDeclaration(): FieldDeclarationContext | null {
        return this.getRuleContext(0, FieldDeclarationContext);
    }
    public constructorDeclaration(): ConstructorDeclarationContext | null {
        return this.getRuleContext(0, ConstructorDeclarationContext);
    }
    public genericConstructorDeclaration(): GenericConstructorDeclarationContext | null {
        return this.getRuleContext(0, GenericConstructorDeclarationContext);
    }
    public interfaceDeclaration(): InterfaceDeclarationContext | null {
        return this.getRuleContext(0, InterfaceDeclarationContext);
    }
    public annotationTypeDeclaration(): AnnotationTypeDeclarationContext | null {
        return this.getRuleContext(0, AnnotationTypeDeclarationContext);
    }
    public classDeclaration(): ClassDeclarationContext | null {
        return this.getRuleContext(0, ClassDeclarationContext);
    }
    public enumDeclaration(): EnumDeclarationContext | null {
        return this.getRuleContext(0, EnumDeclarationContext);
    }
    public recordDeclaration(): RecordDeclarationContext | null {
        return this.getRuleContext(0, RecordDeclarationContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_memberDeclaration;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterMemberDeclaration) {
             listener.enterMemberDeclaration(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitMemberDeclaration) {
             listener.exitMemberDeclaration(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitMemberDeclaration) {
            return visitor.visitMemberDeclaration(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class MethodDeclarationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public typeTypeOrVoid(): TypeTypeOrVoidContext {
        return this.getRuleContext(0, TypeTypeOrVoidContext)!;
    }
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
    }
    public formalParameters(): FormalParametersContext {
        return this.getRuleContext(0, FormalParametersContext)!;
    }
    public methodBody(): MethodBodyContext {
        return this.getRuleContext(0, MethodBodyContext)!;
    }
    public LBRACK(): antlr.TerminalNode[];
    public LBRACK(i: number): antlr.TerminalNode | null;
    public LBRACK(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.LBRACK);
    	} else {
    		return this.getToken(JavaParser.LBRACK, i);
    	}
    }
    public RBRACK(): antlr.TerminalNode[];
    public RBRACK(i: number): antlr.TerminalNode | null;
    public RBRACK(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.RBRACK);
    	} else {
    		return this.getToken(JavaParser.RBRACK, i);
    	}
    }
    public THROWS(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.THROWS, 0);
    }
    public qualifiedNameList(): QualifiedNameListContext | null {
        return this.getRuleContext(0, QualifiedNameListContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_methodDeclaration;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterMethodDeclaration) {
             listener.enterMethodDeclaration(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitMethodDeclaration) {
             listener.exitMethodDeclaration(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitMethodDeclaration) {
            return visitor.visitMethodDeclaration(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class MethodBodyContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public block(): BlockContext | null {
        return this.getRuleContext(0, BlockContext);
    }
    public SEMI(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.SEMI, 0);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_methodBody;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterMethodBody) {
             listener.enterMethodBody(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitMethodBody) {
             listener.exitMethodBody(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitMethodBody) {
            return visitor.visitMethodBody(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class TypeTypeOrVoidContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public typeType(): TypeTypeContext | null {
        return this.getRuleContext(0, TypeTypeContext);
    }
    public VOID(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.VOID, 0);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_typeTypeOrVoid;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterTypeTypeOrVoid) {
             listener.enterTypeTypeOrVoid(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitTypeTypeOrVoid) {
             listener.exitTypeTypeOrVoid(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitTypeTypeOrVoid) {
            return visitor.visitTypeTypeOrVoid(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class GenericMethodDeclarationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public typeParameters(): TypeParametersContext {
        return this.getRuleContext(0, TypeParametersContext)!;
    }
    public methodDeclaration(): MethodDeclarationContext {
        return this.getRuleContext(0, MethodDeclarationContext)!;
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_genericMethodDeclaration;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterGenericMethodDeclaration) {
             listener.enterGenericMethodDeclaration(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitGenericMethodDeclaration) {
             listener.exitGenericMethodDeclaration(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitGenericMethodDeclaration) {
            return visitor.visitGenericMethodDeclaration(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class GenericConstructorDeclarationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public typeParameters(): TypeParametersContext {
        return this.getRuleContext(0, TypeParametersContext)!;
    }
    public constructorDeclaration(): ConstructorDeclarationContext {
        return this.getRuleContext(0, ConstructorDeclarationContext)!;
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_genericConstructorDeclaration;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterGenericConstructorDeclaration) {
             listener.enterGenericConstructorDeclaration(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitGenericConstructorDeclaration) {
             listener.exitGenericConstructorDeclaration(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitGenericConstructorDeclaration) {
            return visitor.visitGenericConstructorDeclaration(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ConstructorDeclarationContext extends antlr.ParserRuleContext {
    public _constructorBody?: BlockContext;
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
    }
    public formalParameters(): FormalParametersContext {
        return this.getRuleContext(0, FormalParametersContext)!;
    }
    public block(): BlockContext {
        return this.getRuleContext(0, BlockContext)!;
    }
    public THROWS(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.THROWS, 0);
    }
    public qualifiedNameList(): QualifiedNameListContext | null {
        return this.getRuleContext(0, QualifiedNameListContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_constructorDeclaration;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterConstructorDeclaration) {
             listener.enterConstructorDeclaration(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitConstructorDeclaration) {
             listener.exitConstructorDeclaration(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitConstructorDeclaration) {
            return visitor.visitConstructorDeclaration(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class FieldDeclarationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public typeType(): TypeTypeContext {
        return this.getRuleContext(0, TypeTypeContext)!;
    }
    public variableDeclarators(): VariableDeclaratorsContext {
        return this.getRuleContext(0, VariableDeclaratorsContext)!;
    }
    public SEMI(): antlr.TerminalNode {
        return this.getToken(JavaParser.SEMI, 0)!;
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_fieldDeclaration;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterFieldDeclaration) {
             listener.enterFieldDeclaration(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitFieldDeclaration) {
             listener.exitFieldDeclaration(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitFieldDeclaration) {
            return visitor.visitFieldDeclaration(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class InterfaceBodyDeclarationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public interfaceMemberDeclaration(): InterfaceMemberDeclarationContext | null {
        return this.getRuleContext(0, InterfaceMemberDeclarationContext);
    }
    public modifier(): ModifierContext[];
    public modifier(i: number): ModifierContext | null;
    public modifier(i?: number): ModifierContext[] | ModifierContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ModifierContext);
        }

        return this.getRuleContext(i, ModifierContext);
    }
    public SEMI(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.SEMI, 0);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_interfaceBodyDeclaration;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterInterfaceBodyDeclaration) {
             listener.enterInterfaceBodyDeclaration(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitInterfaceBodyDeclaration) {
             listener.exitInterfaceBodyDeclaration(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitInterfaceBodyDeclaration) {
            return visitor.visitInterfaceBodyDeclaration(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class InterfaceMemberDeclarationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public constDeclaration(): ConstDeclarationContext | null {
        return this.getRuleContext(0, ConstDeclarationContext);
    }
    public interfaceMethodDeclaration(): InterfaceMethodDeclarationContext | null {
        return this.getRuleContext(0, InterfaceMethodDeclarationContext);
    }
    public genericInterfaceMethodDeclaration(): GenericInterfaceMethodDeclarationContext | null {
        return this.getRuleContext(0, GenericInterfaceMethodDeclarationContext);
    }
    public interfaceDeclaration(): InterfaceDeclarationContext | null {
        return this.getRuleContext(0, InterfaceDeclarationContext);
    }
    public annotationTypeDeclaration(): AnnotationTypeDeclarationContext | null {
        return this.getRuleContext(0, AnnotationTypeDeclarationContext);
    }
    public classDeclaration(): ClassDeclarationContext | null {
        return this.getRuleContext(0, ClassDeclarationContext);
    }
    public enumDeclaration(): EnumDeclarationContext | null {
        return this.getRuleContext(0, EnumDeclarationContext);
    }
    public recordDeclaration(): RecordDeclarationContext | null {
        return this.getRuleContext(0, RecordDeclarationContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_interfaceMemberDeclaration;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterInterfaceMemberDeclaration) {
             listener.enterInterfaceMemberDeclaration(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitInterfaceMemberDeclaration) {
             listener.exitInterfaceMemberDeclaration(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitInterfaceMemberDeclaration) {
            return visitor.visitInterfaceMemberDeclaration(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ConstDeclarationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public typeType(): TypeTypeContext {
        return this.getRuleContext(0, TypeTypeContext)!;
    }
    public constantDeclarator(): ConstantDeclaratorContext[];
    public constantDeclarator(i: number): ConstantDeclaratorContext | null;
    public constantDeclarator(i?: number): ConstantDeclaratorContext[] | ConstantDeclaratorContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ConstantDeclaratorContext);
        }

        return this.getRuleContext(i, ConstantDeclaratorContext);
    }
    public SEMI(): antlr.TerminalNode {
        return this.getToken(JavaParser.SEMI, 0)!;
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.COMMA);
    	} else {
    		return this.getToken(JavaParser.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_constDeclaration;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterConstDeclaration) {
             listener.enterConstDeclaration(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitConstDeclaration) {
             listener.exitConstDeclaration(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitConstDeclaration) {
            return visitor.visitConstDeclaration(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ConstantDeclaratorContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
    }
    public ASSIGN(): antlr.TerminalNode {
        return this.getToken(JavaParser.ASSIGN, 0)!;
    }
    public variableInitializer(): VariableInitializerContext {
        return this.getRuleContext(0, VariableInitializerContext)!;
    }
    public LBRACK(): antlr.TerminalNode[];
    public LBRACK(i: number): antlr.TerminalNode | null;
    public LBRACK(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.LBRACK);
    	} else {
    		return this.getToken(JavaParser.LBRACK, i);
    	}
    }
    public RBRACK(): antlr.TerminalNode[];
    public RBRACK(i: number): antlr.TerminalNode | null;
    public RBRACK(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.RBRACK);
    	} else {
    		return this.getToken(JavaParser.RBRACK, i);
    	}
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_constantDeclarator;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterConstantDeclarator) {
             listener.enterConstantDeclarator(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitConstantDeclarator) {
             listener.exitConstantDeclarator(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitConstantDeclarator) {
            return visitor.visitConstantDeclarator(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class InterfaceMethodDeclarationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public interfaceCommonBodyDeclaration(): InterfaceCommonBodyDeclarationContext {
        return this.getRuleContext(0, InterfaceCommonBodyDeclarationContext)!;
    }
    public interfaceMethodModifier(): InterfaceMethodModifierContext[];
    public interfaceMethodModifier(i: number): InterfaceMethodModifierContext | null;
    public interfaceMethodModifier(i?: number): InterfaceMethodModifierContext[] | InterfaceMethodModifierContext | null {
        if (i === undefined) {
            return this.getRuleContexts(InterfaceMethodModifierContext);
        }

        return this.getRuleContext(i, InterfaceMethodModifierContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_interfaceMethodDeclaration;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterInterfaceMethodDeclaration) {
             listener.enterInterfaceMethodDeclaration(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitInterfaceMethodDeclaration) {
             listener.exitInterfaceMethodDeclaration(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitInterfaceMethodDeclaration) {
            return visitor.visitInterfaceMethodDeclaration(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class InterfaceMethodModifierContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public annotation(): AnnotationContext | null {
        return this.getRuleContext(0, AnnotationContext);
    }
    public PUBLIC(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.PUBLIC, 0);
    }
    public ABSTRACT(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.ABSTRACT, 0);
    }
    public DEFAULT(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.DEFAULT, 0);
    }
    public STATIC(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.STATIC, 0);
    }
    public STRICTFP(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.STRICTFP, 0);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_interfaceMethodModifier;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterInterfaceMethodModifier) {
             listener.enterInterfaceMethodModifier(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitInterfaceMethodModifier) {
             listener.exitInterfaceMethodModifier(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitInterfaceMethodModifier) {
            return visitor.visitInterfaceMethodModifier(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class GenericInterfaceMethodDeclarationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public typeParameters(): TypeParametersContext {
        return this.getRuleContext(0, TypeParametersContext)!;
    }
    public interfaceCommonBodyDeclaration(): InterfaceCommonBodyDeclarationContext {
        return this.getRuleContext(0, InterfaceCommonBodyDeclarationContext)!;
    }
    public interfaceMethodModifier(): InterfaceMethodModifierContext[];
    public interfaceMethodModifier(i: number): InterfaceMethodModifierContext | null;
    public interfaceMethodModifier(i?: number): InterfaceMethodModifierContext[] | InterfaceMethodModifierContext | null {
        if (i === undefined) {
            return this.getRuleContexts(InterfaceMethodModifierContext);
        }

        return this.getRuleContext(i, InterfaceMethodModifierContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_genericInterfaceMethodDeclaration;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterGenericInterfaceMethodDeclaration) {
             listener.enterGenericInterfaceMethodDeclaration(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitGenericInterfaceMethodDeclaration) {
             listener.exitGenericInterfaceMethodDeclaration(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitGenericInterfaceMethodDeclaration) {
            return visitor.visitGenericInterfaceMethodDeclaration(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class InterfaceCommonBodyDeclarationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public typeTypeOrVoid(): TypeTypeOrVoidContext {
        return this.getRuleContext(0, TypeTypeOrVoidContext)!;
    }
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
    }
    public formalParameters(): FormalParametersContext {
        return this.getRuleContext(0, FormalParametersContext)!;
    }
    public methodBody(): MethodBodyContext {
        return this.getRuleContext(0, MethodBodyContext)!;
    }
    public annotation(): AnnotationContext[];
    public annotation(i: number): AnnotationContext | null;
    public annotation(i?: number): AnnotationContext[] | AnnotationContext | null {
        if (i === undefined) {
            return this.getRuleContexts(AnnotationContext);
        }

        return this.getRuleContext(i, AnnotationContext);
    }
    public LBRACK(): antlr.TerminalNode[];
    public LBRACK(i: number): antlr.TerminalNode | null;
    public LBRACK(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.LBRACK);
    	} else {
    		return this.getToken(JavaParser.LBRACK, i);
    	}
    }
    public RBRACK(): antlr.TerminalNode[];
    public RBRACK(i: number): antlr.TerminalNode | null;
    public RBRACK(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.RBRACK);
    	} else {
    		return this.getToken(JavaParser.RBRACK, i);
    	}
    }
    public THROWS(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.THROWS, 0);
    }
    public qualifiedNameList(): QualifiedNameListContext | null {
        return this.getRuleContext(0, QualifiedNameListContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_interfaceCommonBodyDeclaration;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterInterfaceCommonBodyDeclaration) {
             listener.enterInterfaceCommonBodyDeclaration(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitInterfaceCommonBodyDeclaration) {
             listener.exitInterfaceCommonBodyDeclaration(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitInterfaceCommonBodyDeclaration) {
            return visitor.visitInterfaceCommonBodyDeclaration(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class VariableDeclaratorsContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public variableDeclarator(): VariableDeclaratorContext[];
    public variableDeclarator(i: number): VariableDeclaratorContext | null;
    public variableDeclarator(i?: number): VariableDeclaratorContext[] | VariableDeclaratorContext | null {
        if (i === undefined) {
            return this.getRuleContexts(VariableDeclaratorContext);
        }

        return this.getRuleContext(i, VariableDeclaratorContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.COMMA);
    	} else {
    		return this.getToken(JavaParser.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_variableDeclarators;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterVariableDeclarators) {
             listener.enterVariableDeclarators(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitVariableDeclarators) {
             listener.exitVariableDeclarators(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitVariableDeclarators) {
            return visitor.visitVariableDeclarators(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class VariableDeclaratorContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public variableDeclaratorId(): VariableDeclaratorIdContext {
        return this.getRuleContext(0, VariableDeclaratorIdContext)!;
    }
    public ASSIGN(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.ASSIGN, 0);
    }
    public variableInitializer(): VariableInitializerContext | null {
        return this.getRuleContext(0, VariableInitializerContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_variableDeclarator;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterVariableDeclarator) {
             listener.enterVariableDeclarator(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitVariableDeclarator) {
             listener.exitVariableDeclarator(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitVariableDeclarator) {
            return visitor.visitVariableDeclarator(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class VariableDeclaratorIdContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
    }
    public LBRACK(): antlr.TerminalNode[];
    public LBRACK(i: number): antlr.TerminalNode | null;
    public LBRACK(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.LBRACK);
    	} else {
    		return this.getToken(JavaParser.LBRACK, i);
    	}
    }
    public RBRACK(): antlr.TerminalNode[];
    public RBRACK(i: number): antlr.TerminalNode | null;
    public RBRACK(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.RBRACK);
    	} else {
    		return this.getToken(JavaParser.RBRACK, i);
    	}
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_variableDeclaratorId;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterVariableDeclaratorId) {
             listener.enterVariableDeclaratorId(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitVariableDeclaratorId) {
             listener.exitVariableDeclaratorId(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitVariableDeclaratorId) {
            return visitor.visitVariableDeclaratorId(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class VariableInitializerContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public arrayInitializer(): ArrayInitializerContext | null {
        return this.getRuleContext(0, ArrayInitializerContext);
    }
    public expression(): ExpressionContext | null {
        return this.getRuleContext(0, ExpressionContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_variableInitializer;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterVariableInitializer) {
             listener.enterVariableInitializer(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitVariableInitializer) {
             listener.exitVariableInitializer(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitVariableInitializer) {
            return visitor.visitVariableInitializer(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ArrayInitializerContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public LBRACE(): antlr.TerminalNode {
        return this.getToken(JavaParser.LBRACE, 0)!;
    }
    public RBRACE(): antlr.TerminalNode {
        return this.getToken(JavaParser.RBRACE, 0)!;
    }
    public variableInitializer(): VariableInitializerContext[];
    public variableInitializer(i: number): VariableInitializerContext | null;
    public variableInitializer(i?: number): VariableInitializerContext[] | VariableInitializerContext | null {
        if (i === undefined) {
            return this.getRuleContexts(VariableInitializerContext);
        }

        return this.getRuleContext(i, VariableInitializerContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.COMMA);
    	} else {
    		return this.getToken(JavaParser.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_arrayInitializer;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterArrayInitializer) {
             listener.enterArrayInitializer(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitArrayInitializer) {
             listener.exitArrayInitializer(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitArrayInitializer) {
            return visitor.visitArrayInitializer(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ClassOrInterfaceTypeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public identifier(): IdentifierContext[];
    public identifier(i: number): IdentifierContext | null;
    public identifier(i?: number): IdentifierContext[] | IdentifierContext | null {
        if (i === undefined) {
            return this.getRuleContexts(IdentifierContext);
        }

        return this.getRuleContext(i, IdentifierContext);
    }
    public typeArguments(): TypeArgumentsContext[];
    public typeArguments(i: number): TypeArgumentsContext | null;
    public typeArguments(i?: number): TypeArgumentsContext[] | TypeArgumentsContext | null {
        if (i === undefined) {
            return this.getRuleContexts(TypeArgumentsContext);
        }

        return this.getRuleContext(i, TypeArgumentsContext);
    }
    public DOT(): antlr.TerminalNode[];
    public DOT(i: number): antlr.TerminalNode | null;
    public DOT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.DOT);
    	} else {
    		return this.getToken(JavaParser.DOT, i);
    	}
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_classOrInterfaceType;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterClassOrInterfaceType) {
             listener.enterClassOrInterfaceType(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitClassOrInterfaceType) {
             listener.exitClassOrInterfaceType(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitClassOrInterfaceType) {
            return visitor.visitClassOrInterfaceType(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class TypeArgumentContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public typeType(): TypeTypeContext | null {
        return this.getRuleContext(0, TypeTypeContext);
    }
    public QUESTION(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.QUESTION, 0);
    }
    public annotation(): AnnotationContext[];
    public annotation(i: number): AnnotationContext | null;
    public annotation(i?: number): AnnotationContext[] | AnnotationContext | null {
        if (i === undefined) {
            return this.getRuleContexts(AnnotationContext);
        }

        return this.getRuleContext(i, AnnotationContext);
    }
    public EXTENDS(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.EXTENDS, 0);
    }
    public SUPER(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.SUPER, 0);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_typeArgument;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterTypeArgument) {
             listener.enterTypeArgument(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitTypeArgument) {
             listener.exitTypeArgument(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitTypeArgument) {
            return visitor.visitTypeArgument(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class QualifiedNameListContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public qualifiedName(): QualifiedNameContext[];
    public qualifiedName(i: number): QualifiedNameContext | null;
    public qualifiedName(i?: number): QualifiedNameContext[] | QualifiedNameContext | null {
        if (i === undefined) {
            return this.getRuleContexts(QualifiedNameContext);
        }

        return this.getRuleContext(i, QualifiedNameContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.COMMA);
    	} else {
    		return this.getToken(JavaParser.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_qualifiedNameList;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterQualifiedNameList) {
             listener.enterQualifiedNameList(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitQualifiedNameList) {
             listener.exitQualifiedNameList(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitQualifiedNameList) {
            return visitor.visitQualifiedNameList(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class FormalParametersContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(JavaParser.LPAREN, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(JavaParser.RPAREN, 0)!;
    }
    public receiverParameter(): ReceiverParameterContext | null {
        return this.getRuleContext(0, ReceiverParameterContext);
    }
    public COMMA(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.COMMA, 0);
    }
    public formalParameterList(): FormalParameterListContext | null {
        return this.getRuleContext(0, FormalParameterListContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_formalParameters;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterFormalParameters) {
             listener.enterFormalParameters(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitFormalParameters) {
             listener.exitFormalParameters(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitFormalParameters) {
            return visitor.visitFormalParameters(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ReceiverParameterContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public typeType(): TypeTypeContext {
        return this.getRuleContext(0, TypeTypeContext)!;
    }
    public THIS(): antlr.TerminalNode {
        return this.getToken(JavaParser.THIS, 0)!;
    }
    public identifier(): IdentifierContext[];
    public identifier(i: number): IdentifierContext | null;
    public identifier(i?: number): IdentifierContext[] | IdentifierContext | null {
        if (i === undefined) {
            return this.getRuleContexts(IdentifierContext);
        }

        return this.getRuleContext(i, IdentifierContext);
    }
    public DOT(): antlr.TerminalNode[];
    public DOT(i: number): antlr.TerminalNode | null;
    public DOT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.DOT);
    	} else {
    		return this.getToken(JavaParser.DOT, i);
    	}
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_receiverParameter;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterReceiverParameter) {
             listener.enterReceiverParameter(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitReceiverParameter) {
             listener.exitReceiverParameter(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitReceiverParameter) {
            return visitor.visitReceiverParameter(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class FormalParameterListContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public formalParameter(): FormalParameterContext[];
    public formalParameter(i: number): FormalParameterContext | null;
    public formalParameter(i?: number): FormalParameterContext[] | FormalParameterContext | null {
        if (i === undefined) {
            return this.getRuleContexts(FormalParameterContext);
        }

        return this.getRuleContext(i, FormalParameterContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.COMMA);
    	} else {
    		return this.getToken(JavaParser.COMMA, i);
    	}
    }
    public lastFormalParameter(): LastFormalParameterContext | null {
        return this.getRuleContext(0, LastFormalParameterContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_formalParameterList;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterFormalParameterList) {
             listener.enterFormalParameterList(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitFormalParameterList) {
             listener.exitFormalParameterList(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitFormalParameterList) {
            return visitor.visitFormalParameterList(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class FormalParameterContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public typeType(): TypeTypeContext {
        return this.getRuleContext(0, TypeTypeContext)!;
    }
    public variableDeclaratorId(): VariableDeclaratorIdContext {
        return this.getRuleContext(0, VariableDeclaratorIdContext)!;
    }
    public variableModifier(): VariableModifierContext[];
    public variableModifier(i: number): VariableModifierContext | null;
    public variableModifier(i?: number): VariableModifierContext[] | VariableModifierContext | null {
        if (i === undefined) {
            return this.getRuleContexts(VariableModifierContext);
        }

        return this.getRuleContext(i, VariableModifierContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_formalParameter;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterFormalParameter) {
             listener.enterFormalParameter(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitFormalParameter) {
             listener.exitFormalParameter(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitFormalParameter) {
            return visitor.visitFormalParameter(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class LastFormalParameterContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public typeType(): TypeTypeContext {
        return this.getRuleContext(0, TypeTypeContext)!;
    }
    public ELLIPSIS(): antlr.TerminalNode {
        return this.getToken(JavaParser.ELLIPSIS, 0)!;
    }
    public variableDeclaratorId(): VariableDeclaratorIdContext {
        return this.getRuleContext(0, VariableDeclaratorIdContext)!;
    }
    public variableModifier(): VariableModifierContext[];
    public variableModifier(i: number): VariableModifierContext | null;
    public variableModifier(i?: number): VariableModifierContext[] | VariableModifierContext | null {
        if (i === undefined) {
            return this.getRuleContexts(VariableModifierContext);
        }

        return this.getRuleContext(i, VariableModifierContext);
    }
    public annotation(): AnnotationContext[];
    public annotation(i: number): AnnotationContext | null;
    public annotation(i?: number): AnnotationContext[] | AnnotationContext | null {
        if (i === undefined) {
            return this.getRuleContexts(AnnotationContext);
        }

        return this.getRuleContext(i, AnnotationContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_lastFormalParameter;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterLastFormalParameter) {
             listener.enterLastFormalParameter(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitLastFormalParameter) {
             listener.exitLastFormalParameter(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitLastFormalParameter) {
            return visitor.visitLastFormalParameter(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class LambdaLVTIListContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public lambdaLVTIParameter(): LambdaLVTIParameterContext[];
    public lambdaLVTIParameter(i: number): LambdaLVTIParameterContext | null;
    public lambdaLVTIParameter(i?: number): LambdaLVTIParameterContext[] | LambdaLVTIParameterContext | null {
        if (i === undefined) {
            return this.getRuleContexts(LambdaLVTIParameterContext);
        }

        return this.getRuleContext(i, LambdaLVTIParameterContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.COMMA);
    	} else {
    		return this.getToken(JavaParser.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_lambdaLVTIList;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterLambdaLVTIList) {
             listener.enterLambdaLVTIList(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitLambdaLVTIList) {
             listener.exitLambdaLVTIList(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitLambdaLVTIList) {
            return visitor.visitLambdaLVTIList(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class LambdaLVTIParameterContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public VAR(): antlr.TerminalNode {
        return this.getToken(JavaParser.VAR, 0)!;
    }
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
    }
    public variableModifier(): VariableModifierContext[];
    public variableModifier(i: number): VariableModifierContext | null;
    public variableModifier(i?: number): VariableModifierContext[] | VariableModifierContext | null {
        if (i === undefined) {
            return this.getRuleContexts(VariableModifierContext);
        }

        return this.getRuleContext(i, VariableModifierContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_lambdaLVTIParameter;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterLambdaLVTIParameter) {
             listener.enterLambdaLVTIParameter(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitLambdaLVTIParameter) {
             listener.exitLambdaLVTIParameter(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitLambdaLVTIParameter) {
            return visitor.visitLambdaLVTIParameter(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class QualifiedNameContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public identifier(): IdentifierContext[];
    public identifier(i: number): IdentifierContext | null;
    public identifier(i?: number): IdentifierContext[] | IdentifierContext | null {
        if (i === undefined) {
            return this.getRuleContexts(IdentifierContext);
        }

        return this.getRuleContext(i, IdentifierContext);
    }
    public DOT(): antlr.TerminalNode[];
    public DOT(i: number): antlr.TerminalNode | null;
    public DOT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.DOT);
    	} else {
    		return this.getToken(JavaParser.DOT, i);
    	}
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_qualifiedName;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterQualifiedName) {
             listener.enterQualifiedName(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitQualifiedName) {
             listener.exitQualifiedName(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitQualifiedName) {
            return visitor.visitQualifiedName(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class LiteralContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public integerLiteral(): IntegerLiteralContext | null {
        return this.getRuleContext(0, IntegerLiteralContext);
    }
    public floatLiteral(): FloatLiteralContext | null {
        return this.getRuleContext(0, FloatLiteralContext);
    }
    public CHAR_LITERAL(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.CHAR_LITERAL, 0);
    }
    public STRING_LITERAL(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.STRING_LITERAL, 0);
    }
    public BOOL_LITERAL(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.BOOL_LITERAL, 0);
    }
    public NULL_LITERAL(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.NULL_LITERAL, 0);
    }
    public TEXT_BLOCK(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.TEXT_BLOCK, 0);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_literal;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterLiteral) {
             listener.enterLiteral(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitLiteral) {
             listener.exitLiteral(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitLiteral) {
            return visitor.visitLiteral(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class IntegerLiteralContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public DECIMAL_LITERAL(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.DECIMAL_LITERAL, 0);
    }
    public HEX_LITERAL(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.HEX_LITERAL, 0);
    }
    public OCT_LITERAL(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.OCT_LITERAL, 0);
    }
    public BINARY_LITERAL(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.BINARY_LITERAL, 0);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_integerLiteral;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterIntegerLiteral) {
             listener.enterIntegerLiteral(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitIntegerLiteral) {
             listener.exitIntegerLiteral(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitIntegerLiteral) {
            return visitor.visitIntegerLiteral(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class FloatLiteralContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public FLOAT_LITERAL(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.FLOAT_LITERAL, 0);
    }
    public HEX_FLOAT_LITERAL(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.HEX_FLOAT_LITERAL, 0);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_floatLiteral;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterFloatLiteral) {
             listener.enterFloatLiteral(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitFloatLiteral) {
             listener.exitFloatLiteral(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitFloatLiteral) {
            return visitor.visitFloatLiteral(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class AltAnnotationQualifiedNameContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public AT(): antlr.TerminalNode {
        return this.getToken(JavaParser.AT, 0)!;
    }
    public identifier(): IdentifierContext[];
    public identifier(i: number): IdentifierContext | null;
    public identifier(i?: number): IdentifierContext[] | IdentifierContext | null {
        if (i === undefined) {
            return this.getRuleContexts(IdentifierContext);
        }

        return this.getRuleContext(i, IdentifierContext);
    }
    public DOT(): antlr.TerminalNode[];
    public DOT(i: number): antlr.TerminalNode | null;
    public DOT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.DOT);
    	} else {
    		return this.getToken(JavaParser.DOT, i);
    	}
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_altAnnotationQualifiedName;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterAltAnnotationQualifiedName) {
             listener.enterAltAnnotationQualifiedName(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitAltAnnotationQualifiedName) {
             listener.exitAltAnnotationQualifiedName(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitAltAnnotationQualifiedName) {
            return visitor.visitAltAnnotationQualifiedName(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class AnnotationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public AT(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.AT, 0);
    }
    public qualifiedName(): QualifiedNameContext | null {
        return this.getRuleContext(0, QualifiedNameContext);
    }
    public altAnnotationQualifiedName(): AltAnnotationQualifiedNameContext | null {
        return this.getRuleContext(0, AltAnnotationQualifiedNameContext);
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.LPAREN, 0);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.RPAREN, 0);
    }
    public elementValuePairs(): ElementValuePairsContext | null {
        return this.getRuleContext(0, ElementValuePairsContext);
    }
    public elementValue(): ElementValueContext | null {
        return this.getRuleContext(0, ElementValueContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_annotation;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterAnnotation) {
             listener.enterAnnotation(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitAnnotation) {
             listener.exitAnnotation(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitAnnotation) {
            return visitor.visitAnnotation(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ElementValuePairsContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public elementValuePair(): ElementValuePairContext[];
    public elementValuePair(i: number): ElementValuePairContext | null;
    public elementValuePair(i?: number): ElementValuePairContext[] | ElementValuePairContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ElementValuePairContext);
        }

        return this.getRuleContext(i, ElementValuePairContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.COMMA);
    	} else {
    		return this.getToken(JavaParser.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_elementValuePairs;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterElementValuePairs) {
             listener.enterElementValuePairs(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitElementValuePairs) {
             listener.exitElementValuePairs(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitElementValuePairs) {
            return visitor.visitElementValuePairs(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ElementValuePairContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
    }
    public ASSIGN(): antlr.TerminalNode {
        return this.getToken(JavaParser.ASSIGN, 0)!;
    }
    public elementValue(): ElementValueContext {
        return this.getRuleContext(0, ElementValueContext)!;
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_elementValuePair;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterElementValuePair) {
             listener.enterElementValuePair(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitElementValuePair) {
             listener.exitElementValuePair(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitElementValuePair) {
            return visitor.visitElementValuePair(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ElementValueContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public expression(): ExpressionContext | null {
        return this.getRuleContext(0, ExpressionContext);
    }
    public annotation(): AnnotationContext | null {
        return this.getRuleContext(0, AnnotationContext);
    }
    public elementValueArrayInitializer(): ElementValueArrayInitializerContext | null {
        return this.getRuleContext(0, ElementValueArrayInitializerContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_elementValue;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterElementValue) {
             listener.enterElementValue(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitElementValue) {
             listener.exitElementValue(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitElementValue) {
            return visitor.visitElementValue(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ElementValueArrayInitializerContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public LBRACE(): antlr.TerminalNode {
        return this.getToken(JavaParser.LBRACE, 0)!;
    }
    public RBRACE(): antlr.TerminalNode {
        return this.getToken(JavaParser.RBRACE, 0)!;
    }
    public elementValue(): ElementValueContext[];
    public elementValue(i: number): ElementValueContext | null;
    public elementValue(i?: number): ElementValueContext[] | ElementValueContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ElementValueContext);
        }

        return this.getRuleContext(i, ElementValueContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.COMMA);
    	} else {
    		return this.getToken(JavaParser.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_elementValueArrayInitializer;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterElementValueArrayInitializer) {
             listener.enterElementValueArrayInitializer(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitElementValueArrayInitializer) {
             listener.exitElementValueArrayInitializer(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitElementValueArrayInitializer) {
            return visitor.visitElementValueArrayInitializer(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class AnnotationTypeDeclarationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public AT(): antlr.TerminalNode {
        return this.getToken(JavaParser.AT, 0)!;
    }
    public INTERFACE(): antlr.TerminalNode {
        return this.getToken(JavaParser.INTERFACE, 0)!;
    }
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
    }
    public annotationTypeBody(): AnnotationTypeBodyContext {
        return this.getRuleContext(0, AnnotationTypeBodyContext)!;
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_annotationTypeDeclaration;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterAnnotationTypeDeclaration) {
             listener.enterAnnotationTypeDeclaration(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitAnnotationTypeDeclaration) {
             listener.exitAnnotationTypeDeclaration(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitAnnotationTypeDeclaration) {
            return visitor.visitAnnotationTypeDeclaration(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class AnnotationTypeBodyContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public LBRACE(): antlr.TerminalNode {
        return this.getToken(JavaParser.LBRACE, 0)!;
    }
    public RBRACE(): antlr.TerminalNode {
        return this.getToken(JavaParser.RBRACE, 0)!;
    }
    public annotationTypeElementDeclaration(): AnnotationTypeElementDeclarationContext[];
    public annotationTypeElementDeclaration(i: number): AnnotationTypeElementDeclarationContext | null;
    public annotationTypeElementDeclaration(i?: number): AnnotationTypeElementDeclarationContext[] | AnnotationTypeElementDeclarationContext | null {
        if (i === undefined) {
            return this.getRuleContexts(AnnotationTypeElementDeclarationContext);
        }

        return this.getRuleContext(i, AnnotationTypeElementDeclarationContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_annotationTypeBody;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterAnnotationTypeBody) {
             listener.enterAnnotationTypeBody(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitAnnotationTypeBody) {
             listener.exitAnnotationTypeBody(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitAnnotationTypeBody) {
            return visitor.visitAnnotationTypeBody(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class AnnotationTypeElementDeclarationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public annotationTypeElementRest(): AnnotationTypeElementRestContext | null {
        return this.getRuleContext(0, AnnotationTypeElementRestContext);
    }
    public modifier(): ModifierContext[];
    public modifier(i: number): ModifierContext | null;
    public modifier(i?: number): ModifierContext[] | ModifierContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ModifierContext);
        }

        return this.getRuleContext(i, ModifierContext);
    }
    public SEMI(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.SEMI, 0);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_annotationTypeElementDeclaration;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterAnnotationTypeElementDeclaration) {
             listener.enterAnnotationTypeElementDeclaration(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitAnnotationTypeElementDeclaration) {
             listener.exitAnnotationTypeElementDeclaration(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitAnnotationTypeElementDeclaration) {
            return visitor.visitAnnotationTypeElementDeclaration(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class AnnotationTypeElementRestContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public typeType(): TypeTypeContext | null {
        return this.getRuleContext(0, TypeTypeContext);
    }
    public annotationMethodOrConstantRest(): AnnotationMethodOrConstantRestContext | null {
        return this.getRuleContext(0, AnnotationMethodOrConstantRestContext);
    }
    public SEMI(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.SEMI, 0);
    }
    public classDeclaration(): ClassDeclarationContext | null {
        return this.getRuleContext(0, ClassDeclarationContext);
    }
    public interfaceDeclaration(): InterfaceDeclarationContext | null {
        return this.getRuleContext(0, InterfaceDeclarationContext);
    }
    public enumDeclaration(): EnumDeclarationContext | null {
        return this.getRuleContext(0, EnumDeclarationContext);
    }
    public annotationTypeDeclaration(): AnnotationTypeDeclarationContext | null {
        return this.getRuleContext(0, AnnotationTypeDeclarationContext);
    }
    public recordDeclaration(): RecordDeclarationContext | null {
        return this.getRuleContext(0, RecordDeclarationContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_annotationTypeElementRest;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterAnnotationTypeElementRest) {
             listener.enterAnnotationTypeElementRest(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitAnnotationTypeElementRest) {
             listener.exitAnnotationTypeElementRest(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitAnnotationTypeElementRest) {
            return visitor.visitAnnotationTypeElementRest(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class AnnotationMethodOrConstantRestContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public annotationMethodRest(): AnnotationMethodRestContext | null {
        return this.getRuleContext(0, AnnotationMethodRestContext);
    }
    public annotationConstantRest(): AnnotationConstantRestContext | null {
        return this.getRuleContext(0, AnnotationConstantRestContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_annotationMethodOrConstantRest;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterAnnotationMethodOrConstantRest) {
             listener.enterAnnotationMethodOrConstantRest(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitAnnotationMethodOrConstantRest) {
             listener.exitAnnotationMethodOrConstantRest(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitAnnotationMethodOrConstantRest) {
            return visitor.visitAnnotationMethodOrConstantRest(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class AnnotationMethodRestContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(JavaParser.LPAREN, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(JavaParser.RPAREN, 0)!;
    }
    public defaultValue(): DefaultValueContext | null {
        return this.getRuleContext(0, DefaultValueContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_annotationMethodRest;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterAnnotationMethodRest) {
             listener.enterAnnotationMethodRest(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitAnnotationMethodRest) {
             listener.exitAnnotationMethodRest(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitAnnotationMethodRest) {
            return visitor.visitAnnotationMethodRest(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class AnnotationConstantRestContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public variableDeclarators(): VariableDeclaratorsContext {
        return this.getRuleContext(0, VariableDeclaratorsContext)!;
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_annotationConstantRest;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterAnnotationConstantRest) {
             listener.enterAnnotationConstantRest(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitAnnotationConstantRest) {
             listener.exitAnnotationConstantRest(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitAnnotationConstantRest) {
            return visitor.visitAnnotationConstantRest(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class DefaultValueContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public DEFAULT(): antlr.TerminalNode {
        return this.getToken(JavaParser.DEFAULT, 0)!;
    }
    public elementValue(): ElementValueContext {
        return this.getRuleContext(0, ElementValueContext)!;
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_defaultValue;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterDefaultValue) {
             listener.enterDefaultValue(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitDefaultValue) {
             listener.exitDefaultValue(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitDefaultValue) {
            return visitor.visitDefaultValue(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ModuleDeclarationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public MODULE(): antlr.TerminalNode {
        return this.getToken(JavaParser.MODULE, 0)!;
    }
    public qualifiedName(): QualifiedNameContext {
        return this.getRuleContext(0, QualifiedNameContext)!;
    }
    public moduleBody(): ModuleBodyContext {
        return this.getRuleContext(0, ModuleBodyContext)!;
    }
    public OPEN(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.OPEN, 0);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_moduleDeclaration;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterModuleDeclaration) {
             listener.enterModuleDeclaration(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitModuleDeclaration) {
             listener.exitModuleDeclaration(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitModuleDeclaration) {
            return visitor.visitModuleDeclaration(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ModuleBodyContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public LBRACE(): antlr.TerminalNode {
        return this.getToken(JavaParser.LBRACE, 0)!;
    }
    public RBRACE(): antlr.TerminalNode {
        return this.getToken(JavaParser.RBRACE, 0)!;
    }
    public moduleDirective(): ModuleDirectiveContext[];
    public moduleDirective(i: number): ModuleDirectiveContext | null;
    public moduleDirective(i?: number): ModuleDirectiveContext[] | ModuleDirectiveContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ModuleDirectiveContext);
        }

        return this.getRuleContext(i, ModuleDirectiveContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_moduleBody;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterModuleBody) {
             listener.enterModuleBody(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitModuleBody) {
             listener.exitModuleBody(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitModuleBody) {
            return visitor.visitModuleBody(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ModuleDirectiveContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public REQUIRES(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.REQUIRES, 0);
    }
    public qualifiedName(): QualifiedNameContext[];
    public qualifiedName(i: number): QualifiedNameContext | null;
    public qualifiedName(i?: number): QualifiedNameContext[] | QualifiedNameContext | null {
        if (i === undefined) {
            return this.getRuleContexts(QualifiedNameContext);
        }

        return this.getRuleContext(i, QualifiedNameContext);
    }
    public SEMI(): antlr.TerminalNode {
        return this.getToken(JavaParser.SEMI, 0)!;
    }
    public requiresModifier(): RequiresModifierContext[];
    public requiresModifier(i: number): RequiresModifierContext | null;
    public requiresModifier(i?: number): RequiresModifierContext[] | RequiresModifierContext | null {
        if (i === undefined) {
            return this.getRuleContexts(RequiresModifierContext);
        }

        return this.getRuleContext(i, RequiresModifierContext);
    }
    public EXPORTS(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.EXPORTS, 0);
    }
    public TO(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.TO, 0);
    }
    public OPENS(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.OPENS, 0);
    }
    public USES(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.USES, 0);
    }
    public PROVIDES(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.PROVIDES, 0);
    }
    public WITH(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.WITH, 0);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_moduleDirective;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterModuleDirective) {
             listener.enterModuleDirective(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitModuleDirective) {
             listener.exitModuleDirective(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitModuleDirective) {
            return visitor.visitModuleDirective(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class RequiresModifierContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public TRANSITIVE(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.TRANSITIVE, 0);
    }
    public STATIC(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.STATIC, 0);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_requiresModifier;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterRequiresModifier) {
             listener.enterRequiresModifier(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitRequiresModifier) {
             listener.exitRequiresModifier(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitRequiresModifier) {
            return visitor.visitRequiresModifier(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class RecordDeclarationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public RECORD(): antlr.TerminalNode {
        return this.getToken(JavaParser.RECORD, 0)!;
    }
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
    }
    public recordHeader(): RecordHeaderContext {
        return this.getRuleContext(0, RecordHeaderContext)!;
    }
    public recordBody(): RecordBodyContext {
        return this.getRuleContext(0, RecordBodyContext)!;
    }
    public typeParameters(): TypeParametersContext | null {
        return this.getRuleContext(0, TypeParametersContext);
    }
    public IMPLEMENTS(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.IMPLEMENTS, 0);
    }
    public typeList(): TypeListContext | null {
        return this.getRuleContext(0, TypeListContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_recordDeclaration;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterRecordDeclaration) {
             listener.enterRecordDeclaration(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitRecordDeclaration) {
             listener.exitRecordDeclaration(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitRecordDeclaration) {
            return visitor.visitRecordDeclaration(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class RecordHeaderContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(JavaParser.LPAREN, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(JavaParser.RPAREN, 0)!;
    }
    public recordComponentList(): RecordComponentListContext | null {
        return this.getRuleContext(0, RecordComponentListContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_recordHeader;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterRecordHeader) {
             listener.enterRecordHeader(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitRecordHeader) {
             listener.exitRecordHeader(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitRecordHeader) {
            return visitor.visitRecordHeader(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class RecordComponentListContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public recordComponent(): RecordComponentContext[];
    public recordComponent(i: number): RecordComponentContext | null;
    public recordComponent(i?: number): RecordComponentContext[] | RecordComponentContext | null {
        if (i === undefined) {
            return this.getRuleContexts(RecordComponentContext);
        }

        return this.getRuleContext(i, RecordComponentContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.COMMA);
    	} else {
    		return this.getToken(JavaParser.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_recordComponentList;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterRecordComponentList) {
             listener.enterRecordComponentList(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitRecordComponentList) {
             listener.exitRecordComponentList(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitRecordComponentList) {
            return visitor.visitRecordComponentList(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class RecordComponentContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public typeType(): TypeTypeContext {
        return this.getRuleContext(0, TypeTypeContext)!;
    }
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_recordComponent;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterRecordComponent) {
             listener.enterRecordComponent(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitRecordComponent) {
             listener.exitRecordComponent(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitRecordComponent) {
            return visitor.visitRecordComponent(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class RecordBodyContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public LBRACE(): antlr.TerminalNode {
        return this.getToken(JavaParser.LBRACE, 0)!;
    }
    public RBRACE(): antlr.TerminalNode {
        return this.getToken(JavaParser.RBRACE, 0)!;
    }
    public classBodyDeclaration(): ClassBodyDeclarationContext[];
    public classBodyDeclaration(i: number): ClassBodyDeclarationContext | null;
    public classBodyDeclaration(i?: number): ClassBodyDeclarationContext[] | ClassBodyDeclarationContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ClassBodyDeclarationContext);
        }

        return this.getRuleContext(i, ClassBodyDeclarationContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_recordBody;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterRecordBody) {
             listener.enterRecordBody(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitRecordBody) {
             listener.exitRecordBody(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitRecordBody) {
            return visitor.visitRecordBody(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class BlockContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public LBRACE(): antlr.TerminalNode {
        return this.getToken(JavaParser.LBRACE, 0)!;
    }
    public RBRACE(): antlr.TerminalNode {
        return this.getToken(JavaParser.RBRACE, 0)!;
    }
    public blockStatement(): BlockStatementContext[];
    public blockStatement(i: number): BlockStatementContext | null;
    public blockStatement(i?: number): BlockStatementContext[] | BlockStatementContext | null {
        if (i === undefined) {
            return this.getRuleContexts(BlockStatementContext);
        }

        return this.getRuleContext(i, BlockStatementContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_block;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterBlock) {
             listener.enterBlock(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitBlock) {
             listener.exitBlock(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitBlock) {
            return visitor.visitBlock(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class BlockStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public localVariableDeclaration(): LocalVariableDeclarationContext | null {
        return this.getRuleContext(0, LocalVariableDeclarationContext);
    }
    public SEMI(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.SEMI, 0);
    }
    public statement(): StatementContext | null {
        return this.getRuleContext(0, StatementContext);
    }
    public localTypeDeclaration(): LocalTypeDeclarationContext | null {
        return this.getRuleContext(0, LocalTypeDeclarationContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_blockStatement;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterBlockStatement) {
             listener.enterBlockStatement(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitBlockStatement) {
             listener.exitBlockStatement(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitBlockStatement) {
            return visitor.visitBlockStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class LocalVariableDeclarationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public typeType(): TypeTypeContext {
        return this.getRuleContext(0, TypeTypeContext)!;
    }
    public variableDeclarators(): VariableDeclaratorsContext {
        return this.getRuleContext(0, VariableDeclaratorsContext)!;
    }
    public variableModifier(): VariableModifierContext[];
    public variableModifier(i: number): VariableModifierContext | null;
    public variableModifier(i?: number): VariableModifierContext[] | VariableModifierContext | null {
        if (i === undefined) {
            return this.getRuleContexts(VariableModifierContext);
        }

        return this.getRuleContext(i, VariableModifierContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_localVariableDeclaration;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterLocalVariableDeclaration) {
             listener.enterLocalVariableDeclaration(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitLocalVariableDeclaration) {
             listener.exitLocalVariableDeclaration(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitLocalVariableDeclaration) {
            return visitor.visitLocalVariableDeclaration(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class IdentifierContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public IDENTIFIER(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.IDENTIFIER, 0);
    }
    public MODULE(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.MODULE, 0);
    }
    public OPEN(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.OPEN, 0);
    }
    public REQUIRES(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.REQUIRES, 0);
    }
    public EXPORTS(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.EXPORTS, 0);
    }
    public OPENS(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.OPENS, 0);
    }
    public TO(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.TO, 0);
    }
    public USES(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.USES, 0);
    }
    public PROVIDES(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.PROVIDES, 0);
    }
    public WITH(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.WITH, 0);
    }
    public TRANSITIVE(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.TRANSITIVE, 0);
    }
    public YIELD(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.YIELD, 0);
    }
    public SEALED(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.SEALED, 0);
    }
    public PERMITS(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.PERMITS, 0);
    }
    public RECORD(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.RECORD, 0);
    }
    public VAR(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.VAR, 0);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_identifier;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterIdentifier) {
             listener.enterIdentifier(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitIdentifier) {
             listener.exitIdentifier(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitIdentifier) {
            return visitor.visitIdentifier(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class LocalTypeDeclarationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public classDeclaration(): ClassDeclarationContext | null {
        return this.getRuleContext(0, ClassDeclarationContext);
    }
    public interfaceDeclaration(): InterfaceDeclarationContext | null {
        return this.getRuleContext(0, InterfaceDeclarationContext);
    }
    public recordDeclaration(): RecordDeclarationContext | null {
        return this.getRuleContext(0, RecordDeclarationContext);
    }
    public classOrInterfaceModifier(): ClassOrInterfaceModifierContext[];
    public classOrInterfaceModifier(i: number): ClassOrInterfaceModifierContext | null;
    public classOrInterfaceModifier(i?: number): ClassOrInterfaceModifierContext[] | ClassOrInterfaceModifierContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ClassOrInterfaceModifierContext);
        }

        return this.getRuleContext(i, ClassOrInterfaceModifierContext);
    }
    public SEMI(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.SEMI, 0);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_localTypeDeclaration;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterLocalTypeDeclaration) {
             listener.enterLocalTypeDeclaration(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitLocalTypeDeclaration) {
             listener.exitLocalTypeDeclaration(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitLocalTypeDeclaration) {
            return visitor.visitLocalTypeDeclaration(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class StatementContext extends antlr.ParserRuleContext {
    public _blockLabel?: BlockContext;
    public _statementExpression?: ExpressionContext;
    public _identifierLabel?: IdentifierContext;
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public block(): BlockContext | null {
        return this.getRuleContext(0, BlockContext);
    }
    public ASSERT(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.ASSERT, 0);
    }
    public expression(): ExpressionContext[];
    public expression(i: number): ExpressionContext | null;
    public expression(i?: number): ExpressionContext[] | ExpressionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }

        return this.getRuleContext(i, ExpressionContext);
    }
    public SEMI(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.SEMI, 0);
    }
    public COLON(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.COLON, 0);
    }
    public IF(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.IF, 0);
    }
    public parExpression(): ParExpressionContext | null {
        return this.getRuleContext(0, ParExpressionContext);
    }
    public statement(): StatementContext[];
    public statement(i: number): StatementContext | null;
    public statement(i?: number): StatementContext[] | StatementContext | null {
        if (i === undefined) {
            return this.getRuleContexts(StatementContext);
        }

        return this.getRuleContext(i, StatementContext);
    }
    public ELSE(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.ELSE, 0);
    }
    public FOR(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.FOR, 0);
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.LPAREN, 0);
    }
    public forControl(): ForControlContext | null {
        return this.getRuleContext(0, ForControlContext);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.RPAREN, 0);
    }
    public WHILE(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.WHILE, 0);
    }
    public DO(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.DO, 0);
    }
    public TRY(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.TRY, 0);
    }
    public finallyBlock(): FinallyBlockContext | null {
        return this.getRuleContext(0, FinallyBlockContext);
    }
    public catchClause(): CatchClauseContext[];
    public catchClause(i: number): CatchClauseContext | null;
    public catchClause(i?: number): CatchClauseContext[] | CatchClauseContext | null {
        if (i === undefined) {
            return this.getRuleContexts(CatchClauseContext);
        }

        return this.getRuleContext(i, CatchClauseContext);
    }
    public resourceSpecification(): ResourceSpecificationContext | null {
        return this.getRuleContext(0, ResourceSpecificationContext);
    }
    public SWITCH(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.SWITCH, 0);
    }
    public LBRACE(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.LBRACE, 0);
    }
    public RBRACE(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.RBRACE, 0);
    }
    public switchBlockStatementGroup(): SwitchBlockStatementGroupContext[];
    public switchBlockStatementGroup(i: number): SwitchBlockStatementGroupContext | null;
    public switchBlockStatementGroup(i?: number): SwitchBlockStatementGroupContext[] | SwitchBlockStatementGroupContext | null {
        if (i === undefined) {
            return this.getRuleContexts(SwitchBlockStatementGroupContext);
        }

        return this.getRuleContext(i, SwitchBlockStatementGroupContext);
    }
    public switchLabel(): SwitchLabelContext[];
    public switchLabel(i: number): SwitchLabelContext | null;
    public switchLabel(i?: number): SwitchLabelContext[] | SwitchLabelContext | null {
        if (i === undefined) {
            return this.getRuleContexts(SwitchLabelContext);
        }

        return this.getRuleContext(i, SwitchLabelContext);
    }
    public SYNCHRONIZED(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.SYNCHRONIZED, 0);
    }
    public RETURN(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.RETURN, 0);
    }
    public THROW(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.THROW, 0);
    }
    public BREAK(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.BREAK, 0);
    }
    public identifier(): IdentifierContext | null {
        return this.getRuleContext(0, IdentifierContext);
    }
    public CONTINUE(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.CONTINUE, 0);
    }
    public YIELD(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.YIELD, 0);
    }
    public switchExpression(): SwitchExpressionContext | null {
        return this.getRuleContext(0, SwitchExpressionContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_statement;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterStatement) {
             listener.enterStatement(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitStatement) {
             listener.exitStatement(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitStatement) {
            return visitor.visitStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class CatchClauseContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public CATCH(): antlr.TerminalNode {
        return this.getToken(JavaParser.CATCH, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(JavaParser.LPAREN, 0)!;
    }
    public catchType(): CatchTypeContext {
        return this.getRuleContext(0, CatchTypeContext)!;
    }
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(JavaParser.RPAREN, 0)!;
    }
    public block(): BlockContext {
        return this.getRuleContext(0, BlockContext)!;
    }
    public variableModifier(): VariableModifierContext[];
    public variableModifier(i: number): VariableModifierContext | null;
    public variableModifier(i?: number): VariableModifierContext[] | VariableModifierContext | null {
        if (i === undefined) {
            return this.getRuleContexts(VariableModifierContext);
        }

        return this.getRuleContext(i, VariableModifierContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_catchClause;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterCatchClause) {
             listener.enterCatchClause(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitCatchClause) {
             listener.exitCatchClause(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitCatchClause) {
            return visitor.visitCatchClause(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class CatchTypeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public qualifiedName(): QualifiedNameContext[];
    public qualifiedName(i: number): QualifiedNameContext | null;
    public qualifiedName(i?: number): QualifiedNameContext[] | QualifiedNameContext | null {
        if (i === undefined) {
            return this.getRuleContexts(QualifiedNameContext);
        }

        return this.getRuleContext(i, QualifiedNameContext);
    }
    public BITOR(): antlr.TerminalNode[];
    public BITOR(i: number): antlr.TerminalNode | null;
    public BITOR(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.BITOR);
    	} else {
    		return this.getToken(JavaParser.BITOR, i);
    	}
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_catchType;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterCatchType) {
             listener.enterCatchType(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitCatchType) {
             listener.exitCatchType(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitCatchType) {
            return visitor.visitCatchType(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class FinallyBlockContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public FINALLY(): antlr.TerminalNode {
        return this.getToken(JavaParser.FINALLY, 0)!;
    }
    public block(): BlockContext {
        return this.getRuleContext(0, BlockContext)!;
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_finallyBlock;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterFinallyBlock) {
             listener.enterFinallyBlock(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitFinallyBlock) {
             listener.exitFinallyBlock(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitFinallyBlock) {
            return visitor.visitFinallyBlock(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ResourceSpecificationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(JavaParser.LPAREN, 0)!;
    }
    public resources(): ResourcesContext {
        return this.getRuleContext(0, ResourcesContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(JavaParser.RPAREN, 0)!;
    }
    public SEMI(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.SEMI, 0);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_resourceSpecification;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterResourceSpecification) {
             listener.enterResourceSpecification(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitResourceSpecification) {
             listener.exitResourceSpecification(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitResourceSpecification) {
            return visitor.visitResourceSpecification(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ResourcesContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public resource(): ResourceContext[];
    public resource(i: number): ResourceContext | null;
    public resource(i?: number): ResourceContext[] | ResourceContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ResourceContext);
        }

        return this.getRuleContext(i, ResourceContext);
    }
    public SEMI(): antlr.TerminalNode[];
    public SEMI(i: number): antlr.TerminalNode | null;
    public SEMI(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.SEMI);
    	} else {
    		return this.getToken(JavaParser.SEMI, i);
    	}
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_resources;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterResources) {
             listener.enterResources(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitResources) {
             listener.exitResources(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitResources) {
            return visitor.visitResources(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ResourceContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public ASSIGN(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.ASSIGN, 0);
    }
    public expression(): ExpressionContext | null {
        return this.getRuleContext(0, ExpressionContext);
    }
    public classOrInterfaceType(): ClassOrInterfaceTypeContext | null {
        return this.getRuleContext(0, ClassOrInterfaceTypeContext);
    }
    public variableDeclaratorId(): VariableDeclaratorIdContext | null {
        return this.getRuleContext(0, VariableDeclaratorIdContext);
    }
    public VAR(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.VAR, 0);
    }
    public identifier(): IdentifierContext | null {
        return this.getRuleContext(0, IdentifierContext);
    }
    public variableModifier(): VariableModifierContext[];
    public variableModifier(i: number): VariableModifierContext | null;
    public variableModifier(i?: number): VariableModifierContext[] | VariableModifierContext | null {
        if (i === undefined) {
            return this.getRuleContexts(VariableModifierContext);
        }

        return this.getRuleContext(i, VariableModifierContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_resource;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterResource) {
             listener.enterResource(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitResource) {
             listener.exitResource(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitResource) {
            return visitor.visitResource(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class SwitchBlockStatementGroupContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public switchLabel(): SwitchLabelContext[];
    public switchLabel(i: number): SwitchLabelContext | null;
    public switchLabel(i?: number): SwitchLabelContext[] | SwitchLabelContext | null {
        if (i === undefined) {
            return this.getRuleContexts(SwitchLabelContext);
        }

        return this.getRuleContext(i, SwitchLabelContext);
    }
    public blockStatement(): BlockStatementContext[];
    public blockStatement(i: number): BlockStatementContext | null;
    public blockStatement(i?: number): BlockStatementContext[] | BlockStatementContext | null {
        if (i === undefined) {
            return this.getRuleContexts(BlockStatementContext);
        }

        return this.getRuleContext(i, BlockStatementContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_switchBlockStatementGroup;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterSwitchBlockStatementGroup) {
             listener.enterSwitchBlockStatementGroup(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitSwitchBlockStatementGroup) {
             listener.exitSwitchBlockStatementGroup(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitSwitchBlockStatementGroup) {
            return visitor.visitSwitchBlockStatementGroup(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class SwitchLabelContext extends antlr.ParserRuleContext {
    public _constantExpression?: ExpressionContext;
    public _enumConstantName?: Token | null;
    public _varName?: IdentifierContext;
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public CASE(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.CASE, 0);
    }
    public COLON(): antlr.TerminalNode {
        return this.getToken(JavaParser.COLON, 0)!;
    }
    public typeType(): TypeTypeContext | null {
        return this.getRuleContext(0, TypeTypeContext);
    }
    public expression(): ExpressionContext | null {
        return this.getRuleContext(0, ExpressionContext);
    }
    public IDENTIFIER(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.IDENTIFIER, 0);
    }
    public identifier(): IdentifierContext | null {
        return this.getRuleContext(0, IdentifierContext);
    }
    public DEFAULT(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.DEFAULT, 0);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_switchLabel;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterSwitchLabel) {
             listener.enterSwitchLabel(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitSwitchLabel) {
             listener.exitSwitchLabel(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitSwitchLabel) {
            return visitor.visitSwitchLabel(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ForControlContext extends antlr.ParserRuleContext {
    public _forUpdate?: ExpressionListContext;
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public enhancedForControl(): EnhancedForControlContext | null {
        return this.getRuleContext(0, EnhancedForControlContext);
    }
    public SEMI(): antlr.TerminalNode[];
    public SEMI(i: number): antlr.TerminalNode | null;
    public SEMI(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.SEMI);
    	} else {
    		return this.getToken(JavaParser.SEMI, i);
    	}
    }
    public forInit(): ForInitContext | null {
        return this.getRuleContext(0, ForInitContext);
    }
    public expression(): ExpressionContext | null {
        return this.getRuleContext(0, ExpressionContext);
    }
    public expressionList(): ExpressionListContext | null {
        return this.getRuleContext(0, ExpressionListContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_forControl;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterForControl) {
             listener.enterForControl(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitForControl) {
             listener.exitForControl(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitForControl) {
            return visitor.visitForControl(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ForInitContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public localVariableDeclaration(): LocalVariableDeclarationContext | null {
        return this.getRuleContext(0, LocalVariableDeclarationContext);
    }
    public expressionList(): ExpressionListContext | null {
        return this.getRuleContext(0, ExpressionListContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_forInit;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterForInit) {
             listener.enterForInit(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitForInit) {
             listener.exitForInit(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitForInit) {
            return visitor.visitForInit(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class EnhancedForControlContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public variableDeclaratorId(): VariableDeclaratorIdContext {
        return this.getRuleContext(0, VariableDeclaratorIdContext)!;
    }
    public COLON(): antlr.TerminalNode {
        return this.getToken(JavaParser.COLON, 0)!;
    }
    public expression(): ExpressionContext {
        return this.getRuleContext(0, ExpressionContext)!;
    }
    public typeType(): TypeTypeContext | null {
        return this.getRuleContext(0, TypeTypeContext);
    }
    public VAR(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.VAR, 0);
    }
    public variableModifier(): VariableModifierContext[];
    public variableModifier(i: number): VariableModifierContext | null;
    public variableModifier(i?: number): VariableModifierContext[] | VariableModifierContext | null {
        if (i === undefined) {
            return this.getRuleContexts(VariableModifierContext);
        }

        return this.getRuleContext(i, VariableModifierContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_enhancedForControl;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterEnhancedForControl) {
             listener.enterEnhancedForControl(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitEnhancedForControl) {
             listener.exitEnhancedForControl(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitEnhancedForControl) {
            return visitor.visitEnhancedForControl(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ParExpressionContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(JavaParser.LPAREN, 0)!;
    }
    public expression(): ExpressionContext {
        return this.getRuleContext(0, ExpressionContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(JavaParser.RPAREN, 0)!;
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_parExpression;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterParExpression) {
             listener.enterParExpression(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitParExpression) {
             listener.exitParExpression(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitParExpression) {
            return visitor.visitParExpression(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ExpressionListContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public expression(): ExpressionContext[];
    public expression(i: number): ExpressionContext | null;
    public expression(i?: number): ExpressionContext[] | ExpressionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }

        return this.getRuleContext(i, ExpressionContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.COMMA);
    	} else {
    		return this.getToken(JavaParser.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_expressionList;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterExpressionList) {
             listener.enterExpressionList(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitExpressionList) {
             listener.exitExpressionList(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitExpressionList) {
            return visitor.visitExpressionList(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class MethodCallContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public identifier(): IdentifierContext | null {
        return this.getRuleContext(0, IdentifierContext);
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(JavaParser.LPAREN, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(JavaParser.RPAREN, 0)!;
    }
    public expressionList(): ExpressionListContext | null {
        return this.getRuleContext(0, ExpressionListContext);
    }
    public THIS(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.THIS, 0);
    }
    public SUPER(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.SUPER, 0);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_methodCall;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterMethodCall) {
             listener.enterMethodCall(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitMethodCall) {
             listener.exitMethodCall(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitMethodCall) {
            return visitor.visitMethodCall(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ExpressionContext extends antlr.ParserRuleContext {
    public _prefix?: Token | null;
    public _bop?: Token | null;
    public _postfix?: Token | null;
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public primary(): PrimaryContext | null {
        return this.getRuleContext(0, PrimaryContext);
    }
    public methodCall(): MethodCallContext | null {
        return this.getRuleContext(0, MethodCallContext);
    }
    public NEW(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.NEW, 0);
    }
    public creator(): CreatorContext | null {
        return this.getRuleContext(0, CreatorContext);
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.LPAREN, 0);
    }
    public typeType(): TypeTypeContext[];
    public typeType(i: number): TypeTypeContext | null;
    public typeType(i?: number): TypeTypeContext[] | TypeTypeContext | null {
        if (i === undefined) {
            return this.getRuleContexts(TypeTypeContext);
        }

        return this.getRuleContext(i, TypeTypeContext);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.RPAREN, 0);
    }
    public expression(): ExpressionContext[];
    public expression(i: number): ExpressionContext | null;
    public expression(i?: number): ExpressionContext[] | ExpressionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }

        return this.getRuleContext(i, ExpressionContext);
    }
    public annotation(): AnnotationContext[];
    public annotation(i: number): AnnotationContext | null;
    public annotation(i?: number): AnnotationContext[] | AnnotationContext | null {
        if (i === undefined) {
            return this.getRuleContexts(AnnotationContext);
        }

        return this.getRuleContext(i, AnnotationContext);
    }
    public BITAND(): antlr.TerminalNode[];
    public BITAND(i: number): antlr.TerminalNode | null;
    public BITAND(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.BITAND);
    	} else {
    		return this.getToken(JavaParser.BITAND, i);
    	}
    }
    public ADD(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.ADD, 0);
    }
    public SUB(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.SUB, 0);
    }
    public INC(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.INC, 0);
    }
    public DEC(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.DEC, 0);
    }
    public TILDE(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.TILDE, 0);
    }
    public BANG(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.BANG, 0);
    }
    public lambdaExpression(): LambdaExpressionContext | null {
        return this.getRuleContext(0, LambdaExpressionContext);
    }
    public switchExpression(): SwitchExpressionContext | null {
        return this.getRuleContext(0, SwitchExpressionContext);
    }
    public COLONCOLON(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.COLONCOLON, 0);
    }
    public identifier(): IdentifierContext | null {
        return this.getRuleContext(0, IdentifierContext);
    }
    public typeArguments(): TypeArgumentsContext | null {
        return this.getRuleContext(0, TypeArgumentsContext);
    }
    public classType(): ClassTypeContext | null {
        return this.getRuleContext(0, ClassTypeContext);
    }
    public MUL(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.MUL, 0);
    }
    public DIV(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.DIV, 0);
    }
    public MOD(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.MOD, 0);
    }
    public LT(): antlr.TerminalNode[];
    public LT(i: number): antlr.TerminalNode | null;
    public LT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.LT);
    	} else {
    		return this.getToken(JavaParser.LT, i);
    	}
    }
    public GT(): antlr.TerminalNode[];
    public GT(i: number): antlr.TerminalNode | null;
    public GT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.GT);
    	} else {
    		return this.getToken(JavaParser.GT, i);
    	}
    }
    public LE(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.LE, 0);
    }
    public GE(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.GE, 0);
    }
    public EQUAL(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.EQUAL, 0);
    }
    public NOTEQUAL(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.NOTEQUAL, 0);
    }
    public CARET(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.CARET, 0);
    }
    public BITOR(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.BITOR, 0);
    }
    public AND(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.AND, 0);
    }
    public OR(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.OR, 0);
    }
    public COLON(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.COLON, 0);
    }
    public QUESTION(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.QUESTION, 0);
    }
    public ASSIGN(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.ASSIGN, 0);
    }
    public ADD_ASSIGN(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.ADD_ASSIGN, 0);
    }
    public SUB_ASSIGN(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.SUB_ASSIGN, 0);
    }
    public MUL_ASSIGN(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.MUL_ASSIGN, 0);
    }
    public DIV_ASSIGN(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.DIV_ASSIGN, 0);
    }
    public AND_ASSIGN(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.AND_ASSIGN, 0);
    }
    public OR_ASSIGN(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.OR_ASSIGN, 0);
    }
    public XOR_ASSIGN(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.XOR_ASSIGN, 0);
    }
    public RSHIFT_ASSIGN(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.RSHIFT_ASSIGN, 0);
    }
    public URSHIFT_ASSIGN(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.URSHIFT_ASSIGN, 0);
    }
    public LSHIFT_ASSIGN(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.LSHIFT_ASSIGN, 0);
    }
    public MOD_ASSIGN(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.MOD_ASSIGN, 0);
    }
    public DOT(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.DOT, 0);
    }
    public THIS(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.THIS, 0);
    }
    public innerCreator(): InnerCreatorContext | null {
        return this.getRuleContext(0, InnerCreatorContext);
    }
    public SUPER(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.SUPER, 0);
    }
    public superSuffix(): SuperSuffixContext | null {
        return this.getRuleContext(0, SuperSuffixContext);
    }
    public explicitGenericInvocation(): ExplicitGenericInvocationContext | null {
        return this.getRuleContext(0, ExplicitGenericInvocationContext);
    }
    public nonWildcardTypeArguments(): NonWildcardTypeArgumentsContext | null {
        return this.getRuleContext(0, NonWildcardTypeArgumentsContext);
    }
    public LBRACK(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.LBRACK, 0);
    }
    public RBRACK(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.RBRACK, 0);
    }
    public INSTANCEOF(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.INSTANCEOF, 0);
    }
    public pattern(): PatternContext | null {
        return this.getRuleContext(0, PatternContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_expression;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterExpression) {
             listener.enterExpression(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitExpression) {
             listener.exitExpression(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitExpression) {
            return visitor.visitExpression(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class PatternContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public typeType(): TypeTypeContext {
        return this.getRuleContext(0, TypeTypeContext)!;
    }
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
    }
    public variableModifier(): VariableModifierContext[];
    public variableModifier(i: number): VariableModifierContext | null;
    public variableModifier(i?: number): VariableModifierContext[] | VariableModifierContext | null {
        if (i === undefined) {
            return this.getRuleContexts(VariableModifierContext);
        }

        return this.getRuleContext(i, VariableModifierContext);
    }
    public annotation(): AnnotationContext[];
    public annotation(i: number): AnnotationContext | null;
    public annotation(i?: number): AnnotationContext[] | AnnotationContext | null {
        if (i === undefined) {
            return this.getRuleContexts(AnnotationContext);
        }

        return this.getRuleContext(i, AnnotationContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_pattern;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterPattern) {
             listener.enterPattern(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitPattern) {
             listener.exitPattern(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitPattern) {
            return visitor.visitPattern(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class LambdaExpressionContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public lambdaParameters(): LambdaParametersContext {
        return this.getRuleContext(0, LambdaParametersContext)!;
    }
    public ARROW(): antlr.TerminalNode {
        return this.getToken(JavaParser.ARROW, 0)!;
    }
    public lambdaBody(): LambdaBodyContext {
        return this.getRuleContext(0, LambdaBodyContext)!;
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_lambdaExpression;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterLambdaExpression) {
             listener.enterLambdaExpression(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitLambdaExpression) {
             listener.exitLambdaExpression(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitLambdaExpression) {
            return visitor.visitLambdaExpression(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class LambdaParametersContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public identifier(): IdentifierContext[];
    public identifier(i: number): IdentifierContext | null;
    public identifier(i?: number): IdentifierContext[] | IdentifierContext | null {
        if (i === undefined) {
            return this.getRuleContexts(IdentifierContext);
        }

        return this.getRuleContext(i, IdentifierContext);
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.LPAREN, 0);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.RPAREN, 0);
    }
    public formalParameterList(): FormalParameterListContext | null {
        return this.getRuleContext(0, FormalParameterListContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.COMMA);
    	} else {
    		return this.getToken(JavaParser.COMMA, i);
    	}
    }
    public lambdaLVTIList(): LambdaLVTIListContext | null {
        return this.getRuleContext(0, LambdaLVTIListContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_lambdaParameters;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterLambdaParameters) {
             listener.enterLambdaParameters(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitLambdaParameters) {
             listener.exitLambdaParameters(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitLambdaParameters) {
            return visitor.visitLambdaParameters(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class LambdaBodyContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public expression(): ExpressionContext | null {
        return this.getRuleContext(0, ExpressionContext);
    }
    public block(): BlockContext | null {
        return this.getRuleContext(0, BlockContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_lambdaBody;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterLambdaBody) {
             listener.enterLambdaBody(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitLambdaBody) {
             listener.exitLambdaBody(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitLambdaBody) {
            return visitor.visitLambdaBody(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class PrimaryContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.LPAREN, 0);
    }
    public expression(): ExpressionContext | null {
        return this.getRuleContext(0, ExpressionContext);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.RPAREN, 0);
    }
    public THIS(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.THIS, 0);
    }
    public SUPER(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.SUPER, 0);
    }
    public literal(): LiteralContext | null {
        return this.getRuleContext(0, LiteralContext);
    }
    public identifier(): IdentifierContext | null {
        return this.getRuleContext(0, IdentifierContext);
    }
    public typeTypeOrVoid(): TypeTypeOrVoidContext | null {
        return this.getRuleContext(0, TypeTypeOrVoidContext);
    }
    public DOT(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.DOT, 0);
    }
    public CLASS(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.CLASS, 0);
    }
    public nonWildcardTypeArguments(): NonWildcardTypeArgumentsContext | null {
        return this.getRuleContext(0, NonWildcardTypeArgumentsContext);
    }
    public explicitGenericInvocationSuffix(): ExplicitGenericInvocationSuffixContext | null {
        return this.getRuleContext(0, ExplicitGenericInvocationSuffixContext);
    }
    public arguments(): ArgumentsContext | null {
        return this.getRuleContext(0, ArgumentsContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_primary;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterPrimary) {
             listener.enterPrimary(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitPrimary) {
             listener.exitPrimary(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitPrimary) {
            return visitor.visitPrimary(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class SwitchExpressionContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public SWITCH(): antlr.TerminalNode {
        return this.getToken(JavaParser.SWITCH, 0)!;
    }
    public parExpression(): ParExpressionContext {
        return this.getRuleContext(0, ParExpressionContext)!;
    }
    public LBRACE(): antlr.TerminalNode {
        return this.getToken(JavaParser.LBRACE, 0)!;
    }
    public RBRACE(): antlr.TerminalNode {
        return this.getToken(JavaParser.RBRACE, 0)!;
    }
    public switchLabeledRule(): SwitchLabeledRuleContext[];
    public switchLabeledRule(i: number): SwitchLabeledRuleContext | null;
    public switchLabeledRule(i?: number): SwitchLabeledRuleContext[] | SwitchLabeledRuleContext | null {
        if (i === undefined) {
            return this.getRuleContexts(SwitchLabeledRuleContext);
        }

        return this.getRuleContext(i, SwitchLabeledRuleContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_switchExpression;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterSwitchExpression) {
             listener.enterSwitchExpression(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitSwitchExpression) {
             listener.exitSwitchExpression(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitSwitchExpression) {
            return visitor.visitSwitchExpression(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class SwitchLabeledRuleContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public CASE(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.CASE, 0);
    }
    public switchRuleOutcome(): SwitchRuleOutcomeContext {
        return this.getRuleContext(0, SwitchRuleOutcomeContext)!;
    }
    public ARROW(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.ARROW, 0);
    }
    public COLON(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.COLON, 0);
    }
    public expressionList(): ExpressionListContext | null {
        return this.getRuleContext(0, ExpressionListContext);
    }
    public NULL_LITERAL(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.NULL_LITERAL, 0);
    }
    public guardedPattern(): GuardedPatternContext | null {
        return this.getRuleContext(0, GuardedPatternContext);
    }
    public DEFAULT(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.DEFAULT, 0);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_switchLabeledRule;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterSwitchLabeledRule) {
             listener.enterSwitchLabeledRule(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitSwitchLabeledRule) {
             listener.exitSwitchLabeledRule(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitSwitchLabeledRule) {
            return visitor.visitSwitchLabeledRule(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class GuardedPatternContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.LPAREN, 0);
    }
    public guardedPattern(): GuardedPatternContext | null {
        return this.getRuleContext(0, GuardedPatternContext);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.RPAREN, 0);
    }
    public typeType(): TypeTypeContext | null {
        return this.getRuleContext(0, TypeTypeContext);
    }
    public identifier(): IdentifierContext | null {
        return this.getRuleContext(0, IdentifierContext);
    }
    public variableModifier(): VariableModifierContext[];
    public variableModifier(i: number): VariableModifierContext | null;
    public variableModifier(i?: number): VariableModifierContext[] | VariableModifierContext | null {
        if (i === undefined) {
            return this.getRuleContexts(VariableModifierContext);
        }

        return this.getRuleContext(i, VariableModifierContext);
    }
    public annotation(): AnnotationContext[];
    public annotation(i: number): AnnotationContext | null;
    public annotation(i?: number): AnnotationContext[] | AnnotationContext | null {
        if (i === undefined) {
            return this.getRuleContexts(AnnotationContext);
        }

        return this.getRuleContext(i, AnnotationContext);
    }
    public AND(): antlr.TerminalNode[];
    public AND(i: number): antlr.TerminalNode | null;
    public AND(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.AND);
    	} else {
    		return this.getToken(JavaParser.AND, i);
    	}
    }
    public expression(): ExpressionContext[];
    public expression(i: number): ExpressionContext | null;
    public expression(i?: number): ExpressionContext[] | ExpressionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }

        return this.getRuleContext(i, ExpressionContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_guardedPattern;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterGuardedPattern) {
             listener.enterGuardedPattern(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitGuardedPattern) {
             listener.exitGuardedPattern(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitGuardedPattern) {
            return visitor.visitGuardedPattern(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class SwitchRuleOutcomeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public block(): BlockContext | null {
        return this.getRuleContext(0, BlockContext);
    }
    public blockStatement(): BlockStatementContext[];
    public blockStatement(i: number): BlockStatementContext | null;
    public blockStatement(i?: number): BlockStatementContext[] | BlockStatementContext | null {
        if (i === undefined) {
            return this.getRuleContexts(BlockStatementContext);
        }

        return this.getRuleContext(i, BlockStatementContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_switchRuleOutcome;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterSwitchRuleOutcome) {
             listener.enterSwitchRuleOutcome(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitSwitchRuleOutcome) {
             listener.exitSwitchRuleOutcome(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitSwitchRuleOutcome) {
            return visitor.visitSwitchRuleOutcome(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ClassTypeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
    }
    public classOrInterfaceType(): ClassOrInterfaceTypeContext | null {
        return this.getRuleContext(0, ClassOrInterfaceTypeContext);
    }
    public DOT(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.DOT, 0);
    }
    public annotation(): AnnotationContext[];
    public annotation(i: number): AnnotationContext | null;
    public annotation(i?: number): AnnotationContext[] | AnnotationContext | null {
        if (i === undefined) {
            return this.getRuleContexts(AnnotationContext);
        }

        return this.getRuleContext(i, AnnotationContext);
    }
    public typeArguments(): TypeArgumentsContext | null {
        return this.getRuleContext(0, TypeArgumentsContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_classType;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterClassType) {
             listener.enterClassType(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitClassType) {
             listener.exitClassType(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitClassType) {
            return visitor.visitClassType(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class CreatorContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public nonWildcardTypeArguments(): NonWildcardTypeArgumentsContext | null {
        return this.getRuleContext(0, NonWildcardTypeArgumentsContext);
    }
    public createdName(): CreatedNameContext {
        return this.getRuleContext(0, CreatedNameContext)!;
    }
    public classCreatorRest(): ClassCreatorRestContext | null {
        return this.getRuleContext(0, ClassCreatorRestContext);
    }
    public arrayCreatorRest(): ArrayCreatorRestContext | null {
        return this.getRuleContext(0, ArrayCreatorRestContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_creator;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterCreator) {
             listener.enterCreator(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitCreator) {
             listener.exitCreator(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitCreator) {
            return visitor.visitCreator(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class CreatedNameContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public identifier(): IdentifierContext[];
    public identifier(i: number): IdentifierContext | null;
    public identifier(i?: number): IdentifierContext[] | IdentifierContext | null {
        if (i === undefined) {
            return this.getRuleContexts(IdentifierContext);
        }

        return this.getRuleContext(i, IdentifierContext);
    }
    public typeArgumentsOrDiamond(): TypeArgumentsOrDiamondContext[];
    public typeArgumentsOrDiamond(i: number): TypeArgumentsOrDiamondContext | null;
    public typeArgumentsOrDiamond(i?: number): TypeArgumentsOrDiamondContext[] | TypeArgumentsOrDiamondContext | null {
        if (i === undefined) {
            return this.getRuleContexts(TypeArgumentsOrDiamondContext);
        }

        return this.getRuleContext(i, TypeArgumentsOrDiamondContext);
    }
    public DOT(): antlr.TerminalNode[];
    public DOT(i: number): antlr.TerminalNode | null;
    public DOT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.DOT);
    	} else {
    		return this.getToken(JavaParser.DOT, i);
    	}
    }
    public primitiveType(): PrimitiveTypeContext | null {
        return this.getRuleContext(0, PrimitiveTypeContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_createdName;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterCreatedName) {
             listener.enterCreatedName(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitCreatedName) {
             listener.exitCreatedName(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitCreatedName) {
            return visitor.visitCreatedName(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class InnerCreatorContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
    }
    public classCreatorRest(): ClassCreatorRestContext {
        return this.getRuleContext(0, ClassCreatorRestContext)!;
    }
    public nonWildcardTypeArgumentsOrDiamond(): NonWildcardTypeArgumentsOrDiamondContext | null {
        return this.getRuleContext(0, NonWildcardTypeArgumentsOrDiamondContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_innerCreator;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterInnerCreator) {
             listener.enterInnerCreator(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitInnerCreator) {
             listener.exitInnerCreator(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitInnerCreator) {
            return visitor.visitInnerCreator(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ArrayCreatorRestContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public LBRACK(): antlr.TerminalNode[];
    public LBRACK(i: number): antlr.TerminalNode | null;
    public LBRACK(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.LBRACK);
    	} else {
    		return this.getToken(JavaParser.LBRACK, i);
    	}
    }
    public RBRACK(): antlr.TerminalNode[];
    public RBRACK(i: number): antlr.TerminalNode | null;
    public RBRACK(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.RBRACK);
    	} else {
    		return this.getToken(JavaParser.RBRACK, i);
    	}
    }
    public arrayInitializer(): ArrayInitializerContext | null {
        return this.getRuleContext(0, ArrayInitializerContext);
    }
    public expression(): ExpressionContext[];
    public expression(i: number): ExpressionContext | null;
    public expression(i?: number): ExpressionContext[] | ExpressionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }

        return this.getRuleContext(i, ExpressionContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_arrayCreatorRest;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterArrayCreatorRest) {
             listener.enterArrayCreatorRest(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitArrayCreatorRest) {
             listener.exitArrayCreatorRest(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitArrayCreatorRest) {
            return visitor.visitArrayCreatorRest(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ClassCreatorRestContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public arguments(): ArgumentsContext {
        return this.getRuleContext(0, ArgumentsContext)!;
    }
    public classBody(): ClassBodyContext | null {
        return this.getRuleContext(0, ClassBodyContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_classCreatorRest;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterClassCreatorRest) {
             listener.enterClassCreatorRest(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitClassCreatorRest) {
             listener.exitClassCreatorRest(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitClassCreatorRest) {
            return visitor.visitClassCreatorRest(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ExplicitGenericInvocationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public nonWildcardTypeArguments(): NonWildcardTypeArgumentsContext {
        return this.getRuleContext(0, NonWildcardTypeArgumentsContext)!;
    }
    public explicitGenericInvocationSuffix(): ExplicitGenericInvocationSuffixContext {
        return this.getRuleContext(0, ExplicitGenericInvocationSuffixContext)!;
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_explicitGenericInvocation;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterExplicitGenericInvocation) {
             listener.enterExplicitGenericInvocation(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitExplicitGenericInvocation) {
             listener.exitExplicitGenericInvocation(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitExplicitGenericInvocation) {
            return visitor.visitExplicitGenericInvocation(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class TypeArgumentsOrDiamondContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public LT(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.LT, 0);
    }
    public GT(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.GT, 0);
    }
    public typeArguments(): TypeArgumentsContext | null {
        return this.getRuleContext(0, TypeArgumentsContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_typeArgumentsOrDiamond;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterTypeArgumentsOrDiamond) {
             listener.enterTypeArgumentsOrDiamond(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitTypeArgumentsOrDiamond) {
             listener.exitTypeArgumentsOrDiamond(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitTypeArgumentsOrDiamond) {
            return visitor.visitTypeArgumentsOrDiamond(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class NonWildcardTypeArgumentsOrDiamondContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public LT(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.LT, 0);
    }
    public GT(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.GT, 0);
    }
    public nonWildcardTypeArguments(): NonWildcardTypeArgumentsContext | null {
        return this.getRuleContext(0, NonWildcardTypeArgumentsContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_nonWildcardTypeArgumentsOrDiamond;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterNonWildcardTypeArgumentsOrDiamond) {
             listener.enterNonWildcardTypeArgumentsOrDiamond(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitNonWildcardTypeArgumentsOrDiamond) {
             listener.exitNonWildcardTypeArgumentsOrDiamond(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitNonWildcardTypeArgumentsOrDiamond) {
            return visitor.visitNonWildcardTypeArgumentsOrDiamond(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class NonWildcardTypeArgumentsContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public LT(): antlr.TerminalNode {
        return this.getToken(JavaParser.LT, 0)!;
    }
    public typeList(): TypeListContext {
        return this.getRuleContext(0, TypeListContext)!;
    }
    public GT(): antlr.TerminalNode {
        return this.getToken(JavaParser.GT, 0)!;
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_nonWildcardTypeArguments;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterNonWildcardTypeArguments) {
             listener.enterNonWildcardTypeArguments(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitNonWildcardTypeArguments) {
             listener.exitNonWildcardTypeArguments(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitNonWildcardTypeArguments) {
            return visitor.visitNonWildcardTypeArguments(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class TypeListContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public typeType(): TypeTypeContext[];
    public typeType(i: number): TypeTypeContext | null;
    public typeType(i?: number): TypeTypeContext[] | TypeTypeContext | null {
        if (i === undefined) {
            return this.getRuleContexts(TypeTypeContext);
        }

        return this.getRuleContext(i, TypeTypeContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.COMMA);
    	} else {
    		return this.getToken(JavaParser.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_typeList;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterTypeList) {
             listener.enterTypeList(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitTypeList) {
             listener.exitTypeList(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitTypeList) {
            return visitor.visitTypeList(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class TypeTypeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public classOrInterfaceType(): ClassOrInterfaceTypeContext | null {
        return this.getRuleContext(0, ClassOrInterfaceTypeContext);
    }
    public primitiveType(): PrimitiveTypeContext | null {
        return this.getRuleContext(0, PrimitiveTypeContext);
    }
    public annotation(): AnnotationContext[];
    public annotation(i: number): AnnotationContext | null;
    public annotation(i?: number): AnnotationContext[] | AnnotationContext | null {
        if (i === undefined) {
            return this.getRuleContexts(AnnotationContext);
        }

        return this.getRuleContext(i, AnnotationContext);
    }
    public LBRACK(): antlr.TerminalNode[];
    public LBRACK(i: number): antlr.TerminalNode | null;
    public LBRACK(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.LBRACK);
    	} else {
    		return this.getToken(JavaParser.LBRACK, i);
    	}
    }
    public RBRACK(): antlr.TerminalNode[];
    public RBRACK(i: number): antlr.TerminalNode | null;
    public RBRACK(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.RBRACK);
    	} else {
    		return this.getToken(JavaParser.RBRACK, i);
    	}
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_typeType;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterTypeType) {
             listener.enterTypeType(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitTypeType) {
             listener.exitTypeType(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitTypeType) {
            return visitor.visitTypeType(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class PrimitiveTypeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public BOOLEAN(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.BOOLEAN, 0);
    }
    public CHAR(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.CHAR, 0);
    }
    public BYTE(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.BYTE, 0);
    }
    public SHORT(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.SHORT, 0);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.INT, 0);
    }
    public LONG(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.LONG, 0);
    }
    public FLOAT(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.FLOAT, 0);
    }
    public DOUBLE(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.DOUBLE, 0);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_primitiveType;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterPrimitiveType) {
             listener.enterPrimitiveType(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitPrimitiveType) {
             listener.exitPrimitiveType(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitPrimitiveType) {
            return visitor.visitPrimitiveType(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class TypeArgumentsContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public LT(): antlr.TerminalNode {
        return this.getToken(JavaParser.LT, 0)!;
    }
    public typeArgument(): TypeArgumentContext[];
    public typeArgument(i: number): TypeArgumentContext | null;
    public typeArgument(i?: number): TypeArgumentContext[] | TypeArgumentContext | null {
        if (i === undefined) {
            return this.getRuleContexts(TypeArgumentContext);
        }

        return this.getRuleContext(i, TypeArgumentContext);
    }
    public GT(): antlr.TerminalNode {
        return this.getToken(JavaParser.GT, 0)!;
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(JavaParser.COMMA);
    	} else {
    		return this.getToken(JavaParser.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_typeArguments;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterTypeArguments) {
             listener.enterTypeArguments(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitTypeArguments) {
             listener.exitTypeArguments(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitTypeArguments) {
            return visitor.visitTypeArguments(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class SuperSuffixContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public arguments(): ArgumentsContext | null {
        return this.getRuleContext(0, ArgumentsContext);
    }
    public DOT(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.DOT, 0);
    }
    public identifier(): IdentifierContext | null {
        return this.getRuleContext(0, IdentifierContext);
    }
    public typeArguments(): TypeArgumentsContext | null {
        return this.getRuleContext(0, TypeArgumentsContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_superSuffix;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterSuperSuffix) {
             listener.enterSuperSuffix(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitSuperSuffix) {
             listener.exitSuperSuffix(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitSuperSuffix) {
            return visitor.visitSuperSuffix(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ExplicitGenericInvocationSuffixContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public SUPER(): antlr.TerminalNode | null {
        return this.getToken(JavaParser.SUPER, 0);
    }
    public superSuffix(): SuperSuffixContext | null {
        return this.getRuleContext(0, SuperSuffixContext);
    }
    public identifier(): IdentifierContext | null {
        return this.getRuleContext(0, IdentifierContext);
    }
    public arguments(): ArgumentsContext | null {
        return this.getRuleContext(0, ArgumentsContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_explicitGenericInvocationSuffix;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterExplicitGenericInvocationSuffix) {
             listener.enterExplicitGenericInvocationSuffix(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitExplicitGenericInvocationSuffix) {
             listener.exitExplicitGenericInvocationSuffix(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitExplicitGenericInvocationSuffix) {
            return visitor.visitExplicitGenericInvocationSuffix(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ArgumentsContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(JavaParser.LPAREN, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(JavaParser.RPAREN, 0)!;
    }
    public expressionList(): ExpressionListContext | null {
        return this.getRuleContext(0, ExpressionListContext);
    }
    public override get ruleIndex(): number {
        return JavaParser.RULE_arguments;
    }
    public override enterRule(listener: JavaParserListener): void {
        if(listener.enterArguments) {
             listener.enterArguments(this);
        }
    }
    public override exitRule(listener: JavaParserListener): void {
        if(listener.exitArguments) {
             listener.exitArguments(this);
        }
    }
    public override accept<Result>(visitor: JavaParserVisitor<Result>): Result | null {
        if (visitor.visitArguments) {
            return visitor.visitArguments(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
