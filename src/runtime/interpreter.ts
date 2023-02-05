import { exit } from "process";
import { AssignmentExpr, BinExpr, CallExpr, Float, FunctionDeclaration, Identifier, Int, Object, Program, Statement, String, VariableDeclaration, WhileDeclaration } from "../frontend/ast";
import Environment from "./env";
import { evalAssignmentExpr } from "./evals/assignment";
import { evalBinExpr } from "./evals/binExpr";
import { evalCallExpr } from "./evals/callExpr";
import { evalFuncDeclaration } from "./evals/funcDeclaration";
import { evalObjectExpr } from "./evals/object";
import { evalProgram } from "./evals/program";
import { evalVarDeclaration } from "./evals/varDeclaration";
import { evalWhileDeclaration } from "./evals/whileDeclaration";
import { MKNULL, NumberValue, RuntimeValues, StringValue } from "./value";

function evalIdentifier(identifier: Identifier, env: Environment): RuntimeValues {
  const val = env.loopupVar(identifier.symbol)
  return val
}

export function evaluate(astNode: Statement, env: Environment): RuntimeValues {
  switch (astNode.kind) {
    case "Int":
      return { value: ((astNode as Int).value), type: 'number' } as NumberValue
    case "Float":
      return { value: ((astNode as Float).value), type: 'number' } as NumberValue
    case "String":
      return { value: ((astNode as String).value), type: 'string' } as StringValue
    case "Null":
      return MKNULL()
    case "Identifier":
      return evalIdentifier(astNode as Identifier, env)

    case "BinExpr":
      return evalBinExpr(astNode as BinExpr, env)
    case 'Program':
      return evalProgram(astNode as Program, env)

    case "VariableDeclaration":
      return evalVarDeclaration(astNode as VariableDeclaration, env)
    case "FunctionDeclaration":
      return evalFuncDeclaration(astNode as FunctionDeclaration, env)
    case "WhileDeclaration":
      return evalWhileDeclaration(astNode as WhileDeclaration, env)

    case "AssignmentExpr":
      return evalAssignmentExpr(astNode as AssignmentExpr, env)

    case "Object":
      return evalObjectExpr(astNode as Object, env)

    case "CallExpr":
      return evalCallExpr(astNode as CallExpr, env)
    default:
      console.error("Undefined node " + astNode.kind)
      exit(1)
  }
}
