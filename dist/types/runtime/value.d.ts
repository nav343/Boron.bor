import { Statement } from "../frontend/ast";
import Environment from "./env";
export declare type ValueTypes = "null" | "number" | "boolean" | "object" | "nativeFn" | "string" | "function" | "color";
export interface RuntimeValues {
    type: ValueTypes;
}
export interface NullValue extends RuntimeValues {
    type: 'null';
    value: null;
}
export interface NumberValue extends RuntimeValues {
    type: "number";
    value: number;
}
export interface StringValue extends RuntimeValues {
    type: "string";
    value: string;
}
export interface BooleanValue extends RuntimeValues {
    type: "boolean";
    value: boolean;
}
export interface ObjectValue extends RuntimeValues {
    type: "object";
    properties: Map<string, RuntimeValues>;
}
export declare type FunctionCall = (args: RuntimeValues[], env: Environment) => RuntimeValues;
export interface NativeFnValue extends RuntimeValues {
    type: "nativeFn";
    call: FunctionCall;
}
export interface FunctionValue extends RuntimeValues {
    type: "function";
    name: string;
    params: string[];
    declarationEnv: Environment;
    body: Statement[];
}
export declare function MKNUMBER(n?: number): NumberValue;
export declare function MKSTRING(str?: string): StringValue;
export declare function MKNULL(): NullValue;
export declare function MKBOOL(val: boolean): BooleanValue;
export declare function MKNATIVEFN(call: FunctionCall): NativeFnValue;
