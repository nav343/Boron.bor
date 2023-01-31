import { FunctionDeclaration } from "../../frontend/ast";
import Environment from "../env";
import { FunctionValue, RuntimeValues } from "../value";

export function evalFuncDeclaration(decl: FunctionDeclaration, env: Environment): RuntimeValues {
  const fn = {
    type: 'function',
    name: decl.name,
    body: decl.body,
    params: decl.params,
    declarationEnv: env
  } as FunctionValue

  return env.declareVariable(decl.name, fn, true)
}
