import { FunctionDeclaration } from "../../frontend/ast";
import Environment from "../env";
import { RuntimeValues } from "../value";
export declare function evalFuncDeclaration(decl: FunctionDeclaration, env: Environment): RuntimeValues;
