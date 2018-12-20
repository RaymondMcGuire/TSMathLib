/* =========================================================================
 *
 *  sparse_matrix.ts
 *  M*N dimention sparse matrix
 * ========================================================================= */
/// <reference path="./vector.ts" />
/// <reference path="./matrix.ts" />
/// <reference path="./interface.ts" />
module EMathLib {
    export class SparseMatrix {

        private _elements: Array<[number, number, number]>; //row,col,data
        private _M: number;
        private _N: number;
        private _size: number;

        //constructs matrix with parameters or zero
        constructor(M: number, N: number, params?: Array<[number, number, number]>) {
            this._M = M;
            this._N = N;

            if (params == undefined) {
                this._size = 0;
                this._elements = new Array<[number, number, number]>();
            } else {
                this._size = params.length;

                this._elements = new Array<[number, number, number]>(this.size());
                for (var _i = 0; _i < params.length; _i++) {
                    this._elements[_i] = params[_i];
                }

                this._elements.sort((a, b) => {
                    if (a[0] < b[0])
                        return -1;
                    else if (a[0] > b[0])
                        return 1;
                    else if (a[0] == b[0]) {
                        if (a[1] < b[1])
                            return -1;
                        else if (a[1] > b[1])
                            return 1;
                    }
                    return 0;
                });
            }
        }

        size() { return this._size; }

        rows() { return this._M; }

        cols() { return this._N; }

        data() { return this._elements; }

        set(params: SparseMatrix) {
            if (params.rows() != this.rows() || params.cols() != this.cols()) {
                console.log("dimension is not correct!");
                return undefined;
            }

            this._size = params.size();
            this._elements = new Array<[number, number, number]>(this.size());
            for (var _i = 0; _i < params.size(); _i++) {
                this._elements[_i] = params.data()[_i];
            }
        }

        forEachData(smd: SparseMatrixData) {
            for (var _i = 0; _i < this.size(); _i++) {
                smd(this.data()[_i]);
            }
        }


        forEachIndex(indexs: MatrixIndex) {
            for (var _e = 0; _e < this.size(); _e++) {
                let e = this.data()[_e];
                indexs(e[0], e[1]);
            }
        }

        private _searchElemByRow(row: number): number {
            let e = this.data();
            for (var _i = 0; _i < e.length; _i++) {
                if (e[_i][0] == row) {
                    return _i;
                }
            }
            return -1;
        }

        private _searchElemByIndexs(row: number, col: number): number {
            let e = this.data();
            for (var _i = 0; _i < e.length; _i++) {
                if (e[_i][0] == row && e[_i][1] == col) {
                    return _i;
                }
            }
            return -1;
        }

        getDataByIndexs(row: number, col: number) {
            let idx = this._searchElemByIndexs(row, col);
            if (idx == -1) return 0;
            return this.data()[idx][2];
        }

        private setDataByRowCol(row: number, col: number, d: number) {
            let idx = this._searchElemByIndexs(row, col);
            if (idx == -1) {
                this._size += 1;
                this.data().push([row, col, d]);
            } else {
                this.data()[idx][2] = d;
            }
        }

        private addDataByIndexs(row: number, col: number, d: number) {
            this._size += 1;
            this.data().push([row, col, d]);
        }

        private setTupleByIndexs(n: [number, number, number]) {
            let idx = this._searchElemByIndexs(n[0], n[1]);
            if (idx == -1) {
                this._size += 1;
                this.data().push(n);
            } else {
                this.data()[idx] = n;
            }

        }

        private _transpose() {
            let m = new SparseMatrix(this.rows(), this.cols());
            this.forEachIndex((i, j) => {
                m.setTupleByIndexs([j, i, this.getDataByIndexs(i, j)]);
            });
            m.data().sort((a, b) => { if (a[0] < b[0]) return -1; else if (a[0] > b[0]) return 1; else if (a[0] == b[0]) { if (a[1] < b[1]) return -1; else if (a[1] > b[1]) return 1; } return 0; });
            return m;
        }

        transpose() {
            this.set(this._transpose());
        }

        mulMat(m: Matrix) {
            //TODO check matrix shape is right or not
            //A.cols == B.rows
            let newM = this.rows();
            let newN = m.cols();
            let mm = new SparseMatrix(newM, newN);

            //collect row->col
            let rowColMapping = new Array<Array<number>>(this.rows());
            for (var _i = 0; _i < this.rows(); _i++)rowColMapping[_i] = new Array<number>();

            this.forEachData((d) => {
                let r = d[0];
                let c = d[1];
                rowColMapping[r].push(c);
            });



            for (var _c = 0; _c < m.cols(); _c++) {
                let idx = 0;
                for (var _r = 0; _r < this.rows(); _r++) {
                    if (rowColMapping[_r].length == 0) continue;
                    let d = 0;
                    for (var _rc = 0; _rc < rowColMapping[_r].length; _rc++) {
                        let c = rowColMapping[_r][_rc];
                        let v = this.data()[idx][2];
                        idx++;

                        d += muldec(v, m.getDataByIndexs(c, _c));
                    }

                    if (d == 0) continue;

                    mm.addDataByIndexs(_r, _c, d);
                }
            }

            mm.data().sort((a, b) => { if (a[0] < b[0]) return -1; else if (a[0] > b[0]) return 1; else if (a[0] == b[0]) { if (a[1] < b[1]) return -1; else if (a[1] > b[1]) return 1; } return 0; });
            return mm;
        }

        spMat2Mat() {
            let m = new Matrix(this.rows(), this.cols());
            this.forEachData((d) => {
                m.setDataByIndexs(d[0], d[1], d[2]);
            });
            return m;
        }

        spMat2Vec() {
            if (this.rows() != 1 && this.cols() != 1) {
                console.log("can not convert to vector!");
                return undefined;
            }

            let _size = this.rows() * this.cols();
            let data = new Array<number>(_size);
            for (var _i = 0; _i < _size; _i++) {
                data[_i] = 0;
            }

            this.forEachData((d) => {
                let idx = d[this.rows() == 1 ? 1 : 0];
                data[idx] = d[2];
            });


            let Vec = new Vector(_size, data);
            return Vec;
        }

        mulVec(v: Vector) {
            //check shape
            if (v.size() != this.cols()) {
                console.log("vector shape is not right!");
                return undefined;
            }

            let vec2mat = new Matrix(v.size(), 1, v.data());
            let mat = this.mulMat(vec2mat);
            let vec = mat.spMat2Vec();
            return vec;
        }

        printSparseMatrix() {
            let print_string = "";
            this.forEachData((r => {
                print_string += "[" + r + "]";
            }));
            print_string += "";
            console.log(print_string);
        }
    }
}