import { IfStatement } from "../../frontend/ast";
import { IfValue, RuntimeValues } from "../value";

export function evalIfStatement(astNode: IfStatement): RuntimeValues {
  const IF = {
    body: astNode.body,
    condition: astNode.condition
  } as IfValue
  return IF
}
