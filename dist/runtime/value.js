"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MKNATIVEFN = exports.MKBOOL = exports.MKNULL = exports.MKSTRING = exports.MKNUMBER = void 0;
// MACROS
function MKNUMBER(n = 0) {
    return { value: n, type: 'number' };
}
exports.MKNUMBER = MKNUMBER;
function MKSTRING(str = '') {
    return { value: str, type: 'string' };
}
exports.MKSTRING = MKSTRING;
function MKNULL() {
    return { type: 'null', value: null };
}
exports.MKNULL = MKNULL;
function MKBOOL(val) {
    return { type: 'boolean', value: val };
}
exports.MKBOOL = MKBOOL;
function MKNATIVEFN(call) {
    return { type: 'nativeFn', call };
}
exports.MKNATIVEFN = MKNATIVEFN;
