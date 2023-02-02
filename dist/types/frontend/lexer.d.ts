import { Token } from "./utils/Token";
export declare class Lexer {
    code: string;
    private cc;
    private pos;
    constructor(code: string);
    private next;
    tokenize(): Token[];
}
