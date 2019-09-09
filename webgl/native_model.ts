import { HSV2RGB } from './color_space'

/* =========================================================================
 *
 *  native_model.ts
 *  simple 3d model for webgl
 *
 * ========================================================================= */
export class BoardModel {
  data: Array<number>
  index: Array<number>
  constructor(
    uposition: any = undefined,
    ucolor: any = undefined,
    bnormal: boolean = true,
    bcolor: boolean = true,
    btexcoord: boolean = false
  ) {
    this.data = new Array<any>()
    let position = [
      -1.0,
      0.0,
      -1.0,
      1.0,
      0.0,
      -1.0,
      -1.0,
      0.0,
      1.0,
      1.0,
      0.0,
      1.0
    ]
    let normal = [0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0]

    this.index = [0, 1, 2, 3, 2, 1]

    let texCoord = [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0]

    for (let i = 0; i < 4; i++) {
      if (uposition === undefined) {
        this.data.push(
          position[i * 3 + 0],
          position[i * 3 + 1],
          position[i * 3 + 2]
        )
      } else {
        this.data.push(
          uposition[i * 3 + 0],
          uposition[i * 3 + 1],
          uposition[i * 3 + 2]
        )
      }

      if (bnormal) {
        this.data.push(normal[i * 3 + 0], normal[i * 3 + 1], normal[i * 3 + 2])
      }

      if (ucolor === undefined) {
        let color = [
          1.0,
          1.0,
          1.0,
          1.0,
          1.0,
          1.0,
          1.0,
          1.0,
          1.0,
          1.0,
          1.0,
          1.0,
          1.0,
          1.0,
          1.0,
          1.0
        ]
        if (bcolor) {
          this.data.push(
            color[i * 4 + 0],
            color[i * 4 + 1],
            color[i * 4 + 2],
            color[i * 4 + 3]
          )
        }
      } else {
        if (bcolor) {
          this.data.push(
            ucolor[i * 4 + 0],
            ucolor[i * 4 + 1],
            ucolor[i * 4 + 2],
            ucolor[i * 4 + 3]
          )
        }
      }

      if (btexcoord) {
        this.data.push(texCoord[i * 2 + 0], texCoord[i * 2 + 1])
      }
    }
  }
}

export class TorusModel {
  horCrossSectionSmooth: number
  verCrossSectionSmooth: number
  horRadius: number
  verRadius: number
  normal: Array<number>
  // px py pz cr cg cb ca
  data: Array<number>
  index: Array<number>
  constructor(
    vcrs: number,
    hcrs: number,
    vr: number,
    hr: number,
    color: Array<number>,
    bnormal: boolean,
    btexture: boolean = false
  ) {
    this.verCrossSectionSmooth = vcrs
    this.horCrossSectionSmooth = hcrs
    this.verRadius = vr
    this.horRadius = hr
    this.data = new Array<number>()
    this.index = new Array<number>()
    this.normal = new Array<number>()
    this.preCalculate(bnormal, btexture, color)
  }

  private preCalculate(
    bnormal: boolean,
    btexture: boolean,
    color?: Array<number>
  ) {
    // calculate pos and col
    for (let i = 0; i <= this.verCrossSectionSmooth; i++) {
      let verIncrement = ((Math.PI * 2) / this.verCrossSectionSmooth) * i
      let verX = Math.cos(verIncrement)
      let verY = Math.sin(verIncrement)
      for (let ii = 0; ii <= this.horCrossSectionSmooth; ii++) {
        let horIncrement = ((Math.PI * 2) / this.horCrossSectionSmooth) * ii
        let horX =
          (verX * this.verRadius + this.horRadius) * Math.cos(horIncrement)
        let horY = verY * this.verRadius
        let horZ =
          (verX * this.verRadius + this.horRadius) * Math.sin(horIncrement)
        this.data.push(horX, horY, horZ)

        if (bnormal) {
          let nx = verX * Math.cos(horIncrement)
          let nz = verX * Math.sin(horIncrement)
          this.normal.push(nx, verY, nz)
          this.data.push(nx, verY, nz)
        }
        // hsv2rgb
        if (color === undefined) {
          let rgba = HSV2RGB((360 / this.horCrossSectionSmooth) * ii, 1, 1, 1)
          this.data.push(rgba[0], rgba[1], rgba[2], rgba[3])
        } else {
          this.data.push(color[0], color[1], color[2], color[3])
        }

        if (btexture) {
          let rs = (1 / this.horCrossSectionSmooth) * ii
          let rt = (1 / this.verCrossSectionSmooth) * i + 0.5
          if (rt > 1.0) {
            rt -= 1.0
          }
          rt = 1.0 - rt
          this.data.push(rs, rt)
        }
      }
    }

    // calculate index
    for (let i = 0; i < this.verCrossSectionSmooth; i++) {
      for (let ii = 0; ii < this.horCrossSectionSmooth; ii++) {
        let verIncrement = (this.horCrossSectionSmooth + 1) * i + ii
        this.index.push(
          verIncrement,
          verIncrement + this.horCrossSectionSmooth + 1,
          verIncrement + 1
        )
        this.index.push(
          verIncrement + this.horCrossSectionSmooth + 1,
          verIncrement + this.horCrossSectionSmooth + 2,
          verIncrement + 1
        )
      }
    }
  }
}

export class ShpereModel {
  horCrossSectionSmooth: number
  verCrossSectionSmooth: number
  Radius: number
  // px py pz cr cg cb ca
  data: Array<number>
  index: Array<number>
  constructor(
    vcrs: number,
    hcrs: number,
    rad: number,
    color: Array<number>,
    bnormal: boolean,
    btexture: boolean = false
  ) {
    this.verCrossSectionSmooth = vcrs
    this.horCrossSectionSmooth = hcrs
    this.Radius = rad
    this.data = new Array<number>()
    this.index = new Array<number>()
    this.preCalculate(bnormal, btexture, color)
  }

  private preCalculate(
    bnormal: boolean,
    btexture: boolean,
    color?: Array<number>
  ) {
    // calculate pos and col
    for (let i = 0; i <= this.verCrossSectionSmooth; i++) {
      let verIncrement = (Math.PI / this.verCrossSectionSmooth) * i
      let verX = Math.cos(verIncrement)
      let verY = Math.sin(verIncrement)
      for (let ii = 0; ii <= this.horCrossSectionSmooth; ii++) {
        let horIncrement = ((Math.PI * 2) / this.horCrossSectionSmooth) * ii
        let horX = verY * this.Radius * Math.cos(horIncrement)
        let horY = verX * this.Radius
        let horZ = verY * this.Radius * Math.sin(horIncrement)
        this.data.push(horX, horY, horZ)

        if (bnormal) {
          let nx = verY * Math.cos(horIncrement)
          let nz = verY * Math.sin(horIncrement)
          this.data.push(nx, verX, nz)
        }
        // hsv2rgb
        if (color === undefined) {
          let rgba = HSV2RGB((360 / this.horCrossSectionSmooth) * i, 1, 1, 1)
          this.data.push(rgba[0], rgba[1], rgba[2], rgba[3])
        } else {
          this.data.push(color[0], color[1], color[2], color[3])
        }

        if (btexture) {
          this.data.push(
            1 - (1 / this.horCrossSectionSmooth) * ii,
            (1 / this.verCrossSectionSmooth) * i
          )
        }
      }
    }

    // calculate index
    for (let i = 0; i < this.verCrossSectionSmooth; i++) {
      for (let ii = 0; ii < this.horCrossSectionSmooth; ii++) {
        let verIncrement = (this.horCrossSectionSmooth + 1) * i + ii
        this.index.push(
          verIncrement,
          verIncrement + 1,
          verIncrement + this.horCrossSectionSmooth + 2
        )
        this.index.push(
          verIncrement,
          verIncrement + this.horCrossSectionSmooth + 2,
          verIncrement + this.horCrossSectionSmooth + 1
        )
      }
    }
  }
}

export class CubeModel {
  side: number
  data: Array<number>
  index: Array<number>
  constructor(
    side: number,
    bnormal: boolean,
    btexture: boolean,
    color?: Array<number>
  ) {
    this.side = side
    this.data = new Array<number>()
    this.index = [
      0,
      1,
      2,
      0,
      2,
      3,
      4,
      5,
      6,
      4,
      6,
      7,
      8,
      9,
      10,
      8,
      10,
      11,
      12,
      13,
      14,
      12,
      14,
      15,
      16,
      17,
      18,
      16,
      18,
      19,
      20,
      21,
      22,
      20,
      22,
      23
    ]

    let hs = side * 0.5
    let pos = [
      -hs,
      -hs,
      hs,
      hs,
      -hs,
      hs,
      hs,
      hs,
      hs,
      -hs,
      hs,
      hs,
      -hs,
      -hs,
      -hs,
      -hs,
      hs,
      -hs,
      hs,
      hs,
      -hs,
      hs,
      -hs,
      -hs,
      -hs,
      hs,
      -hs,
      -hs,
      hs,
      hs,
      hs,
      hs,
      hs,
      hs,
      hs,
      -hs,
      -hs,
      -hs,
      -hs,
      hs,
      -hs,
      -hs,
      hs,
      -hs,
      hs,
      -hs,
      -hs,
      hs,
      hs,
      -hs,
      -hs,
      hs,
      hs,
      -hs,
      hs,
      hs,
      hs,
      hs,
      -hs,
      hs,
      -hs,
      -hs,
      -hs,
      -hs,
      -hs,
      hs,
      -hs,
      hs,
      hs,
      -hs,
      hs,
      -hs
    ]
    let normal = [
      -1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      -1.0
    ]
    let col = new Array()
    for (let i = 0; i < pos.length / 3; i++) {
      let tc: Array<number>
      if (color !== undefined) {
        tc = color
      } else {
        tc = HSV2RGB((360 / pos.length / 3) * i, 1, 1, 1)
      }
      col.push(tc[0], tc[1], tc[2], tc[3])
    }
    let st = [
      0.0,
      0.0,
      1.0,
      0.0,
      1.0,
      1.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      1.0,
      1.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      1.0,
      1.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      1.0,
      1.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      1.0,
      1.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      1.0,
      1.0,
      0.0,
      1.0
    ]

    let cubeVertexNum = 24
    for (let i = 0; i < cubeVertexNum; i++) {
      // pos
      this.data.push(pos[i * 3 + 0], pos[i * 3 + 1], pos[i * 3 + 2])
      // normal
      if (bnormal) {
        this.data.push(normal[i * 3 + 0], normal[i * 3 + 1], normal[i * 3 + 2])
      }
      // color
      this.data.push(
        col[i * 4 + 0],
        col[i * 4 + 1],
        col[i * 4 + 2],
        col[i * 4 + 3]
      )
      // texture
      if (btexture) {
        this.data.push(st[i * 2 + 0], st[i * 2 + 1])
      }
    }
  }
}
