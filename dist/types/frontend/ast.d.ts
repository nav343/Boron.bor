export declare type NodeType = "Program" | "BinExpr" | "Identifier" | "VariableDeclaration" | "FunctionDeclaration" | "AssignmentExpr" | "FunctionCall" | "CallExpr" | "MemberExpr" | "Object" | "Property" | "Int" | "Float" | "String" | "Let" | "Const" | "Null";
export interface Statement {
    kind: NodeType;
}
export interface Program extends Statement {
    kind: "Program";
    body: Statement[];
}
export interface VariableDeclaration extends Statement {
    kind: "VariableDeclaration";
    constant: boolean;
    identifier: string;
    value?: Expr;
}
export interface FunctionDeclaration extends Statement {
    kind: "FunctionDeclaration";
    params: string[];
    name: string;
    body: Statement[];
}
export interface Expr extends Statement {
}
export interface BinExpr extends Expr {
    kind: "BinExpr";
    left: Expr;
    op: string;
    right: Expr;
}
export interface Identifier extends Expr {
    kind: "Identifier";
    symbol: string;
}
export interface AssignmentExpr extends Expr {
    kind: "AssignmentExpr";
    assign: Expr;
    value: Expr;
}
export interface Let extends Expr {
    kind: "Let";
    keyword: string;
}
export interface Const extends Expr {
    kind: "Const";
    keyword: string;
}
export interface Null extends Expr {
    kind: "Null";
    keyword: string;
}
export interface Int extends Expr {
    kind: "Int";
    value: number;
}
export interface Float extends Expr {
    kind: "Float";
    value: number;
}
export interface String extends Expr {
    kind: "String";
    value: string;
}
export interface Property extends Expr {
    kind: "Property";
    key: string;
    value?: Expr;
}
export interface Object extends Expr {
    kind: "Object";
    property: Property[];
}
export interface MemberExpr extends Expr {
    kind: "MemberExpr";
    object: Expr;
    property: Expr;
    computed: boolean;
}
export interface CallExpr extends Expr {
    kind: "CallExpr";
    args: Expr[];
    caller: Expr;
}
