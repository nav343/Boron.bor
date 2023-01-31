import { CallExpr, Identifier } from "../../frontend/ast";
import Environment from "../env";
import { evaluate } from "../interpreter";
import { FunctionValue, MKNULL, NativeFnValue, RuntimeValues } from "../value";

export function evalCallExpr(expr: CallExpr, env: Environment): RuntimeValues {
  const args = expr.args.map((arg) => evaluate(arg, env))
  const fn = evaluate(expr.caller, env)
  if (fn.type == 'nativeFn') {
    const res = (fn as NativeFnValue).call(args, env)
    return res
  }

  if (fn.type == "function") {
    const func = fn as FunctionValue;
    const scope = new Environment(func.declarationEnv);

    for (let i = 0; i < func.params.length; i++) {
      const varname = func.params[i];
      scope.declareVariable(varname, args[i], false);
    }

    let result: RuntimeValues = MKNULL();
    for (const stmt of func.body) {
      result = evaluate(stmt, scope);
    }
    return result;
  }

  console.log(`Cannot call "${(expr.caller as Identifier).symbol}" as it is not a function.`)
  return { type: 'null' }
}
