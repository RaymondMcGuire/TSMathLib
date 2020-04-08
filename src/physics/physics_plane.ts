/*
 * @Author: Xu.Wang
 * @Date: 2020-04-07 18:38:41
 * @Last Modified by:   Xu.Wang
 * @Last Modified time: 2020-04-07 18:38:41
 */
import { Surface, SurfaceRayIntersection3 } from './surface'
import { Transform } from './transform'
import { Vector3, TS_EPSILON, TS_MAX_NUM } from '../math'
import { Ray } from './ray'
import { BoundingBox } from './bounding_box'

export class PhysicsPlane extends Surface {
  _point: Vector3 = new Vector3()
  _normal: Vector3 = new Vector3()

  constructor(
    transform: Transform = new Transform(),
    isNormalFlipped: boolean = false
  ) {
    super(transform, isNormalFlipped)
  }

  setByPointWithNormal(point: Vector3, normal: Vector3) {
    this._normal = normal
    this._point = point
  }

  setByThreePoints(point1: Vector3, point2: Vector3, Vector3: Vector3) {
    this._normal = point2.sub(point1).cross(Vector3.sub(point1)).normalized()
    this._point = point1
  }

  isBounded(): boolean {
    return false
  }

  closestPointLocal(otherPoint: Vector3): Vector3 {
    let r = otherPoint.sub(this._point)
    return r.sub(this._normal.mul(this._normal.dot(r))).add(this._point)
  }

  closestNormalLocal(_: Vector3): Vector3 {
    return this._normal
  }

  intersectsLocal(ray: Ray): boolean {
    return Math.abs(ray.direction.dot(this._normal)) > 0
  }

  closestIntersectionLocal(ray: Ray): SurfaceRayIntersection3 {
    let intersection = new SurfaceRayIntersection3()

    let dDotN = ray.direction.dot(this._normal)

    // Check if not parallel
    if (Math.abs(dDotN) > 0) {
      let t = this._normal.dot(this._point.sub(ray.origin)) / dDotN
      if (t >= 0.0) {
        intersection.isIntersecting = true
        intersection.distance = t
        intersection.point = ray.pointAt(t)
        intersection.normal = this._normal
      }
    }

    return intersection
  }

  boundingBoxLocal(): BoundingBox {
    let eps = TS_EPSILON
    let dmax = TS_MAX_NUM

    if (Math.abs(this._normal.dot(new Vector3(1, 0, 0)) - 1.0) < eps) {
      return new BoundingBox(
        this._point.sub(new Vector3(0, dmax, dmax)),
        this._point.add(new Vector3(0, dmax, dmax))
      )
    } else if (Math.abs(this._normal.dot(new Vector3(0, 1, 0)) - 1.0) < eps) {
      return new BoundingBox(
        this._point.sub(new Vector3(dmax, 0, dmax)),
        this._point.add(new Vector3(dmax, 0, dmax))
      )
    } else if (Math.abs(this._normal.dot(new Vector3(0, 0, 1)) - 1.0) < eps) {
      return new BoundingBox(
        this._point.sub(new Vector3(dmax, dmax, 0)),
        this._point.add(new Vector3(dmax, dmax, 0))
      )
    } else {
      return new BoundingBox(
        new Vector3(dmax, dmax, dmax),
        new Vector3(dmax, dmax, dmax)
      )
    }
  }
}
