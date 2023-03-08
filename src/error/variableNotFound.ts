import { exit } from 'process';
import { BOLD, RED, RESET, YELLOW } from '../frontend/utils/colors';
import { Token } from '../frontend/utils/Token';
import { BaseError } from './err'

export class VariableNotFound extends BaseError {
  constructor(message: string, token: Token | null, col?: number) {
    super({
      type: RED + BOLD + "Variable Not Found" + RESET,
      message: YELLOW + BOLD + message + RESET,
      token,
      lineNo: undefined,
      col
    })
    super.throw()
    exit(1)
  }
}
