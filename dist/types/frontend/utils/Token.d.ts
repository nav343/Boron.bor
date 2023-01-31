import { Type } from "./Type";
export interface Token {
    tokenType: Type;
    value: string;
}
export declare function token(tokenType: Type, value?: any): {
    tokenType: Type;
    value: any;
};
