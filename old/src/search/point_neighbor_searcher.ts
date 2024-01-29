/*
 * @Author: Xu.Wang
 * @Date: 2020-03-31 15:27:43
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-03-31 16:48:47
 */

import { Vector3 } from '../math/vector3'

export abstract class PointNeighborSearcher {
  abstract _name: string

  /**
   * For each nearby point around the origin
   * @param callback The callback function.
   * @param origin   The origin position.
   * @param radius   The search radius.
   */
  abstract forEachNearbyPoint(
    origin: Vector3,
    radius: number,
    callback: (pidx: number, p: Vector3) => void
  ): void

  /**
   * Determines whether nearby point has
   * @param origin
   * @param radius
   * @returns true if has nearby point
   */
  abstract hasNearbyPoint(origin: Vector3, radius: number): boolean

  /**
   * Builds point neighbor searcher
   * @param points
   */
  abstract build(points: Array<Vector3>): void
}
