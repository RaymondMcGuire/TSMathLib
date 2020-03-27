/* =========================================================================
 *
 *  matrix4x4.ts
 *  4*4 size matrix
 * ========================================================================= */

import { Vector } from '../src/math/vector'

export class Matrix4x4 extends Vector {
  constructor(params?: Array<number>) {
    super(16, params)
  }

  create(params?: Array<number>): Matrix4x4 {
    return new Matrix4x4(params)
  }

  identity(): Matrix4x4 {
    let mat = this.create()
    mat.data()[0] = 1
    mat.data()[1] = 0
    mat.data()[2] = 0
    mat.data()[3] = 0
    mat.data()[4] = 0
    mat.data()[5] = 1
    mat.data()[6] = 0
    mat.data()[7] = 0
    mat.data()[8] = 0
    mat.data()[9] = 0
    mat.data()[10] = 1
    mat.data()[11] = 0
    mat.data()[12] = 0
    mat.data()[13] = 0
    mat.data()[14] = 0
    mat.data()[15] = 1
    return mat
  }

  // mat2 x mat1,give mat1 a transform(mat2)
  multiply(mat1: Matrix4x4, mat2: Matrix4x4): Matrix4x4 {
    let v16 = new Array<number>(16)

    let a = mat1.data()[0]
    let b = mat1.data()[1]
    let c = mat1.data()[2]
    let d = mat1.data()[3]
    let e = mat1.data()[4]
    let f = mat1.data()[5]
    let g = mat1.data()[6]
    let h = mat1.data()[7]
    let i = mat1.data()[8]
    let j = mat1.data()[9]
    let k = mat1.data()[10]
    let l = mat1.data()[11]
    let m = mat1.data()[12]
    let n = mat1.data()[13]
    let o = mat1.data()[14]
    let p = mat1.data()[15]
    let A = mat2.data()[0]
    let B = mat2.data()[1]
    let C = mat2.data()[2]
    let D = mat2.data()[3]
    let E = mat2.data()[4]
    let F = mat2.data()[5]
    let G = mat2.data()[6]
    let H = mat2.data()[7]
    let I = mat2.data()[8]
    let J = mat2.data()[9]
    let K = mat2.data()[10]
    let L = mat2.data()[11]
    let M = mat2.data()[12]
    let N = mat2.data()[13]
    let O = mat2.data()[14]
    let P = mat2.data()[15]

    v16[0] = A * a + B * e + C * i + D * m
    v16[1] = A * b + B * f + C * j + D * n
    v16[2] = A * c + B * g + C * k + D * o
    v16[3] = A * d + B * h + C * l + D * p
    v16[4] = E * a + F * e + G * i + H * m
    v16[5] = E * b + F * f + G * j + H * n
    v16[6] = E * c + F * g + G * k + H * o
    v16[7] = E * d + F * h + G * l + H * p
    v16[8] = I * a + J * e + K * i + L * m
    v16[9] = I * b + J * f + K * j + L * n
    v16[10] = I * c + J * g + K * k + L * o
    v16[11] = I * d + J * h + K * l + L * p
    v16[12] = M * a + N * e + O * i + P * m
    v16[13] = M * b + N * f + O * j + P * n
    v16[14] = M * c + N * g + O * k + P * o
    v16[15] = M * d + N * h + O * l + P * p

    let mat = this.create(v16)
    return mat
  }

  scale(mat1: Matrix4x4, _scale: Array<number>): Matrix4x4 {
    let v16 = new Array<number>(16)

    v16[0] = mat1.data()[0] * _scale[0]
    v16[1] = mat1.data()[1] * _scale[0]
    v16[2] = mat1.data()[2] * _scale[0]
    v16[3] = mat1.data()[3] * _scale[0]

    v16[4] = mat1.data()[4] * _scale[1]
    v16[5] = mat1.data()[5] * _scale[1]
    v16[6] = mat1.data()[6] * _scale[1]
    v16[7] = mat1.data()[7] * _scale[1]

    v16[8] = mat1.data()[8] * _scale[2]
    v16[9] = mat1.data()[9] * _scale[2]
    v16[10] = mat1.data()[10] * _scale[2]
    v16[11] = mat1.data()[11] * _scale[2]

    v16[12] = mat1.data()[12]
    v16[13] = mat1.data()[13]
    v16[14] = mat1.data()[14]
    v16[15] = mat1.data()[15]
    let mat = this.create(v16)
    return mat
  }

  // vec * matrix,so translate matrix should use its transpose matrix
  translate(mat1: Matrix4x4, _translate: Array<number>): Matrix4x4 {
    let v16 = new Array<number>(16)

    v16[0] = mat1.data()[0]
    v16[1] = mat1.data()[1]
    v16[2] = mat1.data()[2]
    v16[3] = mat1.data()[3]
    v16[4] = mat1.data()[4]
    v16[5] = mat1.data()[5]
    v16[6] = mat1.data()[6]
    v16[7] = mat1.data()[7]
    v16[8] = mat1.data()[8]
    v16[9] = mat1.data()[9]
    v16[10] = mat1.data()[10]
    v16[11] = mat1.data()[11]
    v16[12] =
      mat1.data()[0] * _translate[0] +
      mat1.data()[4] * _translate[1] +
      mat1.data()[8] * _translate[2] +
      mat1.data()[12]
    v16[13] =
      mat1.data()[1] * _translate[0] +
      mat1.data()[5] * _translate[1] +
      mat1.data()[9] * _translate[2] +
      mat1.data()[13]
    v16[14] =
      mat1.data()[2] * _translate[0] +
      mat1.data()[6] * _translate[1] +
      mat1.data()[10] * _translate[2] +
      mat1.data()[14]
    v16[15] =
      mat1.data()[3] * _translate[0] +
      mat1.data()[7] * _translate[1] +
      mat1.data()[11] * _translate[2] +
      mat1.data()[15]
    let mat = this.create(v16)
    return mat
  }

  // https://dspace.lboro.ac.uk/dspace-jspui/handle/2134/18050
  rotate(mat1: Matrix4x4, angle: number, axis: Array<number>): Matrix4x4 {
    let sq = Math.sqrt(
      axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]
    )
    if (!sq) {
      console.log('error: matrix4x4 rotate sq = 0')
      return new Matrix4x4()
    }

    let a = axis[0]
    let b = axis[1]
    let c = axis[2]
    if (sq !== 1) {
      sq = 1 / sq
      a *= sq
      b *= sq
      c *= sq
    }
    let d = Math.sin(angle)
    let e = Math.cos(angle)
    let f = 1 - e
    let g = mat1.data()[0]
    let h = mat1.data()[1]
    let i = mat1.data()[2]
    let j = mat1.data()[3]
    let k = mat1.data()[4]
    let l = mat1.data()[5]
    let m = mat1.data()[6]
    let n = mat1.data()[7]
    let o = mat1.data()[8]
    let p = mat1.data()[9]
    let q = mat1.data()[10]
    let r = mat1.data()[11]
    let s = a * a * f + e
    let t = b * a * f + c * d
    let u = c * a * f - b * d
    let v = a * b * f - c * d
    let w = b * b * f + e
    let x = c * b * f + a * d
    let y = a * c * f + b * d
    let z = b * c * f - a * d
    let A = c * c * f + e

    let v16 = new Array<number>(16)

    v16[0] = g * s + k * t + o * u
    v16[1] = h * s + l * t + p * u
    v16[2] = i * s + m * t + q * u
    v16[3] = j * s + n * t + r * u
    v16[4] = g * v + k * w + o * x
    v16[5] = h * v + l * w + p * x
    v16[6] = i * v + m * w + q * x
    v16[7] = j * v + n * w + r * x
    v16[8] = g * y + k * z + o * A
    v16[9] = h * y + l * z + p * A
    v16[10] = i * y + m * z + q * A
    v16[11] = j * y + n * z + r * A

    v16[12] = mat1.data()[12]
    v16[13] = mat1.data()[13]
    v16[14] = mat1.data()[14]
    v16[15] = mat1.data()[15]
    let mat = this.create(v16)
    return mat
  }

  viewMatrix(
    cam: Array<number>,
    target: Array<number>,
    up: Array<number>
  ): Matrix4x4 {
    let camX = cam[0]
    let camY = cam[1]
    let camZ = cam[2]
    let targetX = target[0]
    let targetY = target[1]
    let targetZ = target[2]
    let upX = up[0]
    let upY = up[1]
    let upZ = up[2]

    // cam and target have the same position
    if (camX === targetX && camY === targetY && camZ === targetZ) {
      return this.identity()
    }

    let forwardX = camX - targetX
    let forwardY = camY - targetY
    let forwardZ = camZ - targetZ
    let l =
      1 /
      Math.sqrt(forwardX * forwardX + forwardY * forwardY + forwardZ * forwardZ)
    forwardX *= l
    forwardY *= l
    forwardZ *= l
    let rightX = upY * forwardZ - upZ * forwardY
    let rightY = upZ * forwardX - upX * forwardZ
    let rightZ = upX * forwardY - upY * forwardX
    l = Math.sqrt(rightX * rightX + rightY * rightY + rightZ * rightZ)
    if (!l) {
      rightX = 0
      rightY = 0
      rightZ = 0
    } else {
      l = 1 / Math.sqrt(rightX * rightX + rightY * rightY + rightZ * rightZ)
      rightX *= l
      rightY *= l
      rightZ *= l
    }

    upX = forwardY * rightZ - forwardZ * rightY
    upY = forwardZ * rightX - forwardX * rightZ
    upZ = forwardX * rightY - forwardY * rightX

    let v16 = new Array<number>(16)
    v16[0] = rightX
    v16[1] = upX
    v16[2] = forwardX
    v16[3] = 0
    v16[4] = rightY
    v16[5] = upY
    v16[6] = forwardY
    v16[7] = 0
    v16[8] = rightZ
    v16[9] = upZ
    v16[10] = forwardZ
    v16[11] = 0
    v16[12] = -(rightX * camX + rightY * camY + rightZ * camZ)
    v16[13] = -(upX * camX + upY * camY + upZ * camZ)
    v16[14] = -(forwardX * camX + forwardY * camY + forwardZ * camZ)
    v16[15] = 1
    let mat = this.create(v16)
    return mat
  }

  perspectiveMatrix(
    fovy: number,
    aspect: number,
    near: number,
    far: number
  ): Matrix4x4 {
    let t = near * Math.tan((fovy * Math.PI) / 360)
    let r = t * aspect
    let a = r * 2
    let b = t * 2
    let c = far - near

    let v16 = new Array<number>(16)
    v16[0] = (near * 2) / a
    v16[1] = 0
    v16[2] = 0
    v16[3] = 0
    v16[4] = 0
    v16[5] = (near * 2) / b
    v16[6] = 0
    v16[7] = 0
    v16[8] = 0
    v16[9] = 0
    v16[10] = -(far + near) / c
    v16[11] = -1
    v16[12] = 0
    v16[13] = 0
    v16[14] = -(far * near * 2) / c
    v16[15] = 0
    let mat = this.create(v16)
    return mat
  }

  orthoMatrix(
    left: number,
    right: number,
    top: number,
    bottom: number,
    near: number,
    far: number
  ): Matrix4x4 {
    let h = right - left
    let v = top - bottom
    let d = far - near

    let v16 = new Array<number>(16)
    v16[0] = 2 / h
    v16[1] = 0
    v16[2] = 0
    v16[3] = 0
    v16[4] = 0
    v16[5] = 2 / v
    v16[6] = 0
    v16[7] = 0
    v16[8] = 0
    v16[9] = 0
    v16[10] = -2 / d
    v16[11] = 0
    v16[12] = -(left + right) / h
    v16[13] = -(top + bottom) / v
    v16[14] = -(far + near) / d
    v16[15] = 1
    let mat = this.create(v16)
    return mat
  }

  transpose(mat1: Matrix4x4): Matrix4x4 {
    let v16 = new Array<number>(16)
    v16[0] = mat1.data()[0]
    v16[1] = mat1.data()[4]
    v16[2] = mat1.data()[8]
    v16[3] = mat1.data()[12]
    v16[4] = mat1.data()[1]
    v16[5] = mat1.data()[5]
    v16[6] = mat1.data()[9]
    v16[7] = mat1.data()[13]
    v16[8] = mat1.data()[2]
    v16[9] = mat1.data()[6]
    v16[10] = mat1.data()[10]
    v16[11] = mat1.data()[14]
    v16[12] = mat1.data()[3]
    v16[13] = mat1.data()[7]
    v16[14] = mat1.data()[11]
    v16[15] = mat1.data()[15]
    let mat = this.create(v16)
    return mat
  }

  inverse(mat1: Matrix4x4): Matrix4x4 {
    let a = mat1.data()[0]
    let b = mat1.data()[1]
    let c = mat1.data()[2]
    let d = mat1.data()[3]
    let e = mat1.data()[4]
    let f = mat1.data()[5]
    let g = mat1.data()[6]
    let h = mat1.data()[7]
    let i = mat1.data()[8]
    let j = mat1.data()[9]
    let k = mat1.data()[10]
    let l = mat1.data()[11]
    let m = mat1.data()[12]
    let n = mat1.data()[13]
    let o = mat1.data()[14]
    let p = mat1.data()[15]
    let q = a * f - b * e
    let r = a * g - c * e
    let s = a * h - d * e
    let t = b * g - c * f
    let u = b * h - d * f
    let v = c * h - d * g
    let w = i * n - j * m
    let x = i * o - k * m
    let y = i * p - l * m
    let z = j * o - k * n
    let A = j * p - l * n
    let B = k * p - l * o
    let ivd = 1 / (q * B - r * A + s * z + t * y - u * x + v * w)
    let v16 = new Array<number>(16)
    v16[0] = (f * B - g * A + h * z) * ivd
    v16[1] = (-b * B + c * A - d * z) * ivd
    v16[2] = (n * v - o * u + p * t) * ivd
    v16[3] = (-j * v + k * u - l * t) * ivd
    v16[4] = (-e * B + g * y - h * x) * ivd
    v16[5] = (a * B - c * y + d * x) * ivd
    v16[6] = (-m * v + o * s - p * r) * ivd
    v16[7] = (i * v - k * s + l * r) * ivd
    v16[8] = (e * A - f * y + h * w) * ivd
    v16[9] = (-a * A + b * y - d * w) * ivd
    v16[10] = (m * u - n * s + p * q) * ivd
    v16[11] = (-i * u + j * s - l * q) * ivd
    v16[12] = (-e * z + f * x - g * w) * ivd
    v16[13] = (a * z - b * x + c * w) * ivd
    v16[14] = (-m * t + n * r - o * q) * ivd
    v16[15] = (i * t - j * r + k * q) * ivd
    let mat = this.create(v16)
    return mat
  }
}
