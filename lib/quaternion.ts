/* =========================================================================
 *
 *  quaternion.ts
 *
 *  q_v = (q_x,q_y,q_z) = iq_x+jq_y+kq_z
 *  \hat{q} = (q_v,q_w) = q_v + q_w = iq_x+jq_y+kq_z+q_w
 *  i^2 = j^2 = k^2 = ijk = -1
 *  jk = -kj = i, ki = -ik = j, ij = -ji = k
 *
 * ========================================================================= */
import { Matrix4x4 } from '../webgl/matrix4x4'
import { Vector3 } from './vector3'

export class Quaternion {
  x: number
  y: number
  z: number
  w: number
  constructor(_x?: number, _y?: number, _z?: number, _w?: number) {
    if (
      _x !== undefined &&
      _y !== undefined &&
      _z !== undefined &&
      _w !== undefined
    ) {
      this.x = _x
      this.y = _y
      this.z = _z
      this.w = _w
    } else {
      let q = this.identity()
      this.x = q.x
      this.y = q.y
      this.z = q.z
      this.w = q.w
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
    let q = this
    let _x = q.y * r.z - q.z * r.y + r.w * q.x + q.w * r.x
    let _y = q.z * r.x - q.x * r.z + r.w * q.y + q.w * r.y
    let _z = q.x * r.y - q.y * r.x + r.w * q.z + q.w * r.z
    let _w = q.w * r.w - q.x * r.x - q.y * r.y - q.z * r.z
    return new Quaternion(_x, _y, _z, _w)
  }

  add(r: Quaternion): Quaternion {
    let q = this
    return new Quaternion(q.x + r.x, q.y + r.y, q.z + r.z, q.w + r.w)
  }

  inv(): Quaternion {
    return new Quaternion(-this.x, -this.y, -this.z, this.w)
  }

  norm(): Quaternion {
    let _x = 0
    let _y = 0
    let _z = 0
    let _w = 1
    let l = Math.sqrt(
      this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
    )
    if (l !== 0) {
      l = 1 / l
      _x = this.x * l
      _y = this.y * l
      _z = this.z * l
      _w = this.w * l
    }
    return new Quaternion(_x, _y, _z, _w)
  }

  identity(): Quaternion {
    return new Quaternion(0, 0, 0, 1)
  }

  rotate(angle: number, axis: Array<number>): Quaternion {
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

  ToMat4x4(): Matrix4x4 {
    let x = this.x
    let y = this.y
    let z = this.z
    let w = this.w

    let x2 = x + x
    let y2 = y + y
    let z2 = z + z
    let xx = x * x2
    let xy = x * y2
    let xz = x * z2
    let yy = y * y2
    let yz = y * z2
    let zz = z * z2
    let wx = w * x2
    let wy = w * y2
    let wz = w * z2

    let v16 = new Array<number>(16)
    v16[0] = 1 - (yy + zz)
    v16[1] = xy - wz
    v16[2] = xz + wy
    v16[3] = 0
    v16[4] = xy + wz
    v16[5] = 1 - (xx + zz)
    v16[6] = yz - wx
    v16[7] = 0
    v16[8] = xz - wy
    v16[9] = yz + wx
    v16[10] = 1 - (xx + yy)
    v16[11] = 0
    v16[12] = 0
    v16[13] = 0
    v16[14] = 0
    v16[15] = 1

    let mat = new Matrix4x4(v16)
    return mat
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
      if (Math.abs(hs) < 0.0001) {
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
}
