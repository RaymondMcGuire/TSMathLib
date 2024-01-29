/*
 * @Author: Xu.Wang
 * @Date: 2020-04-02 23:43:14
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-04-16 18:37:01
 */
import { Vector3 } from '../math/vector3'
import { PointNeighborSearcher } from '../search/point_neighbor_searcher'
import { PointHashGridSearcher } from '../search/point_hash_grid_searcher'
import { Point3 } from '../math/point3'


export class ParticleSystemData {
  private DEFAULT_HASH_GRID_RESOLUTION: Point3 = new Point3(8, 8, 8)

  private _particleRadius: number
  private _particleMass: number
  private _particleSize: number

  private _positionIdx: number
  private _velocityIdx: number
  private _forceIdx: number

  private _scalarDataList: Array<Array<number>>
  private _vectorDataList: Array<Array<Vector3>>

  private _neighborSearcher: PointNeighborSearcher
  private _neighborLists: Array<Array<number>>

  constructor(particleRadius: number = 1e-3, particleMass: number = 1e-3) {
    // LOG.LOGGER(
    //   'init ParticleSystemData: particleRadius=' +
    //     particleRadius +
    //     ',particleMass=' +
    //     particleMass
    // )
    // init particles params & particle number is zero
    this._particleRadius = particleRadius
    this._particleMass = particleMass
    this._particleSize = 0

    // init data lists
    this._scalarDataList = new Array<Array<number>>()
    this._vectorDataList = new Array<Array<Vector3>>()

    // add basic data types
    this._positionIdx = this.addVectorData()
    this._velocityIdx = this.addVectorData()
      this._forceIdx = this.addVectorData()
      
    // set neighbor searcher
    this._neighborSearcher = new PointHashGridSearcher(
      0.0,
      this.DEFAULT_HASH_GRID_RESOLUTION
    )

    this._neighborLists = new Array<Array<number>>()
  }

  addParticles(
    newPositions: Array<Vector3>,
    newVelocities: Array<Vector3>,
    newForces: Array<Vector3>
  ) {
    if (
      newPositions.length !== newVelocities.length ||
      newVelocities.length !== newForces.length
    ) {
      console.log('particles params data size is not correct')
      return
    }

    let newNumberOfParticles = newPositions.length

    let oldNumberOfParticles = this.numberOfParticles()
    let totalNumberOfParticles = oldNumberOfParticles + newNumberOfParticles

    this.resizeNumOfParticles(totalNumberOfParticles)

    let pos = this.positions()
    let vel = this.velocities()
    let frc = this.forces()

    for (let i = 0; i < newNumberOfParticles; i++) {
      pos[i + oldNumberOfParticles] = newPositions[i]
      vel[i + oldNumberOfParticles] = newVelocities[i]
      frc[i + oldNumberOfParticles] = newForces[i]
    }
  }

  // Neighbor Searcher
  buildNeighborSearcher(maxSearchRadius: number) {
    this._neighborSearcher = new PointHashGridSearcher(
      2.0 * maxSearchRadius,
      this.DEFAULT_HASH_GRID_RESOLUTION
    )
    this._neighborSearcher.build(this.positions())
  }

  buildNeighborLists(maxSearchRadius: number) {
    this._neighborLists = new Array<Array<number>>(this.numberOfParticles())

    let points = this.positions()
    for (let i = 0; i < this.numberOfParticles(); ++i) {
        let origin = new Vector3(points[i].x(), points[i].y(), points[i].z())
      this._neighborLists[i] = new Array<number>()

      this._neighborSearcher.forEachNearbyPoint(
        origin,
        maxSearchRadius,

        (j: number, _: Vector3) => {
            if (i !== j) {
            this._neighborLists[i].push(j)
          }
        }
      )
    }
  }

  setNeighborSearcher(newNeighborSearcher: PointNeighborSearcher) {
    this._neighborSearcher = newNeighborSearcher
  }

  neighborSearcher(): PointNeighborSearcher {
    return this._neighborSearcher
  }

  neighborLists(): Array<Array<number>> {
    return this._neighborLists
  }

  // Helper Method
  addScalarData(scalar: number = 0) {
    let attrIdx = this._scalarDataList.length
    let scalarList = new Array<number>(this.numberOfParticles())
    scalarList.fill(scalar)
    this._scalarDataList.push(scalarList)
    return attrIdx
  }

  addVectorData(vec: Vector3 = new Vector3(0.0, 0.0, 0.0)) {
    let attrIdx = this._vectorDataList.length
    let vecList = new Array<Vector3>(this.numberOfParticles())
    vecList.fill(vec)
    this._vectorDataList.push(vecList)
    return attrIdx
  }

  scalarDataAt(idx: number): Array<number> {
    return this._scalarDataList[idx]
  }

  vectorDataAt(idx: number): Array<Vector3> {
    return this._vectorDataList[idx]
  }

  // Setter Method

  setParticleRadius(radius: number) {
    this._particleRadius = Math.max(radius, 0.0)
  }

  setParticleMass(mass: number) {
    this._particleMass = mass
  }

  resizeNumOfParticles(num: number) {
    this._particleSize = num

    for (let idx = 0; idx < this._scalarDataList.length; idx++) {
      let scalarList = this._scalarDataList[idx]
      scalarList = new Array<number>(this._particleSize)
      scalarList.fill(0)
    }

    for (let idx = 0; idx < this._vectorDataList.length; idx++) {
      let vecList = this._vectorDataList[idx]
      vecList = new Array<Vector3>(this._particleSize)
      vecList.fill(new Vector3(0.0, 0.0, 0.0))
    }
  }

  // Getter Method

  particleRadius(): number {
    return this._particleRadius
  }
  particleMass(): number {
    return this._particleMass
  }

  numberOfParticles(): number {
    return this._particleSize
  }

  positions(): Array<Vector3> {
    return this.vectorDataAt(this._positionIdx)
  }

  velocities(): Array<Vector3> {
    return this.vectorDataAt(this._velocityIdx)
  }

  forces(): Array<Vector3> {
    return this.vectorDataAt(this._forceIdx)
  }
}
