import { expect } from 'chai'
import 'mocha'
import { ParticleSystem } from '../../src/physics'
import { Vector3 } from '../../src/math'


describe('Particle System', () => {

    describe('Constructor', () => {
        it('construct particle system', () => {
            let ps = new ParticleSystem()
            ps.particleSystemData().addParticles(new Array<Vector3>(new Vector3(0,5,0)),new Array<Vector3>(new Vector3(0,0,0)),new Array<Vector3>(new Vector3(0,0,0)))
            // console.log("pos:",ps.particleSystemData().positions())
            // console.log("vel:",ps.particleSystemData().velocities())
            // console.log("force:", ps.particleSystemData().forces())
            ps.advanceSingleFrame()
            // console.log("pos:",ps.particleSystemData().positions())
            // console.log("vel:",ps.particleSystemData().velocities())
            // console.log("force:", ps.particleSystemData().forces())
            expect(ps.particleSystemData().numberOfParticles()).to.equals(1)
        })
    })
})
