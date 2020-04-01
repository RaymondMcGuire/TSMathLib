/*
 * @Author: Xu.Wang
 * @Date: 2020-03-31 17:29:48
 * @Last Modified by:   Xu.Wang
 * @Last Modified time: 2020-03-31 17:29:48
 */

export interface MatrixIndex {
  (i: number, j: number): void
}
export interface MatrixData {
  (data: number): void
}
export interface MatrixSplit {
  (s: Array<number>): void
}

export interface SparseMatrixData {
  (data: [number, number, number]): void
}

export interface VectorData {
  (data: number): void
}
