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
  BANG,        // !

  GR,          // >
  SR,          // <

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
  FUNC,
  WHILE,


  TRUE,
}

export const KEYWORDS: Record<string, Type> = {
  "let": Type.LET,
  "if": Type.IF,
  "null": Type.NULL,
  "const": Type.CONST,
  "func": Type.FUNC,
  "while": Type.WHILE,
  "TRUE": Type.TRUE,
}
