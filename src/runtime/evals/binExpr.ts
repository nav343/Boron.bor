import { SyntaxError } from "../../error/syntaxError"
import { BinExpr } from "../../frontend/ast"
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
    else { new SyntaxError(`Cannot divide or subtract a string from anything`, null) }
  }

  else if (leftHand.type === 'string' && rightHand.type === 'number' || expr.right.kind === 'Identifier') {
    const left = (leftHand as StringValue).value
    const right = rightHand.type === 'number' ? (rightHand as NumberValue).value : rightHand as any

    if (expr.op === '*') return MKSTRING(left.repeat(right))
    else { new SyntaxError(`Can only multiply with the left hand being a string and right hand being a number`, null) }
  }
  return MKNULL()
}
