import { expect } from 'chai'
import 'mocha'
import { Vector3 } from '../../src/math/vector3'
import { isSimilar } from '../../src/math'

describe('Vector3', () => {

    describe('Operation', () => {
    
        let v1 = new Vector3(3.0, 9.0, 4.0)

        it('add operator', () => {
            let n = 4.0
            v1 = v1.add(n)
            expect(v1.x()).to.equal(7.0)
            expect(v1.y()).to.equal(13.0)
            expect(v1.z()).to.equal(8.0)

            let v2 = new Vector3(-2.0, 1.0, 5.0)
            v1 = v1.add(v2)
            expect(v1.x()).to.equal(5.0)
            expect(v1.y()).to.equal(14.0)
            expect(v1.z()).to.equal(13.0)
        })

        it('sub operator', () => {
            let n = 8.0
            v1 = v1.sub(n)
            expect(v1.x()).to.equal(-3.0)
            expect(v1.y()).to.equal(6.0)
            expect(v1.z()).to.equal(5.0)

            let v3 = new Vector3(-5.0, 3.0, 12.0)
            v1 = v1.sub(v3)
            expect(v1.x()).to.equal(2.0)
            expect(v1.y()).to.equal(3.0)
            expect(v1.z()).to.equal(-7.0)
        })

        it('mul operator', () => {
            let n = 2.0
            v1 = v1.mul(n)
            expect(v1.x()).to.equal(4.0)
            expect(v1.y()).to.equal(6.0)
            expect(v1.z()).to.equal(-14.0)

            let v3 = new Vector3(3.0, -2.0, 0.5)
            v1 = v1.mul(v3)
            expect(v1.x()).to.equal(12.0)
            expect(v1.y()).to.equal(-12.0)
            expect(v1.z()).to.equal(-7.0)
        })

        
        it('div operator', () => {
            let n = 4.0
            v1 = v1.div(n)
            expect(v1.x()).to.equal(3.0)
            expect(v1.y()).to.equal(-3.0)
            expect(v1.z()).to.equal(-1.75)

            let v3 = new Vector3(3.0, -1.0, 0.25)
            v1 = v1.div(v3)
            expect(v1.x()).to.equal(1.0)
            expect(v1.y()).to.equal(3.0)
            expect(v1.z()).to.equal(-7.0)
        })

        it('dot operator', () => {

            let v2 = new Vector3(4.0, 2.0, 1.0)
            let d = v1.dot(v2)
            expect(d).to.equal(3.0)
        })

        it('cross operator', () => {

            let v2 = new Vector3(5.0, -7.0, 2.0)
            let v3 = v1.cross(v2)      
            expect(v3.x()).to.equal(-43.0)
            expect(v3.y()).to.equal(-37.0)
            expect(v3.z()).to.equal(-22.0)
        })
    })

    describe('Inverse Operation', () => {
        
        it('rsub operation', () => {
            let v1 = new Vector3(5.0,14.0,13.0)
            let n = 8.0
            v1 = v1.rsub(n)
            expect(v1.x()).to.equal(3.0)
            expect(v1.y()).to.equal(-6.0)
            expect(v1.z()).to.equal(-5.0)

            let v2 = new Vector3(-5.0, 3.0, -1.0)
            v1 = v1.rsub(v2)
            expect(v1.x()).to.equal(-8.0)
            expect(v1.y()).to.equal(9.0)
            expect(v1.z()).to.equal(4.0)
        })

        it('rdiv operation', () => {
            let v1 = new Vector3(-12.0,-9.0,8.0)
            let n = 36.0
            v1 = v1.rdiv(n)
            expect(v1.x()).to.equal(-3.0)
            expect(v1.y()).to.equal(-4.0)
            expect(v1.z()).to.equal(4.5)

            let v2 = new Vector3(3.0, -16.0, 18.0)
            v1 = v1.rdiv(v2)
            expect(v1.x()).to.equal(-1.0)
            expect(v1.y()).to.equal(4.0)
            expect(v1.z()).to.equal(4.0)
        })
    })

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

    describe('Geometric Method', () => {
        it('tangential', () => {
            let normal = new Vector3(1.0, 1.0, 1.0).normalized();
            let tangential = normal.tangential();
            
            expect(isSimilar(tangential[0].dot(normal), 0.0, 1e-9)).to.true
            expect(isSimilar(tangential[1].dot(normal), 0.0, 1e-9)).to.true
        })
    })
})
