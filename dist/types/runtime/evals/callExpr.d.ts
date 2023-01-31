import { CallExpr } from "../../frontend/ast";
import Environment from "../env";
import { RuntimeValues } from "../value";
export declare function evalCallExpr(expr: CallExpr, env: Environment): RuntimeValues;
