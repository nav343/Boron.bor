import { readFileSync } from "fs";
import { FileError } from "../../error/noFileError";
import { Export, Import, Statement } from "../../frontend/ast";
import Parser from "../../frontend/parser";
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
  } catch (error) {
    new FileError(`Cannot read file as it does not exist or cannot import file due to an unknown error !.`, astNode._package)
  }
  return { type: 'null' }
}
