/*
 * @Author: Xu.Wang
 * @Date: 2020-04-07 18:38:17
 * @Last Modified by:   Xu.Wang
 * @Last Modified time: 2020-04-07 18:38:17
 */
import { Surface, SurfaceRayIntersection3 } from './surface'
import { Vector3, square } from '../math'
import { Transform } from './transform'
import { Ray } from '.'
import { BoundingBox } from './bounding_box'

export class PhysicsSphere extends Surface {
  _center: Vector3
  _radius: number

  constructor(
    center: Vector3 = new Vector3(),
    radius: number = 1.0,
    transform: Transform = new Transform(),
    isNormalFlipped: boolean = false
  ) {
    super(transform, isNormalFlipped)
    this._center = center
    this._radius = radius
  }

  closestPointLocal(otherPoint: Vector3): Vector3 {
    return this.closestNormalLocal(otherPoint)
      .mul(this._radius)
      .add(this._center)
  }

  closestDistanceLocal(otherPoint: Vector3): number {
    return Math.abs(this._center.distanceTo(otherPoint) - this._radius)
  }

  closestNormalLocal(otherPoint: Vector3): Vector3 {
    if (this._center.isSimilar(otherPoint)) {
      return new Vector3(1, 0, 0)
    } else {
      return otherPoint.sub(this._center).normalized()
    }
  }

  intersectsLocal(ray: Ray): boolean {
    let r = ray.origin.sub(this._center)
    let b = ray.direction.dot(r)
    let c = r.lengthSquared() - square(this._radius)
    let d = b * b - c

    if (d > 0) {
      d = Math.sqrt(d)
      let tMin = -b - d
      let tMax = -b + d

      if (tMin < 0.0) {
        tMin = tMax
      }

      if (tMin >= 0.0) {
        return true
      }
    }

    return false
  }

  closestIntersectionLocal(ray: Ray): SurfaceRayIntersection3 {
    let intersection = new SurfaceRayIntersection3()
    let r = ray.origin.sub(this._center)
    let b = ray.direction.dot(r)
    let c = r.lengthSquared() - square(this._radius)
    let d = b * b - c

    if (d > 0) {
      d = Math.sqrt(d)
      let tMin = -b - d
      let tMax = -b + d

      if (tMin < 0.0) {
        tMin = tMax
      }

      if (tMin < 0.0) {
        intersection.isIntersecting = false
      } else {
        intersection.isIntersecting = true
        intersection.distance = tMin
        intersection.point = ray.origin.add(ray.direction.mul(tMin))
        intersection.normal = intersection.point.sub(this._center).normalized()
      }
    } else {
      intersection.isIntersecting = false
    }

    return intersection
  }

  boundingBoxLocal(): BoundingBox {
    let r = new Vector3(this._radius, this._radius, this._radius)
    return new BoundingBox(this._center.sub(r), this._center.add(r))
  }
}
