"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("process");
const lexer_1 = require("./lexer");
const Type_1 = require("./utils/Type");
class Parser {
    tokens = [];
    notEof() {
        return this.tokens[0].tokenType != Type_1.Type.EOF;
    }
    expect(type, error) {
        const previous = this.tokens.shift();
        if (!previous || previous.tokenType != type) {
            console.error("Parser Error\n", error, this.at(), "Expecting: ", type);
            (0, process_1.exit)(1);
        }
        return previous;
    }
    advance() {
        const previousToken = this.tokens.shift();
        return previousToken;
    }
    genAst(code) {
        this.tokens = (0, lexer_1.tokenize)(code);
        const program = {
            kind: "Program",
            body: []
        };
        while (this.notEof()) {
            program.body.push(this.parseStatement());
        }
        return program;
    }
    at() {
        return this.tokens[0];
    }
    parseStatement() {
        switch (this.at().tokenType) {
            case Type_1.Type.LET:
                return this.parseVarDeclaration();
            case Type_1.Type.CONST:
                return this.parseVarDeclaration();
            case Type_1.Type.FUNC:
                return this.parseFuncDeclaration();
            default:
                return this.parseExpr();
        }
    }
    parseFuncDeclaration() {
        this.advance();
        const name = this.expect(Type_1.Type.IDENTIFIER, "Expected an identifier after a func keyword, but got: ").value;
        const args = this.parseArgs();
        const params = [];
        for (const arg of args) {
            if (arg.kind !== 'Identifier') {
                console.log('Expected a string argument inside a function.');
                break;
            }
            params.push(arg.symbol);
        }
        this.expect(Type_1.Type.OPENCURLY, `Expected a function body`);
        const body = [];
        while (this.at().tokenType != Type_1.Type.EOF && this.at().tokenType != Type_1.Type.CLOSECURLY) {
            body.push(this.parseStatement());
        }
        this.expect(Type_1.Type.CLOSECURLY, 'Expected a closing curly bracket "}" after the function body.');
        const func = {
            kind: 'FunctionDeclaration',
            params,
            body,
            name
        };
        return func;
    }
    // LET [IDENTIFIER] "=" [VALUE]
    parseVarDeclaration() {
        const isConstant = this.advance().tokenType === Type_1.Type.CONST;
        const identifier = this.expect(Type_1.Type.IDENTIFIER, "Expected an identifier after a let or a const keyword").value;
        if (this.at().tokenType === Type_1.Type.SEMICOL) {
            this.advance();
            if (isConstant) {
                throw `Must assign to constant values, no value provided for ${identifier}`;
            }
            return {
                kind: 'VariableDeclaration',
                identifier,
                constant: false,
                value: undefined
            };
        }
        this.expect(Type_1.Type.Equals, "Expected an equals after identifier");
        const declarations = {
            kind: 'VariableDeclaration',
            value: this.parseExpr(),
            constant: isConstant,
            identifier
        };
        this.expect(Type_1.Type.SEMICOL, "Expected a semicolon at the end of variable declaration. But got ");
        return declarations;
    }
    parseExpr() {
        return this.parseAssignmentExpr();
    }
    parseAssignmentExpr() {
        const left = this.parseObjectExpr();
        if (this.at().tokenType === Type_1.Type.Equals) {
            this.advance();
            const value = this.parseAssignmentExpr();
            return {
                kind: "AssignmentExpr",
                value,
                assign: left
            };
        }
        return left;
    }
    parseObjectExpr() {
        if (this.at().tokenType !== Type_1.Type.OPENCURLY) {
            return this.parseAddExpr();
        }
        this.advance();
        const property = new Array();
        while (this.notEof() && this.at().tokenType != Type_1.Type.CLOSECURLY) {
            const key = this.expect(Type_1.Type.IDENTIFIER, "Object literal key expected").value;
            if (this.at().tokenType === Type_1.Type.COMMA) {
                this.advance();
                property.push({ kind: 'Property', key });
                continue;
            }
            else if (this.at().tokenType === Type_1.Type.CLOSECURLY) {
                property.push({ kind: 'Property', key });
                continue;
            }
            this.expect(Type_1.Type.COLON, "Missing colon after a key");
            const value = this.parseExpr();
            property.push({ kind: "Property", value, key });
            if (this.at().tokenType != Type_1.Type.CLOSECURLY) {
                this.expect(Type_1.Type.COMMA, "Expected a comma or a curley bracket");
            }
        }
        this.expect(Type_1.Type.CLOSECURLY, "Object literal missing closing curly bracket. ");
        return { kind: "Object", property };
    }
    parseAddExpr() {
        let left = this.parseMulExpr();
        while (this.at().value === '+' || this.at().value === '-') {
            const op = this.advance().value;
            const right = this.parseMulExpr();
            left = {
                kind: "BinExpr",
                left,
                op,
                right,
            };
        }
        return left;
    }
    parseMulExpr() {
        let left = this.parseCallMemberExpr();
        while (this.at().value === '*' || this.at().value === '/' || this.at().value === '%' || this.at().value === '^') {
            const op = this.advance().value;
            const right = this.parseCallMemberExpr();
            left = {
                kind: "BinExpr",
                left,
                op,
                right,
            };
        }
        return left;
    }
    parseCallMemberExpr() {
        const member = this.parseMemberExpr();
        if (this.at().tokenType == Type_1.Type.OPENPAR) {
            return this.parseCallExpr(member);
        }
        return member;
    }
    parseCallExpr(caller) {
        let call_expr = {
            kind: "CallExpr",
            caller,
            args: this.parseArgs(),
        };
        if (this.at().tokenType == Type_1.Type.OPENPAR) {
            call_expr = this.parseCallExpr(call_expr);
        }
        return call_expr;
    }
    parseArgs() {
        this.expect(Type_1.Type.OPENPAR, "Expected open parenthesis");
        const args = this.at().tokenType == Type_1.Type.CLOSEPAR
            ? []
            : this.parseArgumentList();
        this.expect(Type_1.Type.CLOSEPAR, "Missing closing parenthesis inside arguments list");
        return args;
    }
    parseArgumentList() {
        const args = [this.parseAssignmentExpr()];
        while (this.at().tokenType == Type_1.Type.COMMA && this.advance()) {
            args.push(this.parseAssignmentExpr());
        }
        return args;
    }
    parseMemberExpr() {
        let object = this.parsePrimaryExpr();
        while (this.at().tokenType == Type_1.Type.DOT || this.at().tokenType == Type_1.Type.OPENSQ) {
            const operator = this.advance();
            let property;
            let computed;
            // non-computed values aka obj.expr
            if (operator.tokenType == Type_1.Type.DOT) {
                computed = false;
                // get identifier
                property = this.parsePrimaryExpr();
                if (property.kind != "Identifier") {
                    throw `Cannonot use dot operator without right hand side being a identifier`;
                }
            }
            else { // this allows obj[computedValue]
                computed = true;
                property = this.parseExpr();
                this.expect(Type_1.Type.CLOSESQ, "Missing closing bracket in computed value.");
            }
            object = {
                kind: "MemberExpr",
                object,
                property,
                computed,
            };
        }
        return object;
    }
    parsePrimaryExpr() {
        const tk = this.at().tokenType;
        switch (tk) {
            case Type_1.Type.IDENTIFIER:
                return { kind: "Identifier", symbol: this.advance().value };
            // Numbers
            case Type_1.Type.INT:
                return {
                    kind: "Int",
                    value: parseInt(this.advance().value)
                };
            case Type_1.Type.FLOAT:
                return {
                    kind: "Float",
                    value: parseFloat(this.advance().value)
                };
            case Type_1.Type.STRING:
                return {
                    kind: "String",
                    value: String(this.advance().value)
                };
            case Type_1.Type.OPENPAR: {
                this.advance();
                const value = this.parseExpr();
                this.expect(Type_1.Type.CLOSEPAR, "Unexpected token found inside brackets. Expected closing parenthesis");
                return value;
            }
            // Keywords
            case Type_1.Type.LET:
                return { kind: "Let", keyword: this.advance().value };
            case Type_1.Type.CONST:
                return { kind: "Const", keyword: this.advance().value };
            case Type_1.Type.NULL: {
                this.advance();
                return { kind: 'Null', keyword: 'null' };
            }
            default:
                const errChar = JSON.stringify(this.at(), null, '  ');
                console.log(`Unexpected token ${errChar} found while parsing.`);
                (0, process_1.exit)(1);
        }
    }
}
exports.default = Parser;
