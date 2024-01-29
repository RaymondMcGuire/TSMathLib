import { expect } from 'chai'
import 'mocha'
import { Vector3 } from '../../src/math/vector3'
import { RigidBodyCollider, PhysicsPlane } from '../../src/physics'
import { Quaternion } from '../../src/math'

describe('Rigdi Body Collider', () => {

    describe('ResolveCollision', () => {
        it('No Penetration', () => {
            let plane = new PhysicsPlane()
            plane.setByPointWithNormal(new Vector3(0, 0, 0), new Vector3(0, 1, 0))
            let collider = new RigidBodyCollider(plane);
    
            let newPosition = new Vector3(1, 0.1, 0);
            let newVelocity = new Vector3(1, 0, 0);
            let radius = 0.05;
            let restitutionCoefficient = 0.5;
    
            let result = collider.resolveCollision(radius, restitutionCoefficient, newPosition, newVelocity);
            newPosition = result.pos
            newVelocity = result.vel
            expect(1.0).to.equals(newPosition.x());
            expect(0.1).to.equals(newPosition.y());
            expect(0.0).to.equals(newPosition.z());
            expect(1.0).to.equals(newVelocity.x());
            expect(0.0).to.equals(newVelocity.y());
            expect(0.0).to.equals(newVelocity.z());
        })

        it('Penetration Within Radius', () => {
            let plane = new PhysicsPlane()
            plane.setByPointWithNormal(new Vector3(0, 0, 0), new Vector3(0, 1, 0))
            let collider = new RigidBodyCollider(plane);
    
            let newPosition = new Vector3(1, 0.1, 0);
            let newVelocity = new Vector3(1, 0, 0);
            let radius = 0.2;
            let restitutionCoefficient = 0.5;
    
            let result = collider.resolveCollision(radius, restitutionCoefficient, newPosition, newVelocity);
            newPosition = result.pos
            newVelocity = result.vel
            expect(1.0).to.equals(newPosition.x());
            expect(0.2).to.equals(newPosition.y());
            expect(0.0).to.equals(newPosition.z());
        })

        it('Sitting', () => {
            let plane = new PhysicsPlane()
            plane.setByPointWithNormal(new Vector3(0, 0, 0), new Vector3(0, 1, 0))
            let collider = new RigidBodyCollider(plane);
    
            let newPosition = new Vector3(1, 0.1, 0);
            let newVelocity = new Vector3(1, 0, 0);
            let radius = 0.1;
            let restitutionCoefficient = 0.5;
    
            let result = collider.resolveCollision(radius, restitutionCoefficient, newPosition, newVelocity);
            newPosition = result.pos
            newVelocity = result.vel
            expect(1.0).to.equals(newPosition.x());
            expect(0.1).to.equals(newPosition.y());
            expect(0.0).to.equals(newPosition.z());
            expect(1.0).to.equals(newVelocity.x());
            expect(0.0).to.equals(newVelocity.y());
            expect(0.0).to.equals(newVelocity.z());
        })

        it('Bounce-back', () => {
            let plane = new PhysicsPlane()
            plane.setByPointWithNormal(new Vector3(0, 0, 0), new Vector3(0, 1, 0))
            let collider = new RigidBodyCollider(plane);
    
            let newPosition = new Vector3(1, -1, 0);
            let newVelocity = new Vector3(1, -1, 0);
            let radius = 0.1;
            let restitutionCoefficient = 0.5;
    
            let result = collider.resolveCollision(radius, restitutionCoefficient, newPosition, newVelocity);
            newPosition = result.pos
            newVelocity = result.vel
            expect(1.0).to.equals(newPosition.x());
            expect(0.1).to.equals(newPosition.y());
            expect(0.0).to.equals(newPosition.z());
            expect(1.0).to.equals(newVelocity.x());
            expect(restitutionCoefficient).to.equals(newVelocity.y());
            expect(0.0).to.equals(newVelocity.z());
        })

        it('Friction', () => {
            let plane = new PhysicsPlane()
            plane.setByPointWithNormal(new Vector3(0, 0, 0), new Vector3(0, 1, 0))
            let collider = new RigidBodyCollider(plane);
    
            let newPosition = new Vector3(1, -1, 0);
            let newVelocity = new Vector3(1, -1, 0);
            let radius = 0.1;
            let restitutionCoefficient = 0.5;
            
            collider.setFrictionCoefficient(0.1)
            let result = collider.resolveCollision(radius, restitutionCoefficient, newPosition, newVelocity);
            newPosition = result.pos
            newVelocity = result.vel

            expect(1.0).to.equals(newPosition.x());
            expect(0.1).to.equals(newPosition.y());
            expect(0.0).to.equals(newPosition.z());
            expect(1.0).to.above(newVelocity.x());
            expect(restitutionCoefficient).to.equals(newVelocity.y());
            expect(0.0).to.equals(newVelocity.z());
        })

        it('VelocityAt', () => {
            let plane = new PhysicsPlane()
            plane.setByPointWithNormal(new Vector3(0, 0, 0), new Vector3(0, 1, 0))
            let collider = new RigidBodyCollider(plane);
            collider.setAngularVelocity(new Vector3(0,0,4))
            collider.setLinearVelocity(new Vector3(1, 3, -2))
            collider.surface().transform().setTranslation(new Vector3(-1, -2, 2))

            let q = new Quaternion()
            q.setByAxisAngle(new Vector3(1,0,0),0.1)
            collider.surface().transform().setOrientation(q)
            
            let result = collider.velocityAt(new Vector3(5, 7, 8));
            expect(-35.0).to.equals(result.x());
            expect(27.0).to.equals(result.y());
            expect(-2.0).to.equals(result.z());

        })
    })
})
