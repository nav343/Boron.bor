import { IfStatement } from "../../frontend/ast";
import Environment from "../env";
import { evaluate } from "../interpreter";
import { MKNULL, NumberValue, RuntimeValues } from "../value";

export function evalIfStatement(astNode: IfStatement, env: Environment): RuntimeValues {
  const val1 = astNode.valueOne.tokenType === 0 ? (env.loopupVar(astNode.valueOne.value) as NumberValue).value : astNode.valueOne.value
  const val2 = astNode.valueTwo.tokenType === 0 ? env.loopupVar(astNode.valueTwo.value) : astNode.valueTwo.value
  const condition = eval(`${val1} ${astNode.op} ${val2}`)
  if (condition === true) { astNode.body.forEach(statement => evaluate(statement, env)) }
  return MKNULL()
}
