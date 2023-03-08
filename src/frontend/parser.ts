import { exit } from 'process'
import { SyntaxError } from '../error/syntaxError'
import { NumberValue } from '../runtime/value'
import { Statement, Program, Identifier, Expr, Int, Float, Let, BinExpr, Null, Const, VariableDeclaration, AssignmentExpr, Property, Object, CallExpr, MemberExpr, String, FunctionDeclaration, While, IfStatement, Export, Import, WhileDeclaration, ElseStatement } from './ast'
import { Lexer } from './lexer'
import { RESET, YELLOW } from './utils/colors'
import { Token } from './utils/Token'
import { Type } from './utils/Type'

export default class Parser {
  private tokens: Token[] = []
  private code: string | undefined
  private notEof(): boolean {
    return this.tokens[0].tokenType != Type.EOF
  }

  private ifInitialized: boolean = false

  constructor(code?: string) { this.code = code }

  private expect(type: Type, details: any) {
    const previous = this.tokens.shift() as Token
    if (!previous || previous.tokenType != type)
      new SyntaxError(`Unexpected ${previous.value}\n ${details}`, previous)

    return previous
  }
  private advance() {
    const previousToken = this.tokens.shift() as Token
    return previousToken
  }

  public genAst(code: string): Program {
    const lexer = new Lexer(code)
    this.tokens = lexer.tokenize()
    const program: Program = {
      kind: "Program",
      body: []
    }
    while (this.notEof()) {
      program.body.push(this.parseStatement())
    }
    return program
  }

  private at() {
    return this.tokens[0] as Token
  }

  private parseStatement(): Statement {
    switch (this.at().tokenType) {
      case Type.LET:
        return this.parseVarDeclaration()
      case Type.CONST:
        return this.parseVarDeclaration()
      case Type.FUNC:
        return this.parseFuncDeclaration()

      // packages
      case Type.EXPORT:
        return this.parseExportStatement()
      case Type.IMPORT:
        return this.parseImportStatement()

      case Type.IF:
        return this.parseIfStatement()
      case Type.ELSE:
        return this.parseElseStatement()
      case Type.WHILE:
        return this.parseWhileDeclaration()
      default:
        return this.parseExpr()
    }
  }

  private parseExportStatement(): Statement {
    this.advance()
    this.expect(Type.OPENPAR, "Expected open parenthesis")
    const item = this.expect(Type.IDENTIFIER, "Expected a value to export")
    this.expect(Type.CLOSEPAR, "Expected closing parenthesis")
    return { name: item.value, kind: 'Export' } as Export
  }

  private parseImportStatement(): Statement {
    this.advance()
    const _package = this.expect(Type.STRING, "Expected a package name after import keyword").value
    return { kind: 'Import', _package } as Import
  }

  private parseIfStatement(): Statement {
    this.ifInitialized = true
    let op0: string | null = ''
    this.advance()

    this.expect(Type.OPENPAR, "Expected open parenthesis after 'if' keyword")
    const val1 = this.expect(this.at().tokenType, "Expecting identifier or a number")
    if (this.at().tokenType === Type.Equals ||
      this.at().tokenType === Type.GR ||
      this.at().tokenType === Type.SR ||
      this.at().tokenType === Type.BANG
    ) { op0 = this.at().value; this.advance() } else {
      new SyntaxError(`Expecting one of these: ${YELLOW + ">, <, =, !" + RESET}.\n But got ${this.at().value}`, null)
      exit(1)
    }
    const op1 = this.expect(Type.Equals, "Expecting double equals").value
    const op = op0 + op1
    const val2 = this.expect(this.at().tokenType, "Idk wut to check for?")
    this.expect(Type.CLOSEPAR, "Expecting closing parenthesis")

    const body = this.parseBody()

    return { kind: 'IfStatement', valueOne: val1, op, valueTwo: val2, body } as IfStatement
  }

  private parseElseStatement(): Statement {
    if (!this.ifInitialized) {
      new SyntaxError("No `IF` statement found", null)
      exit(1)
    }
    this.ifInitialized = false
    this.advance()
    if (this.at().tokenType == Type.IF) {
      return this.parseIfStatement()
    } else {
      const body = this.parseBody()
      return { kind: 'ElseStatement', body } as ElseStatement
    }
  }

  // while (condition) -> { body }
  // TODO: this is wayyy harder than expected...... so i'm gonna skip this for now haha
  private parseWhileDeclaration(): Statement {
    let op0 = ''
    this.advance()
    this.expect(Type.OPENPAR, "Expected open parenthesis after while keyword")
    const val1 = this.expect(this.at().tokenType, "Expecting identifier or a number")
    if (this.at().tokenType === Type.Equals ||
      this.at().tokenType === Type.GR ||
      this.at().tokenType === Type.SR ||
      this.at().tokenType === Type.BANG
    ) { op0 = this.at().value; this.advance() } else {
      new SyntaxError(`Expecting one of these: ${YELLOW + ">, <, =, !" + RESET}.\n But got ${this.at().value}`, null)
      exit(1)
    }
    const op1 = this.expect(Type.Equals, "Expecting double equals").value
    const op = op0 + op1
    const val2 = this.expect(this.at().tokenType, "Idk wut to check for?")
    this.expect(Type.CLOSEPAR, "Expected closing parenthesis after condition")

    const body = this.parseBody()

    const _while = {
      kind: 'WhileDeclaration',
      valueOne: val1,
      op,
      valueTwo: val2,
      body
    } as WhileDeclaration
    return _while
  }

  private parseBody(): Statement[] {
    // BODY START
    this.expect(Type.OPENCURLY, `Expected body`)
    const body: Statement[] = []
    while (this.at().tokenType != Type.EOF && this.at().tokenType != Type.CLOSECURLY) {
      body.push(this.parseStatement())
    }
    this.expect(Type.CLOSECURLY, 'Expected a closing curly bracket "}" after the function body.')
    // BODY END
    return body
  }

  private parseFuncDeclaration(): Statement {
    this.advance()
    const name = this.expect(Type.IDENTIFIER, "Expected an identifier after a func keyword, but got: ").value
    const args = this.parseArgs()
    const params: string[] = []
    for (const arg of args) {
      if (arg.kind !== 'Identifier') {
        new SyntaxError('Expected a string argument inside a function.', null)
        break
      }
      params.push((arg as Identifier).symbol)
    }

    this.expect(Type.OPENCURLY, `Expected a function body`)
    const body: Statement[] = []

    while (this.at().tokenType != Type.EOF && this.at().tokenType != Type.CLOSECURLY) {
      body.push(this.parseStatement())
    }

    this.expect(Type.CLOSECURLY, 'Expected a closing curly bracket "}" after the function body.')
    const func = {
      kind: 'FunctionDeclaration',
      params,
      body,
      name
    } as FunctionDeclaration
    return func
  }

  // LET [IDENTIFIER] "=" [VALUE]
  private parseVarDeclaration(): Statement {
    const isConstant = this.advance().tokenType === Type.CONST
    const identifier = this.expect(Type.IDENTIFIER, "Expected an identifier after a let or a const keyword").value

    if (this.at().tokenType === Type.SEMICOL) {
      this.advance()
      if (isConstant) {
        new SyntaxError(`Must assign to constant values, no value provided for ${identifier}`, null)
      }
      return {
        kind: 'VariableDeclaration',
        identifier,
        constant: false,
        value: undefined
      } as VariableDeclaration
    }

    this.expect(Type.Equals, "Expected an equals after identifier")
    const declarations = {
      kind: 'VariableDeclaration',
      value: this.parseExpr(),
      constant: isConstant,
      identifier
    } as VariableDeclaration
    this.expect(Type.SEMICOL, "Expected a semicolon at the end of variable declaration. But got ")

    return declarations
  }

  private parseExpr(): Expr {
    return this.parseAssignmentExpr()
  }

  private parseAssignmentExpr(): Expr {
    const left = this.parseObjectExpr()
    if (this.at().tokenType === Type.Equals) {
      this.advance()
      const value = this.parseAssignmentExpr()
      return {
        kind: "AssignmentExpr",
        value,
        assign: left
      } as AssignmentExpr
    }

    return left
  }

  private parseObjectExpr(): Expr {
    if (this.at().tokenType !== Type.OPENCURLY) {
      return this.parseAddExpr()
    }
    this.advance()

    const property = new Array<Property>()
    while (this.notEof() && this.at().tokenType != Type.CLOSECURLY) {
      const key = this.expect(Type.IDENTIFIER, "Object literal key expected").value
      if (this.at().tokenType === Type.COMMA) {
        this.advance()
        property.push({ kind: 'Property', key } as Property)
        continue
      } else if (this.at().tokenType === Type.CLOSECURLY) {
        property.push({ kind: 'Property', key } as Property)
        continue
      }


      this.expect(Type.COLON, "Missing colon after a key")
      const value = this.parseExpr()
      property.push({ kind: "Property", value, key })
      if (this.at().tokenType != Type.CLOSECURLY) {
        this.expect(Type.COMMA, "Expected a comma or a curley bracket")
      }
    }
    this.expect(Type.CLOSECURLY, "Object literal missing closing curly bracket. ")
    return { kind: "Object", property } as Object
  }

  private parseAddExpr(): Expr {
    let left = this.parseMulExpr()

    while (this.at().value === '+' || this.at().value === '-') {
      const op = this.advance().value
      const right = this.parseMulExpr()
      left = {
        kind: "BinExpr",
        left,
        op,
        right,
      } as BinExpr
    }

    return left
  }

  private parseMulExpr(): Expr {
    let left = this.parseCallMemberExpr()

    while (this.at().value === '*' || this.at().value === '/' || this.at().value === '%' || this.at().value === '^') {
      const op = this.advance().value
      const right = this.parseCallMemberExpr()
      if (((right as unknown) as NumberValue).value === 0) { new SyntaxError('Cannot divide by 0.', null) }
      left = {
        kind: "BinExpr",
        left,
        op,
        right,
      } as BinExpr
    }

    return left
  }

  private parseCallMemberExpr(): Expr {
    const member = this.parseMemberExpr();

    if (this.at().tokenType == Type.OPENPAR) {
      return this.parseCallExpr(member);
    }

    return member;
  }

  private parseCallExpr(caller: Expr): Expr {
    let callExpr: Expr = {
      kind: "CallExpr",
      caller,
      args: this.parseArgs(),
    } as CallExpr;

    if (this.at().tokenType == Type.OPENPAR) {
      callExpr = this.parseCallExpr(callExpr);
    }

    return callExpr;
  }

  private parseArgs(): Expr[] {
    this.expect(Type.OPENPAR, "Expected open parenthesis");
    const args = this.at().tokenType == Type.CLOSEPAR
      ? []
      : this.parseArgumentList();

    this.expect(
      Type.CLOSEPAR,
      "Missing closing parenthesis inside arguments list",
    );
    return args;
  }

  private parseArgumentList(): Expr[] {
    const args = [this.parseAssignmentExpr()];
    while (this.at().tokenType == Type.COMMA && this.advance()) {
      args.push(this.parseAssignmentExpr());
    }
    return args;
  }

  private parseMemberExpr(): Expr {
    let object = this.parsePrimaryExpr();

    while (
      this.at().tokenType == Type.COLON || this.at().tokenType == Type.OPENSQ
    ) {
      const operator = this.advance();
      let property: Expr;
      let computed: boolean;

      if (operator.tokenType == Type.COLON) {
        this.expect(Type.COLON, "Expecting Double Colon (::) for Member Expression")
        computed = false;
        property = this.parsePrimaryExpr();
        if (property.kind != "Identifier") {
          new SyntaxError(`Cannot use ":" operator without Right Side being an identifier`, null)
        }
      } else {
        computed = true;
        property = this.parseExpr();
        this.expect(
          Type.CLOSESQ,
          "Missing closing bracket in computed value.",
        );
      }

      object = {
        kind: "MemberExpr",
        object,
        property,
        computed,
      } as MemberExpr;
    }

    return object;
  }

  private parsePrimaryExpr(): Expr {
    const tk = this.at().tokenType

    switch (tk) {
      case Type.IDENTIFIER:
        return { kind: "Identifier", symbol: this.advance().value } as Identifier


      // Numbers
      case Type.INT:
        return {
          kind: "Int",
          value: parseInt(this.advance().value)
        } as Int
      case Type.FLOAT:
        return {
          kind: "Float",
          value: parseFloat(this.advance().value)
        } as Float
      case Type.STRING:
        return {
          kind: "String",
          value: String(this.advance().value)
        } as String


      case Type.OPENPAR: {
        this.advance()
        const value = this.parseExpr()
        this.expect(
          Type.CLOSEPAR,
          "Unexpected token found inside brackets. Expected closing parenthesis")
        return value
      }

      // Keywords
      case Type.LET:
        return { kind: "Let", keyword: this.advance().value } as Let
      case Type.WHILE:
        return { kind: "While", keyword: this.advance().value } as While
      case Type.CONST:
        return { kind: "Const", keyword: this.advance().value } as Const
      case Type.NULL: {
        this.advance()
        return { kind: 'Null', keyword: 'null' } as Null
      }

      default:
        const type = this.at().tokenType
        const value = this.at().value
        const charAt = typeof this.code === 'undefined' ? '' : this.code.indexOf(value)
        new SyntaxError(`Unexpected token: ${Type[type]} -> ${value}`, null, charAt as number)
        exit(1)
    }
  }
}
