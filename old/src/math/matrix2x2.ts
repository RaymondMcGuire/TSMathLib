/*
 * @Author: Xu.Wang
 * @Date: 2020-04-05 20:57:03
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-04-05 21:11:36
 */

import { Matrix } from './matrix'

export class Matrix2x2 extends Matrix {
  constructor(params?: Array<number>) {
    if (params === undefined) {
      // set to identity matrix
      params = new Array<number>(1, 0, 0, 1)
    } else {
      // check size
      if (4 !== params.length) {
        console.log('Matrix2x2 init error: size is not equal to 4')
        return
      }
    }

    super(2, 2, params)
  }

  private _identity(): Array<number> {
    return new Array<number>(1, 0, 0, 1)
  }

  identity(): Matrix2x2 {
    return new Matrix2x2(this._identity())
  }

  // OpenGL Helper
  scaleMatrix(sx: number, sy: number) {
    return new Matrix2x2(new Array<number>(sx, 0, 0, sy))
  }

  rotationMatrix(rad: number) {
    return new Matrix2x2(
      new Array<number>(
        Math.cos(rad),
        -Math.sin(rad),
        Math.sin(rad),
        Math.cos(rad)
      )
    )
  }
}
