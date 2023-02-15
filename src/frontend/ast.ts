export type NodeType = "Program"
  | "BinExpr"
  | "Identifier"

  | "VariableDeclaration"
  | "FunctionDeclaration"
  | "WhileDeclaration"
  | "IfStatement"
  | "ElseStatement"
  | "AssignmentExpr"
  | "FunctionCall"
  | "CallExpr"
  | "MemberExpr"

  | "Object"
  | "Property"

  | "Int"
  | "Float"
  | "String"

  | "Let"
  | "Const"
  | "Null"
  | "While"
  | "Export"
  | "Import"

// Statements and Program
export interface Statement {
  kind: NodeType
}
export interface Program extends Statement {
  kind: "Program",
  body: Statement[]
}

export interface VariableDeclaration extends Statement {
  kind: "VariableDeclaration",
  constant: boolean
  identifier: string
  value?: Expr
}
export interface FunctionDeclaration extends Statement {
  kind: "FunctionDeclaration",
  params: string[],
  name: string,
  body: Statement[]
}
export interface WhileDeclaration extends Statement {
  kind: "WhileDeclaration",
  condition: boolean
  body: Statement[]
}
export interface IfStatement extends Statement {
  kind: "IfStatement",
  condition: boolean
  body: Statement[]
}
export interface Export extends Statement {
  kind: "Export",
  name: string,
}
export interface Import extends Statement {
  kind: "Import",
  _package: string,
}


// Expressions
export interface Expr extends Statement { }
export interface BinExpr extends Expr {
  kind: "BinExpr"
  left: Expr
  op: string
  right: Expr
}

// Identifiers
export interface Identifier extends Expr {
  kind: "Identifier"
  symbol: string
}

// Assignment Expressions
export interface AssignmentExpr extends Expr {
  kind: "AssignmentExpr"
  assign: Expr
  value: Expr
}



// Keywords
export interface Let extends Expr {
  kind: "Let"
  keyword: string
}

export interface Const extends Expr {
  kind: "Const"
  keyword: string
}

export interface Null extends Expr {
  kind: "Null"
  keyword: string
}

export interface While extends Expr {
  kind: "While"
  keyword: string
}


// Numbers
export interface Int extends Expr {
  kind: "Int"
  value: number
}
export interface Float extends Expr {
  kind: "Float"
  value: number
}
export interface String extends Expr {
  kind: "String"
  value: string
}

// Literals
export interface Property extends Expr {
  kind: "Property"
  key: string,
  value?: Expr
}
export interface Object extends Expr {
  kind: "Object"
  property: Property[]
}

// Members
export interface MemberExpr extends Expr {
  kind: "MemberExpr"
  object: Expr
  property: Expr
  computed: boolean
}
export interface CallExpr extends Expr {
  kind: "CallExpr"
  args: Expr[]
  caller: Expr
}
