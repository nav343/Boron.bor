import { VariableDeclaration } from "../../frontend/ast";
import Environment from "../env";
import { evaluate } from "../interpreter";
import { MKNULL, RuntimeValues } from "../value";

export function evalVarDeclaration(declaration: VariableDeclaration, env: Environment): RuntimeValues {
  const value = declaration.value
    ? evaluate(declaration.value, env)
    : MKNULL()

  return env.declareVariable(
    declaration.identifier,
    value,
    declaration.constant
  )
}
