import { Program } from './ast';
export default class Parser {
    private tokens;
    private notEof;
    private expect;
    private advance;
    genAst(code: string): Program;
    private at;
    private parseStatement;
    private parseFuncDeclaration;
    private parseVarDeclaration;
    private parseExpr;
    private parseAssignmentExpr;
    private parseObjectExpr;
    private parseAddExpr;
    private parseMulExpr;
    private parseCallMemberExpr;
    private parseCallExpr;
    private parseArgs;
    private parseArgumentList;
    private parseMemberExpr;
    private parsePrimaryExpr;
}
