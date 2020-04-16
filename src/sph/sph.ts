/*
 * @Author: Xu.Wang
 * @Date: 2020-03-31 15:12:02
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-04-16 18:39:31
 */
import { ParticleSystem } from '../physics/particle_system'
import { SphData } from './sph_data'
import { square, clamp } from '../math/math_utils'
import { SphKernelSpiky } from './sph_kernel'
import { computePressureFromEos } from '../physics/physics_utils'
import { PHY_WATER_DENSITY } from '../physics'
import { LOG } from '../log/log'

export class SPH extends ParticleSystem {
  kTimeStepLimitBySpeedFactor: number = 0.4
  kTimeStepLimitByForceFactor: number = 0.25

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
    radius: number = 1e-3,
    mass: number = 1e-3,
    targetDensity: number = PHY_WATER_DENSITY,
    targetSpacing: number = 0.1,
    relativeKernelRadius: number = 1.8,
    isUsingSubTimeSteps: boolean = false,
    isUsingFixedSubTimeSteps: boolean = false,
    numberOfFixedSubTimeSteps: number = 1
  ) {
    super(
      radius,
      mass,
      isUsingSubTimeSteps,
      isUsingFixedSubTimeSteps,
      numberOfFixedSubTimeSteps
    )
    let sphParticles = new SphData(radius, mass, targetDensity, targetSpacing)
    this.setParticleSystemData(sphParticles)
    sphParticles.setTargetDensity(targetDensity)
    sphParticles.setTargetSpacing(targetSpacing)
    sphParticles.setRelativeKernelRadius(relativeKernelRadius)
    // setIsUsingFixedSubTimeSteps(false);
  }

  debug() {
    LOG.LOGGER('SPH Debug Mode')
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

  accumulateForces(timeStepInSeconds: number) {
    super.accumulateForces(timeStepInSeconds)
    this.accumulateNonPressureForces(timeStepInSeconds)
    this.accumulatePressureForce(timeStepInSeconds)
  }

  onBeginAdvanceTimeStep(_: number) {
    let particles = this.sphData()

    particles.buildSphNeighborSearcher()
    particles.buildSphNeighborLists()
    particles.updateDensities()
  }

  onEndAdvanceTimeStep(_: number) {
    // computePseudoViscosity(timeStepInSeconds);

    let particles = this.sphData()
    let numberOfParticles = particles.numberOfParticles()
    let densities = particles.densities()

    let maxDensity = 0.0
    for (let i = 0; i < numberOfParticles; ++i) {
      maxDensity = Math.max(maxDensity, densities[i])
    }
  }

  accumulateNonPressureForces(_: number) {
    this.accumulateViscosityForce()
  }

  accumulatePressureForce(_: number) {
    let particles = this.sphData()
    let x = particles.positions()
    let d = particles.densities()
    let p = particles.pressures()
    let f = particles.forces()
    let numberOfParticles = particles.numberOfParticles()

    this.computePressure()

    let massSquared = square(particles.particleMass())
    let kernel = new SphKernelSpiky(particles.kernelRadius())

    for (let i = 0; i < numberOfParticles; i++) {
      let neighbors: Array<number> = particles.neighborLists()[i]
      for (const j in neighbors) {
        let dist = x[i].distanceTo(x[j])

        if (dist > 0.0) {
          let dir = x[j].sub(x[i]).div(dist)
          f[i] = f[i].sub(
            kernel
              .getGradientByDistance(dist, dir)
              .mul(massSquared * (p[i] / (d[i] * d[i]) + p[j] / (d[j] * d[j])))
          )
        }
      }
    }
  }

  accumulateViscosityForce() {
    let particles = this.sphData()
    let numberOfParticles = particles.numberOfParticles()
    let x = particles.positions()
    let v = particles.velocities()
    let d = particles.densities()
    let f = particles.forces()

    // LOG.LOGGER('before accumulateViscosityForce, f[50]=' + f[50].debug())

    let massSquared: number = square(particles.particleMass())
    let kernel: SphKernelSpiky = new SphKernelSpiky(particles.kernelRadius())

    for (let i = 0; i < numberOfParticles; i++) {
      let neighbors: Array<number> = particles.neighborLists()[i]
      //   LOG.LOGGER(
      //     'neighbors size, particle_' +
      //       i +
      //       ': neightbors_size=' +
      //       neighbors.length
      //   )
      for (const j in neighbors) {
        let dist = x[i].distanceTo(x[j])
        // LOG.LOGGER('accumulateViscosityForce, dist=' + dist)
        // LOG.LOGGER('accumulateViscosityForce, v=' + v[j].debug())
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

    // LOG.LOGGER('after accumulateViscosityForce, f[50]=' + f[50].debug())
  }

  numberOfSubTimeSteps(timeIntervalInSeconds: number): number {
    let particles = this.sphData()
    let numberOfParticles = particles.numberOfParticles()
    let f = particles.forces()

    let kernelRadius = particles.kernelRadius()
    let mass = particles.particleMass()

    let maxForceMagnitude = 0.0

    for (let i = 0; i < numberOfParticles; ++i) {
      maxForceMagnitude = Math.max(maxForceMagnitude, f[i].length())
    }

    let timeStepLimitBySpeed =
      (this.kTimeStepLimitBySpeedFactor * kernelRadius) / this._speedOfSound
    let timeStepLimitByForce =
      this.kTimeStepLimitByForceFactor *
      Math.sqrt((kernelRadius * mass) / maxForceMagnitude)

    let desiredTimeStep =
      this._timeStepLimitScale *
      Math.min(timeStepLimitBySpeed, timeStepLimitByForce)

    return Math.ceil(timeIntervalInSeconds / desiredTimeStep)
  }

  computePressure() {
    let particles = this.sphData()
    let numberOfParticles = particles.numberOfParticles()
    let d = particles.densities()
    let p = particles.pressures()
    // LOG.LOGGER('before computePressure, p[50]=' + p[50])
    // See Murnaghan-Tait equation of state from
    // https://en.wikipedia.org/wiki/Tait_equation
    let targetDensity = particles.targetDensity()
    let eosScale = targetDensity * square(this._speedOfSound)

    for (let i = 0; i < numberOfParticles; i++) {
      // LOG.LOGGER('computePressure, d[i]=' + d[i] + ', target=' + targetDensity)
      p[i] = computePressureFromEos(
        d[i],
        targetDensity,
        eosScale,
        this.eosExponent(),
        this.negativePressureScale()
      )
    }
    // LOG.LOGGER('after computePressure, p[50]=' + p[50])
  }
}
