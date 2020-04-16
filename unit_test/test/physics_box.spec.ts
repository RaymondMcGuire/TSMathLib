import { expect } from 'chai'
import 'mocha'
import { Vector3 } from '../../src/math/vector3'
import { PhysicsBox } from '../../src/physics/physics_box'
import { Ray } from '../../src/physics'
import { TS_EPSILON, isSimilar } from '../../src/math'

describe('PhysicsBox', () => {

    describe('Constructor', () => {
        it('Construct Physics Box', () => {
            let box = new PhysicsBox(new Vector3(-1, 2, 1), new Vector3(5, 3, 4));

            expect(box.isNormalFlipped()).to.false;

            expect(box.bound().lower().x()).to.equal(-1)
            expect(box.bound().lower().y()).to.equal(2)
            expect(box.bound().lower().z()).to.equal(1)
            expect(box.bound().upper().x()).to.equal(5)
            expect(box.bound().upper().y()).to.equal(3)
            expect(box.bound().upper().z()).to.equal(4)

            let box1 = new PhysicsBox(new Vector3(-1, 2, 1), new Vector3(5, 3, 4));
            box1.setIsNormalFlipped(true)
            expect(box1.isNormalFlipped()).to.true;

            expect(box1.bound().lower().x()).to.equal(-1)
            expect(box1.bound().lower().y()).to.equal(2)
            expect(box1.bound().lower().z()).to.equal(1)
            expect(box1.bound().upper().x()).to.equal(5)
            expect(box1.bound().upper().y()).to.equal(3)
            expect(box1.bound().upper().z()).to.equal(4)
        })
    })


    describe('Method', () => {
        it('closestPoint', () => {
            let box = new PhysicsBox(new Vector3(-1, 2, 1), new Vector3(5, 3, 4));
    
            let result0 = box.closestPoint(new Vector3(-2, 4, 5));
            expect(result0.x()).to.equal(-1)
            expect(result0.y()).to.equal(3)
            expect(result0.z()).to.equal(4)
    
            let result1 = box.closestPoint(new Vector3(1, 5, 0));
         
        expect(result1.x()).to.equal(1)
        expect(result1.y()).to.equal(3)
        expect(result1.z()).to.equal(1)
    
        let result2 = box.closestPoint(new Vector3(9, 5, 7));
        expect(result2.x()).to.equal(5)
        expect(result2.y()).to.equal(3)
        expect(result2.z()).to.equal(4)
    
        let result3 = box.closestPoint(new Vector3(-2, 2.4, 3));
        expect(result3.x()).to.equal(-1)
        expect(result3.y()).to.equal(2.4)
        expect(result3.z()).to.equal(3)
    
        let result4 = box.closestPoint(new Vector3(1, 2.6, 1.1));
            expect(result4.x()).to.equal(1)
            expect(result4.y()).to.equal(2.6)
            expect(result4.z()).to.equal(1)
    
        let result5 = box.closestPoint(new Vector3(9, 2.2, -1));
            expect(result5.x()).to.equal(5)
            expect(result5.y()).to.equal(2.2)
            expect(result5.z()).to.equal(1)
    
        let result6 = box.closestPoint(new Vector3(-2, 1, 1.1));
            expect(result6.x()).to.equal(-1)
            expect(result6.y()).to.equal(2)
            expect(result6.z()).to.equal(1.1)
    
        let result7 = box.closestPoint(new Vector3(1, 0, 3.5));
            expect(result7.x()).to.equal(1)
            expect(result7.y()).to.equal(2)
            expect(result7.z()).to.equal(3.5)
    
        let result8 = box.closestPoint(new Vector3(9, -1, -3));
            expect(result8.x()).to.equal(5)
            expect(result8.y()).to.equal(2)
            expect(result8.z()).to.equal(1)
        })

        it('ClosestDistance', () => {
            let box = new PhysicsBox(new Vector3(-1, 2, 1), new Vector3(5, 3, 4));

        let result0 = box.closestDistance(new Vector3(-2, 4, 5));
        expect(new Vector3(-1, 3, 4).distanceTo(new Vector3(-2, 4, 5))).to.equal(result0);
    
        let result1 = box.closestDistance(new Vector3(1, 5, 0));
        expect(new Vector3(1, 3, 1).distanceTo(new Vector3(1, 5, 0))).to.equal(result1);
    
        let result2 = box.closestDistance(new Vector3(9, 5, 7));
        expect(new Vector3(5, 3, 4).distanceTo(new Vector3(9, 5, 7))).to.equal(result2);
    
        let result3 = box.closestDistance(new Vector3(-2, 2.4, 3));
        expect(new Vector3(-1, 2.4, 3).distanceTo(new Vector3(-2, 2.4, 3))).to.equal(result3);
    
        let result4 = box.closestDistance(new Vector3(1, 2.6, 1.1));
        expect(new Vector3(1, 2.6, 1).distanceTo(new Vector3(1, 2.6, 1.1))).to.equal(result4);
    
        let result5 = box.closestDistance(new Vector3(9, 2.2, -1));
        expect(new Vector3(5, 2.2, 1).distanceTo(new Vector3(9, 2.2, -1))).to.equal(result5);
    
        let result6 = box.closestDistance(new Vector3(-2, 1, 1.1));
        expect(new Vector3(-1, 2, 1.1).distanceTo(new Vector3(-2, 1, 1.1))).to.equal(result6);
    
        let result7 = box.closestDistance(new Vector3(1, 0, 3.5));
        expect(new Vector3(1, 2, 3.5).distanceTo(new Vector3(1, 0, 3.5))).to.equal(result7);
    
        let result8 = box.closestDistance(new Vector3(9, -1, -3));
        expect(new Vector3(5, 2, 1).distanceTo(new Vector3(9, -1, -3))).to.equal(result8);
            
        })

        it('ClosestDistance', () => {
            let box = new PhysicsBox(new Vector3(-1, 2, 3), new Vector3(5, 3, 7));

            let result0 = box.intersects(new Ray(new Vector3(1, 4, 5), new Vector3(-1, -1, -1).normalized()));
        expect(result0).to.true
    
        let result1 = box.intersects(
            new Ray(new Vector3(1, 2.5, 6), new Vector3(-1, -1, 1).normalized()));
        expect(result1).to.true
    
        let result2 = box.intersects(
            new Ray(new Vector3(1, 1, 2), new Vector3(-1, -1, -1).normalized()));
            expect(result2).to.false
        })

        it('ClosestIntersection', () => {
            let box=new PhysicsBox(new Vector3(-1, 2, 3), new Vector3(5, 3, 7));
        
            let result0 = box.closestIntersection(new Ray(new Vector3(1, 4, 5), new Vector3(-1, -1, -1).normalized()));
            expect(result0.isIntersecting).to.true
            expect(isSimilar(Math.sqrt(3),result0.distance,TS_EPSILON)).to.true
            expect(0).to.equal(result0.point.x());
            expect(3).to.equal(result0.point.y());
            expect(4).to.equal(result0.point.z());
        
            let result1 = box.closestIntersection(
                new Ray(new Vector3(1, 2.5, 6), new Vector3(-1, -1, 1).normalized()));
            expect(result1.isIntersecting).to.true
            expect(isSimilar(Math.sqrt(0.75),result1.distance,TS_EPSILON)).to.true
            expect(0.5).to.equal(result1.point.x());
            expect(2).to.equal(result1.point.y());
            expect(6.5).to.equal(result1.point.z());
        
            let result2 = box.closestIntersection(
                new Ray(new Vector3(1, 1, 2), new Vector3(-1, -1, -1).normalized()));
                expect(result2.isIntersecting).to.false
        })
        
        it('BoundingBox', () => {
            let box=new PhysicsBox(new Vector3(-1, 2, 3), new Vector3(5, 3, 7));
            let boundingBox = box.boundingBox();
            
            expect(-1).to.equal(boundingBox.lower().x());
            expect(2).to.equal(boundingBox.lower().y());
            expect(3).to.equal(boundingBox.lower().z());
            
            expect(5).to.equal(boundingBox.upper().x());
            expect(3).to.equal(boundingBox.upper().y());
            expect(7).to.equal(boundingBox.upper().z());
        })
        
        it('ClosestNormal', () => {
            let box=new PhysicsBox(new Vector3(-1, 2, 1), new Vector3(5, 3, 4));
            box.setIsNormalFlipped(true);
        
            let result0 = box.closestNormal(new Vector3(-2, 2, 3));
            expect(1).to.equal(result0.x());
            expect(0).to.equal(result0.y());
            expect(0).to.equal(result0.z());
        
            let result1 = box.closestNormal(new Vector3(3, 5, 2));
            expect(0).to.equal(result1.x());
            expect(-1).to.equal(result1.y());
            expect(0).to.equal(result1.z());
        
            let result2 = box.closestNormal(new Vector3(9, 3, 4));
            expect(-1).to.equal(result2.x());
            expect(0).to.equal(result2.y());
            expect(0).to.equal(result2.z());
        
            let result3 = box.closestNormal(new Vector3(4, 1, 1));
            expect(0).to.equal(result3.x());
            expect(1).to.equal(result3.y());
            expect(0).to.equal(result3.z());
        
            let result4 = box.closestNormal(new Vector3(4, 2.5, -1));
            expect(0).to.equal(result4.x());
            expect(0).to.equal(result4.y());
            expect(1).to.equal(result4.z());
        
            let result5 = box.closestNormal(new Vector3(4, 2, 9));
            expect(0).to.equal(result5.x());
            expect(0).to.equal(result5.y());
            expect(-1).to.equal(result5.z());
        })
    })
})
