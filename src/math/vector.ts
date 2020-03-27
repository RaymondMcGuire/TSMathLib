/* =========================================================================
 *
 *  vector.ts
 *  T-D vector data
 *  T:type,default setting is number
 *  D:dimension
 * ========================================================================= */
import { absMax, absMin } from './math_utils'

export class Vector {
  _elements: Array<number>
  _dimension: number

  // constructs vector with parameters or zero
  constructor(dimension: number, params?: Array<number>) {
    this._dimension = dimension
    let _i = 0
    if (params === undefined) {
      // init n dimension vector data,setting all 0
      this._elements = new Array<number>(dimension)
      for (_i = 0; _i < dimension; _i++) {
        this._elements[_i] = 0
      }
    } else {
      this._elements = new Array<number>(dimension)
      for (_i = 0; _i < params.length; _i++) {
        this._elements[_i] = params[_i]
      }
    }
  }

  set(params: Vector | undefined) {
    if (params !== undefined) {
      if (params.size() !== this.size()) {
        console.log('dimension is not correct!')
        return false
      }
      for (let _i = 0; _i < params.size(); _i++) {
        this._elements[_i] = params.data()[_i]
      }

      return true
    }
    return false
  }

  setZero() {
    for (let _i = 0; _i < this._dimension; _i++) {
      this._elements[_i] = 0
    }
  }

  setOne() {
    for (let _i = 0; _i < this._dimension; _i++) {
      this._elements[_i] = 1
    }
  }

  data() {
    return this._elements
  }

  at(idx: number) {
    if (idx < 0 || idx >= this.size()) {
      console.log('index is not correct!')
      return -1
    }
    return this._elements[idx]
  }

  dot(others: Vector | undefined) {
    if (others === undefined) {
      console.log('others is not correct!')
      return -1
    }
    if (others.size() !== this.size()) {
      console.log('dimension is not correct!')
      return -1
    }

    let ret = 0
    for (let _i = 0; _i < this.size(); _i++) {
      ret += this._elements[_i] * others.data()[_i]
    }
    return ret
  }

  lengthSquared() {
    return this.dot(this)
  }

  length() {
    return Math.sqrt(this.lengthSquared())
  }

  normalize() {
    this.idiv(this.length())
  }

  sum() {
    let ret = 0
    for (let _i = 0; _i < this._dimension; _i++) {
      ret += this._elements[_i]
    }
    return ret
  }

  size() {
    return this._dimension
  }

  avg() {
    return this.sum() / this.size()
  }

  min() {
    let minVal = this._elements[0]

    for (let _i = 1; _i < this._dimension; _i++) {
      minVal = Math.min(minVal, this._elements[_i])
    }
    return minVal
  }

  max() {
    let maxVal = this._elements[0]
    for (let _i = 1; _i < this._dimension; _i++) {
      maxVal = Math.max(maxVal, this._elements[_i])
    }
    return maxVal
  }

  absmax() {
    let absMaxVal = this._elements[0]
    for (let _i = 1; _i < this._dimension; _i++) {
      absMaxVal = absMax(absMaxVal, this._elements[_i])
    }
    return absMaxVal
  }

  absmin() {
    let absMinVal = this._elements[0]
    for (let _i = 1; _i < this._dimension; _i++) {
      absMinVal = absMin(absMinVal, this._elements[_i])
    }
    return absMinVal
  }

  distanceSquaredTo(others: Vector) {
    if (others.size() !== this.size()) {
      console.log('dimension is not correct!')
      return -1
    }

    let ret = 0
    for (let _i = 0; _i < this.size(); _i++) {
      let diff = this._elements[_i] - others.data()[_i]
      ret += diff * diff
    }

    return ret
  }

  distanceTo(others: Vector) {
    return Math.sqrt(this.distanceSquaredTo(others))
  }

  isEqual(others: Vector) {
    if (this.size() !== others.size()) return false

    for (let _i = 0; _i < this.size(); _i++) {
      if (this.at(_i) !== others.at(_i)) return false
    }

    return true
  }

  isSimilar(others: Vector | undefined, epsilon: number) {
    if (others === undefined) return false
    if (this.size() !== others.size()) return false

    for (let _i = 0; _i < this.size(); _i++) {
      if (Math.abs(this.at(_i) - others.at(_i)) > epsilon) return false
    }

    return true
  }

  add(params?: any) {
    let _i = 0
    if (typeof params === 'object') {
      let v = params
      if (v.size() !== this.size()) return new Vector(1, [-1])

      let newV = new Vector(this.size(), this.data())
      for (_i = 0; _i < newV.size(); _i++) {
        newV.data()[_i] += v.data()[_i]
      }

      return newV
    } else if (typeof params === 'number') {
      let s = params
      let newV = new Vector(this.size(), this.data())
      for (_i = 0; _i < newV.size(); _i++) {
        newV.data()[_i] += s
      }

      return newV
    }

    return new Vector(1, [-1])
  }

  sub(params?: any) {
    let _i = 0
    if (typeof params === 'object') {
      let v = params
      if (v.size() !== this.size()) return new Vector(1, [-1])

      let newV = new Vector(this.size(), this.data())
      for (_i = 0; _i < newV.size(); _i++) {
        newV.data()[_i] -= v.data()[_i]
      }

      return newV
    } else if (typeof params === 'number') {
      let s = params
      let newV = new Vector(this.size(), this.data())
      for (_i = 0; _i < newV.size(); _i++) {
        newV.data()[_i] -= s
      }

      return newV
    }

    return new Vector(1, [-1])
  }

  mul(params?: any) {
    let _i = 0
    if (typeof params === 'object') {
      let v = params
      if (v.size() !== this.size()) return new Vector(1, [-1])

      let newV = new Vector(this.size(), this.data())
      for (_i = 0; _i < newV.size(); _i++) {
        newV.data()[_i] *= v.data()[_i]
      }

      return newV
    } else if (typeof params === 'number') {
      let s = params
      let newV = new Vector(this.size(), this.data())
      for (_i = 0; _i < newV.size(); _i++) {
        newV.data()[_i] *= s
      }

      return newV
    }

    return new Vector(1, [-1])
  }

  div(params?: any) {
    let _i = 0
    if (typeof params === 'object') {
      let v = params
      if (v.size() !== this.size()) return new Vector(1, [-1])

      let newV = new Vector(this.size(), this.data())
      for (_i = 0; _i < newV.size(); _i++) {
        newV.data()[_i] /= v.data()[_i]
      }

      return newV
    } else if (typeof params === 'number') {
      let s = params
      if (s === 0) return new Vector(1, [-1])
      let newV = new Vector(this.size(), this.data())
      for (_i = 0; _i < newV.size(); _i++) {
        newV.data()[_i] /= s
      }

      return newV
    }

    return new Vector(1, [-1])
  }

  idiv(params?: any) {
    this.set(this.div(params))
  }

  iadd(params?: any) {
    this.set(this.add(params))
  }

  isub(params?: any) {
    this.set(this.sub(params))
  }

  imul(params?: any) {
    this.set(this.mul(params))
  }

  setAt(idx: number, val: number) {
    if (idx < 0 || idx >= this.size()) {
      return undefined
    }

    this._elements[idx] = val
    return true
  }

  /**
   * proj_u(v) = <u,v>/<v,v> u
   * @param u
   * @param v
   */
  static proj(u: Vector, v: Vector) {
    return u.mul(v.dot(u) / u.dot(u))
  }
}
