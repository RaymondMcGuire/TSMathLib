/*
 * @Author: Xu.Wang
 * @Date: 2020-04-03 02:24:38
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-04-03 19:13:44
 */
import { Point3 } from '../math/point3'
import { BccPointGenerator } from '../generator/bcc_point_generator'
import { BoundingBox } from '../physics/bounding_box'
import { Vector3 } from '../math/vector3'
import { SphKernelPoly6 } from './sph_kernel'
import { ParticleSystemData } from '../physics/particle_system_data'
import { PHY_WATER_DENSITY } from '../physics/physics_constants'

export class SphData extends ParticleSystemData {
  _targetDensity: number = PHY_WATER_DENSITY
  _targetSpacing: number = 0.1

  // ! Relative radius of SPH kernel
  // ! SPH kernel radius divided by target spacing
  _kernelRadiusOverTargetSpacing: number = 1.8

  // ! SPH kernel radius in meters.
  _kernelRadius: number
  _pressureIdx: number
  _densityIdx: number

  constructor(num: number) {
    super(num)
    this._densityIdx = this.addScalarData()
    this._pressureIdx = this.addScalarData()
    this._kernelRadius =
      this._kernelRadiusOverTargetSpacing * this._targetSpacing
    this.setTargetSpacing(this._targetSpacing)
  }

  densities(): Array<number> {
    return this.scalarDataAt(this._densityIdx)
  }

  pressures(): Array<number> {
    return this.scalarDataAt(this._pressureIdx)
  }

  setTargetSpacing(spacing: number) {
    super.setRadius(spacing)

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
    let incRatio = newMass / this.mass()
    this._targetDensity *= incRatio
    super.setMass(newMass)
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
    let kernel = new SphKernelPoly6(this._kernelRadius)

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
    this.setMass(newMass)
  }

  sumOfKernelNearby(origin: Vector3) {
    let sum = 0.0
    let kernel = new SphKernelPoly6(this._kernelRadius)
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
    let m = this.mass()

    for (let i = 0; i < this.numberOfParticles(); i++) {
      let sum = this.sumOfKernelNearby(p[i])
      d[i] = m * sum
    }
  }
}
