import { expect } from 'chai'
import 'mocha'
import { Ray } from '../../src/physics/ray'
import { Vector3 } from '../../src/math/vector3'
import { BoundingBox, BoundingBoxRayIntersection3 } from '../../src/physics/bounding_box'
import { Point3 } from '../../src/math/point3'
import {isSimilar} from "../../src/math/math_utils"

describe('BoundingBox', () => {
    describe('Constructor', () => {
        it('construct bbox by two points', () => {
            let bbox = new BoundingBox(new Vector3(-2.0, 3.0, 5.0), new Vector3(4.0, -2.0, 1.0))
            
            expect(bbox._lower.x()).to.equal(-2.0)
            expect(bbox._lower.y()).to.equal(-2.0)
            expect(bbox._lower.z()).to.equal(1.0)
   
            expect(bbox._upper.x()).to.equal(4.0)
            expect(bbox._upper.y()).to.equal(3.0)
            expect(bbox._upper.z()).to.equal(5.0)
        })
    })

    describe('Getter Method', () => {
        let bbox = new BoundingBox(new Vector3(-2.0, 3.0, 5.0), new Vector3(4.0, -2.0, 1.0))
        it('width', () => {   
            expect(bbox.width()).to.equal(6.0)
        })
        it('height', () => {   
            expect(bbox.height()).to.equal(5.0)
        })
        it('depth', () => {   
            expect(bbox.depth()).to.equal(4.0)
        })
        it('length-0', () => {   
            expect(bbox.length(0)).to.equal(6.0)
        })
        it('length-1', () => {   
            expect(bbox.length(1)).to.equal(5.0)
        })
        it('length-2', () => {   
            expect(bbox.length(2)).to.equal(4.0)
        })

        let bbox1 = new BoundingBox(new Vector3(-2.0, -2.0, 1.0), new Vector3(4.0, 3.0, 5.0));
        it('Mid Point', () => {   
            let mid = bbox1.midPoint()
            expect(mid.x()).to.equal(1.0)
            expect(mid.y()).to.equal(0.5)
            expect(mid.z()).to.equal(3.0)
        })

        it('Diagonal Length', () => {   
            let dia = bbox1.diagonalLength()
            expect(dia).to.equal(Math.sqrt(6.0 * 6.0 + 5.0 * 5.0 + 4.0 * 4.0))
        })

        it('Diagonal Length Squared', () => {   
            let diaSqr = bbox1.diagonalLengthSquared()
            expect(diaSqr).to.equal(6.0 * 6.0 + 5.0 * 5.0 + 4.0 * 4.0)
        })

        it('Is Empty', () => {   
            let bbox_epty = new BoundingBox(new Vector3(-2.0, -2.0, 1.0), new Vector3(4.0, 3.0, 5.0))
            expect(bbox_epty.isEmpty()).to.false

            bbox_epty._lower = new Vector3(5.0, 1.0, 3.0)
            expect(bbox_epty.isEmpty()).to.true
            bbox_epty._lower = new Vector3(2.0, 4.0, 3.0)
            expect(bbox_epty.isEmpty()).to.true
            bbox_epty._lower = new Vector3(2.0, 1.0, 6.0)
            expect(bbox_epty.isEmpty()).to.true
            bbox_epty._lower = new Vector3(4.0, 1.0, 3.0)
            expect(bbox_epty.isEmpty()).to.true
        })
        
        it('Corner', () => {   
            expect(-2.0).to.equals(bbox1.corner(0).x());
            expect(-2.0).to.equals(bbox1.corner(0).y());
            expect(1.0).to.equals(bbox1.corner(0).z());

            expect(4.0).to.equals(bbox1.corner(1).x());
            expect(-2.0).to.equals(bbox1.corner(1).y());
            expect(1.0).to.equals(bbox1.corner(1).z());

            expect(-2.0).to.equals(bbox1.corner(2).x());
            expect(3.0).to.equals(bbox1.corner(2).y());
            expect(1.0).to.equals(bbox1.corner(2).z());

            expect(4.0).to.equals(bbox1.corner(3).x());
            expect(3.0).to.equals(bbox1.corner(3).y());
            expect(1.0).to.equals(bbox1.corner(3).z());

            expect(-2.0).to.equals(bbox1.corner(4).x());
            expect(-2.0).to.equals(bbox1.corner(4).y());
            expect(5.0).to.equals(bbox1.corner(4).z());

            expect(4.0).to.equals(bbox1.corner(5).x());
            expect(-2.0).to.equals(bbox1.corner(5).y());
            expect(5.0).to.equals(bbox1.corner(5).z());

            expect(-2.0).to.equals(bbox1.corner(6).x());
            expect(3.0).to.equals(bbox1.corner(6).y());
            expect(5.0).to.equals(bbox1.corner(6).z());

            expect(4.0).to.equals(bbox1.corner(7).x());
            expect(3.0).to.equals(bbox1.corner(7).y());
            expect(5.0).to.equals(bbox1.corner(7).z());
        })
    })

    describe('Setter Method', () => {
        it('Reset', () => {
            let bbox = new BoundingBox(new Vector3(-2.0, -2.0, 1.0), new Vector3(4.0, 3.0, 5.0));
            bbox.reset()
            expect(bbox._lower.x()).to.equal(-Number.MAX_VALUE)
            expect(bbox._lower.y()).to.equal(-Number.MAX_VALUE)
            expect(bbox._lower.z()).to.equal(-Number.MAX_VALUE)
   
            expect(bbox._upper.x()).to.equal(Number.MAX_VALUE)
            expect(bbox._upper.y()).to.equal(Number.MAX_VALUE)
            expect(bbox._upper.z()).to.equal(Number.MAX_VALUE)
        })

        it('Merge With Point', () => {
            let bbox = new BoundingBox(new Vector3(-2.0, -2.0, 1.0), new Vector3(4.0, 3.0, 5.0));
            let p = new Point3(5.0, 1.0, -1.0)
            bbox.mergeWithPoint(p)

            expect(bbox._lower.x()).to.equal(-2.0)
            expect(bbox._lower.y()).to.equal(-2.0)
            expect(bbox._lower.z()).to.equal(-1.0)
   
            expect(bbox._upper.x()).to.equal(5.0)
            expect(bbox._upper.y()).to.equal(3.0)
            expect(bbox._upper.z()).to.equal(5.0)
        })

        it('Merge With Bbox', () => {
            let bbox = new BoundingBox(new Vector3(-2.0, -2.0, 1.0), new Vector3(4.0, 3.0, 5.0));
            let bbox1 = new BoundingBox(new Vector3(3.0, 1.0, 3.0), new Vector3(8.0, 2.0, 7.0));
            bbox.mergeWithBbox(bbox1)

            expect(bbox._lower.x()).to.equal(-2.0)
            expect(bbox._lower.y()).to.equal(-2.0)
            expect(bbox._lower.z()).to.equal(1.0)
   
            expect(bbox._upper.x()).to.equal(8.0)
            expect(bbox._upper.y()).to.equal(3.0)
            expect(bbox._upper.z()).to.equal(7.0)
        })

        it('Expand', () => {
            let bbox = new BoundingBox(new Vector3(-2.0, -2.0, 1.0), new Vector3(4.0, 3.0, 5.0));
            bbox.expand(3.0)

            expect(bbox._lower.x()).to.equal(-5.0)
            expect(bbox._lower.y()).to.equal(-5.0)
            expect(bbox._lower.z()).to.equal(-2.0)
   
            expect(bbox._upper.x()).to.equal(7.0)
            expect(bbox._upper.y()).to.equal(6.0)
            expect(bbox._upper.z()).to.equal(8.0)
        })
    })

    describe('Overlap Method', () => {
        it('x-axis not overlap', () => {   
            let bbox1 = new BoundingBox(new Vector3(-2.0, -2.0, 1.0), new Vector3(4.0, 3.0, 5.0));
            let bbox2 = new BoundingBox(new Vector3(5.0, 1.0, 3.0), new Vector3(8.0, 2.0, 4.0));
            expect(bbox1.overlaps(bbox2)).to.false
        })
        it('y-axis not overlap', () => {   
            let bbox1 = new BoundingBox(new Vector3(-2.0, -2.0, 1.0), new Vector3(4.0, 3.0, 5.0));
            let bbox2 = new BoundingBox(new Vector3(3.0, 4.0, 3.0), new Vector3(8.0, 6.0, 4.0));
            expect(bbox1.overlaps(bbox2)).to.false
        })
        it('z-axis not overlap', () => {   
            let bbox1 = new BoundingBox(new Vector3(-2.0, -2.0, 1.0), new Vector3(4.0, 3.0, 5.0));
            let bbox2 = new BoundingBox(new Vector3(3.0, 1.0, 6.0), new Vector3(8.0, 2.0, 9.0));
            expect(bbox1.overlaps(bbox2)).to.false
        })
        it('overlapping', () => {   
            let bbox1 = new BoundingBox(new Vector3(-2.0, -2.0, 1.0), new Vector3(4.0, 3.0, 5.0));
            let bbox2 = new BoundingBox(new Vector3(3.0, 1.0, 3.0), new Vector3(8.0, 2.0, 7.0));
            expect(bbox1.overlaps(bbox2)).to.true
        })
    })

    describe('Contains Method', () => {
        it('x-axis not contain', () => {   
            let bbox1 = new BoundingBox(new Vector3(-2.0, -2.0, 1.0), new Vector3(4.0, 3.0, 5.0));
            let p = new Vector3(-3.0,0.0,4.0);
            expect(bbox1.contains(p)).to.false
        })
        it('y-axis not contain', () => {   
            let bbox1 = new BoundingBox(new Vector3(-2.0, -2.0, 1.0), new Vector3(4.0, 3.0, 5.0));
            let p = new Vector3(2.0,3.5,4.0);
            expect(bbox1.contains(p)).to.false
        })
        it('z-axis not contain', () => {   
            let bbox1 = new BoundingBox(new Vector3(-2.0, -2.0, 1.0), new Vector3(4.0, 3.0, 5.0));
            let p = new Vector3(2.0,0.0,0.0);
            expect(bbox1.contains(p)).to.false
        })
        it('containing', () => {   
            let bbox1 = new BoundingBox(new Vector3(-2.0, -2.0, 1.0), new Vector3(4.0, 3.0, 5.0));
            let p = new Vector3(2.0, 0.0, 4.0);
            expect(bbox1.contains(p)).to.true
        })
    })

    describe('Intersecion Method', () => {
        it('Intersects', () => {   
            let bbox1 = new BoundingBox(new Vector3(-2.0, -2.0, 1.0), new Vector3(4.0, 3.0, 5.0));
            let r = new Ray(new Vector3(-3.0,0.0,2.0), new Vector3(2.0,1.0,1.0))
            expect(bbox1.intersects(r)).to.true

            let r1 = new Ray(new Vector3(3.0, -1.0, 3.0), new Vector3(-1.0, 2.0, -3.0))
            expect(bbox1.intersects(r1)).to.true

            let r2 = new Ray(new Vector3(1.0, -5.0, 1.0), new Vector3(2.0, 1.0, 2.0))
            expect(bbox1.intersects(r2)).to.false
        })
        it('ClosestIntersection', () => {   
            let bbox1 = new BoundingBox(new Vector3(-2.0, -2.0, -1.0), new Vector3(1.0, 0.0, 1.0));
            let r = new Ray(new Vector3(-4.0, -3.0, 0.0), new Vector3(1.0, 1.0, 0.0))
            let bboxIntersection:BoundingBoxRayIntersection3 = bbox1.closestIntersection(r)
            expect(bboxIntersection.isIntersecting).to.true
            expect(isSimilar(bboxIntersection.Far,new Vector3(3.0, 3.0, 0.0).length(),1e-5)).to.true
            expect(isSimilar(bboxIntersection.Near,new Vector3(2.0, 2.0, 0.0).length(),1e-5)).to.true
            
            let r1 = new Ray(new Vector3(0.0, -1.0, 0.0), new Vector3(-2.0, 1.0, 1.0))
            let bboxIntersection1 = bbox1.closestIntersection(r1)
            expect(bboxIntersection1.isIntersecting).to.true
            expect(bboxIntersection1.Far).to.equals(Number.MAX_VALUE)
            expect(isSimilar(bboxIntersection1.Near,new Vector3(2.0, 1.0, 1.0).length(),1e-5)).to.true
        })
    })
})
