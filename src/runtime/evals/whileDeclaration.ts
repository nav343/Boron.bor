import { WhileDeclaration } from "../../frontend/ast";
import Environment from "../env";
import { evaluate } from "../interpreter";
import { MKNULL, NumberValue, RuntimeValues } from "../value";

export function evalWhileDeclaration(astNode: WhileDeclaration, env: Environment): RuntimeValues {
  let res: RuntimeValues = { type: 'null' }
  while (true) {
    const val1 = astNode.valueOne.tokenType === 0 ? (env.loopupVar(astNode.valueOne.value) as NumberValue).value : astNode.valueOne.value
    const val2 = astNode.valueTwo.tokenType === 0 ? env.loopupVar(astNode.valueTwo.value) : astNode.valueTwo.value
    let condition = eval(`${val1} ${astNode.op} ${val2}`)
    if (condition) {
      astNode.body.forEach((body) => {
        evaluate(body, env)
      })
    } else { break }
  }
  return res
}
