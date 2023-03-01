import { exit } from "process"
import { BinExpr } from "../../frontend/ast"
import { BOLD, RED, RESET } from "../../frontend/utils/colors"
import Environment from "../env"
import { evaluate } from "../interpreter"
import { MKNULL, MKSTRING, NumberValue, RuntimeValues, StringValue } from "../value"
import { evalNumberExpr } from "./numberExpr"

export function evalBinExpr(expr: BinExpr, env: Environment): RuntimeValues {
  const leftHand = evaluate(expr.left, env)
  const rightHand = evaluate(expr.right, env)
  if (leftHand.type === 'number' && rightHand.type === 'number') {
    return evalNumberExpr(
      leftHand as NumberValue,
      rightHand as NumberValue,
      expr.op
    )
  }
  else if (leftHand.type === 'string' && rightHand.type === 'string') {
    const left = (leftHand as StringValue).value
    const right = (rightHand as StringValue).value

    if (expr.op === '+') return MKSTRING(left + right)
    else { console.log(RED + BOLD + `Cannot subtract or divide a string from anything ` + RESET); exit(1) }
  }

  else if (leftHand.type === 'string' && rightHand.type === 'number' || expr.right.kind === 'Identifier') {
    const left = (leftHand as StringValue).value
    const right = rightHand.type === 'number' ? (rightHand as NumberValue).value : rightHand as any

    if (expr.op === '*') return MKSTRING(left.repeat(right))
    else { console.log(RED + BOLD + `Can only multiply with the left hand being a string and right hand being a number` + RESET); exit(1) }
  }
  return MKNULL()
}
