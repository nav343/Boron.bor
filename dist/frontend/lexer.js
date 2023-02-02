"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lexer = void 0;
const process_1 = require("process");
const helpers_1 = require("./utils/helpers");
const Token_1 = require("./utils/Token");
const Type_1 = require("./utils/Type");
class Lexer {
    code;
    cc;
    pos;
    constructor(code) {
        this.code = code;
        this.pos = -1;
        this.cc = null;
        this.next();
    }
    next() {
        this.pos += 1;
        if (this.code.length > this.pos) {
            this.cc = this.code[this.pos];
        }
        else {
            this.cc = null;
        }
    }
    tokenize() {
        const tokens = new Array();
        while (this.cc != null) {
            if (this.cc === '\t' || this.cc === ' ' || this.cc === '\n' || this.cc === '\r') {
                this.next();
            }
            else if (this.cc === '(') {
                tokens.push((0, Token_1.token)(Type_1.Type.OPENPAR, this.cc));
                this.next();
            }
            else if (this.cc === ')') {
                tokens.push((0, Token_1.token)(Type_1.Type.CLOSEPAR, this.cc));
                this.next();
            }
            else if (this.cc === '[') {
                tokens.push((0, Token_1.token)(Type_1.Type.OPENSQ, this.cc));
                this.next();
            }
            else if (this.cc === ']') {
                tokens.push((0, Token_1.token)(Type_1.Type.CLOSESQ, this.cc));
                this.next();
            }
            else if (this.cc === '{') {
                tokens.push((0, Token_1.token)(Type_1.Type.OPENCURLY, this.cc));
                this.next();
            }
            else if (this.cc === '}') {
                tokens.push((0, Token_1.token)(Type_1.Type.CLOSECURLY, this.cc));
                this.next();
            }
            else if (this.cc === ':') {
                tokens.push((0, Token_1.token)(Type_1.Type.COLON, this.cc));
                this.next();
            }
            else if (this.cc === '.') {
                tokens.push((0, Token_1.token)(Type_1.Type.DOT, this.cc));
                this.next();
            }
            else if (this.cc === ',') {
                tokens.push((0, Token_1.token)(Type_1.Type.COMMA, this.cc));
                this.next();
            }
            else if (/[//]/.test(this.cc)) {
                this.next();
                while (this.cc !== '\n') {
                    this.next();
                }
            }
            else if (this.cc == '+' || this.cc == '-' || this.cc == '*' || this.cc == '/' || this.cc == '%' || this.cc == '^') {
                tokens.push((0, Token_1.token)(Type_1.Type.BinOP, this.cc));
                this.next();
            }
            else if (this.cc == '=') {
                tokens.push((0, Token_1.token)(Type_1.Type.Equals, this.cc));
                this.next();
            }
            else if (this.cc == ';') {
                tokens.push((0, Token_1.token)(Type_1.Type.SEMICOL, this.cc));
                this.next();
            }
            else {
                // Multiple character tokens
                if ((0, helpers_1.isNumber)(this.cc) || this.cc === '.') {
                    let numStr = '';
                    let dotCount = 0;
                    while ((0, helpers_1.isNumber)(this.cc) || this.cc == '.') {
                        if (this.cc == '.') {
                            if (dotCount == 1) {
                                break;
                            }
                            dotCount += 1;
                            numStr += '.';
                            this.next();
                        }
                        numStr += this.cc;
                        this.next();
                    }
                    if (dotCount == 0) {
                        tokens.push((0, Token_1.token)(Type_1.Type.INT, parseInt(numStr)));
                    }
                    else {
                        tokens.push((0, Token_1.token)(Type_1.Type.FLOAT, parseFloat(numStr)));
                    }
                }
                else if ((0, helpers_1.isAlpha)(this.cc)) {
                    let identifier = '';
                    while ((0, helpers_1.isAlpha)(this.cc)) {
                        identifier += this.cc;
                        this.next();
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
                    console.log("Unrecognized token " + this.cc + " found.");
                    (0, process_1.exit)(1);
                }
            }
        }
        tokens.push({ tokenType: Type_1.Type.EOF, value: "EOF" });
        return tokens;
    }
}
exports.Lexer = Lexer;
