/*
 * @Author: Xu.Wang
 * @Date: 2020-04-03 02:24:38
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-04-16 18:45:39
 */
import { Point3 } from '../math/point3'
import { BccPointGenerator } from '../generator/bcc_point_generator'
import { BoundingBox } from '../physics/bounding_box'
import { Vector3 } from '../math/vector3'
import { SphKernelSpiky } from './sph_kernel'
import { ParticleSystemData } from '../physics/particle_system_data'
import { PHY_WATER_DENSITY } from '../physics/physics_constants'
import { square } from '../math'
import { LOG } from '../log/log'

export class SphData extends ParticleSystemData {
  _targetDensity: number
  _targetSpacing: number

  // ! Relative radius of SPH kernel
  // ! SPH kernel radius divided by target spacing
  _kernelRadiusOverTargetSpacing: number = 1.8

  // ! SPH kernel radius in meters.
  _kernelRadius: number
  _pressureIdx: number
  _densityIdx: number

  constructor(
    radius: number = 1e-3,
    mass: number = 1e-3,
    targetDensity: number = PHY_WATER_DENSITY,
    targetSpacing: number = 0.1
  ) {
    super(radius, mass)

    // set the fluid density & spacing & kernel radius
    this._targetDensity = targetDensity
    this._targetSpacing = targetSpacing
    this._kernelRadius =
      this._kernelRadiusOverTargetSpacing * this._targetSpacing
    LOG.LOGGER(
      'init SphData: targetDensity=' +
        targetDensity +
        ',targetSpacing=' +
        targetSpacing +
        ',kernelRadius=' +
        this._kernelRadius
    )

    // add sph params
    this._densityIdx = this.addScalarData()
    this._pressureIdx = this.addScalarData()

    // recompute particle radius & mass
    this.setTargetSpacing(this._targetSpacing)
    LOG.LOGGER(
      'recompute particle data: particleRadius=' +
        this.particleRadius() +
        ',particleMass=' +
        this.particleMass()
    )
  }

  densities(): Array<number> {
    return this.scalarDataAt(this._densityIdx)
  }

  pressures(): Array<number> {
    return this.scalarDataAt(this._pressureIdx)
  }

  setTargetSpacing(spacing: number) {
    super.setParticleRadius(spacing)

    this._targetSpacing = spacing
    this._kernelRadius =
      this._kernelRadiusOverTargetSpacing * this._targetSpacing

    this.computeMass()
  }

  targetSpacing(): number {
    return this._targetSpacing
  }

  setRelativeKernelRadius(relativeRadius: number) {
    this._kernelRadiusOverTargetSpacing = relativeRadius
    this._kernelRadius =
      this._kernelRadiusOverTargetSpacing * this._targetSpacing

    this.computeMass()
  }

  relativeKernelRadius(): number {
    return this._kernelRadiusOverTargetSpacing
  }

  setKernelRadius(kernelRadius: number) {
    this._kernelRadius = kernelRadius
    this._targetSpacing = kernelRadius / this._kernelRadiusOverTargetSpacing

    this.computeMass()
  }

  kernelRadius(): number {
    return this._kernelRadius
  }

  setMass(newMass: number) {
    let incRatio = newMass / this.particleMass()
    this._targetDensity *= incRatio
    super.setParticleMass(newMass)
  }

  computeMass() {
    let points = new Array<Point3>()
    let bcc = new BccPointGenerator()
    let bbox = new BoundingBox(
      new Vector3(
        -1.5 * this._kernelRadius,
        -1.5 * this._kernelRadius,
        -1.5 * this._kernelRadius
      ),
      new Vector3(
        1.5 * this._kernelRadius,
        1.5 * this._kernelRadius,
        1.5 * this._kernelRadius
      )
    )
    bcc.generate(bbox, this._targetSpacing, points)
    let maxNumberDensity = 0.0
    let kernel = new SphKernelSpiky(this._kernelRadius)

    for (let i = 0; i < points.length; ++i) {
      const point = points[i]
      let sum = 0.0

      for (let j = 0; j < points.length; ++j) {
        const neighborPoint = points[j]
        sum += kernel.get(neighborPoint.distanceTo(point))
      }

      maxNumberDensity = Math.max(maxNumberDensity, sum)
    }

    if (maxNumberDensity <= 0) {
      console.log('Error: maxNumberDensity <= 0!')
      return
    }

    let newMass = this._targetDensity / maxNumberDensity
    super.setParticleMass(newMass)
  }

  sumOfKernelNearby(origin: Vector3) {
    let sum = 0.0
    let kernel = new SphKernelSpiky(this._kernelRadius)
    this.neighborSearcher().forEachNearbyPoint(
      origin,
      this._kernelRadius,
      (_: number, neighborPosition: Vector3) => {
        let dist = origin.distanceTo(neighborPosition)
        sum += kernel.get(dist)
      }
    )
    return sum
  }

  setTargetDensity(targetDensity: number) {
    this._targetDensity = targetDensity

    this.computeMass()
  }

  targetDensity(): number {
    return this._targetDensity
  }
  // compute densities
  updateDensities() {
    let p = this.positions()
    let d = this.densities()
    let m = this.particleMass()

    for (let i = 0; i < this.numberOfParticles(); i++) {
      let sum = this.sumOfKernelNearby(p[i])
      d[i] = m * sum
    }
  }

  interpolate(origin: Vector3, values: Array<number>): number {
    let sum = 0.0
    let d = this.densities()
    let kernel = new SphKernelSpiky(this._kernelRadius)
    let m = this.particleMass()

    this.neighborSearcher().forEachNearbyPoint(
      origin,
      this._kernelRadius,
      (i: number, neighborPosition: Vector3) => {
        let dist = origin.distanceTo(neighborPosition)
        let weight = (m / d[i]) * kernel.get(dist)
        sum += weight * values[i]
      }
    )

    return sum
  }

  gradientAt(i: number, values: Array<number>): Vector3 {
    let sum = new Vector3()
    let p = this.positions()
    let d = this.densities()
    let neighbors = this.neighborLists()[i]
    let origin = p[i]
    let kernel = new SphKernelSpiky(this._kernelRadius)
    let m = this.particleMass()

    for (let j in neighbors) {
      let neighborPosition = p[j]
      let dist = origin.distanceTo(neighborPosition)
      if (dist > 0.0) {
        let dir = neighborPosition.sub(origin).div(dist)
        sum = sum.add(
          kernel
            .getGradientByDistance(dist, dir)
            .mul(
              d[i] * m * (values[i] / square(d[i]) + values[j] / square(d[j]))
            )
        )
      }
    }

    return sum
  }

  laplacianAt(i: number, values: Array<number>): number {
    let sum = 0.0
    let p = this.positions()
    let d = this.densities()
    let neighbors = this.neighborLists()[i]
    let origin = p[i]
    let kernel = new SphKernelSpiky(this._kernelRadius)
    let m = this.particleMass()

    for (let j in neighbors) {
      let neighborPosition = p[j]
      let dist = origin.distanceTo(neighborPosition)
      sum +=
        ((m * (values[j] - values[i])) / d[j]) *
        kernel.getSecondDerivative(dist)
    }

    return sum
  }

  laplacianV3At(i: number, values: Array<number>): Vector3 {
    let sum = new Vector3()
    let p = this.positions()
    let d = this.densities()
    let neighbors = this.neighborLists()[i]
    let origin = p[i]
    let kernel = new SphKernelSpiky(this._kernelRadius)
    let m = this.particleMass()

    for (let j in neighbors) {
      let neighborPosition = p[j]
      let dist = origin.distanceTo(neighborPosition)
      sum = sum.add(
        ((m * (values[j] - values[i])) / d[j]) *
          kernel.getSecondDerivative(dist)
      )
    }
    return sum
  }

  buildSphNeighborSearcher() {
    this.buildNeighborSearcher(this._kernelRadius)
  }

  buildSphNeighborLists() {
    this.buildNeighborLists(this._kernelRadius)
  }
}
