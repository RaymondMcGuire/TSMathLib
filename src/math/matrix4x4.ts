/*
 * @Author: Xu.Wang
 * @Date: 2020-04-05 21:12:38
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-04-06 01:09:19
 */

import { Matrix } from "./matrix";
import { Vector3 } from ".";

export class Matrix4x4 extends Matrix {
	constructor(params?: Array<number>) {
		if (params === undefined) {
			// set to identity matrix
			params = new Array<number>(
				1,
				0,
				0,
				0,
				0,
				1,
				0,
				0,
				0,
				0,
				1,
				0,
				0,
				0,
				0,
				1
			);
		} else {
			// check size
			if (16 !== params.length) {
				console.log("Matrix4x4 init error: size is not equal to 16");
				return;
			}
		}

		super(4, 4, params);
	}

	setDiagonal(s: number) {
		let _elements = this.data();
		_elements[0] = _elements[5] = _elements[10] = _elements[15] = s;
	}

	setOffDiagonal(s: number) {
		let _elements = this.data();
		_elements[1] =
			_elements[2] =
			_elements[3] =
			_elements[4] =
			_elements[6] =
			_elements[7] =
			_elements[8] =
			_elements[9] =
			_elements[11] =
			_elements[12] =
			_elements[13] =
			_elements[14] =
				s;
	}

	identity(): Matrix4x4 {
		return new Matrix4x4(
			new Array<number>(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
		);
	}

	mulMat(m4: Matrix4x4): Matrix4x4 {
		let _m = super.mulMat(m4);
		return new Matrix4x4(_m.data());
	}

	mulV3(v3: Vector3): Vector3 {
		let _v3 = super.mulVec(v3);
		return new Vector3(_v3.data()[0], _v3.data()[1], _v3.data()[2]);
	}
}
