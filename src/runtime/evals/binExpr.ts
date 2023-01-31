import { BinExpr } from "../../frontend/ast"
import Environment from "../env"
import { evaluate } from "../interpreter"
import { MKNULL, NumberValue, RuntimeValues } from "../value"
import { evalNumberExpr } from "./numberExpr"

export function evalBinExpr(expr: BinExpr, env: Environment): RuntimeValues {
  const leftHand = evaluate(expr.left, env)
  const rightHand = evaluate(expr.right, env)
  if (leftHand.type === 'number' || rightHand.type === 'number') {
    return evalNumberExpr(
      leftHand as NumberValue,
      rightHand as NumberValue,
      expr.op
    )
  }
  return MKNULL()
}
