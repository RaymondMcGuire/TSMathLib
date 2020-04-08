/*
 * @Author: Xu.Wang
 * @Date: 2020-04-08 17:20:52
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-04-08 23:19:36
 */
import { Frame, Animation } from '../ip/animation'
import { TS_EPSILON } from '../math'

export abstract class PhysicsAnimation extends Animation {
  private _isUsingSubTimeSteps: boolean
  private _isUsingFixedSubTimeSteps: boolean
  private _numberOfFixedSubTimeSteps: number

  constructor(
    isUsingSubTimeSteps: boolean = false,
    isUsingFixedSubTimeSteps: boolean = false,
    numberOfFixedSubTimeSteps: number = 1
  ) {
    super()

    this._isUsingSubTimeSteps = isUsingSubTimeSteps
    this._isUsingFixedSubTimeSteps = isUsingFixedSubTimeSteps
    this._numberOfFixedSubTimeSteps = numberOfFixedSubTimeSteps
  }

  // Getter Method

  isUsingSubTimeSteps() {
    return this._isUsingSubTimeSteps
  }

  isUsingFixedSubTimeSteps() {
    return this._isUsingFixedSubTimeSteps
  }

  numberOfFixedSubTimeSteps() {
    return this._numberOfFixedSubTimeSteps
  }

  numberOfSubTimeSteps(_: number) {
    return this._numberOfFixedSubTimeSteps
  }

  // Setter Method
  setIsUsingFixedSubTimeSteps(isUsing: boolean) {
    this._isUsingFixedSubTimeSteps = isUsing
  }

  setNumberOfFixedSubTimeSteps(numberOfSteps: number) {
    this._numberOfFixedSubTimeSteps = numberOfSteps
  }

  setIsUsingSubTimeSteps(isUsing: boolean) {
    this._isUsingSubTimeSteps = isUsing
  }

  // Abstract Method

  abstract onInitialize(): void

  abstract onAdvanceTimeStep(timeIntervalInSeconds: number): void

  // Method
  initialize(): void {
    this.onInitialize()
  }

  advanceTimeStep(timeIntervalInSeconds: number) {
    this._currentTime = this._currentFrame.timeInSeconds()
    if (this._isUsingSubTimeSteps) {
      // Using fixed sub-timesteps
      if (this._isUsingFixedSubTimeSteps) {
        let actualTimeInterval =
          timeIntervalInSeconds / this._numberOfFixedSubTimeSteps

        for (let i = 0; i < this._numberOfFixedSubTimeSteps; i++) {
          this.onAdvanceTimeStep(actualTimeInterval)

          this._currentTime += actualTimeInterval
        }
      } else {
        // Using adaptive sub-timesteps
        let remainingTime = timeIntervalInSeconds
        while (remainingTime > TS_EPSILON) {
          let numSteps = this.numberOfSubTimeSteps(remainingTime)
          let actualTimeInterval = remainingTime / numSteps

          this.onAdvanceTimeStep(actualTimeInterval)

          remainingTime -= actualTimeInterval
          this._currentTime += actualTimeInterval
        }
      }
    } else {
      this.onAdvanceTimeStep(timeIntervalInSeconds)
      this._currentTime += timeIntervalInSeconds
    }
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

export class PhysicsAnimationTest extends PhysicsAnimation {
  constructor(
    isUsingSubTimeSteps: boolean = false,
    isUsingFixedSubTimeSteps: boolean = false,
    numberOfFixedSubTimeSteps: number = 1
  ) {
    super(
      isUsingSubTimeSteps,
      isUsingFixedSubTimeSteps,
      numberOfFixedSubTimeSteps
    )
  }

  onInitialize() {
    // console.log('init physics animation')
  }

  onAdvanceTimeStep(_: number) {
    // console.log('advance time timeInterval:', timeIntervalInSeconds)
  }
}
