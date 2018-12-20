/// <reference path="./matrix.ts" />
/// <reference path="./vector.ts" />
/* =========================================================================
 *
 *  conjugate_grad.ts
 *  Solve a linear equation Ax = b with conjugate gradient method.
 *  
 *  Parameters
 *  ----------
 *  A: 2d positive semi-definite (symmetric) matrix
 *  b: 1d array
 *  x: 1d array of initial point
 *  
 *  Return
 *  ----------
 *  1d array x such that Ax = b
 * ========================================================================= */
module EMathLib {
    export function conjugate_grad(A: Matrix, b: Vector, x?: Vector) {
        //TODO:judge A is a "positive semi-definite matrix", tip:using "Cholesky decomposition"

        let n = b.size();
        if (x == undefined) {
            x = new Vector(b.size());
            x.setOne();
        }

        let r = A.mulVec(x).sub(b);
        let p = r.mul(-1);
        let r_k_norm = r.dot(r);

        for (var _i = 0; _i < 2 * n; _i++) {
            let Ap = A.mulVec(p);
            let alpha = r_k_norm / p.dot(Ap);
            x.iadd(p.mul(alpha));
            r.iadd(Ap.mul(alpha));
            let r_kplus1_norm = r.dot(r);
            let beta = r_kplus1_norm / r_k_norm;
            r_k_norm = r_kplus1_norm;
            if (r_kplus1_norm < 1e-5) {
                //console.log('compute finished!');
                break;
            }
            p = p.mul(beta).sub(r);
        }
        return x;
    }


    export function conjugate_grad_spMatrix(A: SparseMatrix, b: Vector, x?: Vector) {
        //TODO:judge A is a "positive semi-definite matrix", tip:using "Cholesky decomposition"

        let n = b.size();
        if (x == undefined) {
            x = new Vector(b.size());
            x.setOne();
        }

        let r = A.mulVec(x).sub(b);
        let p = r.mul(-1);
        let r_k_norm = r.dot(r);

        for (var _i = 0; _i < 2 * n; _i++) {
            let Ap = A.mulVec(p);
            let alpha = r_k_norm / p.dot(Ap);
            x.iadd(p.mul(alpha));
            r.iadd(Ap.mul(alpha));
            let r_kplus1_norm = r.dot(r);
            let beta = r_kplus1_norm / r_k_norm;
            r_k_norm = r_kplus1_norm;
            if (r_kplus1_norm < 1e-5) {
                //console.log('compute finished!');
                break;
            }
            p = p.mul(beta).sub(r);
        }
        return x;
    }

}
