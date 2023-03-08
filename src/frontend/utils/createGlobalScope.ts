import { MKNATIVEFN, MKNATIVEOBJ, MKNULL, MKSTRING, NumberValue, ObjectValue, RuntimeValues, StringValue } from '../../runtime/value'
import { MKBOOL, MKNUMBER } from "../../runtime/value";
import { readFileSync, writeFileSync } from "fs";
import Environment from '../../runtime/env';
import { exit } from "process"
import { BOLD, RED, RESET, WHITE, YELLOW, GREEN } from "./colors";
import { SyntaxError } from '../../error/syntaxError';
//import { exec } from 'child_process';
const prompt = require("prompt-sync")()

export function createGlobalScope() {
  const env = new Environment()

  env.declareVariable('PI', MKNUMBER(3.14159265359), true)
  env.declareVariable('true', MKBOOL(true), true)
  env.declareVariable('false', MKBOOL(false), true)

  env.declareVariable('indexAt', MKNATIVEFN((args) => {
    if (args.length != 2) { new SyntaxError(`Expected 2 arguments but got ${args.length}`, null) }
    if (args[0].type != 'string' && args[0].type != undefined) { new SyntaxError(`Expected a string type but got ${args[0].type}`, null) }

    const varName: any = args[0].type === 'string' ? (args[0] as StringValue).value : args[0]
    const idx = (args[1] as NumberValue).value
    const valAt: any = varName[idx]
    if (valAt == undefined) { return MKNULL() }
    return valAt
  }), true)

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
      if (result.type === "object") {
        if (result.properties.has("thread?")) { console.log(GREEN + BOLD + '[NATIVE OBJECT]' + RESET); exit(0) }
        console.log(result.properties)
      }
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

  env.declareVariable('Color', MKNATIVEFN((args) => {
    if (args[0].type != 'object') { console.log(RED + BOLD + `Expected color object but got ${args[0].type}` + RESET); exit(1) }
    const colorsObj: any = { RED, YELLOW, WHITE, GREEN }
    const color = (args[0] as ObjectValue).properties.get("color")
    const userColorValue = (color as StringValue).value.toUpperCase()
    const colorValue: string = colorsObj[userColorValue]
    if (color?.type != 'string') { console.log(RED + BOLD + `Cannot use ${color?.type} as a color type.` + RESET); exit(1) }

    args.slice(1).map((result: any) => {
      if (result.type === "object") {
        if (result.properties.has("thread?")) { console.log(GREEN + BOLD + '[NATIVE OBJECT]' + RESET); exit(0) }
        console.log(colorValue + result.properties + RESET)
      }
      else if (result.type === 'null') console.log(colorValue + null + RESET)
      else if (result.type === 'boolean') console.log(colorValue + result.value + RESET)
      else if (result.type === 'number' || result.type === 'float') console.log(colorValue + result.value + RESET)
      else if (result.type === 'string') {
        if (result.value === '' || result.value === ' ') { return }
        else {
          console.log(colorValue + result.value + RESET)
        }
      }
      else console.log(result)
    })
    return MKNULL()
  }), true)

  /* env.declareVariable('system', MKNATIVEFN((args) => {
    if (args.length != 1) { console.log(RED + BOLD + "Expecting 1 argument." + RESET); exit(1) }
    const cmd = (args[0] as StringValue).value
    exec(cmd, (err, output) => {
      const errMsg = `Error: ${err?.code}.\nName: ${err?.name}.\nDetails: ${err?.message}.\nCause: ${err?.cause}`
      if (err) { return MKSTRING(errMsg) }
      else {
        return MKSTRING(output)
      }
    })
    exit(0)
  }), true) */

  env.declareVariable('toLowerCase', MKNATIVEFN((args) => {
    const obj: any = []
    if (args.length == 0) { console.log(RED + BOLD + "Expecing a SINGLE value, but got " + args.length + RESET); exit(1) }
    args.map((str: any) => obj.push(str.value.toLowerCase()))
    return obj.join(' ')
  }), true)

  env.declareVariable('toUpperCase', MKNATIVEFN((args) => {
    const obj: any = []
    if (args.length == 0) { console.log(RED + BOLD + "Expecing a SINGLE value, but got " + args.length + RESET); exit(1) }
    args.map((str: any) => obj.push(str.value.toUpperCase()))
    return obj.join(' ')
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

  //const testProp = new Map<string, RuntimeValues>().set("hi", MKSTRING("hello"))
  env.declareVariable('thread', MKNATIVEOBJ({
    type: 'object',
    properties: new Map<string, RuntimeValues>()
      .set("thread?", MKBOOL(true))
      .set("pwd", MKSTRING(process.cwd()))
      .set("width", MKNUMBER(process.stdout.columns))
      .set("height", MKNUMBER(process.stdout.rows))
  }), true)

  // Just for fun, you can override this function
  env.declareVariable('aMagicFunction', MKNATIVEFN(() => {
    let str = '*'
    let spaces = ''
    console.clear()
    str = str.repeat(process.stdout.columns)
    for (let i = 0; i < process.stdout.rows; i++) console.log(GREEN + BOLD + str + RESET)
    for (let i = 0; i < (process.stdout.columns / 2) - 10; i++) spaces += ' '
    console.log(GREEN + BOLD + spaces + "You called me?" + RESET)
    setTimeout(() => { console.clear() }, 1000)
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
