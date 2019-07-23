/* =========================================================================
 *
 *  math_utils.ts
 *  simple math functions
 * ========================================================================= */

export function absMax(x: number, y: number) {
  return x * x > y * y ? x : y
}

export function absMin(x: number, y: number) {
  return x * x < y * y ? x : y
}

export function muldec(x: number, y: number) {
  return (x * 10 * (y * 10)) / 100
}

export function divdec(x: number, y: number) {
  return (x * 10) / (y * 10) / 100
}
