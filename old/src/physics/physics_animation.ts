/*
 * @Author: Xu.Wang
 * @Date: 2020-04-08 17:20:52
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-04-08 23:19:36
 */
import { Frame, Animation } from '../ip/animation'

export abstract class PhysicsAnimation extends Animation {
  constructor() {
    super()
  }

  // Getter Method

  // Setter Method

  // Abstract Method

  abstract onInitialize(): void

  abstract onAdvanceTimeStep(timeIntervalInSeconds: number): void

  // Method
  initialize(): void {
    this.onInitialize()
  }

  advanceTimeStep(timeIntervalInSeconds: number) {
    this._currentTime = this._currentFrame.timeInSeconds()

    this.onAdvanceTimeStep(timeIntervalInSeconds)
    this._currentTime += timeIntervalInSeconds
  }

  onUpdate(frame: Frame) {
    if (frame.index() > this._currentFrame.index()) {
      if (this._currentFrame.index() < 0) {
        this.initialize()
      }
      
      let numberOfFrames = frame.index() - this._currentFrame.index()

      for (let i = 0; i < numberOfFrames; i++) {
        this.advanceTimeStep(frame.timeIntervalInSeconds())
      }

      this._currentFrame = frame
    }
  }
}
