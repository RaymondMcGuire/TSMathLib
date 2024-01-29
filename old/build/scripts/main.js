/* =========================================================================
 *
 *  math_utils.ts
 *  simple math functions
 * ========================================================================= */
var EMathLib;
(function (EMathLib) {
    function absMax(x, y) {
        return (x * x > y * y) ? x : y;
    }
    EMathLib.absMax = absMax;
    function absMin(x, y) {
        return (x * x < y * y) ? x : y;
    }
    EMathLib.absMin = absMin;
    function muldec(x, y) {
        return ((x * 10) * (y * 10)) / 100;
    }
    EMathLib.muldec = muldec;
})(EMathLib || (EMathLib = {}));
/* =========================================================================
 *
 *  vector.ts
 *  T-D vector data
 *  T:type,default setting is number
 *  D:dimension
 * ========================================================================= */
/// <reference path="./math_utils.ts" />
var EMathLib;
(function (EMathLib) {
    var Vector = /** @class */ (function () {
        //constructs vector with parameters or zero
        function Vector(dimension, params) {
            this._dimension = dimension;
            if (params == undefined) {
                //init n dimension vector data,setting all 0
                this._elements = new Array(dimension);
                for (var _i = 0; _i < dimension; _i++) {
                    this._elements[_i] = 0;
                }
            }
            else {
                this._elements = new Array(dimension);
                for (var _i = 0; _i < params.length; _i++) {
                    this._elements[_i] = params[_i];
                }
            }
        }
        Vector.prototype.set = function (params) {
            if (params.size() != this.size()) {
                console.log("dimension is not correct!");
                return undefined;
            }
            for (var _i = 0; _i < params.size(); _i++) {
                this._elements[_i] = params.data()[_i];
            }
        };
        Vector.prototype.setZero = function () {
            for (var _i = 0; _i < this._dimension; _i++) {
                this._elements[_i] = 0;
            }
        };
        Vector.prototype.setOne = function () {
            for (var _i = 0; _i < this._dimension; _i++) {
                this._elements[_i] = 1;
            }
        };
        Vector.prototype.data = function () { return this._elements; };
        Vector.prototype.at = function (idx) {
            if (idx < 0 || idx >= this.size()) {
                console.log("index is not correct!");
                return undefined;
            }
            return this._elements[idx];
        };
        Vector.prototype.dot = function (others) {
            if (others.size() != this.size()) {
                console.log("dimension is not correct!");
                return undefined;
            }
            var ret = 0;
            for (var _i = 0; _i < this.size(); _i++) {
                ret += this._elements[_i] * others.data()[_i];
            }
            return ret;
        };
        Vector.prototype.lengthSquared = function () { return this.dot(this); };
        Vector.prototype.length = function () { return Math.sqrt(this.lengthSquared()); };
        Vector.prototype.normalize = function () { this.idiv(this.length()); };
        Vector.prototype.sum = function () {
            var ret = 0;
            for (var _i = 0; _i < this._dimension; _i++) {
                ret += this._elements[_i];
            }
            return ret;
        };
        Vector.prototype.size = function () { return this._dimension; };
        Vector.prototype.avg = function () { return this.sum() / this.size(); };
        Vector.prototype.min = function () {
            var minVal = this._elements[0];
            for (var _i = 1; _i < this._dimension; _i++) {
                minVal = Math.min(minVal, this._elements[_i]);
            }
            return minVal;
        };
        Vector.prototype.max = function () {
            var maxVal = this._elements[0];
            for (var _i = 1; _i < this._dimension; _i++) {
                maxVal = Math.max(maxVal, this._elements[_i]);
            }
            return maxVal;
        };
        Vector.prototype.absmax = function () {
            var absMaxVal = this._elements[0];
            for (var _i = 1; _i < this._dimension; _i++) {
                absMaxVal = EMathLib.absMax(absMaxVal, this._elements[_i]);
            }
            return absMaxVal;
        };
        Vector.prototype.absmin = function () {
            var absMinVal = this._elements[0];
            for (var _i = 1; _i < this._dimension; _i++) {
                absMinVal = EMathLib.absMin(absMinVal, this._elements[_i]);
            }
            return absMinVal;
        };
        Vector.prototype.distanceSquaredTo = function (others) {
            if (others.size() != this.size()) {
                console.log("dimension is not correct!");
                return undefined;
            }
            var ret = 0;
            for (var _i = 0; _i < this.size(); _i++) {
                var diff = this._elements[_i] - others.data()[_i];
                ret += diff * diff;
            }
            return ret;
        };
        Vector.prototype.distanceTo = function (others) {
            return Math.sqrt(this.distanceSquaredTo(others));
        };
        Vector.prototype.isEqual = function (others) {
            if (this.size() != others.size())
                return false;
            for (var _i = 0; _i < this.size(); _i++) {
                if (this.at(_i) != others.at(_i))
                    return false;
            }
            return true;
        };
        Vector.prototype.isSimilar = function (others, epsilon) {
            if (this.size() != others.size())
                return false;
            for (var _i = 0; _i < this.size(); _i++) {
                if (Math.abs(this.at(_i) - others.at(_i)) > epsilon)
                    return false;
            }
            return true;
        };
        Vector.prototype.add = function (params) {
            if (typeof (params) == 'object') {
                var v = params;
                if (v.size() != this.size())
                    return undefined;
                var newV = new Vector(this.size(), this.data());
                for (var _i = 0; _i < newV.size(); _i++) {
                    newV.data()[_i] += v.data()[_i];
                }
                return newV;
            }
            else if (typeof (params) == 'number') {
                var s = params;
                var newV = new Vector(this.size(), this.data());
                for (var _i = 0; _i < newV.size(); _i++) {
                    newV.data()[_i] += s;
                }
                return newV;
            }
            return undefined;
        };
        Vector.prototype.sub = function (params) {
            if (typeof (params) == 'object') {
                var v = params;
                if (v.size() != this.size())
                    return undefined;
                var newV = new Vector(this.size(), this.data());
                for (var _i = 0; _i < newV.size(); _i++) {
                    newV.data()[_i] -= v.data()[_i];
                }
                return newV;
            }
            else if (typeof (params) == 'number') {
                var s = params;
                var newV = new Vector(this.size(), this.data());
                for (var _i = 0; _i < newV.size(); _i++) {
                    newV.data()[_i] -= s;
                }
                return newV;
            }
            return undefined;
        };
        Vector.prototype.mul = function (params) {
            if (typeof (params) == 'object') {
                var v = params;
                if (v.size() != this.size())
                    return undefined;
                var newV = new Vector(this.size(), this.data());
                for (var _i = 0; _i < newV.size(); _i++) {
                    newV.data()[_i] *= v.data()[_i];
                }
                return newV;
            }
            else if (typeof (params) == 'number') {
                var s = params;
                var newV = new Vector(this.size(), this.data());
                for (var _i = 0; _i < newV.size(); _i++) {
                    newV.data()[_i] *= s;
                }
                return newV;
            }
            return undefined;
        };
        Vector.prototype.div = function (params) {
            if (typeof (params) == 'object') {
                var v = params;
                if (v.size() != this.size())
                    return undefined;
                var newV = new Vector(this.size(), this.data());
                for (var _i = 0; _i < newV.size(); _i++) {
                    newV.data()[_i] /= v.data()[_i];
                }
                return newV;
            }
            else if (typeof (params) == 'number') {
                var s = params;
                if (s == 0)
                    return undefined;
                var newV = new Vector(this.size(), this.data());
                for (var _i = 0; _i < newV.size(); _i++) {
                    newV.data()[_i] /= s;
                }
                return newV;
            }
            return undefined;
        };
        Vector.prototype.idiv = function (params) { this.set(this.div(params)); };
        Vector.prototype.iadd = function (params) { this.set(this.add(params)); };
        Vector.prototype.isub = function (params) { this.set(this.sub(params)); };
        Vector.prototype.imul = function (params) { this.set(this.mul(params)); };
        Vector.prototype.setAt = function (idx, val) {
            if (idx < 0 || idx >= this.size()) {
                return undefined;
            }
            this._elements[idx] = val;
        };
        return Vector;
    }());
    EMathLib.Vector = Vector;
})(EMathLib || (EMathLib = {}));
/* =========================================================================
 *
 *  interface.ts
 *  interface for some functions
 * ========================================================================= */
var EMathLib;
(function (EMathLib) {
    ;
    ;
    ;
    ;
})(EMathLib || (EMathLib = {}));
/* =========================================================================
 *
 *  sparse_matrix.ts
 *  M*N dimention sparse matrix
 * ========================================================================= */
/// <reference path="./vector.ts" />
/// <reference path="./matrix.ts" />
/// <reference path="./interface.ts" />
var EMathLib;
(function (EMathLib) {
    var SparseMatrix = /** @class */ (function () {
        //constructs matrix with parameters or zero
        function SparseMatrix(M, N, params) {
            this._M = M;
            this._N = N;
            if (params == undefined) {
                this._size = 0;
                this._elements = new Array();
            }
            else {
                this._size = params.length;
                this._elements = new Array(this.size());
                for (var _i = 0; _i < params.length; _i++) {
                    this._elements[_i] = params[_i];
                }
                this._elements.sort(function (a, b) {
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
        SparseMatrix.prototype.size = function () { return this._size; };
        SparseMatrix.prototype.rows = function () { return this._M; };
        SparseMatrix.prototype.cols = function () { return this._N; };
        SparseMatrix.prototype.data = function () { return this._elements; };
        SparseMatrix.prototype.set = function (params) {
            if (params.rows() != this.rows() || params.cols() != this.cols()) {
                console.log("dimension is not correct!");
                return undefined;
            }
            this._size = params.size();
            this._elements = new Array(this.size());
            for (var _i = 0; _i < params.size(); _i++) {
                this._elements[_i] = params.data()[_i];
            }
        };
        SparseMatrix.prototype.forEachData = function (smd) {
            for (var _i = 0; _i < this.size(); _i++) {
                smd(this.data()[_i]);
            }
        };
        SparseMatrix.prototype.forEachIndex = function (indexs) {
            for (var _e = 0; _e < this.size(); _e++) {
                var e = this.data()[_e];
                indexs(e[0], e[1]);
            }
        };
        SparseMatrix.prototype._searchElemByRow = function (row) {
            var e = this.data();
            for (var _i = 0; _i < e.length; _i++) {
                if (e[_i][0] == row) {
                    return _i;
                }
            }
            return -1;
        };
        SparseMatrix.prototype._searchElemByIndexs = function (row, col) {
            var e = this.data();
            for (var _i = 0; _i < e.length; _i++) {
                if (e[_i][0] == row && e[_i][1] == col) {
                    return _i;
                }
            }
            return -1;
        };
        SparseMatrix.prototype.getDataByIndexs = function (row, col) {
            var idx = this._searchElemByIndexs(row, col);
            if (idx == -1)
                return 0;
            return this.data()[idx][2];
        };
        SparseMatrix.prototype.setDataByRowCol = function (row, col, d) {
            var idx = this._searchElemByIndexs(row, col);
            if (idx == -1) {
                this._size += 1;
                this.data().push([row, col, d]);
            }
            else {
                this.data()[idx][2] = d;
            }
        };
        SparseMatrix.prototype.addDataByIndexs = function (row, col, d) {
            this._size += 1;
            this.data().push([row, col, d]);
        };
        SparseMatrix.prototype.setTupleByIndexs = function (n) {
            var idx = this._searchElemByIndexs(n[0], n[1]);
            if (idx == -1) {
                this._size += 1;
                this.data().push(n);
            }
            else {
                this.data()[idx] = n;
            }
        };
        SparseMatrix.prototype._transpose = function () {
            var _this = this;
            var m = new SparseMatrix(this.rows(), this.cols());
            this.forEachIndex(function (i, j) {
                m.setTupleByIndexs([j, i, _this.getDataByIndexs(i, j)]);
            });
            m.data().sort(function (a, b) { if (a[0] < b[0])
                return -1;
            else if (a[0] > b[0])
                return 1;
            else if (a[0] == b[0]) {
                if (a[1] < b[1])
                    return -1;
                else if (a[1] > b[1])
                    return 1;
            } return 0; });
            return m;
        };
        SparseMatrix.prototype.transpose = function () {
            this.set(this._transpose());
        };
        SparseMatrix.prototype.mulMat = function (m) {
            //TODO check matrix shape is right or not
            //A.cols == B.rows
            var newM = this.rows();
            var newN = m.cols();
            var mm = new SparseMatrix(newM, newN);
            //collect row->col
            var rowColMapping = new Array(this.rows());
            for (var _i = 0; _i < this.rows(); _i++)
                rowColMapping[_i] = new Array();
            this.forEachData(function (d) {
                var r = d[0];
                var c = d[1];
                rowColMapping[r].push(c);
            });
            for (var _c = 0; _c < m.cols(); _c++) {
                var idx = 0;
                for (var _r = 0; _r < this.rows(); _r++) {
                    if (rowColMapping[_r].length == 0)
                        continue;
                    var d = 0;
                    for (var _rc = 0; _rc < rowColMapping[_r].length; _rc++) {
                        var c = rowColMapping[_r][_rc];
                        var v = this.data()[idx][2];
                        idx++;
                        d += EMathLib.muldec(v, m.getDataByIndexs(c, _c));
                    }
                    if (d == 0)
                        continue;
                    mm.addDataByIndexs(_r, _c, d);
                }
            }
            mm.data().sort(function (a, b) { if (a[0] < b[0])
                return -1;
            else if (a[0] > b[0])
                return 1;
            else if (a[0] == b[0]) {
                if (a[1] < b[1])
                    return -1;
                else if (a[1] > b[1])
                    return 1;
            } return 0; });
            return mm;
        };
        SparseMatrix.prototype.spMat2Mat = function () {
            var m = new EMathLib.Matrix(this.rows(), this.cols());
            this.forEachData(function (d) {
                m.setDataByIndexs(d[0], d[1], d[2]);
            });
            return m;
        };
        SparseMatrix.prototype.spMat2Vec = function () {
            var _this = this;
            if (this.rows() != 1 && this.cols() != 1) {
                console.log("can not convert to vector!");
                return undefined;
            }
            var _size = this.rows() * this.cols();
            var data = new Array(_size);
            for (var _i = 0; _i < _size; _i++) {
                data[_i] = 0;
            }
            this.forEachData(function (d) {
                var idx = d[_this.rows() == 1 ? 1 : 0];
                data[idx] = d[2];
            });
            var Vec = new EMathLib.Vector(_size, data);
            return Vec;
        };
        SparseMatrix.prototype.mulVec = function (v) {
            //check shape
            if (v.size() != this.cols()) {
                console.log("vector shape is not right!");
                return undefined;
            }
            var vec2mat = new EMathLib.Matrix(v.size(), 1, v.data());
            var mat = this.mulMat(vec2mat);
            var vec = mat.spMat2Vec();
            return vec;
        };
        SparseMatrix.prototype.printSparseMatrix = function () {
            var print_string = "";
            this.forEachData((function (r) {
                print_string += "[" + r + "]";
            }));
            print_string += "";
            console.log(print_string);
        };
        return SparseMatrix;
    }());
    EMathLib.SparseMatrix = SparseMatrix;
})(EMathLib || (EMathLib = {}));
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
var EMathLib;
(function (EMathLib) {
    var Matrix = /** @class */ (function () {
        //constructs matrix with parameters or zero
        function Matrix(M, N, params) {
            this._M = M;
            this._N = N;
            this._size = M * N;
            if (params == undefined) {
                //init M*N matrix data,setting all 0
                this._elements = new Array(this.size());
                for (var _i = 0; _i < this.size(); _i++) {
                    this._elements[_i] = 0;
                }
            }
            else {
                //TODO check size
                this._elements = new Array(this.size());
                for (var _i = 0; _i < params.length; _i++) {
                    this._elements[_i] = params[_i];
                }
            }
        }
        Matrix.prototype.set = function (params) {
            if (params.size() != this.size() || params.rows() != this.rows() || params.cols() != this.cols()) {
                console.log("dimension is not correct!");
                return undefined;
            }
            for (var _i = 0; _i < params.size(); _i++) {
                this._elements[_i] = params.data()[_i];
            }
        };
        Matrix.prototype.data = function () { return this._elements; };
        Matrix.prototype.getDataByIndexs = function (row, col) {
            var index = row * this._N + col;
            return this.data()[index];
        };
        Matrix.prototype.setDataByIndexs = function (row, col, d) {
            var index = row * this._N + col;
            this.data()[index] = d;
        };
        Matrix.prototype.size = function () { return this._size; };
        Matrix.prototype.rows = function () { return this._M; };
        Matrix.prototype.cols = function () { return this._N; };
        Matrix.prototype.forEachIndex = function (indexs) {
            for (var _i = 0; _i < this.rows(); _i++) {
                for (var _j = 0; _j < this.cols(); _j++) {
                    indexs(_i, _j);
                }
            }
        };
        Matrix.prototype.forEachData = function (data) {
            for (var _i = 0; _i < this.rows(); _i++) {
                for (var _j = 0; _j < this.cols(); _j++) {
                    data(this.getDataByIndexs(_i, _j));
                }
            }
        };
        Matrix.prototype.forEachRow = function (row) {
            for (var _i = 0; _i < this.rows(); _i++) {
                var row_array = Array(this.cols());
                for (var _j = 0; _j < this.cols(); _j++) {
                    row_array[_j] = this.getDataByIndexs(_i, _j);
                }
                row(row_array);
            }
        };
        Matrix.prototype.forEachCol = function (col) {
            for (var _i = 0; _i < this.cols(); _i++) {
                var col_array = Array(this.rows());
                for (var _j = 0; _j < this.rows(); _j++) {
                    col_array[_j] = this.getDataByIndexs(_j, _i);
                }
                col(col_array);
            }
        };
        Matrix.prototype._ones = function () {
            var m = new Matrix(this.rows(), this.cols());
            m.forEachIndex(function (i, j) {
                m.setDataByIndexs(i, j, 1);
            });
            return m;
        };
        Matrix.prototype.ones = function () {
            this.set(this._ones());
        };
        Matrix.prototype._values = function (v) {
            var m = new Matrix(this.rows(), this.cols());
            m.forEachIndex(function (i, j) {
                m.setDataByIndexs(i, j, v);
            });
            return m;
        };
        Matrix.prototype.setValues = function (v) {
            this.set(this._values(v));
        };
        Matrix.prototype._random = function () {
            var m = new Matrix(this.rows(), this.cols());
            m.forEachIndex(function (i, j) {
                m.setDataByIndexs(i, j, Math.random());
            });
            return m;
        };
        Matrix.prototype.random = function () {
            this.set(this._random());
        };
        Matrix.prototype._transpose = function () {
            var _this = this;
            var m = new Matrix(this.rows(), this.cols());
            m.forEachIndex(function (i, j) {
                m.setDataByIndexs(i, j, _this.getDataByIndexs(j, i));
            });
            return m;
        };
        Matrix.prototype.mat2SpMat = function () {
            var _this = this;
            var data = new Array();
            this.forEachIndex(function (i, j) {
                var d = _this.getDataByIndexs(i, j);
                if (d != 0) {
                    data.push([i, j, d]);
                }
            });
            return new EMathLib.SparseMatrix(this.rows(), this.cols(), data);
        };
        Matrix.prototype.mat2Vec = function () {
            if (this.rows() != 1 && this.cols() != 1) {
                console.log("can not convert to vector!");
                return undefined;
            }
            var Vec = new EMathLib.Vector(this.size(), this.data());
            return Vec;
        };
        Matrix.prototype.transpose = function () {
            this.set(this._transpose());
        };
        Matrix.prototype.sub = function (m) {
            var _this = this;
            var mm = new Matrix(this.rows(), this.cols());
            mm.forEachIndex(function (i, j) {
                var result = _this.getDataByIndexs(i, j) - m.getDataByIndexs(i, j);
                mm.setDataByIndexs(i, j, result);
            });
            return mm;
        };
        Matrix.prototype.mulMat = function (m) {
            var _this = this;
            //TODO check matrix shape is right or not
            //A.cols == B.rows
            var newM = this.rows();
            var newN = m.cols();
            var mm = new Matrix(newM, newN);
            mm.forEachIndex(function (i, j) {
                var d = 0;
                for (var n = 0; n < _this.cols(); n++) {
                    //console.log("-------------------------------")
                    //console.log(this.getDataByIndexs(i, n));
                    //console.log(m.getDataByIndexs(n, j))
                    //console.log(this.getDataByIndexs(i, n) * m.getDataByIndexs(n, j))
                    d += EMathLib.muldec(_this.getDataByIndexs(i, n), m.getDataByIndexs(n, j));
                }
                mm.setDataByIndexs(i, j, d);
            });
            return mm;
        };
        Matrix.prototype.mulVec = function (v) {
            //check shape
            if (v.size() != this.cols()) {
                console.log("vector shape is not right!");
                return undefined;
            }
            var vec2mat = new Matrix(v.size(), 1, v.data());
            var mat = this.mulMat(vec2mat);
            var vec = mat.mat2Vec();
            return vec;
        };
        Matrix.prototype.same = function (m) {
            var _this = this;
            //check matrix shape
            if (this.cols() != m.cols() || this.rows() != m.rows())
                return false;
            //check elements
            this.forEachIndex(function (i, j) {
                if (_this.getDataByIndexs(i, j) != m.getDataByIndexs(i, j))
                    return false;
            });
            return true;
        };
        Matrix.prototype.printMatrix = function () {
            var print_string = "[\n";
            this.forEachRow((function (r) {
                print_string += r.join(",");
                print_string += "\n";
            }));
            print_string += "]";
            console.log(print_string);
        };
        return Matrix;
    }());
    EMathLib.Matrix = Matrix;
})(EMathLib || (EMathLib = {}));
/// <reference path="./matrix.ts" />
/// <reference path="./vector.ts" />
/* =========================================================================
 *
 *  conjugate_grad.ts
 *  Solve a linear equation Ax = b with conjugate gradient method.
 *
 *  Parameters
 *  ----------
 *  A: 2d positive semi-definite (symmetric) matrix
 *  b: 1d array
 *  x: 1d array of initial point
 *
 *  Return
 *  ----------
 *  1d array x such that Ax = b
 * ========================================================================= */
var EMathLib;
(function (EMathLib) {
    function conjugate_grad(A, b, x) {
        //TODO:judge A is a "positive semi-definite matrix", tip:using "Cholesky decomposition"
        var n = b.size();
        if (x == undefined) {
            x = new EMathLib.Vector(b.size());
            x.setOne();
        }
        var r = A.mulVec(x).sub(b);
        var p = r.mul(-1);
        var r_k_norm = r.dot(r);
        for (var _i = 0; _i < 2 * n; _i++) {
            var Ap = A.mulVec(p);
            var alpha = r_k_norm / p.dot(Ap);
            x.iadd(p.mul(alpha));
            r.iadd(Ap.mul(alpha));
            var r_kplus1_norm = r.dot(r);
            var beta = r_kplus1_norm / r_k_norm;
            r_k_norm = r_kplus1_norm;
            if (r_kplus1_norm < 1e-5) {
                //console.log('compute finished!');
                break;
            }
            p = p.mul(beta).sub(r);
        }
        return x;
    }
    EMathLib.conjugate_grad = conjugate_grad;
    function conjugate_grad_spMatrix(A, b, x) {
        //TODO:judge A is a "positive semi-definite matrix", tip:using "Cholesky decomposition"
        var n = b.size();
        if (x == undefined) {
            x = new EMathLib.Vector(b.size());
            x.setOne();
        }
        var r = A.mulVec(x).sub(b);
        var p = r.mul(-1);
        var r_k_norm = r.dot(r);
        for (var _i = 0; _i < 2 * n; _i++) {
            var Ap = A.mulVec(p);
            var alpha = r_k_norm / p.dot(Ap);
            x.iadd(p.mul(alpha));
            r.iadd(Ap.mul(alpha));
            var r_kplus1_norm = r.dot(r);
            var beta = r_kplus1_norm / r_k_norm;
            r_k_norm = r_kplus1_norm;
            if (r_kplus1_norm < 1e-5) {
                //console.log('compute finished!');
                break;
            }
            p = p.mul(beta).sub(r);
        }
        return x;
    }
    EMathLib.conjugate_grad_spMatrix = conjugate_grad_spMatrix;
})(EMathLib || (EMathLib = {}));
var EDsLib;
(function (EDsLib) {
    ;
    var HashSet = /** @class */ (function () {
        function HashSet() {
            this.items = {};
        }
        HashSet.prototype.set = function (key, value) {
            this.items[key] = value;
        };
        HashSet.prototype["delete"] = function (key) {
            return delete this.items[key];
        };
        HashSet.prototype.has = function (key) {
            return key in this.items;
        };
        HashSet.prototype.get = function (key) {
            return this.items[key];
        };
        HashSet.prototype.len = function () {
            return Object.keys(this.items).length;
        };
        HashSet.prototype.forEach = function (f) {
            for (var k in this.items) {
                if (this.items.hasOwnProperty(k)) {
                    f(k, this.items[k]);
                }
            }
        };
        return HashSet;
    }());
    EDsLib.HashSet = HashSet;
})(EDsLib || (EDsLib = {}));
/// <reference path="../ds/hashset.ts" />
var ECvLib;
(function (ECvLib) {
    var SimpleImageLoadSystem = /** @class */ (function () {
        function SimpleImageLoadSystem(paths, callback) {
            var _this = this;
            var images = new EDsLib.HashSet();
            this.loadedImages = 0;
            this.numImages = paths.len();
            paths.forEach(function (k, v) {
                images.set(k, new Image());
                images.get(k).onload = function () {
                    if (++_this.loadedImages >= _this.numImages) {
                        console.log("images loaded!");
                        callback(images);
                    }
                };
                images.get(k).src = v;
            });
            this.images = images;
        }
        return SimpleImageLoadSystem;
    }());
    ECvLib.SimpleImageLoadSystem = SimpleImageLoadSystem;
})(ECvLib || (ECvLib = {}));
/// <reference path="../lib/matrix.ts" />
/// <reference path="../lib/interface.ts" />
var ECvLib;
(function (ECvLib) {
    var MatHxWx3 = /** @class */ (function () {
        function MatHxWx3(imData, height, width) {
            this._CHANNEL = 3;
            this._H = height;
            this._W = width;
            var r = new EMathLib.Matrix(height, width);
            var g = new EMathLib.Matrix(height, width);
            var b = new EMathLib.Matrix(height, width);
            for (var _h = 0; _h < height; _h++) {
                for (var _w = 0; _w < width; _w++) {
                    var index = (_h * width + _w) * 4;
                    r.setDataByIndexs(_h, _w, imData.data[index + 0]);
                    g.setDataByIndexs(_h, _w, imData.data[index + 1]);
                    b.setDataByIndexs(_h, _w, imData.data[index + 2]);
                }
            }
            this._DATA = new Array(this._CHANNEL);
            this._DATA[0] = r;
            this._DATA[1] = g;
            this._DATA[2] = b;
        }
        MatHxWx3.prototype.forEachIndex = function (indexs) {
            for (var _j = 0; _j < this._H; _j++) {
                for (var _i = 0; _i < this._W; _i++) {
                    indexs(_j, _i);
                }
            }
        };
        MatHxWx3.prototype.getDataByIndexs = function (j, i) {
            var r = this.R().getDataByIndexs(j, i);
            var g = this.G().getDataByIndexs(j, i);
            var b = this.B().getDataByIndexs(j, i);
            return [r, g, b];
        };
        MatHxWx3.prototype.setDataByIndexs = function (j, i, v) {
            this._DATA[0].setDataByIndexs(j, i, v[0]);
            this._DATA[1].setDataByIndexs(j, i, v[1]);
            this._DATA[2].setDataByIndexs(j, i, v[2]);
        };
        MatHxWx3.prototype.showMaskRegion = function (mask) {
            var _this = this;
            if (mask.shape()[0] != this.shape()[0] || mask.shape()[1] != this.shape()[1] || mask.shape()[2] != this.shape()[2]) {
                console.log("mask shape is wrong!");
                return undefined;
            }
            this.forEachIndex(function (j, i) {
                var imdata = _this.getDataByIndexs(j, i);
                var maskdata = mask.getDataByIndexs(j, i);
                var v = new Array(imdata[0] * maskdata[0] / 255, imdata[1] * maskdata[1] / 255, imdata[2] * maskdata[2] / 255);
                _this.setDataByIndexs(j, i, v);
            });
        };
        MatHxWx3.prototype.getROIData = function (top, left, height, width) {
            var roi_r = new EMathLib.Matrix(height, width);
            var roi_g = new EMathLib.Matrix(height, width);
            var roi_b = new EMathLib.Matrix(height, width);
            for (var _j = top; _j < top + height; _j++) {
                for (var _i = left; _i < left + width; _i++) {
                    var d = this.getDataByIndexs(_j, _i);
                    roi_r.setDataByIndexs(_j - top, _i - left, d[0]);
                    roi_g.setDataByIndexs(_j - top, _i - left, d[1]);
                    roi_b.setDataByIndexs(_j - top, _i - left, d[2]);
                }
            }
            return [roi_r, roi_g, roi_b];
        };
        MatHxWx3.prototype.setROIData = function (top, left, roi) {
            var height = roi[0].rows();
            var width = roi[0].cols();
            for (var _j = top; _j < top + height; _j++) {
                for (var _i = left; _i < left + width; _i++) {
                    var d = new Array(roi[0].getDataByIndexs(_j - top, _i - left), roi[1].getDataByIndexs(_j - top, _i - left), roi[2].getDataByIndexs(_j - top, _i - left));
                    this.setDataByIndexs(_j, _i, d);
                }
            }
        };
        MatHxWx3.prototype.shape = function () {
            return [this._H, this._W, this._CHANNEL];
        };
        MatHxWx3.prototype.R = function () {
            return this._DATA[0];
        };
        MatHxWx3.prototype.G = function () {
            return this._DATA[1];
        };
        MatHxWx3.prototype.B = function () {
            return this._DATA[2];
        };
        return MatHxWx3;
    }());
    ECvLib.MatHxWx3 = MatHxWx3;
})(ECvLib || (ECvLib = {}));
var EUtilsLib;
(function (EUtilsLib) {
    var TimeRecorder = /** @class */ (function () {
        function TimeRecorder() {
            this._start = new Date();
            this._end = new Date();
            this._totalTime = 0;
        }
        TimeRecorder.prototype.start = function () {
            this._start = new Date();
        };
        TimeRecorder.prototype.end = function () {
            this._end = new Date();
        };
        TimeRecorder.prototype.printTotalTime = function () {
            console.log("Total time:" + this._totalTime);
        };
        TimeRecorder.prototype.printElapsedTime = function () {
            var timeDiff = this._end - this._start; //in ms
            var seconds = timeDiff / 1000;
            this._totalTime += seconds;
            console.log("elapsed time:" + seconds + " seconds");
        };
        return TimeRecorder;
    }());
    EUtilsLib.TimeRecorder = TimeRecorder;
})(EUtilsLib || (EUtilsLib = {}));
/// <reference path="../lib/conjugate_grad.ts" />
/// <reference path="../lib/vector.ts" />
/// <reference path="../lib/matrix.ts" />
/// <reference path="../ds/hashset.ts" />
/// <reference path="../cv/s_imload.ts" />
/// <reference path="../cv/matHW3.ts" />
/// <reference path="../utils/timer.ts" />
var timer = new EUtilsLib.TimeRecorder();
var cvs_target = document.getElementById("cvs_target");
var cvs_source = document.getElementById("cvs_source");
var cvs_target_mask = document.getElementById("cvs_target_mask");
var cvs_source_mask = document.getElementById("cvs_source_mask");
var cvs_synthesis = document.getElementById("cvs_synthesis");
var cvs_preview = document.getElementById("cvs_preview");
var card_target = document.getElementById("card_target");
var card_source = document.getElementById("card_source");
var card_target_mask = document.getElementById("card_target_mask");
var card_source_mask = document.getElementById("card_source_mask");
var card_synthesis = document.getElementById("card_synthesis");
var card_preview = document.getElementById("card_preview");
var btn_PIE = document.getElementById("btn_PIE");
var paths = new EDsLib.HashSet();
paths.set("mona_target", "./images/mona-target.jpg");
paths.set("cat_source", "./images/cat-source.jpg");
function clip(v, min, max) {
    if (v < min)
        v = min;
    if (v > max)
        v = max;
    return v;
}
var ImagesLoadSys = new ECvLib.SimpleImageLoadSystem(paths, function (images) {
    var mona_target = images.get("mona_target");
    var cat_source = images.get("cat_source");
    cvs_target.height = mona_target.height;
    cvs_target.width = mona_target.width;
    card_target.style.width = mona_target.width;
    var height = cvs_target.height;
    var width = cvs_target.width;
    cvs_source.height = cat_source.height;
    cvs_source.width = cat_source.width;
    card_source.style.width = cat_source.width;
    var context_target = cvs_target.getContext('2d');
    context_target.drawImage(mona_target, 0, 0);
    var imageData_target = context_target.getImageData(0, 0, width, height);
    //preview canvas
    cvs_preview.height = mona_target.height;
    cvs_preview.width = mona_target.width;
    card_preview.style.width = mona_target.width;
    var context_preview = cvs_preview.getContext('2d');
    context_preview.drawImage(mona_target, 0, 0);
    //target mask canvas
    cvs_target_mask.height = height;
    cvs_target_mask.width = width;
    card_target_mask.style.width = mona_target.width;
    var context_target_mask = cvs_target_mask.getContext('2d');
    context_target_mask.clearRect(0, 0, width, height);
    context_target_mask.fillStyle = "black";
    context_target_mask.fillRect(0, 0, width, height);
    //source mask canvas
    cvs_source_mask.height = height;
    cvs_source_mask.width = width;
    card_source_mask.style.width = cat_source.width;
    var context_source_mask = cvs_source_mask.getContext('2d');
    context_source_mask.clearRect(0, 0, width, height);
    context_source_mask.fillStyle = "black";
    context_source_mask.fillRect(0, 0, width, height);
    //result canvas
    cvs_synthesis.height = height;
    cvs_synthesis.width = width;
    card_synthesis.style.width = mona_target.width;
    var context_synthesis = cvs_synthesis.getContext('2d');
    context_synthesis.clearRect(0, 0, width, height);
    context_synthesis.fillStyle = "black";
    context_synthesis.fillRect(0, 0, width, height);
    var context_source = cvs_source.getContext('2d');
    context_source.drawImage(cat_source, 0, 0);
    var imageData_source = context_source.getImageData(0, 0, cvs_source.width, cvs_source.height);
    //source image mask edit
    var x = 0;
    var y = 0;
    var draw = false;
    cvs_source.addEventListener("mousemove", function (e) {
        if (draw) {
            var rect = e.target.getBoundingClientRect();
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
            //draw mask region to source image
            context_source.beginPath();
            context_source.arc(x, y, 10, 0, 2 * Math.PI, false);
            context_source.fill();
            //draw mask region to mask image
            context_source_mask.fillStyle = "white";
            context_source_mask.beginPath();
            context_source_mask.arc(x, y, 10, 0, 2 * Math.PI, false);
            context_source_mask.fill();
            context_target_mask.fillStyle = "white";
            context_target_mask.beginPath();
            context_target_mask.arc(x, y, 10, 0, 2 * Math.PI, false);
            context_target_mask.fill();
        }
    });
    cvs_source.addEventListener("mousedown", function (e) {
        draw = true;
    });
    cvs_source.addEventListener("mouseup", function (e) {
        draw = false;
    });
    //adjust mask image position for target image
    var startX = 0;
    var startY = 0;
    var endX = 0;
    var endY = 0;
    var select = true;
    var source_mask_roi_image;
    var temp_coord = [];
    var drag = false;
    var down = false;
    cvs_target_mask.addEventListener('mousedown', function (e) {
        var rect = e.target.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
        down = true;
    });
    cvs_target_mask.addEventListener('mouseup', function (e) {
        var rect = e.target.getBoundingClientRect();
        endX = e.clientX - rect.left;
        endY = e.clientY - rect.top;
        if (select) {
            var h = endY - startY;
            var w = endX - startX;
            source_mask_roi_image = context_source_mask.getImageData(0, 0, width, height);
            source_mask_roi_image = new ECvLib.MatHxWx3(source_mask_roi_image, height, width);
            temp_coord = [];
            temp_coord.push(Math.round(startY), Math.round(startX), h, w);
            //draw
            context_target_mask.beginPath();
            context_target_mask.lineWidth = 3;
            context_target_mask.strokeStyle = "blue";
            context_target_mask.rect(startX, startY, w, h);
            context_target_mask.stroke();
            select = false;
            down = false;
        }
        else if (drag) {
            select = true;
        }
    });
    cvs_target_mask.addEventListener('mousemove', function (e) {
        if (down && !select)
            drag = true;
        else
            drag = false;
        if (drag) {
            var rect = e.target.getBoundingClientRect();
            endX = e.clientX - rect.left;
            endY = e.clientY - rect.top;
            var y_offset = endY - startY;
            var x_offset = endX - startX;
            var formal_roi = source_mask_roi_image.getROIData(temp_coord[0], temp_coord[1], temp_coord[2], temp_coord[3]);
            context_target_mask.clearRect(0, 0, width, height);
            var target_mask_roi_image = context_target_mask.getImageData(0, 0, width, height);
            var target_mask_roi_data = new ECvLib.MatHxWx3(target_mask_roi_image, height, width);
            target_mask_roi_data.setROIData(temp_coord[0] + y_offset, temp_coord[1] + x_offset, formal_roi);
            //draw new mask for target image
            var md = context_target_mask.getImageData(0, 0, width, height);
            for (var j = 0; j < height; j++) {
                for (var i = 0; i < width; i++) {
                    var index = (j * width + i) * 4;
                    var Val_r = target_mask_roi_data.R().getDataByIndexs(j, i);
                    var Val_g = target_mask_roi_data.G().getDataByIndexs(j, i);
                    var Val_b = target_mask_roi_data.B().getDataByIndexs(j, i);
                    md.data[index + 0] = Val_r;
                    md.data[index + 1] = Val_g;
                    md.data[index + 2] = Val_b;
                    md.data[index + 3] = 255;
                }
            }
            context_target_mask.putImageData(md, 0, 0);
            //mapping to target image
            var ti = context_target.getImageData(0, 0, width, height);
            var ti_data = new ECvLib.MatHxWx3(ti, height, width);
            ti_data.showMaskRegion(target_mask_roi_data);
            var preview_data = context_preview.getImageData(0, 0, width, height);
            for (var j = 0; j < height; j++) {
                for (var i = 0; i < width; i++) {
                    var index = (j * width + i) * 4;
                    var vr = ti_data.R().getDataByIndexs(j, i);
                    var vg = ti_data.G().getDataByIndexs(j, i);
                    var vb = ti_data.B().getDataByIndexs(j, i);
                    preview_data.data[index + 0] = vr;
                    preview_data.data[index + 1] = vg;
                    preview_data.data[index + 2] = vb;
                    preview_data.data[index + 3] = 255;
                }
            }
            context_preview.putImageData(preview_data, 0, 0);
            //startX = e.clientX - rect.left;
            //startY = e.clientY - rect.top;
        }
    });
    //button click event
    btn_PIE.addEventListener("click", function () {
        timer.start();
        var mona_target_image = new ECvLib.MatHxWx3(imageData_target, height, width);
        var cat_source_image = new ECvLib.MatHxWx3(imageData_source, height, width);
        var imageData_target_mask = context_target_mask.getImageData(0, 0, width, height);
        var target_mask_image = new ECvLib.MatHxWx3(imageData_target_mask, height, width);
        var imageData_source_mask = context_source_mask.getImageData(0, 0, width, height);
        var source_mask_image = new ECvLib.MatHxWx3(imageData_source_mask, height, width);
        //execute poisson image editing
        var target_maskidx2Corrd = new Array();
        var source_maskidx2Corrd = new Array();
        //record order
        var Coord2indx = new EMathLib.Matrix(height, width);
        Coord2indx.setValues(-1);
        // left, right, top, botton pix in mask or not
        var if_strict_interior = new Array();
        var idx = 0;
        target_mask_image.forEachIndex(function (j, i) {
            if (target_mask_image.getDataByIndexs(j, i)[0] == 255) {
                target_maskidx2Corrd.push([j, i]);
                if_strict_interior.push([
                    j > 0 && target_mask_image.getDataByIndexs(j - 1, i)[0] == 255,
                    j < height - 1 && target_mask_image.getDataByIndexs(j + 1, i)[0] == 255,
                    i > 0 && target_mask_image.getDataByIndexs(j, i - 1)[0] == 255,
                    i < width - 1 && target_mask_image.getDataByIndexs(j, i + 1)[0] == 255
                ]);
                Coord2indx.setDataByIndexs(j, i, idx);
                idx += 1;
            }
        });
        source_mask_image.forEachIndex(function (j, i) {
            if (source_mask_image.getDataByIndexs(j, i)[0] == 255) {
                source_maskidx2Corrd.push([j, i]);
            }
        });
        timer.end();
        timer.printElapsedTime();
        console.log("converted image coordniates to index...");
        timer.start();
        var N = idx;
        var b = new EMathLib.Matrix(N, 3);
        var A = new EMathLib.Matrix(N, N);
        for (var i = 0; i < N; i++) {
            A.setDataByIndexs(i, i, 4);
            var r = target_maskidx2Corrd[i][0];
            var c = target_maskidx2Corrd[i][1];
            if (if_strict_interior[i][0])
                A.setDataByIndexs(i, Coord2indx.getDataByIndexs(r - 1, c), -1);
            if (if_strict_interior[i][1])
                A.setDataByIndexs(i, Coord2indx.getDataByIndexs(r + 1, c), -1);
            if (if_strict_interior[i][2])
                A.setDataByIndexs(i, Coord2indx.getDataByIndexs(r, c - 1), -1);
            if (if_strict_interior[i][3])
                A.setDataByIndexs(i, Coord2indx.getDataByIndexs(r, c + 1), -1);
        }
        for (var i = 0; i < N; i++) {
            var flag = if_strict_interior[i].map(function (b) { return !b; }).map(function (b) { return b ? 1 : 0; });
            var t_r = target_maskidx2Corrd[i][0];
            var t_c = target_maskidx2Corrd[i][1];
            var r = source_maskidx2Corrd[i][0];
            var c = source_maskidx2Corrd[i][1];
            for (var _c = 0; _c < 3; _c++) {
                var sVal = 4 * cat_source_image.getDataByIndexs(r, c)[_c] - cat_source_image.getDataByIndexs(r - 1, c)[_c] - cat_source_image.getDataByIndexs(r + 1, c)[_c] - cat_source_image.getDataByIndexs(r, c - 1)[_c] - cat_source_image.getDataByIndexs(r, c + 1)[_c];
                b.setDataByIndexs(i, _c, sVal);
                var tVal = b.getDataByIndexs(i, _c) + flag[0] * mona_target_image.getDataByIndexs(t_r - 1, t_c)[_c] + flag[1] * mona_target_image.getDataByIndexs(t_r + 1, t_c)[_c] + flag[2] * mona_target_image.getDataByIndexs(t_r, t_c - 1)[_c] + flag[3] * mona_target_image.getDataByIndexs(t_r, t_c + 1)[_c];
                b.setDataByIndexs(i, _c, tVal);
            }
        }
        timer.end();
        timer.printElapsedTime();
        console.log("initialized A matrix and b array...");
        timer.start();
        var color_array = new Array();
        b.forEachCol(function (col) {
            color_array.push(new EMathLib.Vector(col.length, col));
        });
        //85s
        // let R = EMathLib.conjugate_grad(A, color_array[0]);
        // let G = EMathLib.conjugate_grad(A, color_array[1]);
        // let B = EMathLib.conjugate_grad(A, color_array[2]);
        //1s
        //conver matrix A to sparse matrix
        var A_sp = A.mat2SpMat();
        var R = EMathLib.conjugate_grad_spMatrix(A_sp, color_array[0]);
        var G = EMathLib.conjugate_grad_spMatrix(A_sp, color_array[1]);
        var B = EMathLib.conjugate_grad_spMatrix(A_sp, color_array[2]);
        var synthesis_image = mona_target_image;
        for (var i = 0; i < N; i++) {
            var r = target_maskidx2Corrd[i][0];
            var c = target_maskidx2Corrd[i][1];
            var color = [clip(R.data()[i], 0, 255), clip(G.data()[i], 0, 255), clip(B.data()[i], 0, 255)];
            synthesis_image.setDataByIndexs(r, c, color);
        }
        var imgData = context_synthesis.getImageData(0, 0, width, height);
        for (var j = 0; j < height; j++) {
            for (var i = 0; i < width; i++) {
                var index = (j * width + i) * 4;
                var Val_r = synthesis_image.R().getDataByIndexs(j, i);
                var Val_g = synthesis_image.G().getDataByIndexs(j, i);
                var Val_b = synthesis_image.B().getDataByIndexs(j, i);
                imgData.data[index + 0] = Val_r;
                imgData.data[index + 1] = Val_g;
                imgData.data[index + 2] = Val_b;
                imgData.data[index + 3] = 255;
            }
        }
        context_synthesis.putImageData(imgData, 0, 0);
        timer.end();
        timer.printElapsedTime();
        console.log("poisson image editing finished...");
        timer.printTotalTime();
        //reset 
        context_target.drawImage(mona_target, 0, 0);
        context_source.drawImage(cat_source, 0, 0);
        context_preview.drawImage(mona_target, 0, 0);
        context_target_mask.clearRect(0, 0, width, height);
        context_target_mask.fillStyle = "black";
        context_target_mask.fillRect(0, 0, width, height);
        context_source_mask.clearRect(0, 0, width, height);
        context_source_mask.fillStyle = "black";
        context_source_mask.fillRect(0, 0, width, height);
    });
});
