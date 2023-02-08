import { exit } from "process"
import { MKNATIVEFN, MKNULL, MKSTRING, RuntimeValues } from "./value"
import { MKBOOL, MKNUMBER } from "../runtime/value";
import { writeFileSync } from "fs";

export function createGlobalScope() {
  const env = new Environment()

  env.declareVariable('PI', MKNUMBER(3.14159265359), true)
  env.declareVariable('true', MKBOOL(true), true)
  env.declareVariable('false', MKBOOL(false), true)

  // Native functions like writeFile, print, time etc
  env.declareVariable('print', MKNATIVEFN((args) => {
    args.map((result: any) => {
      switch (result.type) {
        case 'object': console.log(result.properties)
        case 'null': console.log("null")
        case 'number': console.log(result.value)
        case 'string': console.log(result.value)
      }
    })
    return MKNULL()
  }), true)

  env.declareVariable('writeFile', MKNATIVEFN((args: any[]) => {
    if (args.length > 2) {
      console.log(`Expected 2 arguments but got ${args.length}`)
      exit(1)
    }
    writeFileSync(`${args[0].value}`, `${args[1].value}`)
    return MKNULL()
  }), true)

  env.declareVariable('TIME', MKNATIVEFN(() => {
    const date = new Date()
    const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    return MKSTRING(time)
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
      throw `Cannot redeclare variable ${varName}.\nTry using another name or remove the existing variable`
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
      throw `Cannot assign to a constant variable ${varName}`
    }

    env.variables.set(varName, value)
    return value
  }

  public resolve(varName: string): Environment {
    if (this.variables.has(varName)) {
      return this
    }
    if (this.parent === undefined) {
      console.log(`Cannot resolve ${varName} because it does not exist.`)
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
