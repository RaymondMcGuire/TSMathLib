import { expect } from 'chai'
import 'mocha'
import { PhysicsAnimationTest } from '../../src/physics/physics_animation'


describe('Physics Animation', () => {

    describe('Test Physics Animation', () => {
        let pat = new PhysicsAnimationTest()
        it('construct physics animation', () => {
            
            expect(pat.isUsingSubTimeSteps()).to.equals(false)
            expect(pat.isUsingFixedSubTimeSteps()).to.equals(false)
            expect(pat.numberOfFixedSubTimeSteps()).to.equals(1)

            expect(pat.currentFrame().index()).to.equals(-1)
            expect(pat.currentTimeInSeconds()).to.equals(0)
        })

        it('advance frame', () => {
            pat.advanceSingleFrame()
            expect(pat.currentFrame().index()).to.equals(0)
            expect(pat.currentTimeInSeconds()).to.equals(0.0)

            pat.advanceSingleFrame()
            expect(pat.currentFrame().index()).to.equals(1)
            expect(pat.currentTimeInSeconds()).to.equals(1.0 / 60.0)
        })
    })
})
