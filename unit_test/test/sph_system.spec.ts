import { expect } from 'chai'
import 'mocha'
import { SPH } from '../../src/sph'
import { PhysicsBox, RigidBodyCollider, BoundingBox } from '../../src/physics'
import { Vector3 } from '../../src/math'
import { VolumeGenerator } from '../../src/generator'



describe('SPH System', () => {

    describe('Constructor', () => {
        it('construct sph system', () => {
            let _sphSys = new SPH()
            _sphSys.sphData().setTargetSpacing(0.25)
        
            let phyBox = new PhysicsBox(
              new Vector3(0, 0, 0),
              new Vector3(1, 1, 1)
            )
        
            phyBox.setIsNormalFlipped(true)
            let collider = new RigidBodyCollider(phyBox)
        
            let volumeBbox = new BoundingBox(
              new Vector3(0, 0, 0),
              new Vector3(1, 1, 1)
            )
            let volumeGenerator = new VolumeGenerator(
              volumeBbox,
              0.25
            )
            let _particles = volumeGenerator.points()
            
            _sphSys.setCollider(collider)

            let p = new Array<Vector3>(_particles.length)
            let v = new Array<Vector3>(_particles.length)
            let f = new Array<Vector3>(_particles.length)
            for (let idx = 0; idx < _particles.length; idx++) {
              p[idx] = _particles[idx].toVector3()
              v[idx] = new Vector3()
              f[idx] = new Vector3()
            }
            _sphSys.sphData().addParticles(p, v, f)
            console.log('num:', _sphSys.sphData().numberOfParticles())

            // for (let i = 0; i < 50; i++) {
            //     _sphSys.advanceSingleFrame()
            // }
            
            expect(1).to.equals(1)
        })
    })
})
