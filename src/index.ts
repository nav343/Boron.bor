import { readFile } from "fs/promises";
import { exit } from "process";
import { NoOption } from "./error/noOption";
import Parser from "./frontend/parser";
import { BOLD, GREEN, RED, RESET, WHITE, YELLOW } from "./frontend/utils/colors";
import { createGlobalScope } from "./frontend/utils/createGlobalScope";
import { decorator } from "./frontend/utils/helpers";
import { initBoronProject } from "./frontend/utils/initBoronProject";
import { evaluate } from "./runtime/interpreter";
const prompt = require('prompt-sync')({
  history: require('prompt-sync-history')(),
});
const version = process.env.npm_package_version
function spaces(charLength: number) {
  let _spaces = ''
  for (let i = 0; i < (process.stdout.columns / 2) - charLength; i++) _spaces += ' '
  return _spaces
}

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
    if (path.toLowerCase() === 'init') { initBoronProject(); exit(0) }
    if (path.includes('-')) {
      if (path === '-') { new NoOption(path, `Expected a value after "-"`) }
      if (path.toLowerCase() == '-h') {
        console.log(GREEN + BOLD + decorator() + RESET)


        // Help body...
        console.log(GREEN + BOLD + spaces(9) + "Boron Help Desk !!" + RESET)
        console.log(GREEN + BOLD + "boronc/boron command takes in ONE single argument which is the name of the file that you want to run." + RESET)
        console.log(YELLOW + BOLD + "\n* For running small chunks of code, boron provides an in built Read-Evaluate-Print-Loop.\n-> Leave the `FILE_NAME` option blank to enter repl mode." + RESET)
        console.log(YELLOW + BOLD + "\n* For running a .bor file, type the RELATIVE PATH of the file that you want to run.\n-> Like `boron ./main.bor`" + RESET)
        console.log(WHITE + BOLD + "\n* Available command line options: " + RESET)
        console.log(WHITE + BOLD + "  -> -v: Shows the version of Boron interpreter installed on your system" + RESET)
        console.log(WHITE + BOLD + "  -> -h: Shows this help menu" + RESET)

        console.log(GREEN + BOLD + "\nHappy Hacking!!" + RESET)
        console.log(GREEN + BOLD + decorator() + RESET)
        exit(0)
      }
      else if (path == '-v') { console.log(GREEN + BOLD + version + RESET); exit(0) }
      else { new NoOption(path, `No option found.`) }
    }

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
    const introMsg = `Boron Lang v${version}`
    const idk = "[REPL] running"
    console.log(GREEN + BOLD + spaces(18) + introMsg + RESET)
    console.log(GREEN + BOLD + spaces(15) + idk + RESET)
    while (true) {
      const code = prompt("> ")
      if (code == null) { exit(0) }
      prompt.history.save()

      const program = parser.genAst(code)
      evaluate(program, env)
    }
  }
}
exec()
