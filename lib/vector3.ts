import { Vector } from './vector'

export class Vector3 extends Vector {
  constructor(e1: number, e2: number, e3: number) {
    super(3, new Array<number>(e1, e2, e3))
  }

  x() {
    return this.data()[0]
  }
  y() {
    return this.data()[1]
  }
  z() {
    return this.data()[2]
  }
  r() {
    return this.data()[0]
  }
  g() {
    return this.data()[1]
  }
  b() {
    return this.data()[2]
  }

  iset(v3: Vector3) {
    this.data()[0] = v3.r()
    this.data()[1] = v3.g()
    this.data()[2] = v3.b()
  }

  set(v3: Vector3) {
    return super.set(new Vector(3, v3.data()))
  }

  add(v3: any) {
    let addv = super.add(v3)
    return new Vector3(addv.data()[0], addv.data()[1], addv.data()[2])
  }

  sub(v3: any) {
    let subv = super.sub(v3)
    return new Vector3(subv.data()[0], subv.data()[1], subv.data()[2])
  }

  mul(v3: any) {
    let mulv = super.mul(v3)
    return new Vector3(mulv.data()[0], mulv.data()[1], mulv.data()[2])
  }

  div(v3: any) {
    let divv = super.div(v3)
    return new Vector3(divv.data()[0], divv.data()[1], divv.data()[2])
  }

  dot(v3: Vector3) {
    return super.dot(new Vector(3, v3.data()))
  }

  cross(v3: Vector3) {
    let nv = new Vector(3, this.data())
    return new Vector3(
      nv.data()[1] * v3.data()[2] - nv.data()[2] * v3.data()[1],
      nv.data()[2] * v3.data()[0] - nv.data()[0] * v3.data()[2],
      nv.data()[0] * v3.data()[1] - nv.data()[1] * v3.data()[0]
    )
  }

  unitVec3(): Vector3 {
    let nv = new Vector(3, this.data())
    nv.normalize()
    return new Vector3(nv.data()[0], nv.data()[1], nv.data()[2])
  }

  gamma2(): Vector3 {
    let tv = new Vector(3, this.data())
    return new Vector3(
      Math.sqrt(tv.at(0)),
      Math.sqrt(tv.at(1)),
      Math.sqrt(tv.at(2))
    )
  }
}
