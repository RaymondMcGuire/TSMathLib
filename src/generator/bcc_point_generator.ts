/*
 * @Author: Xu.Wang
 * @Date: 2020-04-02 00:42:47
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-04-15 22:54:11
 */
import { PointGenerator } from './point_generator'
import { Point3 } from '../math/point3'
import { BoundingBox } from '../physics/bounding_box'

/**
 * Body-centered cubic point generator
 * @ref http://en.wikipedia.org/wiki/Cubic_crystal_system
 *      http://mathworld.wolfram.com/CubicClosePacking.html
 */
export class BccPointGenerator extends PointGenerator {
  forEachPoint(
    bbox: BoundingBox,
    spacing: number,
    callback: (p: Point3) => boolean
  ) {
    let halfSpacing = spacing / 2.0
    let boxWidth = bbox.width()
    let boxHeight = bbox.height()
    let boxDepth = bbox.depth()

    let pPos = new Point3(0.0, 0.0, 0.0)
    let hasOffset = false
    let shouldQuit = false
    for (let k = 0; k * halfSpacing <= boxDepth && !shouldQuit; ++k) {
      pPos.z = k * halfSpacing + bbox.lower().z()

      let offset = hasOffset ? halfSpacing : 0.0

      for (let j = 0; j * spacing + offset <= boxHeight && !shouldQuit; ++j) {
        pPos.y = j * spacing + offset + bbox.lower().y()

        for (let i = 0; i * spacing + offset <= boxWidth; ++i) {
          pPos.x = i * spacing + offset + bbox.lower().x()
          let p = new Point3(pPos.x, pPos.y, pPos.z)
          if (!callback(p)) {
            shouldQuit = true
            break
          }
        }
      }
      hasOffset = !hasOffset
    }
  }

  forEachPointWithNoOffset(
    bbox: BoundingBox,
    spacing: number,
    callback: (p: Point3) => boolean
  ) {
    let boxWidth = bbox.width()
    let boxHeight = bbox.height()
    let boxDepth = bbox.depth()

    let pPos = new Point3(0.0, 0.0, 0.0)

    let shouldQuit = false
    for (let k = 0; k * spacing <= boxDepth && !shouldQuit; ++k) {
      pPos.z = k * spacing + bbox.lower().z()
      for (let j = 0; j * spacing <= boxHeight && !shouldQuit; ++j) {
        pPos.y = j * spacing + bbox.lower().y()

        for (let i = 0; i * spacing <= boxWidth; ++i) {
          pPos.x = i * spacing + bbox.lower().x()
          let p = new Point3(pPos.x, pPos.y, pPos.z)
          if (!callback(p)) {
            shouldQuit = true
            break
          }
        }
      }
    }
  }
}
