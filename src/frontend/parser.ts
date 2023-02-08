import { exit } from 'process'
import { Statement, Program, Identifier, Expr, Int, Float, Let, BinExpr, Null, Const, VariableDeclaration, AssignmentExpr, Property, Object, CallExpr, MemberExpr, String, FunctionDeclaration, WhileDeclaration, While, IfStatement } from './ast'
import { Lexer } from './lexer'
import { RED, BOLD, RESET, WHITE } from './utils/colors'
import { Token } from './utils/Token'
import { Type } from './utils/Type'

export default class Parser {
  private tokens: Token[] = []
  private code: string | undefined
  private notEof(): boolean {
    return this.tokens[0].tokenType != Type.EOF
  }

  constructor(code?: string) { this.code = code }

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

      // TODO: IDK HOW TO FIX THIS :(, cannot get the value of an identifier
      case Type.IF:
        return this.parseIfStatement()
      default:
        return this.parseExpr()
    }
  }

  private parseIfStatement(): Statement {
    this.advance()
    this.expect(Type.OPENPAR, 'Expected an open parenthesis.')
    if (this.advance().tokenType === Type.CLOSEPAR) {
      throw `Expected a condition`
    }
    const condition = this.parseCondition()
    this.expect(Type.CLOSEPAR, "Expected a closing parenthesis after condition")
    this.expect(Type.OPENCURLY, "Expected an if else body")
    if (this.advance().tokenType === Type.CLOSECURLY) {
      throw `Expected an if else body`
    }
    const body: Statement[] = []
    while (this.at().tokenType != Type.EOF && this.at().tokenType != Type.CLOSECURLY) {
      body.push(this.parseStatement())
    }
    this.expect(Type.CLOSECURLY, 'Expected a closing curly bracket "}" after the while loop body.')

    const _if = {
      kind: 'IfStatement',
      condition,
      body
    } as IfStatement
    return _if
  }

  // TODO: BROKE CONDITION CHECKING
  private parseCondition(): boolean {
    const val1 = this.expect(Type.IDENTIFIER, "Expected an identifier").value
    this.expect(Type.Equals, "Expected double equals to symbol")
    this.expect(Type.Equals, "Expected double equals to symbol")
    const val2 = this.expect(Type.INT, "Expected an identifier").value
    return val1 === val2
  }

  // while (condition) -> { body }
  // TODO: this is wayyy harder than expected...... so i'm gonna skip this for now haha
  /* private parseWhileDeclaration(): Statement {
    this.advance()
    this.expect(Type.OPENPAR, "Expected open parenthesis after while keyword")

    //condition
    const condition = this.parseCondition()
    console.log(condition)

    this.expect(Type.CLOSEPAR, "Expected closing parenthesis after condition")
    this.expect(Type.GR, "Expected > after condition closing parenthesis")

    this.expect(Type.OPENCURLY, `Expected a while loop body`)
    const body: Statement[] = []
    while (this.at().tokenType != Type.EOF && this.at().tokenType != Type.CLOSECURLY) {
      body.push(this.parseStatement())
    }
    this.expect(Type.CLOSECURLY, 'Expected a closing curly bracket "}" after the while loop body.')

    const _while = {
      kind: 'WhileDeclaration',
      condition,
      body
    } as WhileDeclaration
    return _while
  } */

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
      case Type.WHILE:
        return { kind: "While", keyword: this.advance().value } as While
      case Type.CONST:
        return { kind: "Const", keyword: this.advance().value } as Const
      case Type.NULL: {
        this.advance()
        return { kind: 'Null', keyword: 'null' } as Null
      }

      default:
        // error characters
        const type = this.at().tokenType
        const value = this.at().value
        const charAt = typeof this.code === 'undefined' ? '' : this.code.indexOf(value)

        let spaces = ''
        for (let i = 0; i < charAt; i++) {
          spaces += ' '
        }

        console.log(`${RED}Unexpected Token Type: "${Type[type]}" found while parsing.${RESET}\n${BOLD + RED}Type  :${RESET} ${BOLD + WHITE + Type[type] + RESET}\n${BOLD + RED}Value :${RESET} ${BOLD + WHITE + value + RESET}`)
        if (typeof this.code !== 'undefined') {
          console.log(this.code.split('\n')[0])
          console.log(`${spaces}^`)
        }
        exit(1)
    }
  }
}
