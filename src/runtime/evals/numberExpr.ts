import { NumberValue } from "../value"

export function evalNumberExpr(leftHand: NumberValue, rightHand: NumberValue, op: string): NumberValue {
  let result: number
  if (op === '+') {
    result = leftHand.value + rightHand.value
  } else if (op === '-') {
    result = leftHand.value - rightHand.value
  } else if (op === '*') {
    result = leftHand.value * rightHand.value
  } else if (op === '/') {
    result = leftHand.value / rightHand.value
  } else if (op === '%') {
    result = leftHand.value % rightHand.value
  } else {
    result = leftHand.value ** rightHand.value
  }
  return { type: 'number', value: result }
}
