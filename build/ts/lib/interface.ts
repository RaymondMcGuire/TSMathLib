/* =========================================================================
 *
 *  interface.ts
 *  interface for some functions
 * ========================================================================= */
module EMathLib {
    export interface MatrixIndex { (i: number, j: number): void };
    export interface MatrixData { (data: number): void };
    export interface MatrixSplit { (s: Array<number>): void };

    export interface SparseMatrixData { (data: [number, number, number]): void };
}