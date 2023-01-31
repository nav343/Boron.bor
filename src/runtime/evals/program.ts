import { Program } from "../../frontend/ast"
import Environment from "../env"
import { evaluate } from "../interpreter"
import { MKNULL, RuntimeValues } from "../value"

export function evalProgram(program: Program, env: Environment): RuntimeValues {
  let lastEval: RuntimeValues = MKNULL()

  for (const statement of program.body) {
    lastEval = evaluate(statement, env)
  }

  return lastEval
}


