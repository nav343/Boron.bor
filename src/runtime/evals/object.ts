import { Object } from "../../frontend/ast";
import Environment from "../env";
import { evaluate } from "../interpreter";
import { ObjectValue, RuntimeValues } from "../value";

export function evalObjectExpr(
  obj: Object,
  env: Environment,
): RuntimeValues {
  const object = {
    type: 'object',
    properties: new Map()
  } as ObjectValue;

  for (const { key, value } of obj.property) {
    const runtimeVal = (value == undefined)
      ? env.loopupVar(key)
      : evaluate(value, env);

    object.properties.set(key, runtimeVal);
  }
  return object
}
