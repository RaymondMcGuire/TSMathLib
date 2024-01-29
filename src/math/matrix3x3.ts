/*
 * @Author: Xu.Wang
 * @Date: 2020-04-05 20:24:10
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-04-06 02:12:07
 */
import { Matrix } from "./matrix";
import { Vector3 } from "./vector3";
import { TS_MAX_NUM } from "./math_constants";

export class Matrix3x3 extends Matrix {
	constructor(params?: Array<number>) {
		if (params === undefined) {
			// set to identity matrix
			params = new Array<number>(1, 0, 0, 0, 1, 0, 0, 0, 1);
		} else {
			// check size
			if (9 !== params.length) {
				console.log(
					"Matrix3x3 init error: size is not equal to 9, size is:",
					params.length
				);
				return;
			}
		}

		super(3, 3, params);
	}

	private _identity(): Array<number> {
		return new Array<number>(1, 0, 0, 0, 1, 0, 0, 0, 1);
	}

	identity() {
		return new Matrix3x3(this._identity());
	}

	mulV3(v3: Vector3): Vector3 {
		// check shape
		if (v3.size() !== this.cols()) {
			console.log("vector shape is not right!", v3.size(), this.cols());
			return new Vector3(-TS_MAX_NUM, -TS_MAX_NUM, -TS_MAX_NUM);
		}

		let vec2mat = new Matrix(v3.size(), 1, v3.data());
		let mat = this.mulMat(vec2mat);

		let vec = mat.mat2Vec();

		return new Vector3(vec.data()[0], vec.data()[1], vec.data()[2]);
	}

	// OpenGL Helper
	scaleMatrix(sx: number, sy: number, sz: number) {
		return new Matrix3x3(new Array<number>(sx, 0, 0, 0, sy, 0, 0, 0, sz));
	}

	rotationMatrix(axis: Vector3, rad: number) {
		return new Matrix3x3(
			new Array<number>(
				1 + (1 - Math.cos(rad)) * (axis.x() * axis.x() - 1),
				-axis.z() * Math.sin(rad) + (1 - Math.cos(rad)) * axis.x() * axis.y(),
				axis.y() * Math.sin(rad) + (1 - Math.cos(rad)) * axis.x() * axis.z(),

				axis.z() * Math.sin(rad) + (1 - Math.cos(rad)) * axis.x() * axis.y(),
				1 + (1 - Math.cos(rad)) * (axis.y() * axis.y() - 1),
				-axis.x() * Math.sin(rad) + (1 - Math.cos(rad)) * axis.y() * axis.z(),

				-axis.y() * Math.sin(rad) + (1 - Math.cos(rad)) * axis.x() * axis.z(),
				axis.x() * Math.sin(rad) + (1 - Math.cos(rad)) * axis.y() * axis.z(),
				1 + (1 - Math.cos(rad)) * (axis.z() * axis.z() - 1)
			)
		);
	}
}
