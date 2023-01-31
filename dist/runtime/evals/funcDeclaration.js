"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evalFuncDeclaration = void 0;
function evalFuncDeclaration(decl, env) {
    const fn = {
        type: 'function',
        name: decl.name,
        body: decl.body,
        params: decl.params,
        declarationEnv: env
    };
    return env.declareVariable(decl.name, fn, true);
}
exports.evalFuncDeclaration = evalFuncDeclaration;
