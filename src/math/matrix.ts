/* =========================================================================
 *
 *  matrix.ts
 *  M*N dimention matrix
 * ========================================================================= */
import { muldec } from './math_utils'
import { Vector } from './vector'
import { SparseMatrix } from './sparse_matrix'
import { MatrixIndex, MatrixData, MatrixSplit } from './interface'
export class Matrix {
  private _elements: Array<number>
  private _M: number
  private _N: number
  private _size: number

  // constructs matrix with parameters or zero
  constructor(M: number, N: number, params?: Array<number>) {
    let _i = 0
    this._M = M
    this._N = N
    this._size = M * N
    if (params === undefined) {
      // init M*N matrix data,setting all 0
      this._elements = new Array<number>(this.size())
      for (_i = 0; _i < this.size(); _i++) {
        this._elements[_i] = 0
      }
    } else {
      // TODO check size
      this._elements = new Array<number>(this.size())
      for (_i = 0; _i < params.length; _i++) {
        this._elements[_i] = params[_i]
      }
    }
  }

  set(params: Matrix) {
    if (
      params.size() !== this.size() ||
      params.rows() !== this.rows() ||
      params.cols() !== this.cols()
    ) {
      console.log('dimension is not correct!')
      return undefined
    }

    for (let _i = 0; _i < params.size(); _i++) {
      this._elements[_i] = params.data()[_i]
    }

    return true
  }

  data() {
    return this._elements
  }

  getDataByIndexs(row: number, col: number) {
    let index = row * this._N + col
    return this.data()[index]
  }

  getDeterminant(row: number, col: number) {
    let d = new Matrix(this.rows() - 1, this.cols() - 1)
    let cnt = 0
    this.forEachIndex((i, j) => {
      if (i !== row && j !== col) {
        let _i = Math.floor(cnt / (this.cols() - 1))
        let _j = cnt % (this.cols() - 1)
        d.setDataByIndexs(_i, _j, this.getDataByIndexs(i, j))
        cnt++
      }
    })
    return d
  }

  setDataByIndexs(row: number, col: number, d: number) {
    let index = row * this._N + col
    this.data()[index] = d
  }

  size() {
    return this._size
  }

  rows() {
    return this._M
  }

  cols() {
    return this._N
  }

  forEachIndex(indexs: MatrixIndex) {
    for (let _i = 0; _i < this.rows(); _i++) {
      for (let _j = 0; _j < this.cols(); _j++) {
        indexs(_i, _j)
      }
    }
  }

  forEachData(data: MatrixData) {
    for (let _i = 0; _i < this.rows(); _i++) {
      for (let _j = 0; _j < this.cols(); _j++) {
        data(this.getDataByIndexs(_i, _j))
      }
    }
  }

  forEachRow(row: MatrixSplit) {
    for (let _i = 0; _i < this.rows(); _i++) {
      let rowArray = Array<number>(this.cols())
      for (let _j = 0; _j < this.cols(); _j++) {
        rowArray[_j] = this.getDataByIndexs(_i, _j)
      }
      row(rowArray)
    }
  }

  forEachCol(col: MatrixSplit) {
    for (let _i = 0; _i < this.cols(); _i++) {
      let colArray = Array<number>(this.rows())
      for (let _j = 0; _j < this.rows(); _j++) {
        colArray[_j] = this.getDataByIndexs(_j, _i)
      }
      col(colArray)
    }
  }

  private _ones() {
    let m = new Matrix(this.rows(), this.cols())
    m.forEachIndex((i, j) => {
      m.setDataByIndexs(i, j, 1)
    })
    return m
  }

  ones() {
    this.set(this._ones())
  }

  private _values(v: number) {
    let m = new Matrix(this.rows(), this.cols())
    m.forEachIndex((i, j) => {
      m.setDataByIndexs(i, j, v)
    })
    return m
  }

  setValues(v: number) {
    this.set(this._values(v))
  }

  private _random() {
    let m = new Matrix(this.rows(), this.cols())
    m.forEachIndex((i, j) => {
      m.setDataByIndexs(i, j, Math.random())
    })
    return m
  }

  random() {
    this.set(this._random())
  }

  private _transpose() {
    let m = new Matrix(this.rows(), this.cols())
    m.forEachIndex((i, j) => {
      m.setDataByIndexs(i, j, this.getDataByIndexs(j, i))
    })
    return m
  }

  mat2SpMat() {
    let data = new Array<[number, number, number]>()
    this.forEachIndex((i, j) => {
      let d = this.getDataByIndexs(i, j)
      if (d !== 0) {
        data.push([i, j, d])
      }
    })
    return new SparseMatrix(this.rows(), this.cols(), data)
  }

  mat2Vec() {
    if (this.rows() !== 1 && this.cols() !== 1) {
      console.log('can not convert to vector!')
      return new Vector(1, [-1])
    }

    let Vec = new Vector(this.size(), this.data())
    return Vec
  }

  transpose() {
    this.set(this._transpose())
  }

  sub(m: Matrix) {
    let mm = new Matrix(this.rows(), this.cols())
    mm.forEachIndex((i, j) => {
      let result = this.getDataByIndexs(i, j) - m.getDataByIndexs(i, j)
      mm.setDataByIndexs(i, j, result)
    })
    return mm
  }

  mulMat(m: Matrix) {
    // TODO check matrix shape is right or not
    // A.cols == B.rows
    let newM = this.rows()
    let newN = m.cols()
    let mm = new Matrix(newM, newN)
    mm.forEachIndex((i, j) => {
      let d = 0

      for (let n = 0; n < this.cols(); n++) {
        // console.l'-------------------------------'--")
        // console.log(this.getDataByIndexs(i, n));
        // console.log(m.getDataByIndexs(n, j))
        // console.log(this.getDataByIndexs(i, n) * m.getDataByIndexs(n, j))

        d += muldec(this.getDataByIndexs(i, n), m.getDataByIndexs(n, j))
      }

      mm.setDataByIndexs(i, j, d)
    })

    return mm
  }

  mulVec(v: Vector) {
    // check shape
    if (v.size() !== this.cols()) {
      console.log('vector shape is not right!')
      return new Vector(1, [-1])
    }

    let vec2mat = new Matrix(v.size(), 1, v.data())
    let mat = this.mulMat(vec2mat)

    let vec = mat.mat2Vec()
    return vec
  }

  same(m: Matrix) {
    let bSame = true
    // check matrix shape
    if (this.cols() !== m.cols() || this.rows() !== m.rows()) bSame = false

    // check elements
    this.forEachIndex((i, j) => {
      if (this.getDataByIndexs(i, j) !== m.getDataByIndexs(i, j)) bSame = false
    })

    return bSame
  }

  printMatrix() {
    let printStr = '[\n'
    this.forEachRow((r) => {
      printStr += r.join(',')
      printStr += '\n'
    })
    printStr += ']'
    console.log(printStr)
  }
}
