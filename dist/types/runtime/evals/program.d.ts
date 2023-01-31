import { Program } from "../../frontend/ast";
import Environment from "../env";
import { RuntimeValues } from "../value";
export declare function evalProgram(program: Program, env: Environment): RuntimeValues;
