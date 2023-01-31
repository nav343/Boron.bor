import { Type } from "./Type";

export interface Token {
  tokenType: Type
  value: string
}

export function token(tokenType: Type, value: any = "") {
  return { tokenType, value }
}
