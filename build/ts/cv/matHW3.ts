/// <reference path="../lib/matrix.ts" />
/// <reference path="../lib/interface.ts" />
namespace ECvLib {
  export class MatHxWx3 {
    private readonly _CHANNEL: number = 3
    private _H: number
    private _W: number
    private _DATA: Array<EMathLib.Matrix>

    constructor(imData: any, height: number, width: number) {
      this._H = height
      this._W = width

      let r = new EMathLib.Matrix(height, width)
      let g = new EMathLib.Matrix(height, width)
      let b = new EMathLib.Matrix(height, width)

      for (let _h = 0; _h < height; _h++) {
        for (let _w = 0; _w < width; _w++) {
          let index = (_h * width + _w) * 4
          r.setDataByIndexs(_h, _w, imData.data[index + 0])
          g.setDataByIndexs(_h, _w, imData.data[index + 1])
          b.setDataByIndexs(_h, _w, imData.data[index + 2])
        }
      }
      this._DATA = new Array<EMathLib.Matrix>(this._CHANNEL)
      this._DATA[0] = r
      this._DATA[1] = g
      this._DATA[2] = b
    }

    forEachIndex(indexs: EMathLib.MatrixIndex) {
      for (let _j = 0; _j < this._H; _j++) {
        for (let _i = 0; _i < this._W; _i++) {
          indexs(_j, _i)
        }
      }
    }

    getDataByIndexs(j: number, i: number) {
      let r = this.R().getDataByIndexs(j, i)
      let g = this.G().getDataByIndexs(j, i)
      let b = this.B().getDataByIndexs(j, i)
      return [r, g, b]
    }

    setDataByIndexs(j: number, i: number, v: Array<number>) {
      this._DATA[0].setDataByIndexs(j, i, v[0])
      this._DATA[1].setDataByIndexs(j, i, v[1])
      this._DATA[2].setDataByIndexs(j, i, v[2])
    }

    showMaskRegion(mask: MatHxWx3) {
      if (
        mask.shape()[0] != this.shape()[0] ||
        mask.shape()[1] != this.shape()[1] ||
        mask.shape()[2] != this.shape()[2]
      ) {
        console.log('mask shape is wrong!')
        return undefined
      }

      this.forEachIndex((j, i) => {
        let imdata = this.getDataByIndexs(j, i)
        let maskdata = mask.getDataByIndexs(j, i)
        let v = new Array<number>(
          (imdata[0] * maskdata[0]) / 255,
          (imdata[1] * maskdata[1]) / 255,
          (imdata[2] * maskdata[2]) / 255
        )
        this.setDataByIndexs(j, i, v)
      })
    }

    getROIData(top: number, left: number, height: number, width: number) {
      let roi_r = new EMathLib.Matrix(height, width)
      let roi_g = new EMathLib.Matrix(height, width)
      let roi_b = new EMathLib.Matrix(height, width)
      for (let _j = top; _j < top + height; _j++) {
        for (let _i = left; _i < left + width; _i++) {
          let d = this.getDataByIndexs(_j, _i)
          roi_r.setDataByIndexs(_j - top, _i - left, d[0])
          roi_g.setDataByIndexs(_j - top, _i - left, d[1])
          roi_b.setDataByIndexs(_j - top, _i - left, d[2])
        }
      }
      return [roi_r, roi_g, roi_b]
    }

    setROIData(top: number, left: number, roi: Array<EMathLib.Matrix>) {
      let height = roi[0].rows()
      let width = roi[0].cols()

      for (let _j = top; _j < top + height; _j++) {
        for (let _i = left; _i < left + width; _i++) {
          let d = new Array(
            roi[0].getDataByIndexs(_j - top, _i - left),
            roi[1].getDataByIndexs(_j - top, _i - left),
            roi[2].getDataByIndexs(_j - top, _i - left)
          )
          this.setDataByIndexs(_j, _i, d)
        }
      }
    }

    shape() {
      return [this._H, this._W, this._CHANNEL]
    }

    R() {
      return this._DATA[0]
    }

    G() {
      return this._DATA[1]
    }

    B() {
      return this._DATA[2]
    }
  }
}
