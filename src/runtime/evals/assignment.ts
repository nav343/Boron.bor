import { AssignmentExpr, Identifier } from "../../frontend/ast";
import Environment from "../env";
import { evaluate } from "../interpreter";
import { RuntimeValues } from "../value";

export function evalAssignmentExpr(node: AssignmentExpr, env: Environment): RuntimeValues {
  if (node.assign.kind != 'Identifier') {
    new SyntaxError(`Cannot assign to variable with Left hand being ${node.assign.kind}`)
  }

  const varName = (node.assign as Identifier).symbol
  return env.assignVariable(varName, evaluate(node.value, env))
}
