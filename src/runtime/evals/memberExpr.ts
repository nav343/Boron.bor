import { exit } from "process";
import { Identifier, MemberExpr } from "../../frontend/ast";
import { BOLD, RED, RESET, YELLOW } from "../../frontend/utils/colors";
import Environment from "../env";
import { ObjectValue, RuntimeValues } from "../value";

export function evalMemberExpr(astNode: MemberExpr, env: Environment): RuntimeValues {
  const obj: RuntimeValues = env.loopupVar((astNode.object as Identifier).symbol)
  const varName: string = (astNode.property as Identifier).symbol
  try {
    const res: any = ((obj as ObjectValue).properties.get(varName) as any).value
    return res
  } catch (err) {
    console.log(RED + BOLD + `${YELLOW + BOLD + varName + RESET + RED + BOLD} does not exist on property ${YELLOW + BOLD + (astNode.object as Identifier).symbol}` + RESET)
    exit(1)
  }
}
