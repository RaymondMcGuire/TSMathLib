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
export class Quaternion {
  x: number
  y: number
  z: number
  w: number
  constructor(_x: number, _y: number, _z: number, _w: number) {
    this.x = _x
    this.y = _y
    this.z = _z
    this.w = _w
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
  mul(r: Quaternion) {
    let q = this
    let _x = q.y * r.z - q.z * r.y + r.w * q.x + q.w * r.x
    let _y = q.z * r.x - q.x * r.z + r.w * q.y + q.w * r.y
    let _z = q.x * r.y - q.y * r.x + r.w * q.z + q.w * r.z
    let _w = q.w * r.w - q.x * r.x - q.y * r.y - q.z * r.z
    return new Quaternion(_x, _y, _z, _w)
  }

  add(r: Quaternion) {
    let q = this
    return new Quaternion(q.x + r.x, q.y + r.y, q.z + r.z, q.w + r.w)
  }

  inv() {
    return new Quaternion(-this.x, -this.y, -this.z, this.w)
  }

  norm() {
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
}
