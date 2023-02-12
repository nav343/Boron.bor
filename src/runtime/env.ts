import { exit } from "process"
import { MKNATIVEFN, MKNULL, MKSTRING, RuntimeValues } from "./value"
import { MKBOOL, MKNUMBER } from "../runtime/value";
import { readFileSync, writeFileSync } from "fs";
import { BOLD, RED, RESET, YELLOW } from "../frontend/utils/colors";

export function createGlobalScope() {
  const env = new Environment()

  env.declareVariable('PI', MKNUMBER(3.14159265359), true)
  env.declareVariable('true', MKBOOL(true), true)
  env.declareVariable('false', MKBOOL(false), true)

  // Native functions like writeFile, print, time etc
  env.declareVariable('print', MKNATIVEFN((args) => {
    args.map((result: any) => {
      if (result.type === "object") console.log(result.properties)
      else if (result.type === 'null') console.log(null)
      else if (result.type === 'number') console.log(result.value)
      else if (result.type === 'string') console.log(result.value)
      else console.log(result)
    })
    return MKNULL()
  }), true)

  // Just for fun, you can override this function
  env.declareVariable('aMagicFunction', MKNATIVEFN(() => {
    console.log("U called me?")
    let stars = '*'
    while (stars.length < 10000) {
      stars += '*'
      console.log(RED + BOLD + stars + RESET)
      console.log(stars.length)
    }
    return MKNULL()
  }), false)

  env.declareVariable('writeFile', MKNATIVEFN((args: any[]) => {
    if (args.length > 2 || args.length < 2) {
      console.log(RED + BOLD + `Expected 2 arguments but got ${YELLOW + args.length + RESET + RED}` + RESET)
      exit(1)
    } else {
      writeFileSync(`${args[0].value}`, `${args[1].value}`)
    }
    return MKNULL()
  }), true)
  env.declareVariable('readFile', MKNATIVEFN((args: any[]) => {
    if (args.length != 1) {
      console.log(RED + BOLD + `Expected 1 arguments but got ${YELLOW + args.length + RESET + RED}` + RESET)
      exit(1)
    }
    const contents = readFileSync(args[0].value, { encoding: 'utf8' }).toString()
    return MKSTRING(contents)
  }), true)

  env.declareVariable('TIME', MKNATIVEFN(() => {
    const date = new Date()
    const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    return MKSTRING(time)
  }), true)

  env.declareVariable('clearScr', MKNATIVEFN(() => {
    console.clear()
    return MKNULL()
  }), true)


  return env
}

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
