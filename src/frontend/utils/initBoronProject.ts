import { exec } from "child_process";
import { exit } from "process";
import { BOLD, GREEN, RED, RESET, YELLOW } from "./colors";
const filePrompt = require('prompt-sync')({
  history: require('prompt-sync-history')()
});
export function initBoronProject() {
  const path = process.argv[3]
  if (path === 'undefined') { console.log("Expected a directory name or a ."); exit(1) }

  if (typeof path == 'string') {
    if (path === '.') {
      console.log(GREEN + `Creating a boron project..... Please answer the given questions` + RESET)
      const name = filePrompt(YELLOW + BOLD + "Name: " + RESET)
      const description = filePrompt(YELLOW + BOLD + "Description: " + RESET)
      const version = filePrompt(YELLOW + BOLD + "Version: " + RESET)
      filePrompt.history.save()
      if (!name || !description || !version) { console.log(RED + BOLD + "A value is required for NAME, DESCRIPTION AND VERSION" + RESET); exit(1) }

      try {
        if (process.platform === 'linux') {
          exec(`touch ./borConfig.json`, (err) => { if (err) { console.log(err); exit(1) } })
          exec(`echo '{\n "name": "${name}",\n "description": "${description}",\n "version": "${version}"\n}' >> ./borConfig.json`, (err) => { if (err) { console.log(err); exit(1) } })
          exec(`mkdir src && cd ./src && echo 'print("Super cool boron project")' >> ./main.bor`, (err) => { if (err) { console.log(err); exit(1) } })
          console.log(GREEN + BOLD + "Done !!. Happy Hacking !!" + RESET)
        } else { console.log(RED + BOLD + `The tool is not yet supported for your operating system (${process.platform}).` + RESET); exit(0) }
      } catch (err) { console.log(err); exit(1) }
    }
  }
}
