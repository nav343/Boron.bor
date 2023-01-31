import { AssignmentExpr } from "../../frontend/ast";
import Environment from "../env";
import { RuntimeValues } from "../value";
export declare function evalAssignmentExpr(node: AssignmentExpr, env: Environment): RuntimeValues;
