"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumber = exports.isAlpha = void 0;
function isAlpha(str) {
    return str.toUpperCase() != str.toLowerCase();
}
exports.isAlpha = isAlpha;
function isNumber(str) {
    const c = str.charCodeAt(0);
    const bound = ['0'.charCodeAt(0), '9'.charCodeAt(0)];
    return (c >= bound[0] && c <= bound[1]);
}
exports.isNumber = isNumber;
