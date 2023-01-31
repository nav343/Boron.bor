"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KEYWORDS = exports.Type = void 0;
var Type;
(function (Type) {
    Type[Type["IDENTIFIER"] = 0] = "IDENTIFIER";
    Type[Type["Equals"] = 1] = "Equals";
    Type[Type["SEMICOL"] = 2] = "SEMICOL";
    Type[Type["OPENPAR"] = 3] = "OPENPAR";
    Type[Type["CLOSEPAR"] = 4] = "CLOSEPAR";
    Type[Type["OPENCURLY"] = 5] = "OPENCURLY";
    Type[Type["CLOSECURLY"] = 6] = "CLOSECURLY";
    Type[Type["OPENSQ"] = 7] = "OPENSQ";
    Type[Type["CLOSESQ"] = 8] = "CLOSESQ";
    Type[Type["COMMA"] = 9] = "COMMA";
    Type[Type["COLON"] = 10] = "COLON";
    Type[Type["DOT"] = 11] = "DOT";
    Type[Type["BinOP"] = 12] = "BinOP";
    Type[Type["ADD"] = 13] = "ADD";
    Type[Type["SUB"] = 14] = "SUB";
    Type[Type["MUL"] = 15] = "MUL";
    Type[Type["DIV"] = 16] = "DIV";
    Type[Type["POW"] = 17] = "POW";
    Type[Type["MOD"] = 18] = "MOD";
    Type[Type["INT"] = 19] = "INT";
    Type[Type["FLOAT"] = 20] = "FLOAT";
    Type[Type["STRING"] = 21] = "STRING";
    Type[Type["EOF"] = 22] = "EOF";
    // Keywords
    Type[Type["LET"] = 23] = "LET";
    Type[Type["IF"] = 24] = "IF";
    Type[Type["NULL"] = 25] = "NULL";
    Type[Type["CONST"] = 26] = "CONST";
    Type[Type["FUNC"] = 27] = "FUNC";
})(Type = exports.Type || (exports.Type = {}));
exports.KEYWORDS = {
    "let": Type.LET,
    "if": Type.IF,
    "null": Type.NULL,
    "const": Type.CONST,
    "func": Type.FUNC
};
