/*
 * @Author: Xu.Wang
 * @Date: 2020-03-28 01:45:02
 * @Last Modified by:   Xu.Wang
 * @Last Modified time: 2020-03-28 01:45:02
 */
import { Matrix } from '../math/matrix'
import { SparseMatrix } from '../math/sparse_matrix'
import { Vector } from '../math/vector'
/* =========================================================================
 *
 *  conjugate_grad.ts
 *  Solve a linear equation Ax = b with conjugate gradient method.
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
export function conjugate_grad(A: Matrix, b: Vector, x?: Vector) {
  // TODO:judge A is a "positive semi-definite matrix", tip:using "Cholesky decomposition"

  let n = b.size()
  if (x === undefined) {
    x = new Vector(b.size())
    x.setOne()
  }

  let r = A.mulVec(x).sub(b)
  let p = r.mul(-1)
  let rkNorm = r.dot(r)

  for (let _i = 0; _i < 2 * n; _i++) {
    let Ap = A.mulVec(p)
    let alpha = rkNorm / p.dot(Ap)
    x.iadd(p.mul(alpha))
    r.iadd(Ap.mul(alpha))
    let rkPlus1Norm = r.dot(r)
    let beta = rkPlus1Norm / rkNorm
    rkNorm = rkPlus1Norm
    if (rkPlus1Norm < 1e-5) {
      // console.log('compute finished!');
      break
    }
    p = p.mul(beta).sub(r)
  }
  return x
}

export function conjugate_grad_spMatrix(
  A: SparseMatrix,
  b: Vector,
  x?: Vector
) {
  // TODO:judge A is a "positive semi-definite matrix", tip:using "Cholesky decomposition"

  let n = b.size()
  if (x === undefined) {
    x = new Vector(b.size())
    x.setOne()
  }

  let r = A.mulVec(x).sub(b)
  let p = r.mul(-1)
  let rkNorm = r.dot(r)

  for (let _i = 0; _i < 2 * n; _i++) {
    let Ap = A.mulVec(p)
    let alpha = rkNorm / p.dot(Ap)
    x.iadd(p.mul(alpha))
    r.iadd(Ap.mul(alpha))
    let rkPlus1Norm = r.dot(r)
    let beta = rkPlus1Norm / rkNorm
    rkNorm = rkPlus1Norm
    if (rkPlus1Norm < 1e-5) {
      // console.log('compute finished!');
      break
    }
    p = p.mul(beta).sub(r)
  }
  return x
}
