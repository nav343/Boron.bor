import { WhileDeclaration } from "../../frontend/ast";
import Environment from "../env";
import { evaluate } from "../interpreter";
import { RuntimeValues } from "../value";

export function evalWhileDeclaration(ast: WhileDeclaration, env: Environment): RuntimeValues {
  let res: RuntimeValues = { type: 'null' }
  while (ast.condition === true) {
    ast.body.forEach((body) => {
      res = evaluate(body, env)
    })
  }
  return res
}
