import { readFileSync } from "fs";
import { Export, Import, Statement } from "../../frontend/ast";
import Parser from "../../frontend/parser";
import { BOLD, RED, RESET } from "../../frontend/utils/colors";
import Environment from "../env";
import { evaluate } from "../interpreter";
import { RuntimeValues } from "../value";

export function evalExportStatement(astNode: Export, packageEnv: Environment, mainEnv: Environment): RuntimeValues {
  return packageEnv.declareVariable(astNode.name, mainEnv.loopupVar(astNode.name), true)
}

export function evalImportStatement(astNode: Import, env: Environment): RuntimeValues {
  try {
    const contents = readFileSync(astNode._package, { encoding: 'utf8' })
    const code = new Parser(contents).genAst(contents)
    evaluate(code as Statement, env)
  } catch (error) { console.log(RED + BOLD + "Cannot read file as it does not exist or cannot import file due to an unknown error!" + RESET) }
  return { type: 'null' }
}
