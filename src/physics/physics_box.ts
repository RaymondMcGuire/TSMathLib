/*
 * @Author: Xu.Wang
 * @Date: 2020-04-15 22:13:18
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-04-16 00:22:02
 */

import { Surface, SurfaceRayIntersection3 } from './surface'
import { Vector3, clampV3 } from '../math'
import { Transform } from './transform'
import { Ray } from '.'
import { BoundingBox } from './bounding_box'
import { PhysicsPlane } from './physics_plane'

export class PhysicsBox extends Surface {
  private _bound: BoundingBox

  constructor(
    lower: Vector3 = new Vector3(),
    upper: Vector3 = new Vector3(1.0, 1.0, 1.0),
    transform: Transform = new Transform(),
    isNormalFlipped: boolean = false
  ) {
    super(transform, isNormalFlipped)
    this._bound = new BoundingBox(lower, upper)
  }

  bound(): BoundingBox {
    return this._bound
  }

  closestPointLocal(otherPoint: Vector3): Vector3 {
    if (this._bound.contains(otherPoint)) {
      let planes = new Array<PhysicsPlane>(
        new PhysicsPlane(new Vector3(1, 0, 0), this._bound.upper()),
        new PhysicsPlane(new Vector3(0, 1, 0), this._bound.upper()),
        new PhysicsPlane(new Vector3(0, 0, 1), this._bound.upper()),
        new PhysicsPlane(new Vector3(-1, 0, 0), this._bound.lower()),
        new PhysicsPlane(new Vector3(0, -1, 0), this._bound.lower()),
        new PhysicsPlane(new Vector3(0, 0, -1), this._bound.lower())
      )

      let result = planes[0].closestPoint(otherPoint)

      let distanceSquared = result.distanceSquaredTo(otherPoint)
      for (let i = 1; i < 6; ++i) {
        let localResult = planes[i].closestPoint(otherPoint)
        let localDistanceSquared = localResult.distanceSquaredTo(otherPoint)

        if (localDistanceSquared < distanceSquared) {
          result = localResult
          distanceSquared = localDistanceSquared
        }
      }

      return result
    } else {
      return clampV3(otherPoint, this._bound.lower(), this._bound.upper())
    }
  }

  closestNormalLocal(otherPoint: Vector3): Vector3 {
    let planes = new Array<PhysicsPlane>(
      new PhysicsPlane(new Vector3(1, 0, 0), this._bound.upper()),
      new PhysicsPlane(new Vector3(0, 1, 0), this._bound.upper()),
      new PhysicsPlane(new Vector3(0, 0, 1), this._bound.upper()),
      new PhysicsPlane(new Vector3(-1, 0, 0), this._bound.lower()),
      new PhysicsPlane(new Vector3(0, -1, 0), this._bound.lower()),
      new PhysicsPlane(new Vector3(0, 0, -1), this._bound.lower())
    )

    if (this._bound.contains(otherPoint)) {
      let closestNormal = planes[0].normal()
      let closestPoint = planes[0].closestPoint(otherPoint)
      let minDistanceSquared = closestPoint.sub(otherPoint).lengthSquared()

      for (let i = 1; i < 6; ++i) {
        let localClosestPoint = planes[i].closestPoint(otherPoint)
        let localDistanceSquared = localClosestPoint
          .sub(otherPoint)
          .lengthSquared()

        if (localDistanceSquared < minDistanceSquared) {
          closestNormal = planes[i].normal()
          minDistanceSquared = localDistanceSquared
        }
      }

      return closestNormal
    } else {
      let closestPoint = clampV3(
        otherPoint,
        this._bound.lower(),
        this._bound.upper()
      )
      let closestPointToInputPoint = otherPoint.sub(closestPoint)
      let closestNormal = planes[0].normal()
      let maxCosineAngle = closestNormal.dot(closestPointToInputPoint)

      for (let i = 1; i < 6; ++i) {
        let cosineAngle = planes[i].normal().dot(closestPointToInputPoint)

        if (cosineAngle > maxCosineAngle) {
          closestNormal = planes[i].normal()
          maxCosineAngle = cosineAngle
        }
      }

      return closestNormal
    }
  }

  intersectsLocal(ray: Ray): boolean {
    return this._bound.intersects(ray)
  }

  closestIntersectionLocal(ray: Ray): SurfaceRayIntersection3 {
    let intersection = new SurfaceRayIntersection3()
    let bbRayIntersection = this._bound.closestIntersection(ray)
    intersection.isIntersecting = bbRayIntersection.isIntersecting
    if (intersection.isIntersecting) {
      intersection.distance = bbRayIntersection.Near
      intersection.point = ray.pointAt(bbRayIntersection.Near)
      intersection.normal = this.closestNormal(intersection.point)
    }

    return intersection
  }

  boundingBoxLocal(): BoundingBox {
    return this._bound
  }
}
