export enum Type {
  IDENTIFIER,

  Equals,      // =
  SEMICOL,     // ;
  OPENPAR,     // (
  CLOSEPAR,    // )
  OPENCURLY,   // {
  CLOSECURLY,  // }
  OPENSQ,      // [
  CLOSESQ,     // ]
  COMMA,       // ;
  COLON,       // :
  DOT,         // .

  BinOP,
  ADD,
  SUB,
  MUL,
  DIV,
  POW,
  MOD,

  INT,
  FLOAT,
  STRING,

  EOF,

  // Keywords
  LET,
  IF,
  NULL,
  CONST,
  FUNC
}

export const KEYWORDS: Record<string, Type> = {
  "let": Type.LET,
  "if": Type.IF,
  "null": Type.NULL,
  "const": Type.CONST,
  "func": Type.FUNC
}
