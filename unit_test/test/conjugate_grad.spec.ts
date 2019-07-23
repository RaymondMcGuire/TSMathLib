import { expect } from 'chai'
import {
  conjugate_grad,
  conjugate_grad_spMatrix
} from '../../lib/conjugate_grad'
import { Vector } from '../../lib/vector'
import { Matrix } from '../../lib/matrix'
import { SparseMatrix } from '../../lib/sparse_matrix'

describe(' Solve a linear equation Ax = b', () => {
  it('conjugate gradient method', () => {
    let P = new Matrix(3, 3, new Array(7, 7, 7, 7, 1, 3, 1, 0, 3))
    let PT = new Matrix(3, 3, P.data())
    PT.transpose()
    let A = PT.mulMat(P)
    let b = new Vector(3)
    b.setOne()
    let x = conjugate_grad(A, b)
    let b_similar = A.mulVec(x).isSimilar(b, 1e-5)
    expect(b_similar).to.equal(true)
  })

  it('conjugate gradient method using sparse matrix', () => {
    let P = new SparseMatrix(
      3,
      3,
      new Array<[number, number, number]>(
        [0, 0, 7],
        [0, 1, 7],
        [0, 2, 7],
        [1, 0, 7],
        [1, 1, 1],
        [1, 2, 3],
        [2, 0, 1],
        [2, 1, 0],
        [2, 2, 3]
      )
    )
    let PT = new SparseMatrix(3, 3, P.data())
    PT.transpose()
    let A = PT.mulMat(P.spMat2Mat())
    let b = new Vector(3)
    b.setOne()
    let x = conjugate_grad_spMatrix(A, b)
    let b_similar = A.mulVec(x).isSimilar(b, 1e-5)
    expect(b_similar).to.equal(true)
  })
})
