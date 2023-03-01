import { ElseStatement, IfStatement } from "../../frontend/ast";
import Environment from "../env";
import { evaluate } from "../interpreter";
import { MKBOOL, MKNULL, RuntimeValues } from "../value";

let ifValue: boolean = false;
export function evalIfStatement(astNode: IfStatement, env: Environment): RuntimeValues {
  const val1 = (
    astNode.valueOne.tokenType === 0 ? (env.loopupVar(astNode.valueOne.value) as any).value === undefined ? env.loopupVar(astNode.valueOne.value) : (env.loopupVar(astNode.valueOne.value) as any).value :
      astNode.valueOne.tokenType === 22 || astNode.valueOne.tokenType == 23 ? String(astNode.valueOne.value) :
        astNode.valueOne.value
  )

  const val2 = (
    astNode.valueTwo.tokenType === 0 ? (env.loopupVar(astNode.valueTwo.value) as any).value === undefined ? env.loopupVar(astNode.valueTwo.value) : (env.loopupVar(astNode.valueTwo.value) as any).value :
      astNode.valueTwo.tokenType === 22 || astNode.valueOne.tokenType == 23 ? String(astNode.valueTwo.value) :
        astNode.valueTwo.value
  )
  switch (astNode.op) {
    case '==':
      if (val1 == val2) { ifValue = true; astNode.body.forEach(statement => evaluate(statement, env)); return MKBOOL(true) } else { return MKBOOL(false) }
    case '<=':
      if (val1 <= val2) { ifValue = true; astNode.body.forEach(statement => evaluate(statement, env)); return MKBOOL(true) } else { return MKBOOL(false) }
    case '>=':
      if (val1 >= val2) { ifValue = true; astNode.body.forEach(statement => evaluate(statement, env)); return MKBOOL(true) } else { return MKBOOL(false) }
    case '!=':
      if (val1 !== val2) { ifValue = true; astNode.body.forEach(statement => evaluate(statement, env)); return MKBOOL(true) } else { return MKBOOL(false) }
    default:
      return MKNULL()
  }
}


export function evalElseStatement(astNode: ElseStatement, env: Environment): RuntimeValues {
  if (ifValue === false) {
    astNode.body.map(statement => evaluate(statement, env)); return MKNULL()
  } else {
    return MKNULL()
  }
}
