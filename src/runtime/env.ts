import { exit } from "process"
import { SyntaxError } from "../error/syntaxError";
import { VariableNotFound } from "../error/variableNotFound";
import { RuntimeValues } from "./value";

export default class Environment {
  private parent?: Environment
  private variables: Map<string, RuntimeValues>
  private constants: Set<string>

  constructor(parentEnv?: Environment) {
    this.parent = parentEnv
    this.variables = new Map()
    this.constants = new Set()
  }

  public loopupVar(varName: string): RuntimeValues {
    const env = this.resolve(varName)
    return env.variables.get(varName) as RuntimeValues
  }

  public declareVariable(varName: string, value: RuntimeValues, isConstant: boolean): RuntimeValues {
    if (this.variables.has(varName)) {
      new SyntaxError(`Cannot redeclare variable ${varName}. Try using another name or try removing the existing variable with the name "${varName}"`, null)
      exit(1)
    }
    this.variables.set(varName, value)
    if (isConstant) {
      this.constants.add(varName)
    }
    return value
  }

  public assignVariable(varName: string, value: RuntimeValues): RuntimeValues {
    const env = this.resolve(varName)
    if (env.constants.has(varName)) {
      new SyntaxError(`Cannot assign to a constant variable ${varName}`, null)
      exit(1)
    }

    env.variables.set(varName, value)
    return value
  }

  public resolve(varName: string): Environment {
    if (this.variables.has(varName)) {
      return this
    }
    if (this.parent === undefined) {
      new VariableNotFound(`Cannot resolve ${varName} as it does not exist or is out of scope.`, null)
      /*const col = this.code.indexOf(varName)
      let nice = ''
      for (let i = 0; i < col; i++) {
        nice += ' '
      }
      console.log(this.code)
      console.log(nice + '^')*/
      exit(1)
    }

    return this.parent.resolve(varName)
  }
}
