/*
 * @Author: Xu.Wang
 * @Date: 2020-04-01 16:53:50
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-04-15 22:59:04
 */
import { swap, clampV3 } from '../math/math_utils'
import { Ray } from './ray'
import { Vector3 } from '../math/vector3'
import { Point3 } from '../math/point3'

export class BoundingBox {
  private _lower: Vector3
  private _upper: Vector3

  /**
   * Creates an instance of bounding box.
   * @param p1
   * @param p2
   */
  constructor(p1?: Vector3, p2?: Vector3) {
    if (p1 === undefined || p2 === undefined) {
      this._lower = new Vector3(
        Number.MAX_VALUE,
        Number.MAX_VALUE,
        Number.MAX_VALUE
      )
      this._upper = new Vector3(
        -Number.MAX_VALUE,
        -Number.MAX_VALUE,
        -Number.MAX_VALUE
      )
    } else {
      this._lower = new Vector3(
        Math.min(p1.x(), p2.x()),
        Math.min(p1.y(), p2.y()),
        Math.min(p1.z(), p2.z())
      )
      this._upper = new Vector3(
        Math.max(p1.x(), p2.x()),
        Math.max(p1.y(), p2.y()),
        Math.max(p1.z(), p2.z())
      )
    }
  }

  lower(): Vector3 {
    return this._lower
  }

  setLower(l: Vector3) {
    this._lower = l
  }

  setUpper(u: Vector3) {
    this._upper = u
  }

  upper(): Vector3 {
    return this._upper
  }

  // Getter Method
  width(): number {
    return this.upper().x() - this.lower().x()
  }

  height(): number {
    return this.upper().y() - this.lower().y()
  }

  depth(): number {
    return this.upper().z() - this.lower().z()
  }

  length(axis: number): number {
    return this.upper().data()[axis] - this.lower().data()[axis]
  }

  midPoint(): Vector3 {
    return this.upper().add(this.lower()).div(2)
  }

  diagonalLength(): number {
    return this.upper().sub(this.lower()).length()
  }

  diagonalLengthSquared(): number {
    return this.upper().sub(this.lower()).lengthSquared()
  }

  contains(point: Vector3): boolean {
    if (this.upper().x() < point.x() || this.lower().x() > point.x()) {
      return false
    }

    if (this.upper().y() < point.y() || this.lower().y() > point.y()) {
      return false
    }

    if (this.upper().z() < point.z() || this.lower().z() > point.z()) {
      return false
    }

    return true
  }

  overlaps(other: BoundingBox): boolean {
    if (
      this.upper().x() < other.lower().x() ||
      this.lower().x() > other.upper().x()
    ) {
      return false
    }

    if (
      this.upper().y() < other.lower().y() ||
      this.lower().y() > other.upper().y()
    ) {
      return false
    }

    if (
      this.upper().y() < other.lower().z() ||
      this.lower().z() > other.upper().y()
    ) {
      return false
    }

    return true
  }

  corner(idx: number): Vector3 {
    let h = 1.0 / 2.0
    let Vector3offset = new Array<Vector3>()
    Vector3offset.push(new Vector3(-h, -h, -h))
    Vector3offset.push(new Vector3(h, -h, -h))
    Vector3offset.push(new Vector3(-h, h, -h))
    Vector3offset.push(new Vector3(h, h, -h))
    Vector3offset.push(new Vector3(-h, -h, h))
    Vector3offset.push(new Vector3(h, -h, h))
    Vector3offset.push(new Vector3(-h, h, h))
    Vector3offset.push(new Vector3(h, h, h))

    let corv3: Vector3 = new Vector3(this.width(), this.height(), this.depth())
    return corv3.mul(Vector3offset[idx]).add(this.midPoint())
  }

  clamp(val: Vector3): Vector3 {
    return clampV3(val, this.lower(), this.upper())
  }

  isEmpty(): boolean {
    return (
      this.lower().x() >= this.upper().x() ||
      this.lower().y() >= this.upper().y() ||
      this.lower().z() >= this.upper().z()
    )
  }

  // Setter Method
  reset() {
    this._lower = new Vector3(
      Number.MAX_VALUE,
      Number.MAX_VALUE,
      Number.MAX_VALUE
    )
    this._upper = new Vector3(
      -Number.MAX_VALUE,
      -Number.MAX_VALUE,
      -Number.MAX_VALUE
    )
  }

  mergeWithBbox(bbox: BoundingBox) {
    this._lower = new Vector3(
      Math.min(this.lower().x(), bbox.lower().x()),
      Math.min(this.lower().y(), bbox.lower().y()),
      Math.min(this.lower().z(), bbox.lower().z())
    )
    this._upper = new Vector3(
      Math.max(this.upper().x(), bbox.upper().x()),
      Math.max(this.upper().y(), bbox.upper().y()),
      Math.max(this.upper().z(), bbox.upper().z())
    )
  }

  mergeWithPoint(point: Point3) {
    this._lower = new Vector3(
      Math.min(this.lower().x(), point.x),
      Math.min(this.lower().y(), point.y),
      Math.min(this.lower().z(), point.z)
    )
    this._upper = new Vector3(
      Math.max(this.upper().x(), point.x),
      Math.max(this.upper().y(), point.y),
      Math.max(this.upper().z(), point.z)
    )
  }

  expand(delta: number) {
    this.lower().isub(delta)
    this.upper().iadd(delta)
  }

  // Intersection Method
  intersects(ray: Ray): boolean {
    let Min = 0
    let Max = Number.MAX_VALUE
    let rayInvDir = ray.direction.rdiv(1)

    for (let i = 0; i < 3; ++i) {
      let tNear =
        (this.lower().data()[i] - ray.origin.data()[i]) * rayInvDir.data()[i]
      let tFar =
        (this.upper().data()[i] - ray.origin.data()[i]) * rayInvDir.data()[i]
      if (tNear > tFar) {
        let val = swap(tNear, tFar)
        tNear = val[0]
        tFar = val[1]
      }
      Min = tNear > Min ? tNear : Min
      Max = tFar < Max ? tFar : Max

      if (Min > Max) {
        return false
      }
    }

    return true
  }

  closestIntersection(ray: Ray): BoundingBoxRayIntersection3 {
    let intersection = new BoundingBoxRayIntersection3()

    let Min = 0
    let Max = Number.MAX_VALUE
    let rayInvDir = ray.direction.rdiv(1)

    for (let i = 0; i < 3; ++i) {
      let tNear =
        (this.lower().data()[i] - ray.origin.data()[i]) * rayInvDir.data()[i]
      let tFar =
        (this.upper().data()[i] - ray.origin.data()[i]) * rayInvDir.data()[i]

      if (tNear > tFar) {
        let val = swap(tNear, tFar)
        tNear = val[0]
        tFar = val[1]
      }
      Min = tNear > Min ? tNear : Min
      Max = tFar < Max ? tFar : Max

      if (Min > Max) {
        intersection.isIntersecting = false
        return intersection
      }
    }

    intersection.isIntersecting = true

    if (this.contains(ray.origin)) {
      intersection.Near = Max
      intersection.Far = Number.MAX_VALUE
    } else {
      intersection.Near = Min
      intersection.Far = Max
    }

    return intersection
  }
}

export class BoundingBoxRayIntersection3 {
  // ! True if the box and ray intersects.
  isIntersecting: boolean

  // ! Distance to the first intersection point.
  Near: number

  // ! Distance to the second (and the last) intersection point.
  Far: number

  constructor() {
    this.isIntersecting = false
    this.Near = Number.MAX_VALUE
    this.Far = Number.MAX_VALUE
  }
}
