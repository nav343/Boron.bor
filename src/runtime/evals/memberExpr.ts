import { exit } from "process";
import { SyntaxError } from "../../error/syntaxError";
import { Identifier, MemberExpr } from "../../frontend/ast";
import Environment from "../env";
import { ObjectValue, RuntimeValues } from "../value";

export function evalMemberExpr(astNode: MemberExpr, env: Environment): RuntimeValues {
  const obj: RuntimeValues = env.loopupVar((astNode.object as Identifier).symbol)
  const varName: string = (astNode.property as Identifier).symbol
  try {
    const res: any = ((obj as ObjectValue).properties.get(varName) as any).value
    return res
  } catch (err) {
    new SyntaxError(`${varName} does not exit in object ${(astNode.object as Identifier).symbol}`, null)
    exit(1)
  }
}
