"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGlobalScope = void 0;
const process_1 = require("process");
const value_1 = require("./value");
const value_2 = require("../runtime/value");
const fs_1 = require("fs");
function createGlobalScope() {
    const env = new Environment();
    env.declareVariable('PI', (0, value_2.MKNUMBER)(3.14159265359), true);
    env.declareVariable('true', (0, value_2.MKBOOL)(true), true);
    env.declareVariable('false', (0, value_2.MKBOOL)(false), true);
    // Native functions like writeFile, print, time etc
    env.declareVariable('print', (0, value_1.MKNATIVEFN)((args) => {
        console.log(...args);
        return (0, value_1.MKNULL)();
    }), true);
    env.declareVariable('writeFile', (0, value_1.MKNATIVEFN)((args) => {
        if (args.length > 2) {
            console.log(`Expected 2 arguments but got ${args.length}`);
            (0, process_1.exit)(1);
        }
        (0, fs_1.writeFileSync)(`${args[0].value}`, `${args[1].value}`);
        return (0, value_1.MKNULL)();
    }), true);
    env.declareVariable('TIME', (0, value_1.MKNATIVEFN)(() => {
        const date = new Date();
        const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        return (0, value_1.MKSTRING)(time);
    }), true);
    return env;
}
exports.createGlobalScope = createGlobalScope;
class Environment {
    parent;
    variables;
    constants;
    constructor(parentEnv) {
        this.parent = parentEnv;
        this.variables = new Map();
        this.constants = new Set();
    }
    loopupVar(varName) {
        const env = this.resolve(varName);
        return env.variables.get(varName);
    }
    declareVariable(varName, value, isConstant) {
        if (this.variables.has(varName)) {
            throw `Cannot redeclare variable ${varName}.\nTry using another name or remove the existing variable`;
        }
        this.variables.set(varName, value);
        if (isConstant) {
            this.constants.add(varName);
        }
        return value;
    }
    assignVariable(varName, value) {
        const env = this.resolve(varName);
        if (env.constants.has(varName)) {
            throw `Cannot assign to a constant variable ${varName}`;
        }
        env.variables.set(varName, value);
        return value;
    }
    resolve(varName) {
        if (this.variables.has(varName)) {
            return this;
        }
        if (this.parent === undefined) {
            console.log(`Cannot resolve ${varName} because it does not exist.`);
            /*const col = this.code.indexOf(varName)
            let nice = ''
            for (let i = 0; i < col; i++) {
              nice += ' '
            }
            console.log(this.code)
            console.log(nice + '^')*/
            (0, process_1.exit)(1);
        }
        return this.parent.resolve(varName);
    }
}
exports.default = Environment;
