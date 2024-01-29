/*
 * @Author: Xu.Wang
 * @Date: 2020-04-01 16:30:02
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-04-01 16:45:30
 */
import { Vector3 } from '../math/vector3'

export class Ray {
  origin: Vector3
  direction: Vector3

  constructor(_origin: Vector3, _direction: Vector3) {
    this.direction = _direction.normalized()
    this.origin = _origin
  }

  pointAt(t: number): Vector3 {
    return this.origin.add(this.direction.mul(t))
  }
}
