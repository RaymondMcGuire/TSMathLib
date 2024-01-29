/*
 * @Author: Xu.Wang
 * @Date: 2020-04-07 13:57:44
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-04-07 14:40:40
 */
import { Surface } from './surface'
import { Vector3 } from '../math'

export class ColliderQueryResult {
  distance: number
  point: Vector3
  normal: Vector3
  velocity: Vector3

  constructor(
    _distance: number,
    _point: Vector3,
    _normal: Vector3,
    _velocity: Vector3
  ) {
    this.distance = _distance
    this.point = _point
    this.normal = _normal
    this.velocity = _velocity
  }
}

export abstract class Collider {
  private _surface: Surface
  private _frictionCoeffient: number
  constructor(surface: Surface) {
    this._frictionCoeffient = 0.0
    this._surface = surface
  }

  abstract velocityAt(point: Vector3): Vector3

  surface(): Surface {
    return this._surface
  }

  setSurface(surface: Surface) {
    this._surface = surface
  }

  getClosestPoint(surface: Surface, queryPoint: Vector3): ColliderQueryResult {
    return new ColliderQueryResult(
      surface.closestDistance(queryPoint),
      surface.closestPoint(queryPoint),
      surface.closestNormal(queryPoint),
      this.velocityAt(queryPoint)
    )
  }

  isPenetrating(
    colliderPoint: ColliderQueryResult,
    position: Vector3,
    radius: number
  ) {
    // If the new candidate position of the particle is inside
    // the volume defined by the surface OR the new distance to the surface is
    // less than the particle's radius, this particle is in colliding state.
    return this._surface.isInside(position) || colliderPoint.distance < radius
  }

  resolveCollision(
    radius: number,
    restitutionCoefficient: number,
    position: Vector3,
    velocity: Vector3
  ) {
    if (!this._surface.isValidGeometry()) {
      return { pos: new Vector3(), vel: new Vector3() }
    }

    let colliderPoint = this.getClosestPoint(this._surface, position)
      let pos = position.clone()
      let vel =velocity.clone()
    // console.log(
    //   'isPenetrating:',
    //   this.isPenetrating(colliderPoint, position, radius)
    // )

    // console.log('_frictionCoeffient:', this._frictionCoeffient)
    // Check if the new position is penetrating the surface
    if (this.isPenetrating(colliderPoint, position, radius)) {
      // Target point is the closest non-penetrating position from the
      // new position.
      let targetNormal = colliderPoint.normal
      let targetPoint = colliderPoint.point.add(targetNormal.mul(radius))
      let colliderVelAtTargetPoint = colliderPoint.velocity

      // Get new candidate relative velocity from the target point.
      let relativeVel = velocity.sub(colliderVelAtTargetPoint)
      let normalDotRelativeVel = targetNormal.dot(relativeVel)
      let relativeVelN = targetNormal.mul(normalDotRelativeVel)
      let relativeVelT = relativeVel.sub(relativeVelN)

      // Check if the velocity is facing opposite direction of the surface
      // normal
      if (normalDotRelativeVel < 0.0) {
        // Apply restitution coefficient to the surface normal component of
        // the velocity
        let deltaRelativeVelN = relativeVelN.mul(-restitutionCoefficient - 1.0)
        relativeVelN = relativeVelN.mul(-restitutionCoefficient)

        // Apply friction to the tangential component of the velocity
        // From Bridson et al., Robust Treatment of Collisions, Contact and
        // Friction for Cloth Animation, 2002
        // http://graphics.stanford.edu/papers/cloth-sig02/cloth.pdf
        if (relativeVelT.lengthSquared() > 0.0) {
          let frictionScale = Math.max(
            1.0 -
              (this._frictionCoeffient * deltaRelativeVelN.length()) /
                relativeVelT.length(),
            0.0
          )
          relativeVelT = relativeVelT.mul(frictionScale)
        }

        // Reassemble the components
        vel = relativeVelN.add(relativeVelT).add(colliderVelAtTargetPoint)
      }

      // Geometric fix
      pos = targetPoint
    }

    return { pos: pos, vel: vel }
  }

  frictionCoefficient(): number {
    return this._frictionCoeffient
  }

  setFrictionCoefficient(newFrictionCoeffient: number) {
    this._frictionCoeffient = Math.max(newFrictionCoeffient, 0.0)
  }

  update(_: number) {
    // call func
  }
}
