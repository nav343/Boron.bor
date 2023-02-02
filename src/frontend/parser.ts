import { exit } from 'process'
import { Statement, Program, Identifier, Expr, Int, Float, Let, BinExpr, Null, Const, VariableDeclaration, AssignmentExpr, Property, Object, CallExpr, MemberExpr, String, FunctionDeclaration } from './ast'
import { Lexer } from './lexer'
import { Token } from './utils/Token'
import { Type } from './utils/Type'

export default class Parser {
  private tokens: Token[] = []
  private notEof(): boolean {
    return this.tokens[0].tokenType != Type.EOF
  }


  private expect(type: Type, error: any) {
    const previous = this.tokens.shift() as Token
    if (!previous || previous.tokenType != type) {
      console.error("Parser Error\n", error, this.at(), "Expecting: ", type)
      exit(1)
    }
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
      default:
        return this.parseExpr()
    }
  }

  private parseFuncDeclaration(): Statement {
    this.advance()
    const name = this.expect(Type.IDENTIFIER, "Expected an identifier after a func keyword, but got: ").value
    const args = this.parseArgs()
    const params: string[] = []
    for (const arg of args) {
      if (arg.kind !== 'Identifier') {
        console.log('Expected a string argument inside a function.')
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
        console.log(`Must assign to constant values, no value provided for ${identifier}`)
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
      this.at().tokenType == Type.DOT || this.at().tokenType == Type.OPENSQ
    ) {
      const operator = this.advance();
      let property: Expr;
      let computed: boolean;

      // non-computed values aka obj.expr
      if (operator.tokenType == Type.DOT) {
        computed = false;
        // get identifier
        property = this.parsePrimaryExpr();
        if (property.kind != "Identifier") {
          throw `Cannonot use dot operator without right hand side being a identifier`;
        }
      } else { // this allows obj[computedValue]
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
      case Type.CONST:
        return { kind: "Const", keyword: this.advance().value } as Const
      case Type.NULL: {
        this.advance()
        return { kind: 'Null', keyword: 'null' } as Null
      }

      default:
        const errChar = JSON.stringify(this.at(), null, '  ')
        console.log(`Unexpected token ${errChar} found while parsing.`)
        exit(1)
    }
  }
}
