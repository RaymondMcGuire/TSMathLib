import { Matrix } from "./matrix";
/* =========================================================================
 *
 *  gaussian_elimination.ts
 *  
 *  
 *  Parameters
 *  ----------
 *  N: coefficients for linear system equations
 *  
 *  Return
 *  ----------
 *  
 * ========================================================================= */
export function gaussian_elimination_solve(N : Matrix) {

	var n = N.rows();

	for( var k = 0; k < n-1; k++ ){

		var p = k;
		var max = Math.abs( N.getDataByIndexs(k,k));

		for( var i = k + 1; i < n; i++){  
			if( Math.abs( N.getDataByIndexs(i,k) ) > max){
				p = i;
				max = Math.abs(N.getDataByIndexs(i,k) );
			}
		}
		if( p != k ){
			for(var i = k; i <= n; i++){
				var tmp = N.getDataByIndexs(k,i);
				N.setDataByIndexs(k,i,N.getDataByIndexs(p,i));
				N.setDataByIndexs(p,i,tmp);
			}
		}


		for( var i = k + 1; i < n; i++){
			for( var j = k + 1; j <= n; j++){
                var result = N.getDataByIndexs(i,j) - N.getDataByIndexs(k,j) * N.getDataByIndexs(i,k) / N.getDataByIndexs(k,k);
                N.setDataByIndexs(i,j,result);
			}
		}
	}

	var ans = [];

	for( var k = n - 1; k >= 0; k--){
		for( var j = k + 1; j < n; j++){
            var result = N.getDataByIndexs(k,n) - N.getDataByIndexs(k,j) * ans[j];
			N.setDataByIndexs(k,n,result);
		}
		ans[k] = N.getDataByIndexs(k,n) / N.getDataByIndexs(k,k);
	}

	return ans;
}