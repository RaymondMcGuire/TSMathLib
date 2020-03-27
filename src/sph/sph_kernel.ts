/*
 * @Author: Xu.Wang
 * @Date: 2020-03-28 01:45:16
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-03-28 03:29:14
 */

import { Vector3 } from '../math/vector3'
import { TS_PI } from '../math/math_constants'

export class SphKernelPoly6 {
  // Kernel radius
  _h: number

  //  Square of the kernel radius
  _h2: number

  //  Cubic of the kernel radius
  _h3: number

  //  Fifth-power of the kernel radius
  _h5: number

  /**
   * Creates an instance of sph kernel poly6
   * @param kernelRadius
   */
  constructor(kernelRadius: number) {
    this._h = kernelRadius
    this._h2 = this._h * this._h
    this._h3 = this._h2 * this._h
    this._h5 = this._h2 * this._h3
  }

  /**
   * Gets sph kernel poly6
   * @param distance
   * @returns
   */
  get(distance: number) {
    let _distance = Math.abs(distance)
    if (_distance >= this._h) {
      return 0.0
    } else {
      let x = 1.0 - (_distance * _distance) / this._h2
      return (315.0 / (64.0 * TS_PI * this._h3)) * x * x * x
    }
  }

  /**
   * Gets first derivative
   * @param distance
   * @returns
   */
  getFirstDerivative(distance: number) {
    let _distance = Math.abs(distance)
    if (_distance >= this._h) {
      return 0.0
    } else {
      let x = 1.0 - (_distance * _distance) / this._h2
      return (-945.0 / (32.0 * TS_PI * this._h5)) * _distance * x * x
    }
  }

  /**
   * Gets gradient by v3
   * @param point
   * @returns
   */
  getGradientByV3(point: Vector3) {
    let dist = point.length()
    if (dist > 0.0) {
      return this.getGradientByDistance(dist, point.div(dist))
    } else {
      return new Vector3(0, 0, 0)
    }
  }

  /**
   * Gets gradient by distance
   * @param distance
   * @param directionToCenter
   * @returns
   */
  getGradientByDistance(distance: number, directionToCenter: Vector3) {
    return directionToCenter.mul(-this.getFirstDerivative(distance))
  }

  getSecondDerivative(distance: number) {
    let _distance = Math.abs(distance)
    if (_distance >= this._h) {
      return 0.0
    } else {
      let x = (_distance * _distance) / this._h2
      return (945.0 / (32.0 * TS_PI * this._h5)) * (1 - x) * (5 * x - 1)
    }
  }
}
