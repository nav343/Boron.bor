import { exit } from "process"
import { BOLD, RED, RESET, YELLOW } from "../frontend/utils/colors";
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
      console.log(RED + `Cannot redeclare variable ${YELLOW + BOLD + varName + RESET}.\n${YELLOW + BOLD}Try using another name or remove the existing variable` + RESET)
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
      console.log(RED + BOLD + `Cannot assign to a constant variable ${YELLOW + varName}` + RESET)
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
      console.log(RED + BOLD + `Cannot resolve ${YELLOW + varName + RED} because it does not exist.` + RESET)
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
