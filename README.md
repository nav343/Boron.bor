# Boron
## ✨Boron V1 is finally here!!
## _Yet another programming language written in Typescript_

## Features
- Easy syntax. Easy to learn.
- Offers an interactive repl for running small piece of code and testing.
- No strict typings required

### Dependencies -> 
- [_PRODUCTION_] Boron requires `pkg` for building an executable
- [_DEV_]        Boron requires `@types/node @types/prompt-sync` and `prompt-sync` for running with NodeJS. Run `yarn install` to install them.

## Installation
Boron does *not* require NodeJS or Typescript to run *after building*.

```sh
# [__] means that it is optional
# [filename] -> Name of a .bor file or nothing for REPL
git clone https://github.com/nav343/Boron.bor.git
cd ./Boron.bor
yarn install
yarn start [filename]
```
 
# For Building [Not tested yet]
Follow the pkg installation guide [on the NPM website.][pkgNpm] or [on github][pkgGithub]
```sh
# [system] -> "linux" | "macos" | "win"
git clone https://github.com/nav343/Boron.bor.git
cd ./Boron.bor
yarn install
pkg .
./dist/build/boron-[system] [filename or nothing]
```

## Editor Setup

| Plugin | README |
| ------ | ------ |
| boron.nvim | [Syntax Highlighter for Vim][boron.nvim] |

## Syntax
```rs
// Variable Declaration
let nice = 23 // Mutable variable named nice with a value of 23.
const a = 23; // Immutable variable named a with a value of 23.

// Objects
let info = {
    name: 1234, // strings are not supported right now and member node is not yet implemented, so the object is kinda useless for now
    age: 4321
}

// User defined Functions
func add(x, y) {
    const res = x + y
    res
}

// Built-in Functions
let currentTime = TIME() // Returns a formatted local time string.
print(currentTime) // Prints the argument passed in.

writeFile('filename.type', 'content here') // Write content to a file

// MORE FEATURES WILL BE ADDED IN FUTURE UPDATES
```

## License
MIT

[boron.nvim]: <https://github.com/nav343/boron.nvim>
[pkgNpm]: <https://www.npmjs.com/package/pkg>
[pkgGithub]: <https://github.com/vercel/pkg#readme>
