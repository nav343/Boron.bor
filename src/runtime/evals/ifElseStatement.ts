import { IfStatement } from "../../frontend/ast";
import Environment from "../env";
import { evaluate } from "../interpreter";
import { MKNULL, ObjectValue, RuntimeValues } from "../value";

export function evalIfStatement(astNode: IfStatement, env: Environment): RuntimeValues {
  console.log((env.loopupVar('a') as ObjectValue).properties.get("name"))
  if (astNode.condition === true) { astNode.body.forEach(statement => evaluate(statement, env)) }
  return MKNULL()
}
