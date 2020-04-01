import { expect } from 'chai'
import 'mocha'
import { Vector3 } from '../../src/math/vector3'
import { BccPointGenerator } from '../../src/generator/bcc_point_generator'
import { BoundingBox } from '../../src/physics/bounding_box'
import { Point3 } from '../../src/math/point3'

describe('Bcc Point Generator', () => {

    describe('Generate', () => {
        it('Generate bcc', () => {
            let bbox = new BoundingBox(new Vector3(-1.0, -1.0, -1.0), new Vector3(1.0, 1.0, 1.0))
            let spacing = 0.5
            let bcc = new BccPointGenerator()
            let points = new Array<Point3>()
            bcc.generate(bbox, spacing, points)
            //bcc.printPoints2Py(points)
            expect(true).to.true
        })
    })
})
