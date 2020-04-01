/*
 * @Author: Xu.Wang
 * @Date: 2020-03-28 02:04:37
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-04-01 19:46:41
 * @Description: simple math functions
 */

import { Vector3 } from './vector3'

export function absMax(x: number, y: number) {
  return x * x > y * y ? x : y
}

export function absMin(x: number, y: number) {
  return x * x < y * y ? x : y
}

export function muldec(x: number, y: number) {
  return (x * 10 * (y * 10)) / 100
}

export function divdec(x: number, y: number) {
  return (x * 10) / (y * 10) / 100
}

export function swap(x: number, y: number) {
  return [y, x]
}

export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(min, val), max)
}

export function clampV3(val: Vector3, min: Vector3, max: Vector3) {
  return new Vector3(
    clamp(val.x(), min.x(), max.x()),
    clamp(val.y(), min.y(), max.y()),
    clamp(val.z(), min.z(), max.z())
  )
}

export function isSimilar(val1: number, val2: number, epsilon: number) {
  if (Math.abs(val1 - val2) > epsilon) return false

  return true
}
