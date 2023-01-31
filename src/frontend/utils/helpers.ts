export function isAlpha(str: string): boolean {
  return str.toUpperCase() != str.toLowerCase()
}

export function isNumber(str: string): boolean {
  const c = str.charCodeAt(0)
  const bound = ['0'.charCodeAt(0), '9'.charCodeAt(0)]
  return (c >= bound[0] && c <= bound[1])
}
