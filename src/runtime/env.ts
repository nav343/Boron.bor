import { exit } from "process"
import { MKNATIVEFN, MKNATIVEOBJ, MKNULL, MKSTRING, RuntimeValues, StringValue } from "./value"
import { MKBOOL, MKNUMBER } from "../runtime/value";
import { readFileSync, writeFileSync } from "fs";
import { BOLD, RED, RESET, YELLOW } from "../frontend/utils/colors";
const prompt = require("prompt-sync")()

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
      else if (result.type === 'boolean') console.log(result.value)
      else if (result.type === 'number' || result.type === 'float') console.log(result.value)
      else if (result.type === 'string') {
        if (result.value === '' || result.value === ' ') { return }
        else {
          console.log(result.value)
        }
      }
      else console.log(result)
    })
    return MKNULL()
  }), true)

  env.declareVariable('typeof', MKNATIVEFN((args) => {
    const obj: any = []
    if (args.length == 0) { console.log(RED + BOLD + "Expected 1 value" + RESET); exit(1) }
    args.map(res => {
      obj.push(res.type)
    })
    return obj.join(' ')
  }), true)

  // Input function and hidden input function
  env.declareVariable("input", MKNATIVEFN((args) => {
    if (args.length != 1) { console.log(RED + BOLD + `Expected ${YELLOW + BOLD + "ONE" + RESET + RED + BOLD} argument, but got ${YELLOW + BOLD + args.length}` + RESET); exit(1) }
    //const res = prompt((args[0] as any).value) as StringValue
    //return res
    const res: any = prompt((args[0] as StringValue).value);
    return res
  }), true)
  env.declareVariable("getPass", MKNATIVEFN((args) => {
    if (args.length != 2) { console.log(RED + BOLD + `Expected ${YELLOW + BOLD + "TWO" + RESET + RED + BOLD} argument, but got ${YELLOW + BOLD + args.length}` + RESET); exit(1) }
    const msg = (args[0] as StringValue).value
    const replaceSymbol = (args[1] as StringValue).value
    const res = prompt(msg, { echo: replaceSymbol === '' ? '*' : replaceSymbol })
    return res as any
  }), true)

  const testProp = new Map<string, RuntimeValues>().set("hi", MKSTRING("hello"))
  env.declareVariable('thread', MKNATIVEOBJ({
    type: 'object',
    properties: new Map<string, RuntimeValues>()
      .set("pwd", MKSTRING(process.cwd()))
      .set("test", MKNATIVEOBJ({
        type: 'object',
        properties: testProp
      }))
  }), true)

  // Just for fun, you can override this function
  env.declareVariable('aMagicFunction', MKNATIVEFN(() => {
    console.log("U called me?")
    let stars = '*'
    while (stars.length < 1000) {
      stars += '!'
      stars += '*'
      console.log(RED + BOLD + stars + RESET)
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
    try {
      const contents = readFileSync(args[0].value, { encoding: 'utf8' }).toString()
      return MKSTRING(contents)
    } catch (error: any) {
      function cwd(): string {
        const currentWorkingDir = process.cwd()
        if (currentWorkingDir.length > 10) {
          return '...' + currentWorkingDir.split(currentWorkingDir.charAt(10))[1]
        } else { return currentWorkingDir }
      }
      if (error.errno === -2) {
        console.log(RED + BOLD + `${YELLOW + args[0].value + RESET + RED + BOLD} does not exist in ${YELLOW + cwd() + RED + BOLD}` + RESET)
      }
      return MKSTRING()
    }
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
