/*
 * @Author: Xu.Wang
 * @Date: 2020-03-31 15:12:02
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-03-31 15:26:28
 */

import { Vector3 } from '../math/vector3'
export class SPH {
  _numOfParticles: number

  _positions: Array<Vector3>
  _densities: Array<number>
  _mass: number
}
