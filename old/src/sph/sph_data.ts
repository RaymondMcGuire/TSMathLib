/*
 * @Author: Xu.Wang
 * @Date: 2020-04-03 02:24:38
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-04-16 18:45:39
 */
import { Vector3 } from '../math/vector3'
import { SphKernelSpiky, SphKernelPoly6 } from './sph_kernel'
import { ParticleSystemData } from '../physics/particle_system_data'
import { PHY_WATER_DENSITY } from '../physics/physics_constants'
import { square } from '../math'

export class SphData extends ParticleSystemData {
  _targetDensity: number
  _pInKernelNum: number

  // ! SPH kernel radius in meters.
  _kernelRadius: number
  _pressureIdx: number
  _densityIdx: number

  constructor(
    mass: number = 0.04,
    pInKernelNum: number = 20,
    targetDensity: number = PHY_WATER_DENSITY
  ) {
    super(0.0, mass)

    // add sph params
    this._densityIdx = this.addScalarData()
    this._pressureIdx = this.addScalarData()
    // set the fluid density & spacing & kernel radius
    this._targetDensity = targetDensity
    this._pInKernelNum = pInKernelNum

    // compute V & kernel radius & particle radius
    let V = (this._pInKernelNum * this.particleMass()) / this._targetDensity
    this._kernelRadius = Math.pow((3.0 * V) / (4.0 * Math.PI), 1 / 3)
    this.setParticleRadius(
      Math.pow(Math.PI / (6.0 * this._pInKernelNum), 1 / 3) * this._kernelRadius
    )

    this.setTargetDensity(this.calcRestDensity())
  }

  // Properties Calculation
  calcRestDensity() {
    let poly6Kernel = new SphKernelPoly6(this._kernelRadius)
    let r0 = 0.0
    let l = 2 * this.particleRadius()
    let n = Math.ceil(this._kernelRadius / l) + 1
    for (let x = -n; x <= n; ++x) {
      for (let y = -n; y <= n; ++y) {
        for (let z = -n; z <= n; ++z) {
          let rij = new Vector3(x * l, y * l, z * l)
          r0 += this.particleMass() * poly6Kernel.get(rij.length())
        }
      }
    }
    return r0
  }

  densities(): Array<number> {
    return this.scalarDataAt(this._densityIdx)
  }

  pressures(): Array<number> {
    return this.scalarDataAt(this._pressureIdx)
  }

  setKernelRadius(kernelRadius: number) {
    this._kernelRadius = kernelRadius
  }

  kernelRadius(): number {
    return this._kernelRadius
  }

    sumOfKernelNearby(origin: Vector3) {
        let sum = 0.0
        // console.log("=====================")
        let kernel = new SphKernelPoly6(this._kernelRadius)
    this.neighborSearcher().forEachNearbyPoint(
      origin,
      this._kernelRadius,
      (i: number, neighborPosition: Vector3) => {
          let dist = origin.distanceTo(neighborPosition)
          sum += kernel.get(dist)
         
          // console.log(i)
      }
    )
    return sum
  }

  setTargetDensity(targetDensity: number) {
    this._targetDensity = targetDensity
  }

  targetDensity(): number {
    return this._targetDensity
  }
  // compute densities
  calcDensities() {
    let p = this.positions()
    let d = this.densities()
    let m = this.particleMass()
    for (let i = 0; i < this.numberOfParticles(); i++) {
      let sum = this.sumOfKernelNearby(p[i])
        d[i] = m * sum
        // console.log(d[i])
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
