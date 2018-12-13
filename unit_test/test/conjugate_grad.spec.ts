import { expect } from 'chai';
import { conjugate_grad } from '../../lib/conjugate_grad';
import { Vector } from '../../lib/vector';
import { Matrix } from '../../lib/matrix';

describe(" Solve a linear equation Ax = b", () => {
    it("conjugate gradient method", () => {
        let P = new Matrix(3, 3, new Array(7, 7, 7, 7, 1, 3, 1, 0, 3));
        let PT = new Matrix(3, 3, P.data());
        PT.transpose();
        let A = PT.mulMat(P);
        let b = new Vector(3);
        b.setOne();
        let x = conjugate_grad(A, b);
        let b_similar = A.mulVec(x).isSimilar(b, 1e-5);
        expect(b_similar).to.equal(true);
    });
});