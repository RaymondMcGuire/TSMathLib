import { expect } from 'chai'
import 'mocha'
import { Quaternion, Vector3, TS_PI, TS_EPSILON, isSimilar, TS_HALF_EPSILON } from '../../src/math'


describe('Quaternion', () => {

    describe('Constructor', () => {
        it('construct quaternion', () => {
            let q1 = new Quaternion()
            expect(q1.x).to.equal(0)
            expect(q1.y).to.equal(0)
            expect(q1.z).to.equal(0)
            expect(q1.w).to.equal(1)
            
            let q2 = new Quaternion(4,3,2,1)
            expect(q2.x).to.equal(4)
            expect(q2.y).to.equal(3)
            expect(q2.z).to.equal(2)
            expect(q2.w).to.equal(1)
        })

        it('set with axis & angle', () => {
            let originalAxis = new Vector3(1, 3, 2).normalized();
            let originalAngle = 0.4;

            let q = new Quaternion();
            q.setByAxisAngle(originalAxis, originalAngle)

            let axis = q.axis();
            let angle = q.angle();

            expect(isSimilar(originalAxis.x(), axis.x(), TS_EPSILON)).to.true
            expect(isSimilar(originalAxis.y(), axis.y(), TS_EPSILON)).to.true
            expect(isSimilar(originalAxis.z(),axis.z(),TS_EPSILON)).to.true
            expect(isSimilar(originalAngle,angle,TS_EPSILON)).to.true
        })

        it('set with from & to vectors (90 degrees)', () => {
            let from = new Vector3(1, 0, 0);
            let to= new Vector3(0, 0, 1);
    
            let q = new Quaternion();
            q.setByFromTo(from,to)
    
            let axis = q.axis();
            let angle = q.angle();

            expect(0.0).to.equal(axis.x());
            expect(-1.0).to.equal(axis.y());
            expect(0.0).to.equal(axis.z());
            expect(isSimilar(TS_PI/2.0,angle,TS_EPSILON)).to.true
        })
    })

    describe('Method', () => {
        it('normalize', () => {
            let q=new Quaternion(2, 3, 4, 1);
            let qn = q.normalized();
        
            let denom = Math.sqrt(30.0);
            expect(2.0 / denom).to.equal(qn.x);
            expect(3.0 / denom).to.equal(qn.y);
            expect(4.0 / denom).to.equal(qn.z);
            expect(1.0 / denom).to.equal(qn.w);
        })

        it('convert to Matrix3x3', () => {
            let q=new Quaternion(0, 5, 2, 1);
            q.normalize()
        
            let mat3 = q.ToMatrix3x3()
            let solution3 = new Array<number>(
                -14.0 / 15.0, -2.0 / 15.0, 1.0 / 3.0,
                2.0 / 15.0, 11.0 / 15.0, 2.0 / 3.0,
                -1.0 / 3.0, 2.0 / 3.0, -2.0 / 3.0
            )

            for (let i = 0; i < 9; ++i) {
                expect(isSimilar(solution3[i],mat3.data()[i],TS_EPSILON)).to.true
            }
        })

        it('convert to Matrix4x4', () => {
            let q=new Quaternion(0, 5, 2, 1);
            q.normalize()
        
            let mat4 = q.ToMatrix4x4()
            let solution4 = new Array<number>(
                -14.0 / 15.0, -2.0 / 15.0, 1.0 / 3.0, 0.0,
                2.0 / 15.0, 11.0 / 15.0, 2.0 / 3.0, 0.0,
                -1.0 / 3.0, 2.0 / 3.0, -2.0 / 3.0, 0.0,
                0.0, 0.0, 0.0, 1.0
            )

            for (let i = 0; i < 16; ++i) {
                expect(isSimilar(solution4[i],mat4.data()[i],TS_EPSILON)).to.true
            }
        })

        it('inverse operation', () => {
            let q= new Quaternion(2, 3, 4,1);

            let q2 = q.inverse();
            expect(-1.0 / 15.0).to.equal(q2.x);
            expect(-1.0 / 10.0).to.equal(q2.y);
            expect(-2.0/15.0).to.equal(q2.z);
            expect(1.0/30.0).to.equal(q2.w);
        })

        it('rotate operation', () => {
            let q = new Quaternion(3, 2, 1, 4);
            q.normalize()
            let axisAngle = q.getAxisAngle();
            q.rotate(1.0)
            let newAxisAngle = q.getAxisAngle();

            expect(axisAngle[1]+1.0).to.equal(newAxisAngle[1]);
        })

        it('get axis & angle', () => {
            let q=new Quaternion(0, 5, 2, 1);
            q.normalize()
            let axisAngle = q.getAxisAngle();
            expect(0.0).to.equal(axisAngle[0].x());
            expect(5.0 / Math.sqrt(29.0)).to.equal(axisAngle[0].y());
            expect(2.0 / Math.sqrt(29.0)).to.equal(axisAngle[0].z());

            expect(q.axis().x()).to.equal(axisAngle[0].x());
            expect(q.axis().y()).to.equal(axisAngle[0].y());
            expect(q.axis().z()).to.equal(axisAngle[0].z());
            expect(q.angle()).to.equal(axisAngle[1]);

            expect(2.0 * Math.acos(1.0 / Math.sqrt(30.0))).to.equal(axisAngle[1]);

            q.set(2, 3, 4, 1);
            expect(Math.sqrt(30.0)).to.equal(q.l2Norm());
        })

        it('operation', () => {
            let q1 = new Quaternion(2, 3, 4, 1);
            let q2=new Quaternion(-2, -3, -4, 1);
            let q3 = q1.mul(q2);

            expect(q3.x).to.equal(0.0);
            expect(q3.y).to.equal(0.0);
            expect(q3.z).to.equal(0.0);
            expect(q3.w).to.equal(30.0);

            q1.normalize()
            let v = new Vector3(7, 8, 9)
            let ans1 = q1.mulV3(v);
            let m = q1.ToMatrix3x3();
            let ans2 = m.mulV3(v);
            
            expect(isSimilar(ans2.x(), ans1.x(), TS_HALF_EPSILON)).to.true
            expect(isSimilar(ans2.y(), ans1.y(), TS_HALF_EPSILON)).to.true
            expect(isSimilar(ans2.z(),ans1.z(),TS_HALF_EPSILON)).to.true


            q1.set(2, 3, 4, 1)
            q2.set(6, 7, 8, 5)
            expect(70.0).to.equal(q1.dot(q2));

            q3= q1.mul(q2)
            expect(q3.x).to.equal(q2.rmul(q1).x);
            expect(q3.y).to.equal(q2.rmul(q1).y);
            expect(q3.z).to.equal(q2.rmul(q1).z);
            expect(q3.w).to.equal(q2.rmul(q1).w);
        })
    })
})
