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
})(EMathLib || (EMathLib = {}));
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
            this.R().setDataByIndexs(j, i, v[0]);
            this.G().setDataByIndexs(j, i, v[1]);
            this.B().setDataByIndexs(j, i, v[2]);
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
    var ImLoad = /** @class */ (function () {
        function ImLoad(path) {
            this.image = new Image();
            this.image.src = path;
        }
        return ImLoad;
    }());
    ECvLib.ImLoad = ImLoad;
})(ECvLib || (ECvLib = {}));
/// <reference path="../lib/conjugate_grad.ts" />
/// <reference path="../lib/vector.ts" />
/// <reference path="../lib/matrix.ts" />
/// <reference path="../cv/im.ts" />
var cvs_target = document.getElementById("cvs_target");
var cvs_mask = document.getElementById("cvs_mask");
var cvs_source = document.getElementById("cvs_source");
var cvs_synthesis = document.getElementById("cvs_synthesis");
var mona_target = new ECvLib.ImLoad("./images/mona-target.jpg");
var mona_mask = new ECvLib.ImLoad("./images/mona-mask.jpg");
var leber_source = new ECvLib.ImLoad("./images/leber-source.jpg");
function clip(v, min, max) {
    if (v < min)
        v = min;
    if (v > max)
        v = max;
    return v;
}
//load image
mona_target.image.onload = function () {
    console.log("target image loaded");
    mona_mask.image.onload = function () {
        console.log("mask image loaded");
        leber_source.image.onload = function () {
            console.log("source image loaded");
            //get image data from canvas
            cvs_target.height = mona_target.image.height;
            cvs_target.width = mona_target.image.width;
            var height = cvs_target.height;
            var width = cvs_target.width;
            cvs_mask.height = mona_mask.image.height;
            cvs_mask.width = mona_mask.image.width;
            cvs_source.height = leber_source.image.height;
            cvs_source.width = leber_source.image.width;
            var context_target = cvs_target.getContext('2d');
            context_target.drawImage(mona_target.image, 0, 0);
            var imageData_target = context_target.getImageData(0, 0, cvs_target.width, cvs_target.height);
            var mona_target_image = new ECvLib.MatHxWx3(imageData_target, cvs_target.height, cvs_target.width);
            var context_mask = cvs_mask.getContext('2d');
            context_mask.drawImage(mona_mask.image, 0, 0);
            var imageData_mask = context_mask.getImageData(0, 0, cvs_mask.width, cvs_mask.height);
            var mona_mask_image = new ECvLib.MatHxWx3(imageData_mask, cvs_mask.height, cvs_mask.width);
            var context_source = cvs_source.getContext('2d');
            context_source.drawImage(leber_source.image, 0, 0);
            var imageData_source = context_source.getImageData(0, 0, cvs_source.width, cvs_source.height);
            var leber_source_image = new ECvLib.MatHxWx3(imageData_source, cvs_source.height, cvs_source.width);
            var maskidx2Corrd = new Array();
            //record order
            var Coord2indx = new EMathLib.Matrix(height, width);
            Coord2indx.setValues(-1);
            // left, right, top, botton pix in mask or not
            var if_strict_interior = new Array();
            var idx = 0;
            mona_mask_image.forEachIndex(function (j, i) {
                if (mona_mask_image.getDataByIndexs(j, i)[0] == 255) {
                    maskidx2Corrd.push([j, i]);
                    if_strict_interior.push([
                        j > 0 && mona_mask_image.getDataByIndexs(j - 1, i)[0] == 255,
                        j < height - 1 && mona_mask_image.getDataByIndexs(j + 1, i)[0] == 255,
                        i > 0 && mona_mask_image.getDataByIndexs(j, i - 1)[0] == 255,
                        i < width - 1 && mona_mask_image.getDataByIndexs(j, i + 1)[0] == 255
                    ]);
                    Coord2indx.setDataByIndexs(j, i, idx);
                    idx += 1;
                }
            });
            var N = idx;
            var b = new EMathLib.Matrix(N, 3);
            var A = new EMathLib.Matrix(N, N);
            for (var i = 0; i < N; i++) {
                A.setDataByIndexs(i, i, 4);
                var r = maskidx2Corrd[i][0];
                var c = maskidx2Corrd[i][1];
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
                var r = maskidx2Corrd[i][0];
                var c = maskidx2Corrd[i][1];
                for (var _c = 0; _c < 3; _c++) {
                    var sVal = 4 * leber_source_image.getDataByIndexs(r, c)[_c] - leber_source_image.getDataByIndexs(r - 1, c)[_c] - leber_source_image.getDataByIndexs(r + 1, c)[_c] - leber_source_image.getDataByIndexs(r, c - 1)[_c] - leber_source_image.getDataByIndexs(r, c + 1)[_c];
                    b.setDataByIndexs(i, _c, sVal);
                    var tVal = b.getDataByIndexs(i, _c) + flag[0] * mona_target_image.getDataByIndexs(r - 1, c)[_c] + flag[1] * mona_target_image.getDataByIndexs(r + 1, c)[_c] + flag[2] * mona_target_image.getDataByIndexs(r, c - 1)[_c] + flag[3] * mona_target_image.getDataByIndexs(r, c + 1)[_c];
                    b.setDataByIndexs(i, _c, tVal);
                }
            }
            var color_array = new Array();
            b.forEachCol(function (col) {
                color_array.push(new EMathLib.Vector(col.length, col));
            });
            var R = EMathLib.conjugate_grad(A, color_array[0]);
            var G = EMathLib.conjugate_grad(A, color_array[1]);
            var B = EMathLib.conjugate_grad(A, color_array[2]);
            var synthesis_image = mona_target_image;
            for (var i = 0; i < N; i++) {
                var r = maskidx2Corrd[i][0];
                var c = maskidx2Corrd[i][1];
                var color = [clip(R.data()[i], 0, 255), clip(G.data()[i], 0, 255), clip(B.data()[i], 0, 255)];
                synthesis_image.setDataByIndexs(r, c, color);
            }
            cvs_synthesis.height = height;
            cvs_synthesis.width = width;
            var context_synthesis = cvs_synthesis.getContext('2d');
            context_synthesis.clearRect(0, 0, width, height);
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
        };
    };
};
