import { readFileSync } from "fs";
import prompt from 'prompt-sync'
import Parser from "./frontend/parser";
import { createGlobalScope } from "./runtime/env";
import { evaluate } from "./runtime/interpreter";

function exec() {
  const path = process.argv[2]
  const env = createGlobalScope()

  if (typeof path === 'string') {
    const code = readFileSync(path, { encoding: 'utf8' }).toString()
    const parser = new Parser(code)
    const program = parser.genAst(code)
    evaluate(program, env)
  } else {
    console.clear()
    const parser = new Parser()
    console.log("Boron Lang v1.0.0\nRead Evaluate Print Loop [REPL] running.....")
    while (true) {
      const code = prompt({ sigint: true })({
        ask: "> ", autocomplete: complete([
          'let', 'x', '=', '20', 'const', 'while'
        ])
      }).toString()

      if (code === 'exit()') {
        console.clear()
        break
      }
      const program = parser.genAst(code)
      evaluate(program, env)
    }
  }
}

function complete(commands: string[]) {
  return function(str: string) {
    var i;
    var ret = [];
    for (i = 0; i < commands.length; i++) {
      if (commands[i].indexOf(str) == 0)
        ret.push(commands[i]);
    }
    return ret;
  };
};

exec()
