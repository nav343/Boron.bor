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
# [filename] -> Name of a .bor file or nothing for REPL mode
git clone https://github.com/nav343/Boron.bor.git
cd ./Boron.bor
yarn install
yarn start [filename]
```
 
# For Building [Not tested on Mac or Windows]
Follow the pkg installation guide [on the NPM website.][pkgNpm] or [on github][pkgGithub]
```sh
# [system] -> "linux" | "macos" | "win.exe"
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

## Docs
Read the docs [here][docs]

## License
MIT

[boron.nvim]: <https://github.com/nav343/boron.vim>
[pkgNpm]: <https://www.npmjs.com/package/pkg>
[pkgGithub]: <https://github.com/vercel/pkg#readme>
[docs]: <https://github.com/nav343/Boron.bor/wiki/Documentation>
