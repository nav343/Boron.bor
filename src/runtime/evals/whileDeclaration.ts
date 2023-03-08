import { WhileDeclaration } from "../../frontend/ast";
import Environment from "../env";
import { evaluate } from "../interpreter";
import { RuntimeValues } from "../value";

export function evalWhileDeclaration(astNode: WhileDeclaration, env: Environment): RuntimeValues {
  let res: RuntimeValues = { type: 'null' }
  while (true) {
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
    let condition
    if (astNode.op == '==') condition = val1 == val2
    else if (astNode.op == '!=') condition = val1 != val2
    else if (astNode.op == '<=') condition = val1 <= val2
    else if (astNode.op == '>=') condition = val1 >= val2

    if (condition) {
      astNode.body.forEach((body) => {
        evaluate(body, env)
      })
    } else { break }
  }
  return res
}
