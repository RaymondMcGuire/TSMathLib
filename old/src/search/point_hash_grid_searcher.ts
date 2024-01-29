/*
 * @Author: Xu.Wang
 * @Date: 2020-03-31 15:38:47
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-04-16 18:42:40
 */

import { Vector3 } from '../math/vector3'
import { Point3 } from '../math/point3'
import { PointNeighborSearcher } from './point_neighbor_searcher'
import { LOG } from '../log/log'

export class PointHashGridSearcher extends PointNeighborSearcher {
  _name = 'PointHashGridSearcher'
  _gridSpacing: number = 1.0
  _resolution: Point3 = new Point3(1, 1, 1)
  _points: Array<Vector3> = new Array<Vector3>()
  _buckets: Array<Array<number>> = new Array<Array<number>>()

  constructor(gridSpacing: number, resolution: Point3) {
    super()
    this._gridSpacing = gridSpacing
    this._resolution = resolution
    LOG.LOGGER(
      'init PointHashGridSearcher : gridSpacing=' +
        gridSpacing +
        ',resolution=' +
        resolution.debug()
    )
  }

  build(points: Array<Vector3>) {
    this._points.fill(new Vector3())
    this._buckets.fill(new Array<number>(0))
    // init array
    this._points = new Array<Vector3>(points.length)
    this._buckets = new Array<Array<number>>(
      this._resolution.x * this._resolution.y * this._resolution.z
    )

    for (let idx = 0; idx < this._buckets.length; idx++) {
      this._buckets[idx] = new Array<number>()
    }

    if (points.length === 0) return

    for (let i = 0; i < points.length; i++) {
      this._points[i] = points[i]
      let key: number = this.getHashKeyFromPosition(points[i])
      this._buckets[key].push(i)
    }
  }

  forEachNearbyPoint(
    origin: Vector3,
    radius: number,
    callback: (pidx: number, p: Vector3) => void
  ) {
    if (this._buckets.length === 0) {
      return
    }

    let nearbyKeys = Array<number>(8)
    this.getNearbyKeys(origin, nearbyKeys)

    let queryRadiusSquared = radius * radius

    for (let i = 0; i < 8; i++) {
      let bucket = this._buckets[nearbyKeys[i]]
      let numberOfPointsInBucket = bucket.length

      for (let j = 0; j < numberOfPointsInBucket; ++j) {
        let pointIndex = bucket[j]
        let rSquared = this._points[pointIndex].sub(origin).lengthSquared()
        if (rSquared <= queryRadiusSquared) {
          callback(pointIndex, this._points[pointIndex])
        }
      }
    }
  }

  hasNearbyPoint(origin: Vector3, radius: number): boolean {
    if (this._buckets.length === 0) {
      return false
    }

    let nearbyKeys = Array<number>(8)
    this.getNearbyKeys(origin, nearbyKeys)

    let queryRadiusSquared = radius * radius

    for (let i = 0; i < 8; i++) {
      let bucket = this._buckets[nearbyKeys[i]]
      let numberOfPointsInBucket = bucket.length

      for (let j = 0; j < numberOfPointsInBucket; ++j) {
        let pointIndex = bucket[j]
        let rSquared = this._points[pointIndex].sub(origin).lengthSquared()
        if (rSquared <= queryRadiusSquared) {
          return true
        }
      }
    }

    return false
  }

  getHashKeyFromPosition(position: Vector3): number {
    let bucketIndex: Point3 = this.getBucketIndex(position)
    return this.getHashKeyFromBucketIndex(bucketIndex)
  }

  getBucketIndex(position: Vector3): Point3 {
    let bucketIndex: Point3 = new Point3()
    bucketIndex.x = Math.floor(position.x() / this._gridSpacing)
    bucketIndex.y = Math.floor(position.y() / this._gridSpacing)
    bucketIndex.z = Math.floor(position.z() / this._gridSpacing)
    return bucketIndex
  }

  getHashKeyFromBucketIndex(bucketIndex: Point3): number {
    let wrappedIndex = bucketIndex
    wrappedIndex.x = bucketIndex.x % this._resolution.x
    wrappedIndex.y = bucketIndex.y % this._resolution.y
    wrappedIndex.z = bucketIndex.z % this._resolution.z

    if (wrappedIndex.x < 0) {
      wrappedIndex.x += this._resolution.x
    }
    if (wrappedIndex.y < 0) {
      wrappedIndex.y += this._resolution.y
    }
    if (wrappedIndex.z < 0) {
      wrappedIndex.z += this._resolution.z
    }
    return (
      (wrappedIndex.z * this._resolution.y + wrappedIndex.y) *
        this._resolution.x +
      wrappedIndex.x
    )
  }

  getNearbyKeys(position: Vector3, nearbyKeys: Array<number>) {
    let originIndex = this.getBucketIndex(position)
    let nearbyBucketIndices = new Array<Point3>(8)

    for (let i = 0; i < 8; i++) {
      nearbyBucketIndices[i] = originIndex.clone()
    }

    if ((originIndex.x + 0.5) * this._gridSpacing <= position.x()) {
      nearbyBucketIndices[4].x += 1
      nearbyBucketIndices[5].x += 1
      nearbyBucketIndices[6].x += 1
      nearbyBucketIndices[7].x += 1
    } else {
      nearbyBucketIndices[4].x -= 1
      nearbyBucketIndices[5].x -= 1
      nearbyBucketIndices[6].x -= 1
      nearbyBucketIndices[7].x -= 1
    }

    if ((originIndex.y + 0.5) * this._gridSpacing <= position.y()) {
      nearbyBucketIndices[2].y += 1
      nearbyBucketIndices[3].y += 1
      nearbyBucketIndices[6].y += 1
      nearbyBucketIndices[7].y += 1
    } else {
      nearbyBucketIndices[2].y -= 1
      nearbyBucketIndices[3].y -= 1
      nearbyBucketIndices[6].y -= 1
      nearbyBucketIndices[7].y -= 1
    }

    if ((originIndex.z + 0.5) * this._gridSpacing <= position.z()) {
      nearbyBucketIndices[1].z += 1
      nearbyBucketIndices[3].z += 1
      nearbyBucketIndices[5].z += 1
      nearbyBucketIndices[7].z += 1
    } else {
      nearbyBucketIndices[1].z -= 1
      nearbyBucketIndices[3].z -= 1
      nearbyBucketIndices[5].z -= 1
      nearbyBucketIndices[7].z -= 1
    }

    for (let i = 0; i < 8; i++) {
      nearbyKeys[i] = this.getHashKeyFromBucketIndex(nearbyBucketIndices[i])
    }

    return nearbyKeys
  }
}
