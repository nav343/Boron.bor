import { IfStatement } from "../../frontend/ast";
import Environment from "../env";
import { evaluate } from "../interpreter";
import { MKBOOL, RuntimeValues } from "../value";

export function evalIfStatement(astNode: IfStatement, env: Environment): RuntimeValues {
  //const val1 = astNode.valueOne.tokenType === 0 ? (env.loopupVar(astNode.valueOne.value) as NumberValue).value : astNode.valueOne.value
  //const val2 = astNode.valueTwo.tokenType === 0 ? env.loopupVar(astNode.valueTwo.value) : astNode.valueTwo.value
  //const condition = eval(`${val1} ${astNode.op} ${val2}`)
  //if (condition === true) { astNode.body.forEach(statement => evaluate(statement, env)) }
  const val1 = (
    astNode.valueOne.tokenType === 0 ? (env.loopupVar(astNode.valueOne.value) as any).value :
      astNode.valueOne.tokenType === 22 ? String(astNode.valueOne.value) :
        astNode.valueOne.value
  )
  const val2 = (
    astNode.valueTwo.tokenType === 0 ? (env.loopupVar(astNode.valueTwo.value) as any).value :
      astNode.valueTwo.tokenType === 22 ? String(astNode.valueTwo.value) :
        astNode.valueTwo.value
  )
  const condition = eval(`${val1} ${astNode.op} ${val2}`)
  if (condition === true) { astNode.body.forEach(statement => evaluate(statement, env)); return MKBOOL(true) } else { return MKBOOL(false) }
}
