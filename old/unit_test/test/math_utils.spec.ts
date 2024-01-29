import { expect } from 'chai'
import 'mocha'
import { swap } from '../../src/math/math_utils'

describe('Math Utils', () => {

    describe('Swap', () => {
        it('Swap var a and b', () => {
            let a = 156
            let b = 333
            let val = swap(a,b)
            expect(a).to.equal(val[1])
            expect(b).to.equal(val[0])
        })
    })
})
