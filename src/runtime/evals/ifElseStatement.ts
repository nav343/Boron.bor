import { IfStatement } from "../../frontend/ast";
import Environment from "../env";
import { evaluate } from "../interpreter";
import { MKNULL, RuntimeValues } from "../value";

export function evalIfStatement(astNode: IfStatement, env: Environment): RuntimeValues {
  if (astNode.condition === true) { astNode.body.forEach(statement => evaluate(statement, env), env) }
  return MKNULL()
}
