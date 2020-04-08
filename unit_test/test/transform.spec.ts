import { expect } from 'chai'
import 'mocha'
import { Transform } from '../../src/physics/transform'
import { Vector3, Quaternion, TS_QUARTER_PI, isSimilar, TS_EPSILON, TS_HALF_PI, TS_HALF_EPSILON } from '../../src/math'
import { BoundingBox } from '../../src/physics'

describe('Transform', () => {

    describe('Constructor', () => {
        it('construct transform', () => {
            let q = new Quaternion()
            q.setByAxisAngle(new Vector3(0.0,1.0,0.0),TS_QUARTER_PI)
            let t = new Transform(new Vector3(2.0, -5.0, 1.0),q)
            
            expect(t.translation().data()).to.deep.equals([2.0, -5.0, 1.0])
            expect(t.orientation().axis().data()).to.deep.equals([0.0, 1.0, 0.0])
            expect(isSimilar(t.orientation().angle(),TS_QUARTER_PI,TS_EPSILON)).to.true
        })
    })

    describe('Method', () => {

        let q = new Quaternion()
        q.setByAxisAngle(new Vector3(0.0, 1.0, 0.0), TS_HALF_PI)
        let t = new Transform(new Vector3(2.0, -5.0, 1.0), q)

        it('toWorldByPoint & toLocalByPoint', () => {
            let r1 = t.toWorldByPoint(new Vector3(4.0, 1.0, -3.0))
            expect(isSimilar(r1.x(),-1.0,TS_HALF_EPSILON)).to.true
            expect(isSimilar(r1.y(), -4.0, TS_HALF_EPSILON)).to.true
            expect(isSimilar(r1.z(), -3.0, TS_HALF_EPSILON)).to.true    
            
            let r2 = t.toLocalByPoint(r1)
            expect(isSimilar(r2.x(),4.0,TS_HALF_EPSILON)).to.true
            expect(isSimilar(r2.y(), 1.0, TS_HALF_EPSILON)).to.true
            expect(isSimilar(r2.z(), -3.0, TS_HALF_EPSILON)).to.true    
        })

        it('toWorldDirection & toLocalDirection', () => {

            let r3 = t.toWorldDirection(new Vector3(4.0, 1.0, -3.0));
            expect(isSimilar(r3.x(),-3.0,TS_HALF_EPSILON)).to.true
            expect(isSimilar(r3.y(), 1.0, TS_HALF_EPSILON)).to.true
            expect(isSimilar(r3.z(), -4.0, TS_HALF_EPSILON)).to.true    
            
            let r4 = t.toLocalDirection(r3)
            expect(isSimilar(r4.x(),4.0,TS_HALF_EPSILON)).to.true
            expect(isSimilar(r4.y(), 1.0, TS_HALF_EPSILON)).to.true
            expect(isSimilar(r4.z(), -3.0, TS_HALF_EPSILON)).to.true    
        })

        it('toWorldByBbox & toLocalByBbox', () => {

            let bbox = new BoundingBox(new Vector3(-2,-1,-3),new Vector3(2,1,3))
            let r5 = t.toWorldByBbox(bbox);
            expect(isSimilar(r5._lower.x(),-1.0,TS_HALF_EPSILON)).to.true
            expect(isSimilar(r5._lower.y(),-6.0,TS_HALF_EPSILON)).to.true
            expect(isSimilar(r5._lower.z(), -1.0, TS_HALF_EPSILON)).to.true
            
            expect(isSimilar(r5._upper.x(),5.0,TS_HALF_EPSILON)).to.true
            expect(isSimilar(r5._upper.y(),-4.0,TS_HALF_EPSILON)).to.true
            expect(isSimilar(r5._upper.z(),3.0,TS_HALF_EPSILON)).to.true
            
            let r6 = t.toLocalByBbox(r5)
            expect(isSimilar(r6._lower.x(),-2.0,TS_HALF_EPSILON)).to.true
            expect(isSimilar(r6._lower.y(),-1.0,TS_HALF_EPSILON)).to.true
            expect(isSimilar(r6._lower.z(), -3.0, TS_HALF_EPSILON)).to.true
            
            expect(isSimilar(r6._upper.x(),2.0,TS_HALF_EPSILON)).to.true
            expect(isSimilar(r6._upper.y(),1.0,TS_HALF_EPSILON)).to.true
            expect(isSimilar(r6._upper.z(),3.0,TS_HALF_EPSILON)).to.true  
        })
        
    
    })
})
