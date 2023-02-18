import { Statement } from "../frontend/ast"
import Environment from "./env"

export type ValueTypes =
  "null" |
  "number" |
  "float" |
  "boolean" |
  "object" |
  "nativeFn" |
  "string" |
  "function" |
  "whileLoop" |
  "ifStatement" |
  "elseStatement" |

  "color"

export interface RuntimeValues {
  type: ValueTypes,
}

export interface NullValue extends RuntimeValues {
  type: 'null',
  value: null,
}

export interface NumberValue extends RuntimeValues {
  type: "number" | "float",
  value: number
}

export interface StringValue extends RuntimeValues {
  type: "string",
  value: string
}

export interface BooleanValue extends RuntimeValues {
  type: "boolean",
  value: boolean
}

export interface ObjectValue extends RuntimeValues {
  type: "object",
  properties: Map<string, RuntimeValues>
}

export type FunctionCall = (args: RuntimeValues[], env: Environment) => RuntimeValues
export interface NativeFnValue extends RuntimeValues {
  type: "nativeFn"
  call: FunctionCall
}

export interface FunctionValue extends RuntimeValues {
  type: "function"
  name: string
  params: string[]
  declarationEnv: Environment
  body: Statement[]
}

export interface WhileValue extends RuntimeValues {
  type: "whileLoop"
  condition: boolean
  body: Statement[]
}

export interface IfValue extends RuntimeValues {
  type: "ifStatement"
  condition: boolean
  body: Statement[]
}



// MACROS
export function MKNUMBER(n: number = 0) {
  return { value: n, type: 'number' } as NumberValue
}
export function MKSTRING(str: string = '') {
  return { value: str, type: 'string' } as StringValue
}
export function MKNULL() {
  return { type: 'null', value: null } as NullValue
}
export function MKBOOL(val: boolean) {
  return { type: 'boolean', value: val } as BooleanValue
}
export function MKNATIVEFN(call: FunctionCall) {
  return { type: 'nativeFn', call } as NativeFnValue
}
