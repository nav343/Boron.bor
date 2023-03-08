import { writeFileSync } from "fs";
import { exit } from "process";
import { GREEN, RESET } from "./colors";
const filePrompt = require('prompt-sync')({
  history: require('prompt-sync-history')()
});
import { dirname } from 'path'
export function initBoronProject() {
  const path = process.argv[3]
  if (path === 'undefined') { console.log("Expected a directory name or a ."); exit(1) }

  if (typeof path == 'string') {
    if (path === '.') {
      console.log(GREEN + `Creating a boron project..... Please answer the given questions` + RESET)
      const name = filePrompt("Name: ")
      const description = filePrompt("Description")
      const version = filePrompt("Version: ")
      filePrompt.history.save()

      // Creating directories and writing files.
      // boronConfig file (similar to package.json)
      const config =
        `{
  "name": ${name},
  "description": ${description},
  "version": ${version}
}`

      try {
        console.log(process.cwd())
        //writeFileSync(__dirname + '/boronConf.json', config, { encoding: 'utf8' })
        exit(0)
      } catch (err) { console.log(err); exit(1) }
    }
  }
}
