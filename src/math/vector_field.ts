import { Vector3 } from "./vector3";

export abstract class VectorField {
	abstract sample(pos: Vector3): Vector3;
}

export class ConstantVectorField extends VectorField {
	_val: Vector3;
	constructor(val: Vector3) {
		super();
		this._val = val;
	}

	sample(_: Vector3) {
		return this._val;
	}
}
