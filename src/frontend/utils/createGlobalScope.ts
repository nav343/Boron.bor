import { MKNATIVEFN, MKNATIVEOBJ, MKNULL, MKSTRING, NumberValue, RuntimeValues, StringValue } from '../../runtime/value'
import { MKBOOL, MKNUMBER } from "../../runtime/value";
import { readFileSync, writeFileSync } from "fs";
import Environment from '../../runtime/env';
import { exit } from "process"
import { BOLD, RED, RESET, YELLOW } from "./colors";
const prompt = require("prompt-sync")()

export function createGlobalScope() {
  const env = new Environment()

  env.declareVariable('PI', MKNUMBER(3.14159265359), true)
  env.declareVariable('true', MKBOOL(true), true)
  env.declareVariable('false', MKBOOL(false), true)

  // Native functions like writeFile, print, time etc
  env.declareVariable('exit', MKNATIVEFN((args) => {
    if (args[0] == undefined) { process.exit(0) }
    const id = (args[0] as NumberValue).value
    if (args.length > 1) {
      console.log(RED + BOLD + `Expected 1 argument but got ${YELLOW + BOLD + args.length} -> [${args.map(val => (val as StringValue).value).join(' - ')}]` + RESET)
      exit(1)
    }
    if (id === 1 || id === 0) { process.exit(id) }
    else {
      console.log(RED + BOLD + `Expected 0 or 1 but got ${YELLOW + BOLD + id + RESET}` + RESET)
      exit(1)
    }
  }), true)
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
    const res = prompt((args[0] as StringValue).value);
    return MKSTRING(res)
  }), true)
  env.declareVariable("getPass", MKNATIVEFN((args) => {
    if (args.length != 2) { console.log(RED + BOLD + `Expected ${YELLOW + BOLD + "TWO" + RESET + RED + BOLD} argument, but got ${YELLOW + BOLD + args.length}` + RESET); exit(1) }
    const msg = (args[0] as StringValue).value
    const replaceSymbol = (args[1] as StringValue).value
    const res = prompt(msg, { echo: replaceSymbol === '' ? '*' : replaceSymbol })
    return MKSTRING(res)
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
