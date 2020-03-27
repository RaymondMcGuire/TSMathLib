import { expect } from 'chai'
import { gaussian_elimination_solve } from '../../src/numerical/gaussian_elimination'
import { Matrix } from '../../src/math/matrix'

describe(' Solve a linear system equations by Gaussian Elimination', () => {
    it('Gaussian Elimination method', () => {
        let J = new Matrix(3, 4, new Array(-2, -2, 0, -1, 2, 1, 1, 2, 4, 2, 3, 1))
        let A = gaussian_elimination_solve(J)
        expect(A[0]).to.equal(4.5)
        expect(A[1]).to.equal(-4)
        expect(A[2]).to.equal(-3)
    })
})
