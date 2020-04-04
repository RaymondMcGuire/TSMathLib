/*
 * @Author: Xu.Wang
 * @Date: 2020-03-31 15:12:02
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-04-05 01:06:38
 */

import { Vector3 } from '../math/vector3'
import { ParticleSystem } from '../physics/particle_system'
import { SphData } from './sph_data'
import { square, clamp } from '../math/math_utils'
import { SphKernelSpiky } from './sph_kernel'
import { computePressureFromEos } from '../physics/physics_utils'

export class SPH extends ParticleSystem {
  // ! Exponent component of equation-of-state (or Tait's equation).
  _eosExponent: number = 7.0

  // ! Negative pressure scaling factor.
  // ! Zero means clamping. One means do nothing.
  _negativePressureScale: number = 0.0

  // ! Viscosity coefficient.
  _viscosityCoefficient: number = 0.01

  // ! Pseudo-viscosity coefficient velocity filtering.
  // ! This is a minimum "safety-net" for SPH solver which is quite
  // ! sensitive to the parameters.
  _pseudoViscosityCoefficient: number = 0.0

  // ! Speed of sound in medium to determin the stiffness of the system.
  // ! Ideally, it should be the actual speed of sound in the fluid, but in
  // ! practice, use lower value to trace-off performance and compressibility.
  _speedOfSound: number = 100.0

  // ! Scales the max allowed time-step.
  _timeStepLimitScale: number = 1.0

  constructor(
    targetDensity: number,
    targetSpacing: number,
    relativeKernelRadius: number
  ) {
    super()
    let sphParticles = new SphData(0)
    this.setParticleSystemData(sphParticles)
    sphParticles.setTargetDensity(targetDensity)
    sphParticles.setTargetSpacing(targetSpacing)
    sphParticles.setRelativeKernelRadius(relativeKernelRadius)
    // setIsUsingFixedSubTimeSteps(false);
  }

  sphData(): SphData {
    return this.particleSystemData() as SphData
  }

  eosExponent(): number {
    return this._eosExponent
  }

  setEosExponent(newEosExponent: number) {
    this._eosExponent = Math.max(newEosExponent, 1.0)
  }

  negativePressureScale(): number {
    return this._negativePressureScale
  }

  setNegativePressureScale(newNegativePressureScale: number) {
    this._negativePressureScale = clamp(newNegativePressureScale, 0.0, 1.0)
  }

  viscosityCoefficient(): number {
    return this._viscosityCoefficient
  }

  setViscosityCoefficient(newViscosityCoefficient: number) {
    this._viscosityCoefficient = Math.max(newViscosityCoefficient, 0.0)
  }

  pseudoViscosityCoefficient(): number {
    return this._pseudoViscosityCoefficient
  }

  setPseudoViscosityCoefficient(newPseudoViscosityCoefficient: number) {
    this._pseudoViscosityCoefficient = Math.max(
      newPseudoViscosityCoefficient,
      0.0
    )
  }

  speedOfSound(): number {
    return this._speedOfSound
  }

  setSpeedOfSound(newSpeedOfSound: number) {
    this._speedOfSound = Math.max(newSpeedOfSound, Number.EPSILON)
  }

  accumulateViscosityForce() {
    let particles = this.sphData()
    let numberOfParticles = particles.numberOfParticles()
    let x = particles.positions()
    let v = particles.velocities()
    let d = particles.densities()
    let f = particles.forces()

    let massSquared: number = square(particles.mass())
    let kernel: SphKernelSpiky = new SphKernelSpiky(particles.kernelRadius())

    for (let i = 0; i < numberOfParticles; i++) {
      let neighbors: Array<number> = particles.neighborLists()[i]
      for (const j in neighbors) {
        let dist = x[i].distanceTo(x[j])
        f[i] = f[i].add(
          v[j]
            .sub(v[i])
            .div(d[j])
            .mul(
              kernel.getSecondDerivative(dist) *
                massSquared *
                this.viscosityCoefficient()
            )
        )
      }
    }
  }

  computePressure() {
    let particles = this.sphData()
    let numberOfParticles = particles.numberOfParticles()
    let d = particles.densities()
    let p = particles.pressures()

    // See Murnaghan-Tait equation of state from
    // https://en.wikipedia.org/wiki/Tait_equation
    let targetDensity = particles.targetDensity()
    let eosScale = targetDensity * square(this._speedOfSound)

    for (let i = 0; i < numberOfParticles; i++) {
      p[i] = computePressureFromEos(
        d[i],
        targetDensity,
        eosScale,
        this.eosExponent(),
        this.negativePressureScale()
      )
    }
  }
  accumulatePressureForce(
    positions: Array<Vector3>,
    densities: Array<number>,
    pressures: Array<number>,
    pressureForces: Array<Vector3>
  ) {
    let particles = this.sphData()
    let numberOfParticles = particles.numberOfParticles()

    let massSquared = square(particles.mass())
    let kernel = new SphKernelSpiky(particles.kernelRadius())

    for (let i = 0; i < numberOfParticles; i++) {
      let neighbors: Array<number> = particles.neighborLists()[i]
      for (const j in neighbors) {
        let dist = positions[i].distanceTo(positions[j])

        if (dist > 0.0) {
          let dir = positions[j].sub(positions[i]).div(dist)
          pressureForces[i] = pressureForces[i].sub(
            kernel
              .getGradientByDistance(dist, dir)
              .mul(
                massSquared *
                  (pressures[i] / (densities[i] * densities[i]) +
                    pressures[j] / (densities[j] * densities[j]))
              )
          )
        }
      }
    }
  }
}
