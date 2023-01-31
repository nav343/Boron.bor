"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evalProgram = void 0;
const interpreter_1 = require("../interpreter");
const value_1 = require("../value");
function evalProgram(program, env) {
    let lastEval = (0, value_1.MKNULL)();
    for (const statement of program.body) {
        lastEval = (0, interpreter_1.evaluate)(statement, env);
    }
    return lastEval;
}
exports.evalProgram = evalProgram;
