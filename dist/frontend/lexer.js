"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenize = void 0;
const process_1 = require("process");
const helpers_1 = require("./utils/helpers");
const Token_1 = require("./utils/Token");
const Type_1 = require("./utils/Type");
function tokenize(code) {
    const tokens = new Array();
    const src = code.split("");
    while (src.length > 0) {
        if (src[0] === '\t' || src[0] === ' ' || src[0] === '\n' || src[0] === '\r') {
            src.shift();
        }
        else if (src[0] === '(') {
            tokens.push((0, Token_1.token)(Type_1.Type.OPENPAR, src.shift()));
        }
        else if (src[0] === ')') {
            tokens.push((0, Token_1.token)(Type_1.Type.CLOSEPAR, src.shift()));
        }
        else if (src[0] === '{') {
            tokens.push((0, Token_1.token)(Type_1.Type.OPENCURLY, src.shift()));
        }
        else if (src[0] === '}') {
            tokens.push((0, Token_1.token)(Type_1.Type.CLOSECURLY, src.shift()));
        }
        else if (src[0] === '[') {
            tokens.push((0, Token_1.token)(Type_1.Type.OPENSQ, src.shift()));
        }
        else if (src[0] === ']') {
            tokens.push((0, Token_1.token)(Type_1.Type.CLOSESQ, src.shift()));
        }
        else if (src[0] === ':') {
            tokens.push((0, Token_1.token)(Type_1.Type.COLON, src.shift()));
        }
        else if (src[0] === ',') {
            tokens.push((0, Token_1.token)(Type_1.Type.COMMA, src.shift()));
        }
        else if (src[0] === '.') {
            tokens.push((0, Token_1.token)(Type_1.Type.DOT, src.shift()));
        }
        else if (/[//]/.test(src[0])) {
            src.shift();
            while (src[0] !== '\n') {
                src.shift();
            }
        }
        else if (src[0] == '+' || src[0] == '-' || src[0] == '*' || src[0] == '/' || src[0] == '%' || src[0] == '^') {
            tokens.push((0, Token_1.token)(Type_1.Type.BinOP, src.shift()));
        }
        else if (src[0] == '=') {
            tokens.push((0, Token_1.token)(Type_1.Type.Equals, src.shift()));
        }
        else if (src[0] == ' ' || src[0] == '\n' || src[0] == '\t') { // Skip whitespaces, new lines and tabs
            src.shift();
        }
        else if (src[0] == ';') {
            tokens.push((0, Token_1.token)(Type_1.Type.SEMICOL, src.shift()));
        }
        else {
            // Multiple character tokens
            if ((0, helpers_1.isNumber)(src[0]) || src[0] === '.') {
                let numStr = '';
                let dotCount = 0;
                while (src.length > 0 && (0, helpers_1.isNumber)(src[0]) || src[0] == '.') {
                    if (src[0] == '.') {
                        if (dotCount == 1) {
                            break;
                        }
                        dotCount += 1;
                        numStr += '.';
                        src.shift();
                    }
                    numStr += src.shift();
                }
                if (dotCount == 0) {
                    tokens.push((0, Token_1.token)(Type_1.Type.INT, parseInt(numStr)));
                }
                else {
                    tokens.push((0, Token_1.token)(Type_1.Type.FLOAT, parseFloat(numStr)));
                }
            }
            else if ((0, helpers_1.isAlpha)(src[0])) {
                let identifier = '';
                while (src.length > 0 && (0, helpers_1.isAlpha)(src[0])) {
                    identifier += src.shift();
                }
                const reservedType = Type_1.KEYWORDS[identifier];
                if (typeof reservedType === 'number') {
                    tokens.push((0, Token_1.token)(reservedType, identifier));
                }
                else {
                    tokens.push((0, Token_1.token)(Type_1.Type.IDENTIFIER, identifier));
                }
            }
            else {
                console.log("Unrecognized token " + src[0] + " found.");
                (0, process_1.exit)(1);
            }
        }
    }
    tokens.push({ tokenType: Type_1.Type.EOF, value: "EOF" });
    return tokens;
}
exports.tokenize = tokenize;
