import { expect } from 'chai';
import * as mathvec from '../lib/vector';

describe("Vector", () => {
    describe("Init", () => {
        it("Init Vector only with dimension,equals to VectorZero", () => {
            let v = new mathvec.EcognitaMathLib.Vector(3);
            v.data().forEach(element => {
                expect(element).to.equal(0);
            });
        });
        it("Init Vector with dimension and params,equals to params", () => {
            let ary = new Array();
            ary.push(1);
            ary.push(4);
            ary.push(3);

            let v = new mathvec.EcognitaMathLib.Vector(3, ary);
            for (let index = 0; index < v.data().length; index++) {
                const element = v.data()[index];
                expect(element).to.equal(ary[index]);
            }
        });

        let v = new mathvec.EcognitaMathLib.Vector(4, new Array(3, 1, 2, 5));
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
            v.set(new mathvec.EcognitaMathLib.Vector(4, ary));
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


    })
});