# Boron
## ✨Boron V1 is finally here!!
## _Yet another programming language written in Typescript_

## Features
- Easy syntax. Easy to learn.
- Offers an interactive repl for running small piece of code and testing.
- No strict typings required

### Dependencies -> 
Boron requires `pkg` for building an executable

## Installation
Boron does *not* require NodeJS or Typescript to run *after building*.

```sh
# [__] means that it is optional
# [filename] -> Name of a .bor file or nothing for REPL
git clone https://github.com/nav343/Boron.bor
cd Boron.bor
yarn install
yarn start [filename]
```
 
# For Building [Not tested yet]
```sh
# [system] -> Follow instructions on pkg gitub or npm package website
git clone https://github.com/nav343/Boron.bor
cd Boron.bor
yarn install
pkg --compress GZip ./dist/index.js --o ./dist/boronc -t [system]
./dist/boronc [filename]
```

## Editor Setup

| Plugin | README |
| ------ | ------ |
| boron.nvim | [Syntax Highlighter for Vim][boron.nvim] |

## Syntax
```js
let nice = 23 // Mutable variable named nice with a value of 23.
const a = 23; // Immutable variable named a with a value of 23.

// Built-in Functions
let currentTime = TIME() // Returns a formatted local time string.
print(currentTime) // Prints the argument passed in.

writeFile('filename.type', 'content here') // Write content to a file

// MORE FEATURES WILL BE ADDED IN FUTURE UPDATES
```

## License
MIT

[boron.nvim]: <https://github.com/nav343/boron.nvim>
