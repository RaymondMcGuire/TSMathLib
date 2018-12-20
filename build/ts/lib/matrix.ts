/* =========================================================================
 *
 *  matrix.ts
 *  T-D vector data
 *  T:type,default setting is number
 *  D:dimension
 * ========================================================================= */
/// <reference path="./math_utils.ts" />
/// <reference path="./vector.ts" />
/// <reference path="./sparse_matrix.ts" />
/// <reference path="./interface.ts" />
module EMathLib {
    export class Matrix {

        private _elements: Array<number>;
        private _M: number;
        private _N: number;
        private _size: number;

        //constructs matrix with parameters or zero
        constructor(M: number, N: number, params?: Array<number>) {
            this._M = M;
            this._N = N;
            this._size = M * N;
            if (params == undefined) {
                //init M*N matrix data,setting all 0
                this._elements = new Array<number>(this.size());
                for (var _i = 0; _i < this.size(); _i++) {
                    this._elements[_i] = 0;
                }
            } else {
                //TODO check size
                this._elements = new Array<number>(this.size());
                for (var _i = 0; _i < params.length; _i++) {
                    this._elements[_i] = params[_i];
                }
            }
        }

        set(params: Matrix) {
            if (params.size() != this.size() || params.rows() != this.rows() || params.cols() != this.cols()) {
                console.log("dimension is not correct!");
                return undefined;
            }

            for (var _i = 0; _i < params.size(); _i++) {
                this._elements[_i] = params.data()[_i];
            }
        }

        data() { return this._elements; }

        getDataByIndexs(row: number, col: number) {
            let index = row * this._N + col;
            return this.data()[index];
        }

        setDataByIndexs(row: number, col: number, d: number) {
            let index = row * this._N + col;
            this.data()[index] = d;
        }

        size() { return this._size; }

        rows() { return this._M; }

        cols() { return this._N; }

        forEachIndex(indexs: MatrixIndex) {
            for (var _i = 0; _i < this.rows(); _i++) {
                for (var _j = 0; _j < this.cols(); _j++) {
                    indexs(_i, _j);
                }
            }
        }

        forEachData(data: MatrixData) {
            for (var _i = 0; _i < this.rows(); _i++) {
                for (var _j = 0; _j < this.cols(); _j++) {
                    data(this.getDataByIndexs(_i, _j));
                }
            }
        }

        forEachRow(row: MatrixSplit) {
            for (var _i = 0; _i < this.rows(); _i++) {
                let row_array = Array<number>(this.cols());
                for (var _j = 0; _j < this.cols(); _j++) {
                    row_array[_j] = this.getDataByIndexs(_i, _j);
                }
                row(row_array);
            }
        }

        forEachCol(col: MatrixSplit) {
            for (var _i = 0; _i < this.cols(); _i++) {
                let col_array = Array<number>(this.rows());
                for (var _j = 0; _j < this.rows(); _j++) {
                    col_array[_j] = this.getDataByIndexs(_j, _i);
                }
                col(col_array);
            }
        }

        private _ones() {
            let m = new Matrix(this.rows(), this.cols());
            m.forEachIndex((i, j) => {
                m.setDataByIndexs(i, j, 1);
            })
            return m;
        }

        ones() {
            this.set(this._ones());
        }

        private _values(v: number) {
            let m = new Matrix(this.rows(), this.cols());
            m.forEachIndex((i, j) => {
                m.setDataByIndexs(i, j, v);
            })
            return m;
        }

        setValues(v: number) {
            this.set(this._values(v));
        }

        private _random() {
            let m = new Matrix(this.rows(), this.cols());
            m.forEachIndex((i, j) => {
                m.setDataByIndexs(i, j, Math.random());
            });
            return m;
        }

        random() {
            this.set(this._random());
        }

        private _transpose() {
            let m = new Matrix(this.rows(), this.cols());
            m.forEachIndex((i, j) => {
                m.setDataByIndexs(i, j, this.getDataByIndexs(j, i));
            });
            return m;
        }

        mat2SpMat() {
            let data = new Array<[number, number, number]>();
            this.forEachIndex((i, j) => {
                let d = this.getDataByIndexs(i, j);
                if (d != 0) {
                    data.push([i, j, d]);
                }
            });
            return new SparseMatrix(this.rows(), this.cols(), data);
        }

        mat2Vec() {
            if (this.rows() != 1 && this.cols() != 1) {
                console.log("can not convert to vector!");
                return undefined;
            }

            let Vec = new Vector(this.size(), this.data());
            return Vec;
        }

        transpose() {
            this.set(this._transpose());
        }

        sub(m: Matrix) {
            let mm = new Matrix(this.rows(), this.cols());
            mm.forEachIndex((i, j) => {
                let result = this.getDataByIndexs(i, j) - m.getDataByIndexs(i, j);
                mm.setDataByIndexs(i, j, result);
            });
            return mm;
        }

        mulMat(m: Matrix) {
            //TODO check matrix shape is right or not
            //A.cols == B.rows
            let newM = this.rows();
            let newN = m.cols();
            let mm = new Matrix(newM, newN);
            mm.forEachIndex((i, j) => {
                let d = 0;

                for (var n = 0; n < this.cols(); n++) {
                    //console.log("-------------------------------")
                    //console.log(this.getDataByIndexs(i, n));
                    //console.log(m.getDataByIndexs(n, j))
                    //console.log(this.getDataByIndexs(i, n) * m.getDataByIndexs(n, j))

                    d += muldec(this.getDataByIndexs(i, n), m.getDataByIndexs(n, j));
                }

                mm.setDataByIndexs(i, j, d);
            });


            return mm;
        }

        mulVec(v: Vector) {
            //check shape
            if (v.size() != this.cols()) {
                console.log("vector shape is not right!");
                return undefined;
            }

            let vec2mat = new Matrix(v.size(), 1, v.data());
            let mat = this.mulMat(vec2mat);

            let vec = mat.mat2Vec();
            return vec;
        }

        same(m: Matrix) {
            //check matrix shape
            if (this.cols() != m.cols() || this.rows() != m.rows()) return false;

            //check elements
            this.forEachIndex((i, j) => {
                if (this.getDataByIndexs(i, j) != m.getDataByIndexs(i, j)) return false;
            });

            return true;
        }

        printMatrix() {
            let print_string = "[\n";
            this.forEachRow((r => {
                print_string += r.join(",");
                print_string += "\n";
            }));
            print_string += "]";
            console.log(print_string);
        }
    }
}