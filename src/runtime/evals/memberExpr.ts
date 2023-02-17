import { Identifier, MemberExpr } from "../../frontend/ast";
import Environment from "../env";
import { ObjectValue, RuntimeValues } from "../value";

export function evalMemberExpr(astNode: MemberExpr, env: Environment): RuntimeValues {
  const obj = env.loopupVar((astNode.object as Identifier).symbol)
  const varName = (astNode.property as Identifier).symbol
  const res: any = ((obj as ObjectValue).properties.get(varName) as any).value
  return res
}
