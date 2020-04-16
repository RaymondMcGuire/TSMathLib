/*
 * @Author: Xu.Wang
 * @Date: 2020-04-07 00:38:37
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-04-15 23:57:00
 */
import { Vector3, Quaternion, Matrix3x3 } from '../math'
import { Ray } from './ray'
import { BoundingBox } from './bounding_box'

export class Transform {
  private _translation: Vector3
  private _orientation: Quaternion
  private _orientationMat3: Matrix3x3
  private _inverseOrientationMat3: Matrix3x3

  constructor(
    translation: Vector3 = new Vector3(),
    orientation: Quaternion = new Quaternion()
  ) {
    this._translation = translation
    this._orientation = orientation
    this._orientationMat3 = orientation.ToMatrix3x3()
    this._inverseOrientationMat3 = orientation.inverse().ToMatrix3x3()
  }

  translation(): Vector3 {
    return this._translation
  }

  setTranslation(translation: Vector3) {
    this._translation = translation
  }

  orientation(): Quaternion {
    return this._orientation
  }

  setOrientation(orientation: Quaternion) {
    this._orientation = orientation
    this._orientationMat3 = orientation.ToMatrix3x3()
    this._inverseOrientationMat3 = orientation.inverse().ToMatrix3x3()
  }

  toLocalByPoint(pointInWorld: Vector3): Vector3 {
    return this._inverseOrientationMat3.mulV3(
      pointInWorld.sub(this._translation)
    )
  }

  toLocalDirection(dirInWorld: Vector3): Vector3 {
    return this._inverseOrientationMat3.mulV3(dirInWorld)
  }

  toLocalByRay(rayInWorld: Ray): Ray {
    return new Ray(
      this.toLocalByPoint(rayInWorld.origin),
      this.toLocalDirection(rayInWorld.direction)
    )
  }

  toLocalByBbox(bboxInWorld: BoundingBox): BoundingBox {
    let bboxInLocal = new BoundingBox(
      new Vector3(0.0, 0.0, 0.0),
      new Vector3(0.0, 0.0, 0.0)
    )
    for (let i = 0; i < 8; ++i) {
      let cornerInLocal = this.toLocalByPoint(bboxInWorld.corner(i))
      bboxInLocal.mergeWithPoint(cornerInLocal.toPoint())
    }
    return bboxInLocal
  }

  toWorldByPoint(pointInLocal: Vector3): Vector3 {
    return this._orientationMat3.mulV3(pointInLocal).add(this._translation)
  }

  toWorldDirection(dirInLocal: Vector3): Vector3 {
    return this._orientationMat3.mulV3(dirInLocal)
  }

  toWorldByRay(rayInLocal: Ray): Ray {
    return new Ray(
      this.toWorldByPoint(rayInLocal.origin),
      this.toWorldDirection(rayInLocal.direction)
    )
  }

  toWorldByBbox(bboxInLocal: BoundingBox): BoundingBox {
    let bboxInWorld = new BoundingBox()
    for (let i = 0; i < 8; ++i) {
      let cornerInWorld = this.toWorldByPoint(bboxInLocal.corner(i))
      bboxInWorld.mergeWithPoint(cornerInWorld.toPoint())
    }
    return bboxInWorld
  }
}
