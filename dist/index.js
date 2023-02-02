"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const parser_1 = __importDefault(require("./frontend/parser"));
const env_1 = require("./runtime/env");
const interpreter_1 = require("./runtime/interpreter");
function exec() {
    const path = process.argv[2];
    const parser = new parser_1.default();
    const env = (0, env_1.createGlobalScope)();
    if (typeof path === 'string') {
        const code = (0, fs_1.readFileSync)(path, { encoding: 'utf8' }).toString();
        const program = parser.genAst(code);
        (0, interpreter_1.evaluate)(program, env);
    }
    else {
        console.clear();
        console.log("Boron Lang v1.0.0\nRead Evaluate Print Loop [REPL] running.....");
        while (true) {
            const code = (0, prompt_sync_1.default)({ sigint: true })({
                ask: "> ", autocomplete: complete([
                    'let', 'x', '=', '20', 'const', 'while'
                ])
            }).toString();
            if (code === 'exit()') {
                console.clear();
                break;
            }
            const program = parser.genAst(code);
            (0, interpreter_1.evaluate)(program, env);
        }
    }
}
function complete(commands) {
    return function (str) {
        var i;
        var ret = [];
        for (i = 0; i < commands.length; i++) {
            if (commands[i].indexOf(str) == 0)
                ret.push(commands[i]);
        }
        return ret;
    };
}
;
exec();
