/*
 * @Author: Xu.Wang
 * @Date: 2020-04-03 18:18:27
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-04-05 01:07:09
 */
import { ParticleSystemData } from './particle_system_data'
import { Vector3 } from '../math/vector3'
import { PHY_GRAVITY } from './physics_constants'
import { clamp } from '../math/math_utils'
import { ConstantVectorField } from '../math/vector_field'

export class ParticleSystem {
  _dragCoefficient: number = 1e-4
  _restitutionCoefficient: number = 0.0
  _gravity: Vector3 = new Vector3(0.0, PHY_GRAVITY, 0.0)

  _wind: ConstantVectorField

  _particleSystemData: ParticleSystemData
  _newPositions: Array<Vector3> = new Array<Vector3>()
  _newVelocities: Array<Vector3> = new Array<Vector3>()
  _newForces: Array<Vector3> = new Array<Vector3>()

  constructor() {
    this._particleSystemData = new ParticleSystemData(0)
    this._wind = new ConstantVectorField(new Vector3(0.0, 0.0, 0.0))
  }

  setParticleSystemData(newParticles: ParticleSystemData) {
    this._particleSystemData = newParticles
  }

  particleSystemData(): ParticleSystemData {
    return this._particleSystemData
  }
  dragCoefficient(): number {
    return this._dragCoefficient
  }

  setDragCoefficient(newDragCoefficient: number) {
    this._dragCoefficient = Math.max(newDragCoefficient, 0.0)
  }

  restitutionCoefficient(): number {
    return this._restitutionCoefficient
  }

  setRestitutionCoefficient(newRestitutionCoefficient: number) {
    this._restitutionCoefficient = clamp(newRestitutionCoefficient, 0.0, 1.0)
  }

  gravity(): Vector3 {
    return this._gravity
  }

  setGravity(newGravity: Vector3) {
    this._gravity = newGravity
  }

  accumulateExternalForces() {
    let n = this._particleSystemData.numberOfParticles()
    let forces = this._particleSystemData.forces()
    let velocities = this._particleSystemData.velocities()
    let positions = this._particleSystemData.positions()
    let mass = this._particleSystemData.mass()
    for (let idx = 0; idx < n; idx++) {
      let forceGravity = this._gravity.mul(mass)
      let forceWind = velocities[idx].sub(this._wind.sample(positions[idx]))
      let force = forceGravity.sub(forceWind.mul(this._dragCoefficient))
      forces[idx] = forces[idx].add(force)
    }
  }

  timeIntegration(timeStepInSeconds: number) {
    let n = this._particleSystemData.numberOfParticles()
    let forces = this._particleSystemData.forces()
    let velocities = this._particleSystemData.velocities()
    let positions = this._particleSystemData.positions()
    let mass = this._particleSystemData.mass()

    for (let i = 0; i < n; i++) {
      // Integrate velocity first
      let newVelocity = this._newVelocities[i]
      newVelocity = velocities[i].add(
        forces[i].mul(timeStepInSeconds).div(mass)
      )

      // Integrate position.
      let newPosition = this._newPositions[i]
      newPosition = positions[i].add(newVelocity.mul(timeStepInSeconds))
    }
  }
}
