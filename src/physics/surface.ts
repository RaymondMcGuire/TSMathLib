/*
 * @Author: Xu.Wang
 * @Date: 2020-04-07 01:29:25
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-04-15 23:43:07
 */
import { Transform } from './transform'
import { Vector3, TS_MAX_NUM } from '../math'
import { BoundingBox } from './bounding_box'
import { Ray } from './ray'

export class SurfaceRayIntersection3 {
  isIntersecting: boolean = false
  distance: number = TS_MAX_NUM
  point: Vector3
  normal: Vector3

  constructor(
    _point: Vector3 = new Vector3(),
    _normal: Vector3 = new Vector3()
  ) {
    this.point = _point
    this.normal = _normal
  }
}

export abstract class Surface {
  private _transform: Transform
  private _isNormalFlipped: boolean

  constructor(transform: Transform, isNormalFlipped: boolean) {
    this._transform = transform
    this._isNormalFlipped = isNormalFlipped
  }

  transform(): Transform {
    return this._transform
  }

  setTransform(t: Transform) {
    this._transform = t
  }

  setIsNormalFlipped(i: boolean) {
    this._isNormalFlipped = i
  }

  isNormalFlipped(): boolean {
    return this._isNormalFlipped
  }

  // ! Returns the closest point from the given point \p otherPoint to the
  // ! surface in local frame.
  abstract closestPointLocal(otherPoint: Vector3): Vector3

  // ! Returns the bounding box of this surface object in local frame.
  abstract boundingBoxLocal(): BoundingBox

  // ! Returns the closest intersection point for given \p ray in local frame.
  abstract closestIntersectionLocal(ray: Ray): SurfaceRayIntersection3

  // ! Returns the normal to the closest point on the surface from the given
  // ! point \p otherPoint in local frame.
  abstract closestNormalLocal(otherPoint: Vector3): Vector3

  closestPoint(otherPoint: Vector3): Vector3 {
    return this._transform.toWorldByPoint(
      this.closestPointLocal(this._transform.toLocalByPoint(otherPoint))
    )
  }

  boundingBox(): BoundingBox {
    return this._transform.toWorldByBbox(this.boundingBoxLocal())
  }

  intersects(ray: Ray): boolean {
    return this.intersectsLocal(this._transform.toLocalByRay(ray))
  }

  closestDistance(otherPoint: Vector3): number {
    return this.closestDistanceLocal(this._transform.toLocalByPoint(otherPoint))
  }

  closestIntersection(ray: Ray): SurfaceRayIntersection3 {
    let result = this.closestIntersectionLocal(
      this._transform.toLocalByRay(ray)
    )
    result.point = this._transform.toWorldByPoint(result.point)
    result.normal = this._transform.toWorldDirection(result.normal)
    let sign = this._isNormalFlipped ? -1.0 : 1.0
    result.normal = result.normal.mul(sign)
    return result
  }

  closestNormal(otherPoint: Vector3): Vector3 {
    let result = this._transform.toWorldDirection(
      this.closestNormalLocal(this._transform.toLocalByPoint(otherPoint))
    )
    let sign = this._isNormalFlipped ? -1.0 : 1.0
    result = result.mul(sign)
    return result
  }

  // ! Returns true if the given \p ray intersects with this surface object
  // ! in local frame.
  intersectsLocal(rayLocal: Ray): boolean {
    let result = this.closestIntersectionLocal(rayLocal)
    return result.isIntersecting
  }

  updateQueryEngine() {
    console.log('Update Query Engine')
  }

  isBounded(): boolean {
    return true
  }

  isValidGeometry(): boolean {
    return true
  }

  // ! Returns true if \p otherPoint is inside by given \p depth the volume
  // ! defined by the surface in local frame.
  isInside(otherPoint: Vector3): boolean {
    return (
      this._isNormalFlipped ===
      !this.isInsideLocal(this._transform.toLocalByPoint(otherPoint))
    )
  }

  // ! Returns the closest distance from the given point \p otherPoint to the
  // ! point on the surface in local frame.
  closestDistanceLocal(otherPointLocal: Vector3): number {
    return otherPointLocal.distanceTo(this.closestPointLocal(otherPointLocal))
  }

  isInsideLocal(otherPointLocal: Vector3): boolean {
    let cpLocal = this.closestPointLocal(otherPointLocal)
    let normalLocal = this.closestNormalLocal(otherPointLocal)
    return otherPointLocal.sub(cpLocal).dot(normalLocal) < 0.0
  }
}
