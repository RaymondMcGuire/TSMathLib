/*
 * @Author: Xu.Wang
 * @Date: 2020-03-31 15:12:02
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-04-16 18:39:31
 */
import { ParticleSystem } from '../physics/particle_system'
import { SphData } from './sph_data'
import { square } from '../math/math_utils'
import { SphKernelSpiky } from './sph_kernel'
import { PHY_WATER_DENSITY } from '../physics'
import { LOG } from '../log/log'
import { Vector3 } from 'tsmathlib/src/math'

export class SPH extends ParticleSystem {
  _viscosityCoefficient: number = 0.002
  _gasCof: number = 5.0

  constructor(
      mass: number = 0.04,
      pInKernel :number = 20,
    targetDensity: number = PHY_WATER_DENSITY
  ) {
    super(0.0, mass)
    let sphParticles = new SphData(mass,pInKernel, targetDensity)
    this.setParticleSystemData(sphParticles)
  }

  debug() {
    LOG.LOGGER('SPH Debug Mode')
  }

  sphData(): SphData {
    return this.particleSystemData() as SphData
  }

  viscosityCoefficient(): number {
    return this._viscosityCoefficient
  }

  setViscosityCoefficient(newViscosityCoefficient: number) {
    this._viscosityCoefficient = Math.max(newViscosityCoefficient, 0.0)
  }

  calcForces() {
    this.calcExternalForces()
    this.calcPressureForce()
    this.calcViscosityForce()
  }

    calcPressureForce() {     
        this.computePressure()

    let particles = this.sphData()
    let p = particles.positions()
    let d = particles.densities()
    let pr = particles.pressures()
    let f = particles.forces()
    let numberOfParticles = particles.numberOfParticles()


    let massSquared = square(particles.particleMass())
    let kernel = new SphKernelSpiky(particles.kernelRadius())

        for (let i = 0; i < numberOfParticles; i++) {

            let neighbors: Array<number> = particles.neighborLists()[i]
         // waste my 8hours
            for (let idx = 0; idx < neighbors.length; idx++) {
                let j = neighbors[idx]
            let dist = p[i].distanceTo(p[j])
            if (dist > 0.0) {
                let dir = (p[j].sub(p[i])).div(dist)
                let tmpFCoef =  (pr[i] / (d[i] * d[i]) + pr[j] / (d[j] * d[j]))*massSquared
                let tmpF = kernel.getGradientByDistance(dist, dir).mul(tmpFCoef)
                f[i] = f[i].sub(tmpF)

            }
        }
        
        // console.log(f[i].x(),f[i].y(),f[i].z())
    }
        
  }

  calcViscosityForce() {
    let particles = this.sphData()
    let numberOfParticles = particles.numberOfParticles()
    let x = particles.positions()
    let v = particles.velocities()
    let d = particles.densities()
    let f = particles.forces()

    let massSquared: number = square(particles.particleMass())
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
    
    update() {
        
        let particles = this.sphData();

    // clear forces
        let forces = particles.forces()
        for (let idx = 0; idx < particles.numberOfParticles(); idx++) {
            forces[idx] = new Vector3()
        }

    // update collider

    this.allocateBuffers();

    // build neighbor searcher
    particles.buildSphNeighborSearcher()
    particles.buildSphNeighborLists()

    // update density
    particles.calcDensities();

    this.calcForces();

    // time
    this.timeIntegration(0.005);

    this.resolveCollision();

    this.updateParticlesData();
    }
    
  computePressure() {
    let particles = this.sphData()
    let targetDensity = particles.targetDensity()
    let numberOfParticles = particles.numberOfParticles()
    let d = particles.densities()
    let p = particles.pressures()

    for (let i = 0; i < numberOfParticles; i++) {
        p[i] = (d[i] - targetDensity) * this._gasCof
        // console.log(p[i])
    }

    // not good for real-time SPH
    // See Murnaghan-Tait equation of state from
    // https://en.wikipedia.org/wiki/Tait_equation
    // let targetDensity = particles.targetDensity()
    // let eosScale = targetDensity * square(this._speedOfSound)

    // for (let i = 0; i < numberOfParticles; i++) {
    //   // LOG.LOGGER('computePressure, d[i]=' + d[i] + ', target=' + targetDensity)
    //   p[i] = computePressureFromEos(
    //     d[i],
    //     targetDensity,
    //     eosScale,
    //     this.eosExponent(),
    //     this.negativePressureScale()
    //   )
    // }
    // LOG.LOGGER('after computePressure, p[50]=' + p[50])
  }
}
