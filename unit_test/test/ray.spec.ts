import { expect } from 'chai'
import 'mocha'
import { Ray } from '../../src/physics/ray'
import { Vector3 } from '../../src/math/vector3'

describe('Ray', () => {

    describe('Constructor', () => {
        it('construct ray', () => {
            let r = new Ray(new Vector3(1.0, 2.0, 3.0), new Vector3(4.0, 5.0, 6.0))
            
            let o = new Vector3(1.0,2.0,3.0)
            let n = new Vector3(4.0,5.0,6.0).normalized()
            expect(r.origin.x).to.equal(o.x)
            expect(r.origin.y).to.equal(o.y)
            expect(r.origin.z).to.equal(o.z)
            expect(r.direction.x).to.equal(n.x)
            expect(r.direction.y).to.equal(n.y)
            expect(r.direction.z).to.equal(n.z)
        })
    })

    describe('Method', () => {
        it('point at t', () => {
            let r = new Ray(new Vector3(1.0,2.0,3.0),new Vector3(3.0,2.0,6.0))
            expect(r.pointAt(7.0).data()[0]).to.equal(4.0)
            expect(r.pointAt(7.0).data()[1]).to.equal(4.0)
            expect(r.pointAt(7.0).data()[2]).to.equal(9.0)
        })
    })
})
