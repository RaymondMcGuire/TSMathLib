import { expect } from 'chai'
import 'mocha'

import { Vector3 } from '../../src/math/vector3'
import {Point3} from "../../src/math/point3"
import { PointHashGridSearcher } from '../../src/search/point_hash_grid_searcher'



describe('Point Hash Grid Searcher', () => {
    it('ForEachNearbyPoint', () => {
        let points = new Array<Vector3>()
        points.push(new Vector3(0,1,3))
        points.push(new Vector3(2, 5, 4))
        points.push(new Vector3(-1, 3, 0))
        
        let phgs = new PointHashGridSearcher(2*Math.sqrt(10),new Point3(4,4,4))
        phgs.build(points)

        let cnt = 0;
        phgs.forEachNearbyPoint(
            new Vector3(0, 0, 0),
            Math.sqrt(10.0),
            (i:number, pt:Vector3)=> {
                expect(i == 0 || i == 2).to.equal(true)
                if (i == 0) {
                    expect(points[0]).to.equal(pt)
                } else if (i == 2) {
                    expect(points[2]).to.equal(pt)
                }
    
                ++cnt;
            });
            expect(cnt).to.equal(2)
    })

    it('ForEachNearbyPointEmpty', () => {
        let points = new Array<Vector3>()
        
        let phgs = new PointHashGridSearcher(2*Math.sqrt(10),new Point3(4,4,4))
        phgs.build(points)

        let cnt = 0;
        phgs.forEachNearbyPoint(
            new Vector3(0, 0, 0),
            Math.sqrt(10.0),
            (i: number, pt: Vector3) => {
                console.log("i",i)
                console.log("pt",pt)
                ++cnt;
            });
            expect(cnt).to.equal(0)
    })
})
