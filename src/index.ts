import { readFile } from "fs/promises";
import prompt from 'prompt-sync'
import Parser from "./frontend/parser";
import { BOLD, RED, RESET, WHITE, YELLOW } from "./frontend/utils/colors";
import { createGlobalScope } from "./frontend/utils/createGlobalScope";
import { decorator } from "./frontend/utils/helpers";
import { evaluate } from "./runtime/interpreter";

interface FileNotFound {
  errno: number
  code: string
  path: string
  syscall: string
}

function exec() {
  const path = process.argv[2]
  const env = createGlobalScope()

  if (typeof path === 'string') {
    readFile(path, { encoding: 'utf8' }).then((raw) => {
      const code = raw.toString()
      const parser = new Parser(code)
      const program = parser.genAst(code)
      evaluate(program, env)
    }).catch((err: FileNotFound) => {
      if (err.errno == -2) {

        // msg
        const errNo = `${YELLOW + BOLD} Code: ${err.errno + RESET}`
        const file = `\n${YELLOW + BOLD} File: ${err.path + RESET}`
        const syscall = `\n${YELLOW + BOLD} SysCall: ${err.syscall + RESET}`
        const note = `\n${WHITE} Please check the file name and try again. ${RESET}`

        const errorMsg = errNo + file + syscall + note;
        console.log(RED + BOLD + "File not found.")
        console.log(RED + BOLD + decorator() + RESET)
        console.log(errorMsg)
        console.log(RED + BOLD + decorator() + RESET)
      }
    })
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

      const program = parser.genAst(code)
      evaluate(program, env)
    }
  }
}

function complete(commands: string[]) {
  return function(str: string) {
    let i;
    let ret = [];
    for (i = 0; i < commands.length; i++) {
      if (commands[i].indexOf(str) == 0)
        ret.push(commands[i]);
    }
    return ret;
  };
};

exec()
