import { exit } from "process";
import { isAlpha, isNumber } from "./utils/helpers";
import { Token, token } from "./utils/Token";
import { Type, KEYWORDS } from "./utils/Type";

export class Lexer {
  code: string
  private cc: string | null
  private pos: number

  constructor(code: string) {
    this.code = code
    this.pos = -1
    this.cc = null
    this.next()
  }

  private next() {
    this.pos += 1
    if (this.code.length > this.pos) {
      this.cc = this.code[this.pos]
    } else { this.cc = null }
  }

  tokenize() {
    const tokens = new Array<Token>()

    while (this.cc != null) {
      if (this.cc === '\t' || this.cc === ' ' || this.cc === '\n' || this.cc === '\r') {
        this.next()
      }

      else if (this.cc === '(') {
        tokens.push(token(Type.OPENPAR, this.cc))
        this.next()
      } else if (this.cc === ')') {
        tokens.push(token(Type.CLOSEPAR, this.cc))
        this.next()
      } else if (this.cc === '[') {
        tokens.push(token(Type.OPENSQ, this.cc))
        this.next()
      } else if (this.cc === ']') {
        tokens.push(token(Type.CLOSESQ, this.cc))
        this.next()
      } else if (this.cc === '{') {
        tokens.push(token(Type.OPENCURLY, this.cc))
        this.next()
      } else if (this.cc === '}') {
        tokens.push(token(Type.CLOSECURLY, this.cc))
        this.next()
      } else if (this.cc === ':') {
        tokens.push(token(Type.COLON, this.cc))
        this.next()
      } else if (this.cc === '.') {
        tokens.push(token(Type.DOT, this.cc))
        this.next()
      } else if (this.cc === ',') {
        tokens.push(token(Type.COMMA, this.cc))
        this.next()
      } else if (/[//]/.test(this.cc)) {
        this.next()
        while (this.cc !== '\n') {
          this.next()
        }
      }

      else if (this.cc == '+' || this.cc == '-' || this.cc == '*' || this.cc == '/' || this.cc == '%' || this.cc == '^') {
        tokens.push(token(Type.BinOP, this.cc))
        this.next()
      } else if (this.cc == '=') {
        tokens.push(token(Type.Equals, this.cc))
        this.next()
      } else if (this.cc == ';') {
        tokens.push(token(Type.SEMICOL, this.cc))
        this.next()
      }

      else {
        // Multiple character tokens
        if (isNumber(this.cc) || this.cc === '.') {
          let numStr = ''
          let dotCount = 0

          while (isNumber(this.cc) || this.cc == '.') {
            if (this.cc == '.') {
              if (dotCount == 1) { break }
              dotCount += 1
              numStr += '.'
              this.next()
            }
            numStr += this.cc
            this.next()
          }
          if (dotCount == 0) {
            tokens.push(token(Type.INT, parseInt(numStr)))
          } else {
            tokens.push(token(Type.FLOAT, parseFloat(numStr)))
          }

        } else if (isAlpha(this.cc)) {
          let identifier = ''

          while (isAlpha(this.cc)) {
            identifier += this.cc
            this.next()
          }

          const reservedType = KEYWORDS[identifier]
          if (typeof reservedType === 'number') {
            tokens.push(token(reservedType, identifier))
          } else {
            tokens.push(token(Type.IDENTIFIER, identifier))
          }
        } else {
          console.log("Unrecognized token " + this.cc + " found.")
          exit(1)
        }
      }
    }

    tokens.push({ tokenType: Type.EOF, value: "EOF" })
    return tokens
  }
}
