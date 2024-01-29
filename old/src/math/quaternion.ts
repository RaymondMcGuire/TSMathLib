/*
 * @Author: Xu.Wang
 * @Date: 2020-04-05 23:25:54
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-04-15 23:50:46
 * @Description  q = w + xi + yj + zk
 *  q_v = (q_x,q_y,q_z) = iq_x+jq_y+kq_z
 *  \hat{q} = (q_v,q_w) = q_v + q_w = iq_x+jq_y+kq_z+q_w
 *  i^2 = j^2 = k^2 = ijk = -1
 *  jk = -kj = i, ki = -ik = j, ij = -ji = k
 */

import { Matrix4x4 } from './matrix4x4'
import { Vector3 } from './vector3'
import { TS_EPSILON, TS_PI } from './math_constants'
import { Matrix3x3 } from './matrix3x3'

export class Quaternion {
  x: number
  y: number
  z: number
  w: number
  constructor(_x: number = 0, _y: number = 0, _z: number = 0, _w: number = 1) {
    this.x = _x
    this.y = _y
    this.z = _z
    this.w = _w
  }

  set(x: number, y: number, z: number, w: number) {
    this.x = x
    this.y = y
    this.z = z
    this.w = w
  }

  setByAxisAngle(axis: Vector3, angle: number) {
    let axisLengthSquared = axis.lengthSquared()

    if (axisLengthSquared < TS_EPSILON) {
      this.setIdentity()
    } else {
      let normalizedAxis = axis.normalized()
      let s = Math.sin(angle / 2)

      this.x = normalizedAxis.x() * s
      this.y = normalizedAxis.y() * s
      this.z = normalizedAxis.z() * s
      this.w = Math.cos(angle / 2)
    }
  }

  setByFromTo(from: Vector3, to: Vector3) {
    let axis = from.cross(to)

    let fromLengthSquared = from.lengthSquared()
    let toLengthSquared = to.lengthSquared()

    if (fromLengthSquared < TS_EPSILON || toLengthSquared < TS_EPSILON) {
      this.setIdentity()
    } else {
      let axisLengthSquared = axis.lengthSquared()
      // In case two vectors are exactly the opposite, pick orthogonal vector
      // for axis.
      if (axisLengthSquared < TS_EPSILON) {
        axis = from.tangential()[0]
      }

      this.set(axis.x(), axis.y(), axis.z(), from.dot(to))
      this.w += this.l2Norm()

      this.normalize()
    }
  }

  /**
   * multiply
   * @param q quaternion q(q_x,q_y,q_z,q_w)
   * @param r quaternion r(r_x,r_y,r_z,r_w)
   * qr = (iq_x+jq_y+kq_z+q_w)(ir_x+jr_y+kr_z+r_w)
   *    = i(q_y*r_z + q_x*r_w +q_w*r_x -q_z*r_y)
   *    + j(q_y*r_w + r_y*q_w + q_z*r_x - q_x*r_z)
   *    + k(q_z*r_w + r_z*q_w + q_x*r_y - q_y*r_x)
   *    + q_w*r_w - q_x*r_x - q_y*r_y - q_z*r_z
   *
   *    = (q_v x r_w + r_w*q_v + q_w*r_v, q_w*r_w - q_v・r_v)
   */
  mul(r: Quaternion): Quaternion {
    let _x = this.y * r.z - this.z * r.y + r.w * this.x + this.w * r.x
    let _y = this.z * r.x - this.x * r.z + r.w * this.y + this.w * r.y
    let _z = this.x * r.y - this.y * r.x + r.w * this.z + this.w * r.z
    let _w = this.w * r.w - this.x * r.x - r.y * this.y - this.z * r.z
    return new Quaternion(_x, _y, _z, _w)
  }

  rmul(q: Quaternion): Quaternion {
    return new Quaternion(
      q.w * this.x + q.x * this.w + q.y * this.z - q.z * this.y,
      q.w * this.y - q.x * this.z + q.y * this.w + q.z * this.x,
      q.w * this.z + q.x * this.y - q.y * this.x + q.z * this.w,
      q.w * this.w - q.x * this.x - q.y * this.y - q.z * this.z
    )
  }

  imul(q: Quaternion) {
    let r = this.mul(q)
    this.set(r.x, r.y, r.z, r.w)
  }

  mulV3(v: Vector3): Vector3 {
    let _2xx = 2 * this.x * this.x
    let _2yy = 2 * this.y * this.y
    let _2zz = 2 * this.z * this.z
    let _2xy = 2 * this.x * this.y
    let _2xz = 2 * this.x * this.z
    let _2xw = 2 * this.x * this.w
    let _2yz = 2 * this.y * this.z
    let _2yw = 2 * this.y * this.w
    let _2zw = 2 * this.z * this.w

    return new Vector3(
      (1 - _2yy - _2zz) * v.x() + (_2xy - _2zw) * v.y() + (_2xz + _2yw) * v.z(),
      (_2xy + _2zw) * v.x() + (1 - _2zz - _2xx) * v.y() + (_2yz - _2xw) * v.z(),
      (_2xz - _2yw) * v.x() + (_2yz + _2xw) * v.y() + (1 - _2yy - _2xx) * v.z()
    )
  }

  dot(q: Quaternion) {
    return this.x * q.x + this.y * q.y + this.z * q.z + this.w * q.w
  }

  add(r: Quaternion): Quaternion {
    let q = this
    return new Quaternion(q.x + r.x, q.y + r.y, q.z + r.z, q.w + r.w)
  }

  inv(): Quaternion {
    return new Quaternion(-this.x, -this.y, -this.z, this.w)
  }

  identity(): Quaternion {
    return new Quaternion(0, 0, 0, 1)
  }

  setIdentity() {
    this.set(0, 0, 0, 1)
  }

  axis(): Vector3 {
    let result = new Vector3(this.x, this.y, this.z)
    result.normalize()

    if (2 * Math.acos(this.w) < TS_PI) {
      return result
    } else {
      return result.mul(-1)
    }
  }

  angle(): number {
    let result = 2 * Math.acos(this.w)

    if (result < TS_PI) {
      return result
    } else {
      // Wrap around
      return 2 * TS_PI - result
    }
  }

  getAxisAngle(): [Vector3, number] {
    let axis = new Vector3(this.x, this.y, this.z)
    axis.normalize()
    let angle = 2 * Math.acos(this.w)

    if (angle > TS_PI) {
      // Wrap around
      axis = axis.mul(-1)
      angle = 2 * TS_PI - angle
    }
    return [axis, angle]
  }

  inverse(): Quaternion {
    let denom =
      this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z
    return new Quaternion(
      -this.x / denom,
      -this.y / denom,
      -this.z / denom,
      this.w / denom
    )
  }

  rotate(angleInRadians: number) {
    let axisAngle = this.getAxisAngle()

    axisAngle[1] += angleInRadians

    this.setByAxisAngle(axisAngle[0], axisAngle[1])
  }

  rotateByAxisAngle(angle: number, axis: Array<number>): Quaternion {
    let sq = Math.sqrt(
      axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]
    )
    if (!sq) {
      console.log('error: quaternion need a axis value')
      return new Quaternion(0, 0, 0, 0)
    }
    let a = axis[0]
    let b = axis[1]
    let c = axis[2]
    if (sq !== 1) {
      sq = 1 / sq
      a *= sq
      b *= sq
      c *= sq
    }
    let s = Math.sin(angle * 0.5)

    let _x = a * s
    let _y = b * s
    let _z = c * s
    let _w = Math.cos(angle * 0.5)
    return new Quaternion(_x, _y, _z, _w)
  }

  // P' = qPq^(-1)
  ToV3(pv3: Vector3, q: Quaternion): Vector3 {
    let invq = q.inv()

    let inp = new Quaternion(pv3.x(), pv3.y(), pv3.z(), 0)

    let pinvq = invq.mul(inp)
    let qpinvq = pinvq.mul(q)

    return new Vector3(qpinvq.x, qpinvq.y, qpinvq.z)
  }

  ToMatrix3x3(): Matrix3x3 {
    let _2xx = 2 * this.x * this.x
    let _2yy = 2 * this.y * this.y
    let _2zz = 2 * this.z * this.z
    let _2xy = 2 * this.x * this.y
    let _2xz = 2 * this.x * this.z
    let _2xw = 2 * this.x * this.w
    let _2yz = 2 * this.y * this.z
    let _2yw = 2 * this.y * this.w
    let _2zw = 2 * this.z * this.w

    let data = new Array<number>(
      1 - _2yy - _2zz,
      _2xy - _2zw,
      _2xz + _2yw,
      _2xy + _2zw,
      1 - _2zz - _2xx,
      _2yz - _2xw,
      _2xz - _2yw,
      _2yz + _2xw,
      1 - _2yy - _2xx
    )
    // console.log(data)
    let m3 = new Matrix3x3(data)

    return m3
  }

  ToMatrix4x4(): Matrix4x4 {
    let _2xx = 2 * this.x * this.x
    let _2yy = 2 * this.y * this.y
    let _2zz = 2 * this.z * this.z
    let _2xy = 2 * this.x * this.y
    let _2xz = 2 * this.x * this.z
    let _2xw = 2 * this.x * this.w
    let _2yz = 2 * this.y * this.z
    let _2yw = 2 * this.y * this.w
    let _2zw = 2 * this.z * this.w

    let data = new Array<number>(
      1 - _2yy - _2zz,
      _2xy - _2zw,
      _2xz + _2yw,
      0,
      _2xy + _2zw,
      1 - _2zz - _2xx,
      _2yz - _2xw,
      0,
      _2xz - _2yw,
      _2yz + _2xw,
      1 - _2yy - _2xx,
      0,
      0,
      0,
      0,
      1
    )

    let m4 = new Matrix4x4(data)

    return m4
  }

  slerp(qtn1: Quaternion, qtn2: Quaternion, time: number): Quaternion {
    let outq = new Quaternion(0, 0, 0, 0)

    if (time < 0 || time > 1) {
      console.log("error: quaternion, parameter time's setting is wrong!")
      return outq
    }

    let ht =
      qtn1.x * qtn2.x + qtn1.y * qtn2.y + qtn1.z * qtn2.z + qtn1.w * qtn2.w
    let hs = 1.0 - ht * ht
    if (hs <= 0.0) {
      outq.x = qtn1.x
      outq.y = qtn1.y
      outq.z = qtn1.z
      outq.w = qtn1.w
    } else {
      hs = Math.sqrt(hs)
      if (Math.abs(hs) < TS_EPSILON) {
        outq.x = qtn1.x * 0.5 + qtn2.x * 0.5
        outq.y = qtn1.y * 0.5 + qtn2.y * 0.5
        outq.z = qtn1.z * 0.5 + qtn2.z * 0.5
        outq.w = qtn1.w * 0.5 + qtn2.w * 0.5
      } else {
        let ph = Math.acos(ht)
        let pt = ph * time
        let t0 = Math.sin(ph - pt) / hs
        let t1 = Math.sin(pt) / hs
        outq.x = qtn1.x * t0 + qtn2.x * t1
        outq.y = qtn1.y * t0 + qtn2.y * t1
        outq.z = qtn1.z * t0 + qtn2.z * t1
        outq.w = qtn1.w * t0 + qtn2.w * t1
      }
    }
    return outq
  }

  l2Norm() {
    return Math.sqrt(
      this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
    )
  }

  normalize() {
    let norm = this.l2Norm()

    if (norm > 0) {
      this.x /= norm
      this.y /= norm
      this.z /= norm
      this.w /= norm
    }
  }

  normalized(): Quaternion {
    let q = new Quaternion(this.x, this.y, this.z, this.w)
    q.normalize()
    return q
  }

  printQuaternion() {
    let str = 'x:' + this.x + ',y:' + this.y + ',z:' + this.z + ',w:' + this.w
    console.log(str)
  }
}
