/// <reference path="../lib/conjugate_grad.ts" />
/// <reference path="../lib/vector.ts" />
/// <reference path="../lib/matrix.ts" />
/// <reference path="../ds/hashset.ts" />
/// <reference path="../cv/s_imload.ts" />
/// <reference path="../cv/matHW3.ts" />
/// <reference path="../utils/timer.ts" />

let timer = new EUtilsLib.TimeRecorder()

let cvs_target = document.getElementById('cvs_target') as HTMLCanvasElement
let cvs_source = document.getElementById('cvs_source') as HTMLCanvasElement
let cvs_target_mask = document.getElementById(
  'cvs_target_mask'
) as HTMLCanvasElement
let cvs_source_mask = document.getElementById(
  'cvs_source_mask'
) as HTMLCanvasElement
let cvs_synthesis = document.getElementById(
  'cvs_synthesis'
) as HTMLCanvasElement
let cvs_preview = document.getElementById('cvs_preview') as HTMLCanvasElement

let card_target = document.getElementById('card_target') as HTMLElement
let card_source = document.getElementById('card_source') as HTMLCanvasElement
let card_target_mask = document.getElementById(
  'card_target_mask'
) as HTMLCanvasElement
let card_source_mask = document.getElementById(
  'card_source_mask'
) as HTMLCanvasElement
let card_synthesis = document.getElementById(
  'card_synthesis'
) as HTMLCanvasElement
let card_preview = document.getElementById('card_preview') as HTMLCanvasElement

let btn_PIE = document.getElementById('btn_PIE') as HTMLButtonElement

let paths = new EDsLib.HashSet<string>()
paths.set('mona_target', './images/mona-target.jpg')
paths.set('cat_source', './images/cat-source.jpg')

function clip(v: number, min: number, max: number) {
  if (v < min) v = min
  if (v > max) v = max
  return v
}

let ImagesLoadSys = new ECvLib.SimpleImageLoadSystem(
  paths,
  (images: EDsLib.HashSet<any>) => {
    let mona_target = images.get('mona_target')
    let cat_source = images.get('cat_source')

    cvs_target.height = mona_target.height
    cvs_target.width = mona_target.width
    card_target.style.width = mona_target.width

    let height = cvs_target.height
    let width = cvs_target.width

    cvs_source.height = cat_source.height
    cvs_source.width = cat_source.width
    card_source.style.width = cat_source.width

    let context_target = cvs_target.getContext('2d')
    context_target.drawImage(mona_target, 0, 0)
    let imageData_target = context_target.getImageData(0, 0, width, height)

    // preview canvas
    cvs_preview.height = mona_target.height
    cvs_preview.width = mona_target.width
    card_preview.style.width = mona_target.width

    let context_preview = cvs_preview.getContext('2d')
    context_preview.drawImage(mona_target, 0, 0)

    // target mask canvas
    cvs_target_mask.height = height
    cvs_target_mask.width = width
    card_target_mask.style.width = mona_target.width

    let context_target_mask = cvs_target_mask.getContext('2d')
    context_target_mask.clearRect(0, 0, width, height)
    context_target_mask.fillStyle = 'black'
    context_target_mask.fillRect(0, 0, width, height)

    // source mask canvas
    cvs_source_mask.height = height
    cvs_source_mask.width = width
    card_source_mask.style.width = cat_source.width

    let context_source_mask = cvs_source_mask.getContext('2d')
    context_source_mask.clearRect(0, 0, width, height)
    context_source_mask.fillStyle = 'black'
    context_source_mask.fillRect(0, 0, width, height)

    // result canvas
    cvs_synthesis.height = height
    cvs_synthesis.width = width
    card_synthesis.style.width = mona_target.width

    let context_synthesis = cvs_synthesis.getContext('2d')
    context_synthesis.clearRect(0, 0, width, height)
    context_synthesis.fillStyle = 'black'
    context_synthesis.fillRect(0, 0, width, height)

    let context_source = cvs_source.getContext('2d')
    context_source.drawImage(cat_source, 0, 0)
    let imageData_source = context_source.getImageData(
      0,
      0,
      cvs_source.width,
      cvs_source.height
    )

    // source image mask edit
    let x = 0
    let y = 0
    let draw = false
    cvs_source.addEventListener('mousemove', (e: any) => {
      if (draw) {
        let rect = e.target.getBoundingClientRect()
        x = e.clientX - rect.left
        y = e.clientY - rect.top

        // draw mask region to source image
        context_source.beginPath()
        context_source.arc(x, y, 10, 0, 2 * Math.PI, false)
        context_source.fill()

        // draw mask region to mask image
        context_source_mask.fillStyle = 'white'
        context_source_mask.beginPath()
        context_source_mask.arc(x, y, 10, 0, 2 * Math.PI, false)
        context_source_mask.fill()

        context_target_mask.fillStyle = 'white'
        context_target_mask.beginPath()
        context_target_mask.arc(x, y, 10, 0, 2 * Math.PI, false)
        context_target_mask.fill()
      }
    })

    cvs_source.addEventListener('mousedown', (e: any) => {
      draw = true
    })

    cvs_source.addEventListener('mouseup', (e: any) => {
      draw = false
    })

    // adjust mask image position for target image
    let startX = 0
    let startY = 0
    let endX = 0
    let endY = 0
    let select = true
    let source_mask_roi_image
    let temp_coord = []
    let drag = false
    let down = false
    cvs_target_mask.addEventListener('mousedown', (e: any) => {
      let rect = e.target.getBoundingClientRect()
      startX = e.clientX - rect.left
      startY = e.clientY - rect.top
      down = true
    })

    cvs_target_mask.addEventListener('mouseup', (e: any) => {
      let rect = e.target.getBoundingClientRect()
      endX = e.clientX - rect.left
      endY = e.clientY - rect.top

      if (select) {
        let h = endY - startY
        let w = endX - startX

        source_mask_roi_image = context_source_mask.getImageData(
          0,
          0,
          width,
          height
        )
        source_mask_roi_image = new ECvLib.MatHxWx3(
          source_mask_roi_image,
          height,
          width
        )
        temp_coord = []
        temp_coord.push(Math.round(startY), Math.round(startX), h, w)
        // draw
        context_target_mask.beginPath()
        context_target_mask.lineWidth = 3
        context_target_mask.strokeStyle = 'blue'
        context_target_mask.rect(startX, startY, w, h)
        context_target_mask.stroke()
        select = false
        down = false
      } else if (drag) {
        select = true
      }
    })

    cvs_target_mask.addEventListener('mousemove', (e: any) => {
      if (down && !select) drag = true
      else drag = false

      if (drag) {
        let rect = e.target.getBoundingClientRect()
        endX = e.clientX - rect.left
        endY = e.clientY - rect.top

        let y_offset = endY - startY
        let x_offset = endX - startX

        let formal_roi = (source_mask_roi_image as ECvLib.MatHxWx3).getROIData(
          temp_coord[0],
          temp_coord[1],
          temp_coord[2],
          temp_coord[3]
        )
        context_target_mask.clearRect(0, 0, width, height)

        let target_mask_roi_image = context_target_mask.getImageData(
          0,
          0,
          width,
          height
        )
        let target_mask_roi_data = new ECvLib.MatHxWx3(
          target_mask_roi_image,
          height,
          width
        )
        target_mask_roi_data.setROIData(
          temp_coord[0] + y_offset,
          temp_coord[1] + x_offset,
          formal_roi
        )

        // draw new mask for target image
        let md = context_target_mask.getImageData(0, 0, width, height)
        for (let j = 0; j < height; j++) {
          for (let i = 0; i < width; i++) {
            let index = (j * width + i) * 4
            let Val_r = target_mask_roi_data.R().getDataByIndexs(j, i)
            let Val_g = target_mask_roi_data.G().getDataByIndexs(j, i)
            let Val_b = target_mask_roi_data.B().getDataByIndexs(j, i)

            md.data[index + 0] = Val_r
            md.data[index + 1] = Val_g
            md.data[index + 2] = Val_b
            md.data[index + 3] = 255
          }
        }
        context_target_mask.putImageData(md, 0, 0)

        // mapping to target image
        let ti = context_target.getImageData(0, 0, width, height)
        let ti_data = new ECvLib.MatHxWx3(ti, height, width)
        ti_data.showMaskRegion(target_mask_roi_data)
        let preview_data = context_preview.getImageData(0, 0, width, height)
        for (let j = 0; j < height; j++) {
          for (let i = 0; i < width; i++) {
            let index = (j * width + i) * 4
            let vr = ti_data.R().getDataByIndexs(j, i)
            let vg = ti_data.G().getDataByIndexs(j, i)
            let vb = ti_data.B().getDataByIndexs(j, i)

            preview_data.data[index + 0] = vr
            preview_data.data[index + 1] = vg
            preview_data.data[index + 2] = vb
            preview_data.data[index + 3] = 255
          }
        }
        context_preview.putImageData(preview_data, 0, 0)

        // startX = e.clientX - rect.left;
        // startY = e.clientY - rect.top;
      }
    })

    // button click event
    btn_PIE.addEventListener('click', () => {
      timer.start()

      let mona_target_image = new ECvLib.MatHxWx3(
        imageData_target,
        height,
        width
      )
      let cat_source_image = new ECvLib.MatHxWx3(
        imageData_source,
        height,
        width
      )

      let imageData_target_mask = context_target_mask.getImageData(
        0,
        0,
        width,
        height
      )
      let target_mask_image = new ECvLib.MatHxWx3(
        imageData_target_mask,
        height,
        width
      )

      let imageData_source_mask = context_source_mask.getImageData(
        0,
        0,
        width,
        height
      )
      let source_mask_image = new ECvLib.MatHxWx3(
        imageData_source_mask,
        height,
        width
      )
      // execute poisson image editing
      let target_maskidx2Corrd = new Array<[number, number]>()
      let source_maskidx2Corrd = new Array<[number, number]>()
      // record order
      let Coord2indx = new EMathLib.Matrix(height, width)
      Coord2indx.setValues(-1)
      // left, right, top, botton pix in mask or not
      let if_strict_interior = new Array<[boolean, boolean, boolean, boolean]>()

      let idx = 0
      target_mask_image.forEachIndex((j, i) => {
        if (target_mask_image.getDataByIndexs(j, i)[0] == 255) {
          target_maskidx2Corrd.push([j, i])
          if_strict_interior.push([
            j > 0 && target_mask_image.getDataByIndexs(j - 1, i)[0] == 255,
            j < height - 1 &&
              target_mask_image.getDataByIndexs(j + 1, i)[0] == 255,
            i > 0 && target_mask_image.getDataByIndexs(j, i - 1)[0] == 255,
            i < width - 1 &&
              target_mask_image.getDataByIndexs(j, i + 1)[0] == 255
          ])
          Coord2indx.setDataByIndexs(j, i, idx)
          idx += 1
        }
      })

      source_mask_image.forEachIndex((j, i) => {
        if (source_mask_image.getDataByIndexs(j, i)[0] == 255) {
          source_maskidx2Corrd.push([j, i])
        }
      })

      timer.end()
      timer.printElapsedTime()
      console.log('converted image coordniates to index...')

      timer.start()

      let N = idx
      let b = new EMathLib.Matrix(N, 3)
      let A = new EMathLib.Matrix(N, N)

      for (let i = 0; i < N; i++) {
        A.setDataByIndexs(i, i, 4)
        let r = target_maskidx2Corrd[i][0]
        let c = target_maskidx2Corrd[i][1]

        if (if_strict_interior[i][0])
          A.setDataByIndexs(i, Coord2indx.getDataByIndexs(r - 1, c), -1)
        if (if_strict_interior[i][1])
          A.setDataByIndexs(i, Coord2indx.getDataByIndexs(r + 1, c), -1)
        if (if_strict_interior[i][2])
          A.setDataByIndexs(i, Coord2indx.getDataByIndexs(r, c - 1), -1)
        if (if_strict_interior[i][3])
          A.setDataByIndexs(i, Coord2indx.getDataByIndexs(r, c + 1), -1)
      }

      for (let i = 0; i < N; i++) {
        let flag = if_strict_interior[i].map(b => !b).map(b => (b ? 1 : 0))

        let t_r = target_maskidx2Corrd[i][0]
        let t_c = target_maskidx2Corrd[i][1]

        let r = source_maskidx2Corrd[i][0]
        let c = source_maskidx2Corrd[i][1]

        for (let _c = 0; _c < 3; _c++) {
          let sVal =
            4 * cat_source_image.getDataByIndexs(r, c)[_c] -
            cat_source_image.getDataByIndexs(r - 1, c)[_c] -
            cat_source_image.getDataByIndexs(r + 1, c)[_c] -
            cat_source_image.getDataByIndexs(r, c - 1)[_c] -
            cat_source_image.getDataByIndexs(r, c + 1)[_c]
          b.setDataByIndexs(i, _c, sVal)

          let tVal =
            b.getDataByIndexs(i, _c) +
            flag[0] * mona_target_image.getDataByIndexs(t_r - 1, t_c)[_c] +
            flag[1] * mona_target_image.getDataByIndexs(t_r + 1, t_c)[_c] +
            flag[2] * mona_target_image.getDataByIndexs(t_r, t_c - 1)[_c] +
            flag[3] * mona_target_image.getDataByIndexs(t_r, t_c + 1)[_c]
          b.setDataByIndexs(i, _c, tVal)
        }
      }

      timer.end()
      timer.printElapsedTime()
      console.log('initialized A matrix and b array...')

      timer.start()

      let color_array = new Array<EMathLib.Vector>()
      b.forEachCol(col => {
        color_array.push(new EMathLib.Vector(col.length, col))
      })

      // 85s
      // let R = EMathLib.conjugate_grad(A, color_array[0]);
      // let G = EMathLib.conjugate_grad(A, color_array[1]);
      // let B = EMathLib.conjugate_grad(A, color_array[2]);

      // 1s
      // conver matrix A to sparse matrix
      let A_sp = A.mat2SpMat()

      let R = EMathLib.conjugate_grad_spMatrix(A_sp, color_array[0])
      let G = EMathLib.conjugate_grad_spMatrix(A_sp, color_array[1])
      let B = EMathLib.conjugate_grad_spMatrix(A_sp, color_array[2])

      let synthesis_image = mona_target_image
      for (let i = 0; i < N; i++) {
        let r = target_maskidx2Corrd[i][0]
        let c = target_maskidx2Corrd[i][1]

        let color = [
          clip(R.data()[i], 0, 255),
          clip(G.data()[i], 0, 255),
          clip(B.data()[i], 0, 255)
        ]
        synthesis_image.setDataByIndexs(r, c, color)
      }

      let imgData = context_synthesis.getImageData(0, 0, width, height)
      for (let j = 0; j < height; j++) {
        for (let i = 0; i < width; i++) {
          let index = (j * width + i) * 4
          let Val_r = synthesis_image.R().getDataByIndexs(j, i)
          let Val_g = synthesis_image.G().getDataByIndexs(j, i)
          let Val_b = synthesis_image.B().getDataByIndexs(j, i)

          imgData.data[index + 0] = Val_r
          imgData.data[index + 1] = Val_g
          imgData.data[index + 2] = Val_b
          imgData.data[index + 3] = 255
        }
      }
      context_synthesis.putImageData(imgData, 0, 0)

      timer.end()
      timer.printElapsedTime()
      console.log('poisson image editing finished...')
      timer.printTotalTime()

      // reset
      context_target.drawImage(mona_target, 0, 0)
      context_source.drawImage(cat_source, 0, 0)
      context_preview.drawImage(mona_target, 0, 0)

      context_target_mask.clearRect(0, 0, width, height)
      context_target_mask.fillStyle = 'black'
      context_target_mask.fillRect(0, 0, width, height)

      context_source_mask.clearRect(0, 0, width, height)
      context_source_mask.fillStyle = 'black'
      context_source_mask.fillRect(0, 0, width, height)
    })
  }
)
