import { AssignmentExpr, BinExpr, CallExpr, Export, Float, FunctionDeclaration, Identifier, IfStatement, Import, Int, MemberExpr, Object, Program, Statement, String, VariableDeclaration, WhileDeclaration } from "../frontend/ast";
import { BOLD, RED, RESET } from "../frontend/utils/colors";
import Environment from "./env";
import { evalAssignmentExpr } from "./evals/assignment";
import { evalBinExpr } from "./evals/binExpr";
import { evalCallExpr } from "./evals/callExpr";
import { evalFuncDeclaration } from "./evals/funcDeclaration";
import { evalIfStatement } from "./evals/ifElseStatement";
import { evalMemberExpr } from "./evals/memberExpr";
import { evalObjectExpr } from "./evals/object";
import { evalExportStatement, evalImportStatement } from "./evals/packageDeclaration";
import { evalProgram } from "./evals/program";
import { evalVarDeclaration } from "./evals/varDeclaration";
import { evalWhileDeclaration } from "./evals/whileDeclaration";
import { MKNULL, NumberValue, RuntimeValues, StringValue } from "./value";

function evalIdentifier(identifier: Identifier, env: Environment): RuntimeValues {
  const val = env.loopupVar(identifier.symbol)
  return val
}

function pkgEnv(env: Environment): Environment {
  return new Environment(env)
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
    case "IfStatement":
      return evalIfStatement(astNode as IfStatement, env)
    // packages
    case "Export":
      return evalExportStatement(astNode as Export, pkgEnv(env), env)
    case "Import":
      return evalImportStatement(astNode as Import, env)

    case "AssignmentExpr":
      return evalAssignmentExpr(astNode as AssignmentExpr, env)

    case "Object":
      return evalObjectExpr(astNode as Object, env)

    case "CallExpr":
      return evalCallExpr(astNode as CallExpr, env)
    case "MemberExpr":
      return evalMemberExpr(astNode as MemberExpr, env)
    default:
      console.error(RED + BOLD + "Undefined node " + astNode.kind + RESET)
      return { type: 'null' }
  }
}
