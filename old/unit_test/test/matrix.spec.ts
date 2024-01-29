import { expect } from 'chai'
import 'mocha'
import { Vector } from '../../src/math/vector'
import { Matrix } from '../../src/math/matrix'
import { SparseMatrix } from '../../src/math/sparse_matrix'
import { Matrix3x3, Vector3 } from '../../src/math'

describe('Matrix', () => {
    it('init full zero matrix', () => {
        let m = new Matrix(3, 3)
        m.forEachData(d => {
            expect(d).to.equal(0)
        })
    })

    it('init random matrix', () => {
        let m = new Matrix(3, 3)
        m.random()
        expect(0).to.equal(0)
        // m.printMatrix();
    })

    it('matrix transpose', () => {
        let m = new Matrix(3, 3, new Array(1, 2, 3, 3, 2, 1, 1, 2, 3)).transpose()
        let m1 = new Matrix(3, 3, new Array(1, 3, 1, 2, 2, 2, 3, 1, 3))
        expect(m.same(m1)).to.equal(true)
    })

    it('matrix multiply', () => {

        // correct result
        let m = new Matrix(3, 4, new Array(1, 2, 3, 4, 4, 3, 2, 1, 1,2,3,4))
        let m1 = new Matrix(4, 3, new Array(1,1,3,2,2,2,3,3,1,1,1,2))
        let m2 = new Matrix(3, 3, new Array(18,18,18,17,17,22,18,18,18))
        expect(m2.same(m.mulMat(m1))).to.equal(true)

        // error result
        let m3 = new Matrix(3, 3, new Array(1, 2, 3, 4, 4, 3, 2, 1, 1))
        let m4 = new Matrix(4, 3, new Array(1,1,3,2,2,2,3,3,1,1,1,2))
        let m5 = new Matrix(3,3).zeros()

        expect(m5.same(m3.mulMat(m4))).to.equal(true)
        
        // matrix multi vec
        let v = new Vector(3, new Array(0.2, 0.1, 0.1))
        let res_v = m2.mulVec(v)
        let b_equal = res_v.isEqual(new Vector(3, new Array(7.2, 7.3, 7.2)))
        expect(b_equal).to.equal(true)
    })

    it('matrix convert to vector', () => {
        let m = new Matrix(1, 9, new Array(1, 2, 3, 3, 2, 1, 1, 2, 3))
        let vec = m.mat2Vec()
        let b_equal = vec.isEqual(
            new Vector(9, new Array(1, 2, 3, 3, 2, 1, 1, 2, 3))
        )
        expect(b_equal).to.equal(true)
    })

    it('matrix convert to sparse matrix', () => {
        let m = new Matrix(3, 3, new Array(0, 0, 0, 0, 1, 0, 0, 0, 3))
        let spm = m.mat2SpMat()
        expect(spm.data()).to.eql(
            new Array<[number, number, number]>([1, 1, 1], [2, 2, 3])
        )
    })

    it('get matrix determinant by (i,j)', () => {
        let m = new Matrix(
            3,
            5,
            new Array(0, 0, 0, 0, 1, 0, 0, 0, 3, 3, 7, 4, 3, 6, 2)
        )
        // m.printMatrix();
        let d = m.getDeterminant(1, 3)
        // d.printMatrix();
        expect(d.data()).to.eql(new Array(0, 0, 0, 1, 7, 4, 3, 2))
    })

    describe('Sparse Matrix', () => {
        it('init sparse matrix', () => {
            let m = new SparseMatrix(
                4,
                7,
                new Array<[number, number, number]>(
                    [1, 3, 54],
                    [0, 1, 8],
                    [0, 3, 6],
                    [3, 4, -12],
                    [1, 2, 34],
                    [0, 6, 2],
                    [1, 6, 2],
                    [2, 0, -7]
                )
            )
            // m.printSparseMatrix();
            expect(m.data()).to.eql(
                new Array<[number, number, number]>(
                    [0, 1, 8],
                    [0, 3, 6],
                    [0, 6, 2],
                    [1, 2, 34],
                    [1, 3, 54],
                    [1, 6, 2],
                    [2, 0, -7],
                    [3, 4, -12]
                )
            )
        })

        it('sparse matrix transpose', () => {
            let m = new SparseMatrix(
                4,
                7,
                new Array<[number, number, number]>(
                    [1, 3, 54],
                    [0, 1, 8],
                    [0, 3, 6],
                    [3, 4, -12],
                    [1, 2, 34],
                    [0, 6, 2],
                    [1, 6, 2],
                    [2, 0, -7]
                )
            ).transpose()
            
            expect(m.data()).to.eql(
                new Array<[number, number, number]>(
                    [0, 2, -7],
                    [1, 0, 8],
                    [2, 1, 34],
                    [3, 0, 6],
                    [3, 1, 54],
                    [4, 3, -12],
                    [6, 0, 2],
                    [6, 1, 2]
                )
            )
        })

        it('sparse matrix multiply matrix', () => {
            let m = new SparseMatrix(
                3,
                10,
                new Array<[number, number, number]>([0, 1, 1], [1, 2, 1])
            )
            let m1 = new Matrix(
                10,
                2,
                new Array(3, 2, 4, 9, 1, 8, 5, 3, 2, 1, 3, 5, 6, 7, 8, 4, 2, 1, 3, 5)
            )
            let m2 = m.mulMat(m1)
            expect(m2.data()).to.eql(
                new Array<[number, number, number]>(
                    [0, 0, 4],
                    [0, 1, 9],
                    [1, 0, 1],
                    [1, 1, 8]
                )
            )

            let m3 = new SparseMatrix(
                3,
                3,
                new Array<[number, number, number]>([0, 1, 1])
            )
            let m4 = new Matrix(3, 1, new Array(3, 4, 1))
            let m5 = m3.mulMat(m4)
            expect(m5.data()).to.eql(new Array<[number, number, number]>([0, 0, 4]))

            let v = new Vector(10, new Array(3, 4, 1, 4, 5, 6, 1, 2, 3, 4))
            let v1 = m.mulVec(v)
            expect(v1.data()).to.eql(new Array<number>(4, 1, 0))
        })
    })
})

describe('Matrix3x3', () => {

    describe('Constructor', () => {
        it('construct ray', () => {
            let m3 = new Matrix3x3()
            expect(m3.data()).to.deep.equal([1, 0, 0, 0, 1, 0, 0, 0, 1])
            
            m3 = new Matrix3x3([1, 2, 3, 4, 5, 6, 7, 8, 9])
            expect(m3.data()).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9])
        })
    })

    describe('Method', () => {
        it('identity', () => {
            let m3 = new Matrix3x3([1, 2, 3, 4, 5, 6, 7, 8, 9])
            let m4 = m3.identity()
            expect(m3.data()).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9])
            expect(m4.data()).to.deep.equal([1, 0, 0, 0, 1, 0, 0, 0, 1])
        })

        it('multiply operation', () => {
            let m3 = new Matrix3x3([9.0, -8.0, 7.0, -6.0, 5.0, -4.0, 3.0, -2.0, 1.0])
            let vec = m3.mulV3(new Vector3(1, 2, 3))
            expect(vec.data()).to.deep.equal([14.0, -8.0, 2.0])

            let m4 = new Matrix3x3([1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0])
            let m5 = m3.mulMat(m4)
            expect(m5.data()).to.deep.equal([26.0, 34.0, 42.0, -14.0, -19.0, -24.0, 2.0, 4.0, 6.0])
        })
    })
})