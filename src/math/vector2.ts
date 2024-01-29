/*
 * @Author: Xu.Wang
 * @Date: 2020-04-05 20:58:19
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-04-05 23:42:19
 */

import { Vector } from "./vector";

export class Vector2 extends Vector {
	constructor(e1: number, e2: number) {
		super(2, new Array<number>(e1, e2));
	}

	x() {
		return this.data()[0];
	}
	y() {
		return this.data()[1];
	}

	iset(v2: Vector2) {
		this.data()[0] = v2.x();
		this.data()[1] = v2.y();
	}

	set(v2: Vector2): boolean {
		return super.set(new Vector(3, v2.data()));
	}

	add(v2: any): Vector2 {
		let addv = super.add(v2);
		return new Vector2(addv.data()[0], addv.data()[1]);
	}

	sub(v2: any): Vector2 {
		let subv = super.sub(v2);
		return new Vector2(subv.data()[0], subv.data()[1]);
	}

	mul(v2: any): Vector2 {
		let mulv = super.mul(v2);
		return new Vector2(mulv.data()[0], mulv.data()[1]);
	}

	div(v2: any): Vector2 {
		let divv = super.div(v2);
		return new Vector2(divv.data()[0], divv.data()[1]);
	}

	rdiv(v2: any): Vector2 {
		let divv = super.rdiv(v2);
		return new Vector2(divv.data()[0], divv.data()[1]);
	}

	dot(v2: Vector2): number {
		return super.dot(new Vector(2, v2.data()));
	}

	cross(v2: Vector2): number {
		return this.x() * v2.y() - this.y() * v2.x();
	}

	normalize() {
		super.normalize();
	}

	normalized(): Vector2 {
		let norm = super.normalized();
		return new Vector2(norm.data()[0], norm.data()[1]);
	}

	tangential(): Vector2 {
		return new Vector2(this.y(), -this.x());
	}
}
