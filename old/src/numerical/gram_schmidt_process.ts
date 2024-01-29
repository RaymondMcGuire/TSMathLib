/*
 * @Author: Xu.Wang
 * @Date: 2020-03-31 16:59:22
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-03-31 17:01:14
 */
import { Vector } from '../math/vector'
/* =========================================================================
 *
 *  gram_schmidt_process.ts
 *  Gram–Schmidt process method : orthonormalising a set of vectors
 *
 *  Parameters
 *  ----------
 *  A: 2d positive semi-definite (symmetric) matrix
 *  b: 1d array
 *  x: 1d array of initial point
 *
 *  Return
 *  ----------
 *  1d array x such that Ax = b
 * ========================================================================= */
export function gram_schmidt_process(v: Array<Vector>): Array<Vector> {
  let size = v.length
  if (size === 0) return new Array<Vector>()
  let dim = v[0].size()
  let u = Array<Vector>(size)
  for (let i = 0; i < size; i++) {
    let sumV = new Vector(dim)
    if (i !== 0) {
      for (let j = 0; j < size - 1; j++) {
        sumV.iadd(Vector.proj(u[j], v[i]))
      }
    }
    u[i] = v[i].sub(sumV)
  }
  return u
}
