/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./examples/tsmath.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./examples/tsmath.ts":
/*!****************************!*\
  !*** ./examples/tsmath.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar matrix_1 = __webpack_require__(/*! ../lib/matrix */ \"./lib/matrix.ts\");\n\nvar m = new matrix_1.Matrix(3, 3);\nm.printMatrix();\n\n//# sourceURL=webpack:///./examples/tsmath.ts?");

/***/ }),

/***/ "./lib/math_utils.ts":
/*!***************************!*\
  !*** ./lib/math_utils.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/* =========================================================================\r\n *\r\n *  math_utils.ts\r\n *  simple math functions\r\n * ========================================================================= */\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nfunction absMax(x, y) {\n  return x * x > y * y ? x : y;\n}\n\nexports.absMax = absMax;\n\nfunction absMin(x, y) {\n  return x * x < y * y ? x : y;\n}\n\nexports.absMin = absMin;\n\nfunction muldec(x, y) {\n  return x * 10 * (y * 10) / 100;\n}\n\nexports.muldec = muldec;\n\nfunction divdec(x, y) {\n  return x * 10 / (y * 10) / 100;\n}\n\nexports.divdec = divdec;\n\n//# sourceURL=webpack:///./lib/math_utils.ts?");

/***/ }),

/***/ "./lib/matrix.ts":
/*!***********************!*\
  !*** ./lib/matrix.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n/* =========================================================================\r\n *\r\n *  matrix.ts\r\n *  M*N dimention matrix\r\n * ========================================================================= */\n\nvar math_utils_1 = __webpack_require__(/*! ./math_utils */ \"./lib/math_utils.ts\");\n\nvar vector_1 = __webpack_require__(/*! ./vector */ \"./lib/vector.ts\");\n\nvar sparse_matrix_1 = __webpack_require__(/*! ./sparse_matrix */ \"./lib/sparse_matrix.ts\");\n\nvar Matrix =\n/** @class */\nfunction () {\n  // constructs matrix with parameters or zero\n  function Matrix(M, N, params) {\n    var _i = 0;\n    this._M = M;\n    this._N = N;\n    this._size = M * N;\n\n    if (params === undefined) {\n      // init M*N matrix data,setting all 0\n      this._elements = new Array(this.size());\n\n      for (_i = 0; _i < this.size(); _i++) {\n        this._elements[_i] = 0;\n      }\n    } else {\n      // TODO check size\n      this._elements = new Array(this.size());\n\n      for (_i = 0; _i < params.length; _i++) {\n        this._elements[_i] = params[_i];\n      }\n    }\n  }\n\n  Matrix.prototype.set = function (params) {\n    if (params.size() !== this.size() || params.rows() !== this.rows() || params.cols() !== this.cols()) {\n      console.log('dimension is not correct!');\n      return undefined;\n    }\n\n    for (var _i = 0; _i < params.size(); _i++) {\n      this._elements[_i] = params.data()[_i];\n    }\n\n    return true;\n  };\n\n  Matrix.prototype.data = function () {\n    return this._elements;\n  };\n\n  Matrix.prototype.getDataByIndexs = function (row, col) {\n    var index = row * this._N + col;\n    return this.data()[index];\n  };\n\n  Matrix.prototype.getDeterminant = function (row, col) {\n    var _this = this;\n\n    var d = new Matrix(this.rows() - 1, this.cols() - 1);\n    var cnt = 0;\n    this.forEachIndex(function (i, j) {\n      if (i !== row && j !== col) {\n        var _i = Math.floor(cnt / (_this.cols() - 1));\n\n        var _j = cnt % (_this.cols() - 1);\n\n        d.setDataByIndexs(_i, _j, _this.getDataByIndexs(i, j));\n        cnt++;\n      }\n    });\n    return d;\n  };\n\n  Matrix.prototype.setDataByIndexs = function (row, col, d) {\n    var index = row * this._N + col;\n    this.data()[index] = d;\n  };\n\n  Matrix.prototype.size = function () {\n    return this._size;\n  };\n\n  Matrix.prototype.rows = function () {\n    return this._M;\n  };\n\n  Matrix.prototype.cols = function () {\n    return this._N;\n  };\n\n  Matrix.prototype.forEachIndex = function (indexs) {\n    for (var _i = 0; _i < this.rows(); _i++) {\n      for (var _j = 0; _j < this.cols(); _j++) {\n        indexs(_i, _j);\n      }\n    }\n  };\n\n  Matrix.prototype.forEachData = function (data) {\n    for (var _i = 0; _i < this.rows(); _i++) {\n      for (var _j = 0; _j < this.cols(); _j++) {\n        data(this.getDataByIndexs(_i, _j));\n      }\n    }\n  };\n\n  Matrix.prototype.forEachRow = function (row) {\n    for (var _i = 0; _i < this.rows(); _i++) {\n      var rowArray = Array(this.cols());\n\n      for (var _j = 0; _j < this.cols(); _j++) {\n        rowArray[_j] = this.getDataByIndexs(_i, _j);\n      }\n\n      row(rowArray);\n    }\n  };\n\n  Matrix.prototype.forEachCol = function (col) {\n    for (var _i = 0; _i < this.cols(); _i++) {\n      var colArray = Array(this.rows());\n\n      for (var _j = 0; _j < this.rows(); _j++) {\n        colArray[_j] = this.getDataByIndexs(_j, _i);\n      }\n\n      col(colArray);\n    }\n  };\n\n  Matrix.prototype._ones = function () {\n    var m = new Matrix(this.rows(), this.cols());\n    m.forEachIndex(function (i, j) {\n      m.setDataByIndexs(i, j, 1);\n    });\n    return m;\n  };\n\n  Matrix.prototype.ones = function () {\n    this.set(this._ones());\n  };\n\n  Matrix.prototype._values = function (v) {\n    var m = new Matrix(this.rows(), this.cols());\n    m.forEachIndex(function (i, j) {\n      m.setDataByIndexs(i, j, v);\n    });\n    return m;\n  };\n\n  Matrix.prototype.setValues = function (v) {\n    this.set(this._values(v));\n  };\n\n  Matrix.prototype._random = function () {\n    var m = new Matrix(this.rows(), this.cols());\n    m.forEachIndex(function (i, j) {\n      m.setDataByIndexs(i, j, Math.random());\n    });\n    return m;\n  };\n\n  Matrix.prototype.random = function () {\n    this.set(this._random());\n  };\n\n  Matrix.prototype._transpose = function () {\n    var _this = this;\n\n    var m = new Matrix(this.rows(), this.cols());\n    m.forEachIndex(function (i, j) {\n      m.setDataByIndexs(i, j, _this.getDataByIndexs(j, i));\n    });\n    return m;\n  };\n\n  Matrix.prototype.mat2SpMat = function () {\n    var _this = this;\n\n    var data = new Array();\n    this.forEachIndex(function (i, j) {\n      var d = _this.getDataByIndexs(i, j);\n\n      if (d !== 0) {\n        data.push([i, j, d]);\n      }\n    });\n    return new sparse_matrix_1.SparseMatrix(this.rows(), this.cols(), data);\n  };\n\n  Matrix.prototype.mat2Vec = function () {\n    if (this.rows() !== 1 && this.cols() !== 1) {\n      console.log('can not convert to vector!');\n      return new vector_1.Vector(1, [-1]);\n    }\n\n    var Vec = new vector_1.Vector(this.size(), this.data());\n    return Vec;\n  };\n\n  Matrix.prototype.transpose = function () {\n    this.set(this._transpose());\n  };\n\n  Matrix.prototype.sub = function (m) {\n    var _this = this;\n\n    var mm = new Matrix(this.rows(), this.cols());\n    mm.forEachIndex(function (i, j) {\n      var result = _this.getDataByIndexs(i, j) - m.getDataByIndexs(i, j);\n      mm.setDataByIndexs(i, j, result);\n    });\n    return mm;\n  };\n\n  Matrix.prototype.mulMat = function (m) {\n    var _this = this; // TODO check matrix shape is right or not\n    // A.cols == B.rows\n\n\n    var newM = this.rows();\n    var newN = m.cols();\n    var mm = new Matrix(newM, newN);\n    mm.forEachIndex(function (i, j) {\n      var d = 0;\n\n      for (var n = 0; n < _this.cols(); n++) {\n        // console.log(\"-------------------------------\")\n        // console.log(this.getDataByIndexs(i, n));\n        // console.log(m.getDataByIndexs(n, j))\n        // console.log(this.getDataByIndexs(i, n) * m.getDataByIndexs(n, j))\n        d += math_utils_1.muldec(_this.getDataByIndexs(i, n), m.getDataByIndexs(n, j));\n      }\n\n      mm.setDataByIndexs(i, j, d);\n    });\n    return mm;\n  };\n\n  Matrix.prototype.mulVec = function (v) {\n    // check shape\n    if (v.size() !== this.cols()) {\n      console.log('vector shape is not right!');\n      return new vector_1.Vector(1, [-1]);\n    }\n\n    var vec2mat = new Matrix(v.size(), 1, v.data());\n    var mat = this.mulMat(vec2mat);\n    var vec = mat.mat2Vec();\n    return vec;\n  };\n\n  Matrix.prototype.same = function (m) {\n    var _this = this;\n\n    var bSame = true; // check matrix shape\n\n    if (this.cols() !== m.cols() || this.rows() !== m.rows()) bSame = false; // check elements\n\n    this.forEachIndex(function (i, j) {\n      if (_this.getDataByIndexs(i, j) !== m.getDataByIndexs(i, j)) bSame = false;\n    });\n    return bSame;\n  };\n\n  Matrix.prototype.printMatrix = function () {\n    var printStr = '[\\n';\n    this.forEachRow(function (r) {\n      printStr += r.join(',');\n      printStr += '\\n';\n    });\n    printStr += ']';\n    console.log(printStr);\n  };\n\n  return Matrix;\n}();\n\nexports.Matrix = Matrix;\n\n//# sourceURL=webpack:///./lib/matrix.ts?");

/***/ }),

/***/ "./lib/sparse_matrix.ts":
/*!******************************!*\
  !*** ./lib/sparse_matrix.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n/* =========================================================================\r\n *\r\n *  sparse_matrix.ts\r\n *  M*N dimention sparse matrix\r\n * ========================================================================= */\n\nvar math_utils_1 = __webpack_require__(/*! ./math_utils */ \"./lib/math_utils.ts\");\n\nvar vector_1 = __webpack_require__(/*! ./vector */ \"./lib/vector.ts\");\n\nvar matrix_1 = __webpack_require__(/*! ./matrix */ \"./lib/matrix.ts\");\n\nvar SparseMatrix =\n/** @class */\nfunction () {\n  // constructs matrix with parameters or zero\n  function SparseMatrix(M, N, params) {\n    this._M = M;\n    this._N = N;\n\n    if (params === undefined) {\n      this._size = 0;\n      this._elements = [];\n    } else {\n      this._size = params.length;\n      this._elements = new Array(this.size());\n\n      for (var _i = 0; _i < params.length; _i++) {\n        this._elements[_i] = params[_i];\n      }\n\n      this._elements.sort(function (a, b) {\n        if (a[0] < b[0]) {\n          return -1;\n        } else if (a[0] > b[0]) {\n          return 1;\n        } else if (a[0] === b[0]) {\n          if (a[1] < b[1]) {\n            return -1;\n          } else if (a[1] > b[1]) {\n            return 1;\n          }\n        }\n\n        return 0;\n      });\n    }\n  }\n\n  SparseMatrix.prototype.size = function () {\n    return this._size;\n  };\n\n  SparseMatrix.prototype.rows = function () {\n    return this._M;\n  };\n\n  SparseMatrix.prototype.cols = function () {\n    return this._N;\n  };\n\n  SparseMatrix.prototype.data = function () {\n    return this._elements;\n  };\n\n  SparseMatrix.prototype.set = function (params) {\n    if (params.rows() !== this.rows() || params.cols() !== this.cols()) {\n      console.log('dimension is not correct!');\n      return undefined;\n    }\n\n    this._size = params.size();\n    this._elements = new Array(this.size());\n\n    for (var _i = 0; _i < params.size(); _i++) {\n      this._elements[_i] = params.data()[_i];\n    }\n\n    return true;\n  };\n\n  SparseMatrix.prototype.forEachData = function (smd) {\n    for (var _i = 0; _i < this.size(); _i++) {\n      smd(this.data()[_i]);\n    }\n  };\n\n  SparseMatrix.prototype.forEachIndex = function (indexs) {\n    for (var _e = 0; _e < this.size(); _e++) {\n      var e = this.data()[_e];\n\n      indexs(e[0], e[1]);\n    }\n  };\n\n  SparseMatrix.prototype._searchElemByRow = function (row) {\n    var e = this.data();\n\n    for (var _i = 0; _i < e.length; _i++) {\n      if (e[_i][0] === row) {\n        return _i;\n      }\n    }\n\n    return -1;\n  };\n\n  SparseMatrix.prototype._searchElemByIndexs = function (row, col) {\n    var e = this.data();\n\n    for (var _i = 0; _i < e.length; _i++) {\n      if (e[_i][0] === row && e[_i][1] === col) {\n        return _i;\n      }\n    }\n\n    return -1;\n  };\n\n  SparseMatrix.prototype.getDataByIndexs = function (row, col) {\n    var idx = this._searchElemByIndexs(row, col);\n\n    if (idx === -1) return 0;\n    return this.data()[idx][2];\n  };\n\n  SparseMatrix.prototype.setDataByRowCol = function (row, col, d) {\n    var idx = this._searchElemByIndexs(row, col);\n\n    if (idx === -1) {\n      this._size += 1;\n      this.data().push([row, col, d]);\n    } else {\n      this.data()[idx][2] = d;\n    }\n  };\n\n  SparseMatrix.prototype.addDataByIndexs = function (row, col, d) {\n    this._size += 1;\n    this.data().push([row, col, d]);\n  };\n\n  SparseMatrix.prototype.setTupleByIndexs = function (n) {\n    var idx = this._searchElemByIndexs(n[0], n[1]);\n\n    if (idx === -1) {\n      this._size += 1;\n      this.data().push(n);\n    } else {\n      this.data()[idx] = n;\n    }\n  };\n\n  SparseMatrix.prototype._transpose = function () {\n    var _this = this;\n\n    var m = new SparseMatrix(this.rows(), this.cols());\n    this.forEachIndex(function (i, j) {\n      m.setTupleByIndexs([j, i, _this.getDataByIndexs(i, j)]);\n    });\n    m.data().sort(function (a, b) {\n      if (a[0] < b[0]) return -1;else if (a[0] > b[0]) return 1;else if (a[0] === b[0]) {\n        if (a[1] < b[1]) return -1;else if (a[1] > b[1]) return 1;\n      }\n      return 0;\n    });\n    return m;\n  };\n\n  SparseMatrix.prototype.transpose = function () {\n    this.set(this._transpose());\n  };\n\n  SparseMatrix.prototype.mulMat = function (m) {\n    // TODO check matrix shape is right or not\n    // A.cols == B.rows\n    var newM = this.rows();\n    var newN = m.cols();\n    var mm = new SparseMatrix(newM, newN); // collect row->col\n\n    var rowColMapping = new Array(this.rows());\n\n    for (var _i = 0; _i < this.rows(); _i++) {\n      rowColMapping[_i] = [];\n    }\n\n    this.forEachData(function (d) {\n      var r = d[0];\n      var c = d[1];\n      rowColMapping[r].push(c);\n    });\n\n    for (var _c = 0; _c < m.cols(); _c++) {\n      var idx = 0;\n\n      for (var _r = 0; _r < this.rows(); _r++) {\n        if (rowColMapping[_r].length === 0) continue;\n        var d = 0;\n\n        for (var _rc = 0; _rc < rowColMapping[_r].length; _rc++) {\n          var c = rowColMapping[_r][_rc];\n          var v = this.data()[idx][2];\n          idx++;\n          d += math_utils_1.muldec(v, m.getDataByIndexs(c, _c));\n        }\n\n        if (d === 0) continue;\n        mm.addDataByIndexs(_r, _c, d);\n      }\n    }\n\n    mm.data().sort(function (a, b) {\n      if (a[0] < b[0]) return -1;else if (a[0] > b[0]) return 1;else if (a[0] === b[0]) {\n        if (a[1] < b[1]) return -1;else if (a[1] > b[1]) return 1;\n      }\n      return 0;\n    });\n    return mm;\n  };\n\n  SparseMatrix.prototype.spMat2Mat = function () {\n    var m = new matrix_1.Matrix(this.rows(), this.cols());\n    this.forEachData(function (d) {\n      m.setDataByIndexs(d[0], d[1], d[2]);\n    });\n    return m;\n  };\n\n  SparseMatrix.prototype.spMat2Vec = function () {\n    var _this = this;\n\n    if (this.rows() !== 1 && this.cols() !== 1) {\n      console.log('can not convert to vector!');\n      return new vector_1.Vector(1, [-1]);\n    }\n\n    var _size = this.rows() * this.cols();\n\n    var data = new Array(_size);\n\n    for (var _i = 0; _i < _size; _i++) {\n      data[_i] = 0;\n    }\n\n    this.forEachData(function (d) {\n      var idx = d[_this.rows() === 1 ? 1 : 0];\n      data[idx] = d[2];\n    });\n    var Vec = new vector_1.Vector(_size, data);\n    return Vec;\n  };\n\n  SparseMatrix.prototype.mulVec = function (v) {\n    // check shape\n    if (v.size() !== this.cols()) {\n      console.log('vector shape is not right!');\n      return new vector_1.Vector(1, [-1]);\n    }\n\n    var vec2mat = new matrix_1.Matrix(v.size(), 1, v.data());\n    var mat = this.mulMat(vec2mat);\n    var vec = mat.spMat2Vec();\n    return vec;\n  };\n\n  SparseMatrix.prototype.printSparseMatrix = function () {\n    var printStr = '';\n    this.forEachData(function (r) {\n      printStr += '[' + r + ']';\n    });\n    printStr += '';\n    console.log(printStr);\n  };\n\n  return SparseMatrix;\n}();\n\nexports.SparseMatrix = SparseMatrix;\n\n//# sourceURL=webpack:///./lib/sparse_matrix.ts?");

/***/ }),

/***/ "./lib/vector.ts":
/*!***********************!*\
  !*** ./lib/vector.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nfunction _typeof(obj) { \"@babel/helpers - typeof\"; if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n/* =========================================================================\r\n *\r\n *  vector.ts\r\n *  T-D vector data\r\n *  T:type,default setting is number\r\n *  D:dimension\r\n * ========================================================================= */\n\nvar math_utils_1 = __webpack_require__(/*! ./math_utils */ \"./lib/math_utils.ts\");\n\nvar Vector =\n/** @class */\nfunction () {\n  // constructs vector with parameters or zero\n  function Vector(dimension, params) {\n    this._dimension = dimension;\n    var _i = 0;\n\n    if (params === undefined) {\n      // init n dimension vector data,setting all 0\n      this._elements = new Array(dimension);\n\n      for (_i = 0; _i < dimension; _i++) {\n        this._elements[_i] = 0;\n      }\n    } else {\n      this._elements = new Array(dimension);\n\n      for (_i = 0; _i < params.length; _i++) {\n        this._elements[_i] = params[_i];\n      }\n    }\n  }\n\n  Vector.prototype.set = function (params) {\n    if (params !== undefined) {\n      if (params.size() !== this.size()) {\n        console.log('dimension is not correct!');\n        return false;\n      }\n\n      for (var _i = 0; _i < params.size(); _i++) {\n        this._elements[_i] = params.data()[_i];\n      }\n\n      return true;\n    }\n\n    return false;\n  };\n\n  Vector.prototype.setZero = function () {\n    for (var _i = 0; _i < this._dimension; _i++) {\n      this._elements[_i] = 0;\n    }\n  };\n\n  Vector.prototype.setOne = function () {\n    for (var _i = 0; _i < this._dimension; _i++) {\n      this._elements[_i] = 1;\n    }\n  };\n\n  Vector.prototype.data = function () {\n    return this._elements;\n  };\n\n  Vector.prototype.at = function (idx) {\n    if (idx < 0 || idx >= this.size()) {\n      console.log('index is not correct!');\n      return -1;\n    }\n\n    return this._elements[idx];\n  };\n\n  Vector.prototype.dot = function (others) {\n    if (others === undefined) {\n      console.log('others is not correct!');\n      return -1;\n    }\n\n    if (others.size() !== this.size()) {\n      console.log('dimension is not correct!');\n      return -1;\n    }\n\n    var ret = 0;\n\n    for (var _i = 0; _i < this.size(); _i++) {\n      ret += this._elements[_i] * others.data()[_i];\n    }\n\n    return ret;\n  };\n\n  Vector.prototype.lengthSquared = function () {\n    return this.dot(this);\n  };\n\n  Vector.prototype.length = function () {\n    return Math.sqrt(this.lengthSquared());\n  };\n\n  Vector.prototype.normalize = function () {\n    this.idiv(this.length());\n  };\n\n  Vector.prototype.sum = function () {\n    var ret = 0;\n\n    for (var _i = 0; _i < this._dimension; _i++) {\n      ret += this._elements[_i];\n    }\n\n    return ret;\n  };\n\n  Vector.prototype.size = function () {\n    return this._dimension;\n  };\n\n  Vector.prototype.avg = function () {\n    return this.sum() / this.size();\n  };\n\n  Vector.prototype.min = function () {\n    var minVal = this._elements[0];\n\n    for (var _i = 1; _i < this._dimension; _i++) {\n      minVal = Math.min(minVal, this._elements[_i]);\n    }\n\n    return minVal;\n  };\n\n  Vector.prototype.max = function () {\n    var maxVal = this._elements[0];\n\n    for (var _i = 1; _i < this._dimension; _i++) {\n      maxVal = Math.max(maxVal, this._elements[_i]);\n    }\n\n    return maxVal;\n  };\n\n  Vector.prototype.absmax = function () {\n    var absMaxVal = this._elements[0];\n\n    for (var _i = 1; _i < this._dimension; _i++) {\n      absMaxVal = math_utils_1.absMax(absMaxVal, this._elements[_i]);\n    }\n\n    return absMaxVal;\n  };\n\n  Vector.prototype.absmin = function () {\n    var absMinVal = this._elements[0];\n\n    for (var _i = 1; _i < this._dimension; _i++) {\n      absMinVal = math_utils_1.absMin(absMinVal, this._elements[_i]);\n    }\n\n    return absMinVal;\n  };\n\n  Vector.prototype.distanceSquaredTo = function (others) {\n    if (others.size() !== this.size()) {\n      console.log('dimension is not correct!');\n      return -1;\n    }\n\n    var ret = 0;\n\n    for (var _i = 0; _i < this.size(); _i++) {\n      var diff = this._elements[_i] - others.data()[_i];\n\n      ret += diff * diff;\n    }\n\n    return ret;\n  };\n\n  Vector.prototype.distanceTo = function (others) {\n    return Math.sqrt(this.distanceSquaredTo(others));\n  };\n\n  Vector.prototype.isEqual = function (others) {\n    if (this.size() !== others.size()) return false;\n\n    for (var _i = 0; _i < this.size(); _i++) {\n      if (this.at(_i) !== others.at(_i)) return false;\n    }\n\n    return true;\n  };\n\n  Vector.prototype.isSimilar = function (others, epsilon) {\n    if (others === undefined) return false;\n    if (this.size() !== others.size()) return false;\n\n    for (var _i = 0; _i < this.size(); _i++) {\n      if (Math.abs(this.at(_i) - others.at(_i)) > epsilon) return false;\n    }\n\n    return true;\n  };\n\n  Vector.prototype.add = function (params) {\n    var _i = 0;\n\n    if (_typeof(params) === 'object') {\n      var v = params;\n      if (v.size() !== this.size()) return new Vector(1, [-1]);\n      var newV = new Vector(this.size(), this.data());\n\n      for (_i = 0; _i < newV.size(); _i++) {\n        newV.data()[_i] += v.data()[_i];\n      }\n\n      return newV;\n    } else if (typeof params === 'number') {\n      var s = params;\n      var newV = new Vector(this.size(), this.data());\n\n      for (_i = 0; _i < newV.size(); _i++) {\n        newV.data()[_i] += s;\n      }\n\n      return newV;\n    }\n\n    return new Vector(1, [-1]);\n  };\n\n  Vector.prototype.sub = function (params) {\n    var _i = 0;\n\n    if (_typeof(params) === 'object') {\n      var v = params;\n      if (v.size() !== this.size()) return new Vector(1, [-1]);\n      var newV = new Vector(this.size(), this.data());\n\n      for (_i = 0; _i < newV.size(); _i++) {\n        newV.data()[_i] -= v.data()[_i];\n      }\n\n      return newV;\n    } else if (typeof params === 'number') {\n      var s = params;\n      var newV = new Vector(this.size(), this.data());\n\n      for (_i = 0; _i < newV.size(); _i++) {\n        newV.data()[_i] -= s;\n      }\n\n      return newV;\n    }\n\n    return new Vector(1, [-1]);\n  };\n\n  Vector.prototype.mul = function (params) {\n    var _i = 0;\n\n    if (_typeof(params) === 'object') {\n      var v = params;\n      if (v.size() !== this.size()) return new Vector(1, [-1]);\n      var newV = new Vector(this.size(), this.data());\n\n      for (_i = 0; _i < newV.size(); _i++) {\n        newV.data()[_i] *= v.data()[_i];\n      }\n\n      return newV;\n    } else if (typeof params === 'number') {\n      var s = params;\n      var newV = new Vector(this.size(), this.data());\n\n      for (_i = 0; _i < newV.size(); _i++) {\n        newV.data()[_i] *= s;\n      }\n\n      return newV;\n    }\n\n    return new Vector(1, [-1]);\n  };\n\n  Vector.prototype.div = function (params) {\n    var _i = 0;\n\n    if (_typeof(params) === 'object') {\n      var v = params;\n      if (v.size() !== this.size()) return new Vector(1, [-1]);\n      var newV = new Vector(this.size(), this.data());\n\n      for (_i = 0; _i < newV.size(); _i++) {\n        newV.data()[_i] /= v.data()[_i];\n      }\n\n      return newV;\n    } else if (typeof params === 'number') {\n      var s = params;\n      if (s === 0) return new Vector(1, [-1]);\n      var newV = new Vector(this.size(), this.data());\n\n      for (_i = 0; _i < newV.size(); _i++) {\n        newV.data()[_i] /= s;\n      }\n\n      return newV;\n    }\n\n    return new Vector(1, [-1]);\n  };\n\n  Vector.prototype.idiv = function (params) {\n    this.set(this.div(params));\n  };\n\n  Vector.prototype.iadd = function (params) {\n    this.set(this.add(params));\n  };\n\n  Vector.prototype.isub = function (params) {\n    this.set(this.sub(params));\n  };\n\n  Vector.prototype.imul = function (params) {\n    this.set(this.mul(params));\n  };\n\n  Vector.prototype.setAt = function (idx, val) {\n    if (idx < 0 || idx >= this.size()) {\n      return undefined;\n    }\n\n    this._elements[idx] = val;\n    return true;\n  };\n  /**\r\n   * proj_u(v) = <u,v>/<v,v> u\r\n   * @param u\r\n   * @param v\r\n   */\n\n\n  Vector.proj = function (u, v) {\n    return u.mul(v.dot(u) / u.dot(u));\n  };\n\n  return Vector;\n}();\n\nexports.Vector = Vector;\n\n//# sourceURL=webpack:///./lib/vector.ts?");

/***/ })

/******/ });