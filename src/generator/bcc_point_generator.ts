/*
 * @Author: Xu.Wang
 * @Date: 2020-04-02 00:42:47
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-04-02 01:15:01
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
      pPos.z = k * halfSpacing + bbox._lower.z()

      let offset = hasOffset ? halfSpacing : 0.0

      for (let j = 0; j * spacing + offset <= boxHeight && !shouldQuit; ++j) {
        pPos.y = j * spacing + offset + bbox._lower.y()

        for (let i = 0; i * spacing + offset <= boxWidth; ++i) {
          pPos.x = i * spacing + offset + bbox._lower.x()
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
}
