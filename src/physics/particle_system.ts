/*
 * @Author: Xu.Wang
 * @Date: 2020-04-03 18:18:27
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-04-08 23:20:01
 */
import { ParticleSystemData } from './particle_system_data'
import { Vector3 } from '../math/vector3'
import { PHY_GRAVITY } from './physics_constants'
import { clamp } from '../math/math_utils'
import { ConstantVectorField } from '../math/vector_field'
import { PhysicsAnimation } from './physics_animation'

export class ParticleSystem extends PhysicsAnimation {
  _dragCoefficient: number = 1e-4
  _restitutionCoefficient: number = 0.0
  _gravity: Vector3 = new Vector3(0.0, PHY_GRAVITY, 0.0)

  _wind: ConstantVectorField

  _particleSystemData: ParticleSystemData
  _newPositions: Array<Vector3> = new Array<Vector3>()
  _newVelocities: Array<Vector3> = new Array<Vector3>()
  _newForces: Array<Vector3> = new Array<Vector3>()

  constructor(
    radius: number = 1e-3,
    mass: number = 1e-3,
    size: number = 0,
    isUsingSubTimeSteps: boolean = false,
    isUsingFixedSubTimeSteps: boolean = false,
    numberOfFixedSubTimeSteps: number = 1
  ) {
    super(
      isUsingSubTimeSteps,
      isUsingFixedSubTimeSteps,
      numberOfFixedSubTimeSteps
    )
    this._particleSystemData = new ParticleSystemData(radius, mass, size)
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
      this._newVelocities[i] = velocities[i].add(
        forces[i].mul(timeStepInSeconds).div(mass)
      )

      // Integrate position.
      this._newPositions[i] = positions[i].add(
        this._newVelocities[i].mul(timeStepInSeconds)
      )
    }
  }

  accumulateForces(_: number) {
    // Add external forces
    this.accumulateExternalForces()
  }

  // Implement Abstract Method
  onInitialize() {
    // When initializing the solver, update the collider and emitter state as
    // well since they also affects the initial condition of the simulation.
    // updateCollider(0.0);
    // updateEmitter(0.0);
  }

  onAdvanceTimeStep(timeStepInSeconds: number) {
    this.beginAdvanceTimeStep(timeStepInSeconds)

    this.accumulateForces(timeStepInSeconds)

    this.timeIntegration(timeStepInSeconds)

    // resolveCollision();

    this.endAdvanceTimeStep(timeStepInSeconds)
  }

  beginAdvanceTimeStep(timeStepInSeconds: number) {
    // Clear forces
    let forces = this._particleSystemData.forces()
    forces.fill(new Vector3())

    // Update collider and emitter
    // updateCollider(timeStepInSeconds);
    // updateEmitter(timeStepInSeconds);

    // Allocate buffers
    let n = this._particleSystemData.numberOfParticles()
    this._newPositions = new Array<Vector3>(n)
    this._newVelocities = new Array<Vector3>(n)
    this._newForces = new Array<Vector3>(n)

    this.onBeginAdvanceTimeStep(timeStepInSeconds)
  }

  endAdvanceTimeStep(timeStepInSeconds: number) {
    // Update data
    let n = this._particleSystemData.numberOfParticles()
    let positions = this._particleSystemData.positions()
    let velocities = this._particleSystemData.velocities()

    for (let index = 0; index < n; index++) {
      positions[index] = this._newPositions[index]
      velocities[index] = this._newVelocities[index]
    }

    this.onEndAdvanceTimeStep(timeStepInSeconds)
  }

  // Overridable Method
  onBeginAdvanceTimeStep(_: number) {
    // console.log('onBeginAdvanceTimeStep:', timeStepInSeconds)
  }

  onEndAdvanceTimeStep(_: number) {
    // console.log('onEndAdvanceTimeStep:', timeStepInSeconds)
  }
}
