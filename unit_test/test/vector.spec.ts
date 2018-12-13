import { expect } from 'chai';
import { Vector } from '../../lib/vector';

describe("Vector", () => {
    describe("Init", () => {
        it("Init Vector only with dimension,equals to VectorZero", () => {
            let v = new Vector(3);
            v.data().forEach(element => {
                expect(element).to.equal(0);
            });
        });
        it("Init Vector with dimension and params,equals to params", () => {
            let ary = new Array();
            ary.push(1);
            ary.push(4);
            ary.push(3);

            let v = new Vector(3, ary);
            for (let index = 0; index < v.data().length; index++) {
                const element = v.data()[index];
                expect(element).to.equal(ary[index]);
            }
        });

        let v = new Vector(4, new Array(3, 1, 2, 5));
        it("setZeros/set function test", () => {
            v.setZero();
            for (let index = 0; index < v.data().length; index++) {
                const element = v.data()[index];
                expect(element).to.equal(0);
            }

            let ary = new Array();
            ary.push(6.0);
            ary.push(2.5);
            ary.push(-9.0);
            ary.push(8.0);
            v.set(new Vector(4, ary));
            for (let index = 0; index < v.data().length; index++) {
                const element = v.data()[index];
                expect(element).to.equal(ary[index]);
            }
        });
        it("get fuction test", () => {
            expect(v.at(0)).to.equal(6.0);
            expect(v.at(1)).to.equal(2.5);
            expect(v.at(2)).to.equal(-9.0);
            expect(v.at(3)).to.equal(8.0);
        });
        it("fundmental calculate function test", () => {
            expect(v.sum()).to.equal(7.5);
            expect(v.avg()).to.equal(7.5 / 4.0);
            expect(v.min()).to.equal(-9.0);
            expect(v.max()).to.equal(8.0);
            expect(v.absmax()).to.equal(-9.0);
            expect(v.absmin()).to.equal(2.5);
            expect(v.lengthSquared()).to.equal(187.25);
            expect(v.length()).to.equal(Math.sqrt(187.25));
        });

        it("distance function test", () => {
            let v1 = new Vector(4, new Array(3.0, -1.0, 2.0, 5.0));
            expect(v1.distanceSquaredTo(v)).to.equal(151.25);
            expect(v1.distanceTo(v)).to.equal(Math.sqrt(151.25));
        });

        it("similiar/equal function test", () => {
            let data = v.data().concat();
            data[0] += 1e-8;
            data[1] -= 1e-8;
            data[2] += 1e-8;
            data[3] -= 1e-8;

            let v1 = new Vector(4, data);
            expect(v.isSimilar(v1, 1e-7)).to.be.true;
            expect(v.isEqual(v1)).to.be.false;
        });

        it("binary operation function test", () => {
            let v1 = new Vector(4, new Array(3.0, -1.0, 2.0, 5.0));
            let v2 = v1.add(v);
            expect(v2.at(0)).to.equal(9.0);
            expect(v2.at(1)).to.equal(1.5);
            expect(v2.at(2)).to.equal(-7.0);
            expect(v2.at(3)).to.equal(13.0);

            v2 = v1.add(3.0);
            expect(v2.at(0)).to.equal(6.0);
            expect(v2.at(1)).to.equal(2.0);
            expect(v2.at(2)).to.equal(5.0);
            expect(v2.at(3)).to.equal(8.0);

            v2 = v1.sub(v);
            expect(v2.at(0)).to.equal(-3.0);
            expect(v2.at(1)).to.equal(-3.5);
            expect(v2.at(2)).to.equal(11.0);
            expect(v2.at(3)).to.equal(-3.0);

            v2 = v1.sub(4.0);
            expect(v2.at(0)).to.equal(-1.0);
            expect(v2.at(1)).to.equal(-5.0);
            expect(v2.at(2)).to.equal(-2.0);
            expect(v2.at(3)).to.equal(1.0);

            v2 = v1.mul(v);
            expect(v2.at(0)).to.equal(18.0);
            expect(v2.at(1)).to.equal(-2.5);
            expect(v2.at(2)).to.equal(-18.0);
            expect(v2.at(3)).to.equal(40.0);

            v2 = v1.mul(2.0);
            expect(v2.at(0)).to.equal(6.0);
            expect(v2.at(1)).to.equal(-2.0);
            expect(v2.at(2)).to.equal(4.0);
            expect(v2.at(3)).to.equal(10.0);

            v2 = v1.div(v);
            expect(v2.at(0)).to.equal(0.5);
            expect(v2.at(1)).to.equal(-0.4);
            expect(v2.at(2)).to.equal(-2.0 / 9.0);
            expect(v2.at(3)).to.equal(0.625);

            v2 = v1.div(0.5);
            expect(v2.at(0)).to.equal(6.0);
            expect(v2.at(1)).to.equal(-2.0);
            expect(v2.at(2)).to.equal(4.0);
            expect(v2.at(3)).to.equal(10.0);
        });

        it("dot function test", () => {
            //v 6, 2.5, -9, 8
            let v1 = new Vector(4, new Array(3.0, -1.0, 2.0, 5.0));
            expect(v1.dot(v)).to.equal(37.5);
            expect(v1.dot(v1)).to.equal(39);
        });
    })
});