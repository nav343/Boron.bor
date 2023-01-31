import { exit } from "process";
import { isAlpha, isNumber } from "./utils/helpers";
import { Token, token } from "./utils/Token";
import { Type, KEYWORDS } from "./utils/Type";

export function tokenize(code: string): Token[] {
  const tokens = new Array<Token>()
  const src = code.split("")

  while (src.length > 0) {
    if (src[0] === '\t' || src[0] === ' ' || src[0] === '\n' || src[0] === '\r') {
      src.shift()
    }

    else if (src[0] === '(') {
      tokens.push(token(Type.OPENPAR, src.shift()))
    } else if (src[0] === ')') {
      tokens.push(token(Type.CLOSEPAR, src.shift()))
    } else if (src[0] === '{') {
      tokens.push(token(Type.OPENCURLY, src.shift()))
    } else if (src[0] === '}') {
      tokens.push(token(Type.CLOSECURLY, src.shift()))
    } else if (src[0] === '[') {
      tokens.push(token(Type.OPENSQ, src.shift()))
    } else if (src[0] === ']') {
      tokens.push(token(Type.CLOSESQ, src.shift()))
    } else if (src[0] === ':') {
      tokens.push(token(Type.COLON, src.shift()))
    } else if (src[0] === ',') {
      tokens.push(token(Type.COMMA, src.shift()))
    } else if (src[0] === '.') {
      tokens.push(token(Type.DOT, src.shift()))
    }




    else if (src[0] == '+' || src[0] == '-' || src[0] == '*' || src[0] == '/' || src[0] == '%' || src[0] == '^') {
      tokens.push(token(Type.BinOP, src.shift()))
    } else if (src[0] == '=') {
      tokens.push(token(Type.Equals, src.shift()))
    } else if (src[0] == ' ' || src[0] == '\n' || src[0] == '\t') { // Skip whitespaces, new lines and tabs
      src.shift()
    } else if (src[0] == ';') {
      tokens.push(token(Type.SEMICOL, src.shift()))
    } else {
      // Multiple character tokens
      if (isNumber(src[0]) || src[0] === '.') {
        let numStr = ''
        let dotCount = 0

        while (src.length > 0 && isNumber(src[0]) || src[0] == '.') {
          if (src[0] == '.') {
            if (dotCount == 1) { break }
            dotCount += 1
            numStr += '.'
            src.shift()
          }
          numStr += src.shift()
        }
        if (dotCount == 0) {
          tokens.push(token(Type.INT, parseInt(numStr)))
        } else {
          tokens.push(token(Type.FLOAT, parseFloat(numStr)))
        }
      } else if (src[0] === '"') {
        let str = ''
        src.shift()
        while (src[0] != '"') {
          str += src.shift()
        }
        tokens.push(token(Type.STRING, str))
      } else if (isAlpha(src[0])) {
        let identifier = ''

        while (src.length > 0 && isAlpha(src[0])) {
          identifier += src.shift()
        }

        const reservedType = KEYWORDS[identifier]
        if (typeof reservedType === 'number') {
          tokens.push(token(reservedType, identifier))
        } else {
          tokens.push(token(Type.IDENTIFIER, identifier))
        }
      } else {
        console.log("Unrecognized token " + src[0] + " found.")
        exit(1)
      }
    }
  }

  tokens.push({ tokenType: Type.EOF, value: "EOF" })
  return tokens
}
