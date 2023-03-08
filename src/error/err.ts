import { decorator } from "../frontend/utils/helpers";
import { Token } from "../frontend/utils/Token";
import { RED, BOLD, RESET, YELLOW } from '../frontend/utils/colors'

interface BoronBaseError {
  type: string
  message: string
}

interface BaseErrorType {
  type: string,
  message: string
  token: Token | null
  lineNo?: number
  col?: number
}

export class BaseError {
  type: string
  message: string
  token: Token | null
  lineNo: number | undefined
  col: number | undefined

  constructor({ type, token, message, col, lineNo }: BaseErrorType) {
    this.type = type
    this.message = message
    this.token = token
    this.lineNo = lineNo
    this.col = col
  }

  public throw(): BoronBaseError {
    if (this.message.length > process.stdout.columns + 1) { this.message = this.message.substring(0, process.stdout.columns + 1) + `\n${this.message.substring(process.stdout.columns + 1)}` }

    console.log(RED + BOLD + decorator() + RESET)
    console.log(" " + RED + BOLD + this.type + RESET)
    console.log(" " + RED + BOLD + this.message + RESET)
    this.token != null ? console.log(RED + BOLD + " Token: " + RESET + YELLOW + this.token?.value + RESET) : null
    this.lineNo != undefined ? console.log(RED + BOLD + " In line: " + RESET + YELLOW + this.lineNo + RESET) : null
    this.col != undefined ? console.log(RED + BOLD + " Col: " + RESET + YELLOW + this.col + RESET) : null
    console.log(RED + BOLD + decorator() + RESET)
    return { type: this.type, message: this.message }
  }
}
