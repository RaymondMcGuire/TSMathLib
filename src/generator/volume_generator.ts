/*
 * @Author: Xu.Wang
 * @Date: 2020-04-04 22:34:32
 * @Last Modified by:   Xu.Wang
 * @Last Modified time: 2020-04-04 22:34:32
 */
import { BoundingBox } from '../physics/bounding_box'
import { Point3 } from '../math/point3'
import { BccPointGenerator } from './bcc_point_generator'

export class VolumeGenerator {
  private _bbox: BoundingBox
  private _spacing: number
  private _points: Array<Point3>

  private _bcc: BccPointGenerator

  constructor(bbox: BoundingBox, spacing: number) {
    this._bbox = bbox
    this._spacing = spacing
    this._bcc = new BccPointGenerator()
    this._points = new Array<Point3>()
    this._bcc.generate(this._bbox, this._spacing, this._points)
  }

  bbox(): BoundingBox {
    return this._bbox
  }
  spacing(): number {
    return this._spacing
  }
  points(): Array<Point3> {
    return this._points
  }
}
