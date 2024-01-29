/*
 * @Author: Xu.Wang
 * @Date: 2020-04-03 23:24:31
 * @Last Modified by:   Xu.Wang
 * @Last Modified time: 2020-04-03 23:24:31
 */
export function computePressureFromEos(
  density: number,
  targetDensity: number,
  eosScale: number,
  eosExponent: number,
  negativePressureScale: number
): number {
  // See Murnaghan-Tait equation of state from
  // https://en.wikipedia.org/wiki/Tait_equation
  let p =
    (eosScale / eosExponent) *
    (Math.pow(density / targetDensity, eosExponent) - 1.0)

  // Negative pressure scaling
  if (p < 0) {
    p *= negativePressureScale
  }

  return p
}
