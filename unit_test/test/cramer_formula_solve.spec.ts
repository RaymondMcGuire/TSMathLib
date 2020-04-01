import { expect } from 'chai'
import 'mocha'
import { cramer_formula_solve } from '../../src/numerical/cramer_formula'
import { Matrix } from '../../src/math/matrix'

describe(" Solve a linear system equations by Cramer's Formula", () => {
    it("Cramer's Formula method", () => {
        let A = new Matrix(2, 2, new Array(1, 2, 4, 5))
        let B = new Matrix(2, 1, new Array(3, 6))
        let X = cramer_formula_solve(A, B)
        expect(X[0]).to.equal(-1)
        expect(X[1]).to.equal(2)

        let A1 = new Matrix(3, 3, new Array(82, 45, 9, 27, 16, 3, 9, 5, 1))
        let B1 = new Matrix(3, 1, new Array(1, 1, 0))
        let X1 = cramer_formula_solve(A1, B1)
        expect(X1[0]).to.equal(1)
        expect(X1[1]).to.equal(1)
        expect(X1[2]).to.equal(-14)
    })
})
