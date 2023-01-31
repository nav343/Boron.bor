import { Statement } from "../frontend/ast";
import Environment from "./env";
import { RuntimeValues } from "./value";
export declare function evaluate(astNode: Statement, env: Environment): RuntimeValues;
