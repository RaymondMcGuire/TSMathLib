/*
 * @Author: Xu.Wang
 * @Date: 2020-03-31 16:11:26
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-03-31 18:59:25
 */
export class Point3 {
  x: number
  y: number
  z: number

  constructor(_x?: number, _y?: number, _z?: number) {
    if (_x === undefined) {
      this.x = 0
    } else {
      this.x = _x
    }

    if (_y === undefined) {
      this.y = 0
    } else {
      this.y = _y
    }

    if (_z === undefined) {
      this.z = 0
    } else {
      this.z = _z
    }
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
}
