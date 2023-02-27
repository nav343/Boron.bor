export function isAlpha(str: string): boolean {
  if (str === null) { return false }
  return str.toUpperCase() != str.toLowerCase()
}

export function isNumber(str: string): boolean {
  const c = str.charCodeAt(0)
  const bound = ['0'.charCodeAt(0), '9'.charCodeAt(0)]
  return (c >= bound[0] && c <= bound[1])
}

export function decorator(): string {
  let dashes = ''
  for (let i = 0; i < process.stdout.columns; i++) { dashes += '-' }
  return dashes
}
