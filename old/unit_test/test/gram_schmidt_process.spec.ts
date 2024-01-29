import { expect } from 'chai'
import 'mocha'
import { gram_schmidt_process } from '../../src/numerical/gram_schmidt_process'
import { Vector } from '../../src/math/vector'
import {isSimilar} from "../../src/math/math_utils"


describe('Gram–Schmidt process method', () => {
    it('Gram–Schmidt process method', () => {
        let V = new Array<Vector>()
        V.push(new Vector(2, [3, 1]))
        V.push(new Vector(2, [2, 2]))
        let U = gram_schmidt_process(V)
        // console.log(U[0].data())
        // console.log(U[1].data())
        expect(isSimilar(U[0].data()[0], 3, 0.1)).to.equal(true)
        expect(isSimilar(U[0].data()[1], 1, 0.1)).to.equal(true)
        expect(isSimilar(U[1].data()[0], -0.4, 0.1)).to.equal(true)
        expect(isSimilar(U[1].data()[1], 1.2, 0.1)).to.equal(true)
    })
})
