import { RuntimeValues } from "./value";
export declare function createGlobalScope(): Environment;
export default class Environment {
    private parent?;
    private variables;
    private constants;
    constructor(parentEnv?: Environment);
    loopupVar(varName: string): RuntimeValues;
    declareVariable(varName: string, value: RuntimeValues, isConstant: boolean): RuntimeValues;
    assignVariable(varName: string, value: RuntimeValues): RuntimeValues;
    resolve(varName: string): Environment;
}
