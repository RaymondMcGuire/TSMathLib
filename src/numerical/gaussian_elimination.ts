import { Matrix } from '../math/matrix'
/* =========================================================================
 *
 *  gaussian_elimination.ts
 *
 *
 *  Parameters
 *  ----------
 *  N: coefficients for linear system equations
 *
 *  Return
 *  ----------
 *
 * ========================================================================= */
export function gaussian_elimination_solve(N: Matrix) {
  let result = 0
  let i
  let j
  let k = 0
  let n = N.rows()

  for (k = 0; k < n - 1; k++) {
    let p = k
    let max = Math.abs(N.getDataByIndexs(k, k))

    for (i = k + 1; i < n; i++) {
      if (Math.abs(N.getDataByIndexs(i, k)) > max) {
        p = i
        max = Math.abs(N.getDataByIndexs(i, k))
      }
    }
    if (p !== k) {
      for (i = k; i <= n; i++) {
        let tmp = N.getDataByIndexs(k, i)
        N.setDataByIndexs(k, i, N.getDataByIndexs(p, i))
        N.setDataByIndexs(p, i, tmp)
      }
    }

    for (i = k + 1; i < n; i++) {
      for (j = k + 1; j <= n; j++) {
        result =
          N.getDataByIndexs(i, j) -
          (N.getDataByIndexs(k, j) * N.getDataByIndexs(i, k)) /
            N.getDataByIndexs(k, k)
        N.setDataByIndexs(i, j, result)
      }
    }
  }

  let ans = []

  for (k = n - 1; k >= 0; k--) {
    for (j = k + 1; j < n; j++) {
      result = N.getDataByIndexs(k, n) - N.getDataByIndexs(k, j) * ans[j]
      N.setDataByIndexs(k, n, result)
    }
    ans[k] = N.getDataByIndexs(k, n) / N.getDataByIndexs(k, k)
  }

  return ans
}
