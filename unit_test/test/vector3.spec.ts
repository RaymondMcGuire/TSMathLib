import { expect } from 'chai'
import 'mocha'
import { Vector3 } from '../../src/math/vector3'

describe('Vector3', () => {

    describe('Norm', () => {
        it('normalize current vector3', () => {
            let v1 = new Vector3(3.0,2.0,6.0)
            v1.normalize()
            expect(v1.data()[0]).to.equal(3.0/7.0)
            expect(v1.data()[1]).to.equal(2.0 / 7.0)
            expect(v1.data()[2]).to.equal(6.0 / 7.0)
        })

        it('return a normalized vector3', () => {
            let v1 = new Vector3(3.0,2.0,6.0)
            let v2 = v1.normalized()
            expect(v1.data()[0]).to.equal(3.0)
            expect(v1.data()[1]).to.equal(2.0)
            expect(v1.data()[2]).to.equal(6.0)
            
            expect(v2.data()[0]).to.equal(3.0/7.0)
            expect(v2.data()[1]).to.equal(2.0 / 7.0)
            expect(v2.data()[2]).to.equal(6.0 / 7.0)
        })
    })
})
