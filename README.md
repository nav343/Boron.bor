<p align="center">
<img src="https://github.com/nav343/Boron.bor/blob/main/assets/logo.png" style="border-radius: 300px" width=200 height=200></img>
</p>

# Boron
## ✨Boron V1 is finally here!!
## _Yet another programming language written in Typescript_

## Features
- Easy syntax. 
- Easy to learn.
- Offers an interactive REPL for running small piece of code and testing (single line only).
- No strict typing required (Dynamically typed language)

### Dependencies -> 
- [_PRODUCTION_] Boron requires `pkg` for building an executable
- [_DEV_]        Boron requires `@types/node @types/prompt-sync` and `prompt-sync` for running with NodeJS. Run `yarn install` to install them.

## Editor Setup

| Plugin | README |
| ------ | ------ |
| boron.nvim | [Syntax Highlighter for Vim][boron.nvim] |

## Docs & Installation guide
Read the official docs [here][docs] on Github Wiki

## Folder Structure
```
.
├── examples/
│   └── Examples.bor
├── src/
│   ├── frontend/
│   │   ├── utils/
│   │   │   ├── Token.ts
│   │   │   ├── Type.ts
│   │   │   ├── color.ts
│   │   │   └── helper.ts
│   │   ├── ast.ts
│   │   ├── lexer.ts
│   │   └── parser.ts
│   ├── old/
│   │   └── # old stuff here
│   ├── runtime/
│   │   ├── evals/
│   │   │   └── All the evaluate expressions and statements here, it's a long list
│   │   ├── env.ts
│   │   ├── interpreter.ts
│   │   └── value.ts
│   └── index.ts
└── test/
    └── main.bor
```

## License
MIT

[boron.nvim]: <https://github.com/nav343/boron.vim>
[pkgNpm]: <https://www.npmjs.com/package/pkg>
[pkgGithub]: <https://github.com/vercel/pkg#readme>
[docs]: <https://github.com/nav343/Boron.bor/wiki/Documentation>
