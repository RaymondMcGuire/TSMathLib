import { Matrix } from '../math/matrix'
/* =========================================================================
 *
 *  cramer_formula.ts
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

/**
 * |a11 a12 a13|
 * |a21 a22 a23|
 * |a31 a32 a33|
 *
 * =a11|a22 a23| - a12|a21 a23| + a13|a21 a22|
 * |a32 a33|      |a31 a33|      |a31 a32|
 */
function calc_determinant(D: Matrix) {
  let rows = D.rows()
  let cols = D.cols()
  if (rows !== cols) return -1

  let _size = rows
  if (_size === 1) {
    return D.getDataByIndexs(0, 0)
  } else if (_size === 2) {
    return (
      D.getDataByIndexs(0, 0) * D.getDataByIndexs(1, 1) -
      D.getDataByIndexs(1, 0) * D.getDataByIndexs(0, 1)
    )
  } else {
    let sum = 0
    let multiplier = -1
    for (let index = 0; index < _size; index++) {
      multiplier = multiplier === -1 ? 1 : -1
      let _d = D.getDeterminant(0, index)
      let _det = multiplier * D.getDataByIndexs(0, index) * calc_determinant(_d)
      sum += _det
    }
    return sum
  }
}

export function cramer_formula_solve(A: Matrix, B: Matrix) {
  let ans = []
  let xSize = A.cols()
  let cofactorA = calc_determinant(A)
  // console.log(cofactorA);
  // A.printMatrix();
  // B.printMatrix();
  for (let index = 0; index < xSize; index++) {
    let _detX = new Matrix(A.rows(), A.cols())
    _detX.forEachIndex((i, j) => {
      if (j === index) {
        _detX.setDataByIndexs(i, j, B.getDataByIndexs(i, 0))
      } else {
        _detX.setDataByIndexs(i, j, A.getDataByIndexs(i, j))
      }
      // console.log(i,j);
    })
    let cofactorDetx = calc_determinant(_detX)
    ans.push(cofactorDetx / cofactorA)
    // _detX.printMatrix();
    // console.log(_detX.data());
  }
  // console.log(ans);
  return ans
}
