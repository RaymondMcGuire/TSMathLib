/* =========================================================================
 *
 *  math_utils.ts
 *  simple math functions
 * ========================================================================= */
export module EcognitaMathLib {
    export function absmax(x: number, y: number) {
        return (x * x > y * y) ? x : y;
    }

    export function absmin(x: number, y: number) {
        return (x * x < y * y) ? x : y;
    }
}