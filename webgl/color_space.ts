/* =========================================================================
 *
 *  color_space.ts
 *  color space transformation
 *
 * ========================================================================= */

// hsv space transform to rgb space
// h(0~360) sva(0~1)
export function HSV2RGB(
  h: number,
  s: number,
  v: number,
  a: number
): Array<number> {
  if (s > 1 || v > 1 || a > 1) {
    console.log('error: color_space s,v,a value is not correct!')
    return new Array<number>(3)
  }
  let th = h % 360
  let i = Math.floor(th / 60)
  let f = th / 60 - i
  let m = v * (1 - s)
  let n = v * (1 - s * f)
  let k = v * (1 - s * (1 - f))
  let color = new Array<number>()
  if (!(s > 0) && !(s < 0)) {
    color.push(v, v, v, a)
  } else {
    let r = new Array(v, n, m, m, k, v)
    let g = new Array(k, v, v, n, m, m)
    let b = new Array(m, m, k, v, v, n)
    color.push(r[i], g[i], b[i], a)
  }
  return color
}
