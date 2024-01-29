/*
 * @Author: Xu.Wang
 * @Date: 2020-04-07 18:39:02
 * @Last Modified by:   Xu.Wang
 * @Last Modified time: 2020-04-07 18:39:02
 */
import { Collider } from './collider'
import { Vector3 } from '../math'
import { Surface } from './surface'

export class RigidBodyCollider extends Collider {
  // ! Linear velocity of the rigid body.
  private _linearVelocity: Vector3

  // ! Angular velocity of the rigid body.
  private _angularVelocity: Vector3

  constructor(
    surface: Surface,
    linearVelocity: Vector3 = new Vector3(),
    angularVelocity: Vector3 = new Vector3()
  ) {
    super(surface)
    this._linearVelocity = linearVelocity
    this._angularVelocity = angularVelocity
  }

  linearVelocity() {
    return this._linearVelocity
  }
  angularVelocity() {
    return this._angularVelocity
  }

  setLinearVelocity(v: Vector3) {
    this._linearVelocity = v
  }

  setAngularVelocity(v: Vector3) {
    this._angularVelocity = v
  }

  velocityAt(point: Vector3): Vector3 {
    let r = point.sub(this.surface().transform().translation())
    return this._linearVelocity.add(this._angularVelocity.cross(r))
  }
}
