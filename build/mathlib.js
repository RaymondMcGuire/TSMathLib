/* =========================================================================
 *
 *  math_utils.ts
 *  simple math functions
 * ========================================================================= */
var EcognitaMathLib;
(function (EcognitaMathLib) {
    function absmax(x, y) {
        return (x * x > y * y) ? x : y;
    }
    EcognitaMathLib.absmax = absmax;
    function absmin(x, y) {
        return (x * x < y * y) ? x : y;
    }
    EcognitaMathLib.absmin = absmin;
})(EcognitaMathLib || (EcognitaMathLib = {}));
/* =========================================================================
 *
 *  vector.ts
 *  T-D vector data
 *  T:type,default setting is number
 *  D:dimension
 * ========================================================================= */
/// <reference path="./math_utils.ts" />
var EcognitaMathLib;
(function (EcognitaMathLib) {
    var Vector = /** @class */ (function () {
        //constructs vector with parameters or zero
        function Vector(dimension, params) {
            this._dimension = dimension;
            if (params == undefined) {
                //init n dimension vector data,setting all 0
                this._elements = new Array(dimension);
                this._elements.forEach(function (value) {
                    value = 0;
                });
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
            this._elements.forEach(function (value) {
                value = 0;
            });
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
            this._elements.forEach(function (value) {
                ret += value;
            });
            return ret;
        };
        Vector.prototype.size = function () { return this._dimension; };
        Vector.prototype.avg = function () { return this.sum() / this.size(); };
        Vector.prototype.min = function () {
            var minVal = this._elements[0];
            this._elements.forEach(function (value) {
                minVal = Math.min(minVal, value);
            });
            return minVal;
        };
        Vector.prototype.max = function () {
            var maxVal = this._elements[0];
            this._elements.forEach(function (value) {
                maxVal = Math.max(maxVal, value);
            });
            return maxVal;
        };
        Vector.prototype.absmax = function () {
            var absMaxVal = this._elements[0];
            this._elements.forEach(function (value) {
                absMaxVal = EcognitaMathLib.absmax(absMaxVal, value);
            });
            return absMaxVal;
        };
        Vector.prototype.absmin = function () {
            var absMinVal = this._elements[0];
            this._elements.forEach(function (value) {
                absMinVal = EcognitaMathLib.absmin(absMinVal, value);
            });
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
                if (this.at(_i) != others.data()[_i])
                    return false;
            }
            return true;
        };
        Vector.prototype.isSimilar = function (others, epsilon) {
            if (this.size() != others.size())
                return false;
            for (var _i = 0; _i < this.size(); _i++) {
                if (Math.abs(this.at(_i) - others.data()[_i]) > epsilon)
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
    EcognitaMathLib.Vector = Vector;
})(EcognitaMathLib || (EcognitaMathLib = {}));
