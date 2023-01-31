"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluate = void 0;
const process_1 = require("process");
const assignment_1 = require("./evals/assignment");
const binExpr_1 = require("./evals/binExpr");
const callExpr_1 = require("./evals/callExpr");
const funcDeclaration_1 = require("./evals/funcDeclaration");
const object_1 = require("./evals/object");
const program_1 = require("./evals/program");
const varDeclaration_1 = require("./evals/varDeclaration");
const value_1 = require("./value");
function evalIdentifier(identifier, env) {
    const val = env.loopupVar(identifier.symbol);
    return val;
}
function evaluate(astNode, env) {
    switch (astNode.kind) {
        case "Int":
            return { value: (astNode.value), type: 'number' };
        case "Float":
            return { value: (astNode.value), type: 'number' };
        case "String":
            return { value: (astNode.value), type: 'string' };
        case "Null":
            return (0, value_1.MKNULL)();
        case "Identifier":
            return evalIdentifier(astNode, env);
        case "BinExpr":
            return (0, binExpr_1.evalBinExpr)(astNode, env);
        case 'Program':
            return (0, program_1.evalProgram)(astNode, env);
        case "VariableDeclaration":
            return (0, varDeclaration_1.evalVarDeclaration)(astNode, env);
        case "FunctionDeclaration":
            return (0, funcDeclaration_1.evalFuncDeclaration)(astNode, env);
        case "AssignmentExpr":
            return (0, assignment_1.evalAssignmentExpr)(astNode, env);
        case "Object":
            return (0, object_1.evalObjectExpr)(astNode, env);
        case "CallExpr":
            return (0, callExpr_1.evalCallExpr)(astNode, env);
        default:
            console.error("Undefined node " + astNode.kind);
            (0, process_1.exit)(1);
    }
}
exports.evaluate = evaluate;
