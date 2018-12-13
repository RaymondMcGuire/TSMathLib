import { expect } from 'chai';
import { Vector } from '../../lib/vector';
import { Matrix } from '../../lib/matrix';

describe("Matrix", () => {
    it("init full zero matrix", () => {
        let m = new Matrix(3, 3);
        m.forEachData((d) => {
            expect(d).to.equal(0);
        });
    });

    it("init random matrix", () => {
        let m = new Matrix(3, 3);
        m.random();
        expect(0).to.equal(0);
        //m.printMatrix();
    });

    it("matrix transpose", () => {
        let m = new Matrix(3, 3, new Array(1, 2, 3, 3, 2, 1, 1, 2, 3));
        let m1 = new Matrix(3, 3, new Array(1, 3, 1, 2, 2, 2, 3, 1, 3));
        m.transpose();
        expect(m.same(m1)).to.equal(true);
    });


    it("matrix multiply", () => {
        let m = new Matrix(3, 3, new Array(1, 2, 3, 3, 2, 1, 1, 2, 3));
        let m1 = new Matrix(3, 3, new Array(1, 3, 1, 2, 2, 2, 3, 1, 3));
        let m2 = new Matrix(3, 3, new Array(13, 10, 13, 10, 13, 10, 13, 10, 13));
        expect(m2.same(m.mulMat(m1))).to.equal(true);

        let v = new Vector(3, new Array(0.2, 0.1, 0.1));
        let res_v = m.mulVec(v);
        let b_equal = res_v.isEqual(new Vector(3, new Array(0.7, 0.9, 0.7)));
        expect(b_equal).to.equal(true);
    });

    it("matrix convert to vector", () => {
        let m = new Matrix(1, 9, new Array(1, 2, 3, 3, 2, 1, 1, 2, 3));
        let vec = m.mat2Vec();
        let b_equal = vec.isEqual(new Vector(9, new Array(1, 2, 3, 3, 2, 1, 1, 2, 3)));
        expect(b_equal).to.equal(true);
    });
});