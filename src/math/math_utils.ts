/*
 * @Author: Xu.Wang
 * @Date: 2020-03-28 02:04:37
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-03-28 02:05:28
 * @Description: simple math functions
 */

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
