import { BinExpr } from "../../frontend/ast";
import Environment from "../env";
import { RuntimeValues } from "../value";
export declare function evalBinExpr(expr: BinExpr, env: Environment): RuntimeValues;
