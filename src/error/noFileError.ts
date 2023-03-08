import { exit } from 'process';
import { BOLD, RED, RESET, YELLOW } from '../frontend/utils/colors';
import { BaseError } from './err'

export class FileError extends BaseError {
  constructor(message: string, path: string) {
    super({
      type: RED + BOLD + "File Not Found: " + RESET,
      message: `${YELLOW + BOLD + message}\n Path: ${path + RESET}`,
      token: null,
      lineNo: undefined
    })
    super.throw()
    exit(1)
  }
}
