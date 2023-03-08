import { exit } from 'process';
import { BOLD, RED, RESET, YELLOW } from '../frontend/utils/colors';
import { BaseError } from './err'

export class NoOption extends BaseError {
  constructor(option: string, message: string) {
    super({
      type: RED + BOLD + "Help Option not found: " + RESET,
      message: YELLOW + BOLD + `${message}\n Option: ${option}` + RESET,
      token: null,
      lineNo: undefined,
    })
    super.throw()
    exit(1)
  }
}
