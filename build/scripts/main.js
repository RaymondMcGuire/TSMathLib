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
    var Vector = (function () {
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
    })();
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
/// <reference path="./interface.ts" />
var EMathLib;
(function (EMathLib) {
    var Matrix = (function () {
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
    })();
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
})(EMathLib || (EMathLib = {}));
/// <reference path="../lib/conjugate_grad.ts" />
var image = new Image();
image.src = "./images/mona-target.jpg";
image.onload = function () {
    var cvs = document.getElementById("cvs");
    cvs.height = image.height;
    cvs.width = image.width;
    var context = cvs.getContext('2d');
    context.drawImage(image, 0, 0);
    var imageData = context.getImageData(0, 0, cvs.width, cvs.height);
    //console.log(imageData);
    var imageDataBuffer = new Array(cvs.height);
    for (var j = 0; j < cvs.height; j++) {
        imageDataBuffer[j] = new Array(cvs.width);
        for (var i = 0; i < cvs.width; i++) {
            var index = (j * cvs.width + i) * 4;
            imageDataBuffer[j][i] = new Array(4);
            imageDataBuffer[j][i][0] = imageData.data[index + 0];
            imageDataBuffer[j][i][1] = imageData.data[index + 1];
            imageDataBuffer[j][i][2] = imageData.data[index + 2];
            imageDataBuffer[j][i][3] = imageData.data[index + 3];
        }
    }
    console.log(imageDataBuffer);
};
