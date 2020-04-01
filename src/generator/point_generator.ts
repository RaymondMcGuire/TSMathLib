/*
 * @Author: Xu.Wang
 * @Date: 2020-04-02 00:34:25
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-04-02 01:42:54
 */

import { BoundingBox } from '../physics/bounding_box'
import { Point3 } from '../math/point3'

export abstract class PointGenerator {
  abstract forEachPoint(
    bbox: BoundingBox,
    spacing: number,
    callback: (p: Point3) => boolean
  ): void

  generate(bbox: BoundingBox, spacing: number, points: Array<Point3>) {
    this.forEachPoint(bbox, spacing, (p: Point3) => {
      points.push(p)
      return true
    })
  }

  printPoints2Py(points: Array<Point3>) {
    let xArray = new Array<number>()
    let yArray = new Array<number>()
    let zArray = new Array<number>()
    for (let idx = 0; idx < points.length; idx++) {
      const p = points[idx]
      xArray.push(p.x)
      yArray.push(p.y)
      zArray.push(p.z)
    }

    let strPrintX = 'xArray = ['
    let strPrintY = 'yArray = ['
    let strPrintZ = 'zArray = ['
    let splitStr = ','
    for (let idx = 0; idx < points.length; idx++) {
      if (idx === points.length - 1) splitStr = ''
      strPrintX += xArray[idx] + splitStr
      strPrintY += yArray[idx] + splitStr
      strPrintZ += zArray[idx] + splitStr
    }
    strPrintX += ']'
    strPrintY += ']'
    strPrintZ += ']'
    let outStr = strPrintX + '\n' + strPrintY + '\n' + strPrintZ + '\n'
    console.log(outStr)
  }
}
