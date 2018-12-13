/* =========================================================================
 *
 *  interface.ts
 *  interface for some functions
 * ========================================================================= */
module EMathLib{
    export interface MatrixIndex { (i: number, j: number): void };
    export interface MatrixData { (data: number): void };
    export interface MatrixRow { (row: Array<number>): void };
}