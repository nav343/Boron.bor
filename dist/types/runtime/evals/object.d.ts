import { Object } from "../../frontend/ast";
import Environment from "../env";
import { RuntimeValues } from "../value";
export declare function evalObjectExpr(obj: Object, env: Environment): RuntimeValues;
