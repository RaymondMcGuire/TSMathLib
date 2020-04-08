/*
 * @Author: Xu.Wang
 * @Date: 2020-04-08 17:20:55
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-04-08 18:05:47
 */
export class Frame {
  private _index: number
  private _timeIntervalInSeconds: number

  constructor(index: number = 0, timeIntervalInSeconds = 1.0 / 60.0) {
    this._index = index
    this._timeIntervalInSeconds = timeIntervalInSeconds
  }

  timeInSeconds(): number {
    return this._index * this._timeIntervalInSeconds
  }

  index(): number {
    return this._index
  }

  setIndex(index: number) {
    this._index = index
  }

  timeIntervalInSeconds(): number {
    return this._timeIntervalInSeconds
  }

  setTimeIntervalInSeconds(time: number) {
    this._timeIntervalInSeconds = time
  }

  advance() {
    this._index += 1
  }

  advanceByDelta(delta: number) {
    this._index += delta
  }
}

export abstract class Animation {
  protected _currentTime: number
  protected _currentFrame: Frame

  constructor() {
    this._currentTime = 0
    this._currentFrame = new Frame()
    this._currentFrame.setIndex(-1)
  }

  abstract onUpdate(frame: Frame): void

  currentFrame() {
    return this._currentFrame
  }

  setCurrentFrame(frame: Frame) {
    this._currentFrame = frame
  }

  update(frame: Frame): void {
    this.onUpdate(frame)
  }

  currentTimeInSeconds() {
    return this._currentTime
  }

  advanceSingleFrame() {
    let newFrame = new Frame(
      this._currentFrame.index(),
      this._currentFrame.timeIntervalInSeconds()
    )
    newFrame.advance()
    this.update(newFrame)
  }
}
