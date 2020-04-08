/*
 * @Author: Xu.Wang
 * @Date: 2020-03-31 16:11:26
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-04-07 17:44:00
 */

import { Vector3 } from './vector3'

export class Point3 {
  x: number
  y: number
  z: number

  constructor(_x: number = 0, _y: number = 0, _z: number = 0) {
    this.x = _x
    this.y = _y
    this.z = _z
  }

  clone(): Point3 {
    return new Point3(this.x, this.y, this.z)
  }

  distanceSquaredTo(others: Point3): number {
    let diffX = this.x - others.x
    let diffY = this.y - others.y
    let diffZ = this.z - others.z
    let ret = diffX * diffX + diffY * diffY + diffZ * diffZ

    return ret
  }

  distanceTo(others: Point3) {
    return Math.sqrt(this.distanceSquaredTo(others))
  }

  toVector3(): Vector3 {
    return new Vector3(this.x, this.y, this.z)
  }
}
