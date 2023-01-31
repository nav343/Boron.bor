import { VariableDeclaration } from "../../frontend/ast";
import Environment from "../env";
import { RuntimeValues } from "../value";
export declare function evalVarDeclaration(declaration: VariableDeclaration, env: Environment): RuntimeValues;
