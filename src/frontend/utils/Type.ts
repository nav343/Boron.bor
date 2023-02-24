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
  ELSE,
  NULL,
  CONST,
  FUNC,
  WHILE,
  IMPORT,
  EXPORT,
  FROM,

  TRUE,
}

export const KEYWORDS: Record<string, Type> = {
  "let": Type.LET,
  "if": Type.IF,
  "else": Type.ELSE,
  "null": Type.NULL,
  "const": Type.CONST,
  "func": Type.FUNC,
  "while": Type.WHILE,
  "import": Type.IMPORT,
  "export": Type.EXPORT,
  "from": Type.FROM,
  "TRUE": Type.TRUE,
}
