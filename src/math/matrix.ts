/*
 * @Author: Xu.Wang
 * @Date: 2020-04-05 20:18:48
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-04-06 01:51:14
 * @Description: M * N Dimention Matrix
 */

import { muldec } from './math_utils'
import { Vector } from './vector'
import { SparseMatrix } from './sparse_matrix'
import { MatrixIndex, MatrixData, MatrixSplit } from './interface'
export class Matrix {
  private _elements: Array<number> = new Array<number>()
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
      // check size
      if (M * N === params.length) {
        this._elements = new Array<number>(this.size())
        for (_i = 0; _i < params.length; _i++) {
          this._elements[_i] = params[_i]
        }
      } else {
        console.log('Matrix init error: size is not equal to M*N')
        return
      }
    }
  }

  private _set(params: Matrix) {
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

  private _fill(n: number) {
    let m = new Matrix(this.rows(), this.cols())
    m.forEachIndex((i, j) => {
      m.setDataByIndexs(i, j, n)
    })
    return m
  }

  ones() {
    return this._fill(1)
  }

  zeros() {
    return this._fill(0)
  }

  fillValues(v: number) {
    this._set(this._fill(v))
  }

  private _random() {
    let m = new Matrix(this.rows(), this.cols())
    m.forEachIndex((i, j) => {
      m.setDataByIndexs(i, j, Math.random())
    })
    return m
  }

  random() {
    return this._random()
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
      console.log('matrix can not convert to vector!', this.rows(), this.cols())
      return new Vector(1, [-1])
    }

    let Vec = new Vector(this.size(), this.data())
    return Vec
  }

  transpose() {
    return this._transpose()
  }

  sub(m: Matrix) {
    let mm = new Matrix(this.rows(), this.cols())
    mm.forEachIndex((i, j) => {
      let result = this.getDataByIndexs(i, j) - m.getDataByIndexs(i, j)
      mm.setDataByIndexs(i, j, result)
    })
    return mm
  }

  /**
   * Matrix this Multiply Matrix m
   * AxB mul BxC = AxC
   * @param m
   * @returns
   */
  mulMat(m: any): Matrix {
    // check matrix shape is right or not
    if (this.cols() !== m.rows()) {
      console.log(
        'Matrix Multiply Error: Matrix1 column is not equal to Matrix2 row:',
        this.cols(),
        m.rows()
      )
      return this.zeros()
    }
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
      console.log('vector shape is not right!', v.size(), this.cols())
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
    if (this.cols() !== m.cols() || this.rows() !== m.rows()) {
      console.log(
        'Matrix Dimension is not correct:',
        this.cols(),
        this.rows(),
        m.cols(),
        m.rows()
      )
      return false
    }

    // check elements
    this.forEachIndex((i, j) => {
      if (this.getDataByIndexs(i, j) !== m.getDataByIndexs(i, j)) {
        console.log(
          'Matrix values is not correct:',
          i,
          j,
          this.getDataByIndexs(i, j),
          m.getDataByIndexs(i, j)
        )
        bSame = false
      }
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
