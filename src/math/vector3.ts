/*
 * @Author: Xu.Wang
 * @Date: 2020-04-05 20:58:08
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-04-07 17:39:36
 */
import { Vector } from "./vector";
import { Point3 } from "./point3";

export class Vector3 extends Vector {
	constructor(e1: number = 0, e2: number = 0, e3: number = 0) {
		super(3, new Array<number>(e1, e2, e3));
	}

	x() {
		return this.data()[0];
	}
	y() {
		return this.data()[1];
	}
	z() {
		return this.data()[2];
	}

	r() {
		return this.data()[0];
	}
	g() {
		return this.data()[1];
	}
	b() {
		return this.data()[2];
	}

	iset(v3: Vector3) {
		this.data()[0] = v3.r();
		this.data()[1] = v3.g();
		this.data()[2] = v3.b();
	}

	set(v3: Vector3): boolean {
		return super.set(new Vector(3, v3.data()));
	}

	add(v3: any): Vector3 {
		let addv = super.add(v3);
		return new Vector3(addv.data()[0], addv.data()[1], addv.data()[2]);
	}

	sub(v3: any): Vector3 {
		let subv = super.sub(v3);
		return new Vector3(subv.data()[0], subv.data()[1], subv.data()[2]);
	}

	mul(v3: any): Vector3 {
		let mulv = super.mul(v3);
		return new Vector3(mulv.data()[0], mulv.data()[1], mulv.data()[2]);
	}

	div(v3: any): Vector3 {
		let divv = super.div(v3);
		return new Vector3(divv.data()[0], divv.data()[1], divv.data()[2]);
	}

	rsub(v3: any): Vector3 {
		let rsubv = super.rsub(v3);
		return new Vector3(rsubv.data()[0], rsubv.data()[1], rsubv.data()[2]);
	}

	rdiv(v3: any): Vector3 {
		let rdivv = super.rdiv(v3);
		return new Vector3(rdivv.data()[0], rdivv.data()[1], rdivv.data()[2]);
	}

	dot(v3: Vector3): number {
		return super.dot(new Vector(3, v3.data()));
	}

	cross(v3: Vector3): Vector3 {
		let nv = new Vector(3, this.data());
		return new Vector3(
			nv.data()[1] * v3.data()[2] - nv.data()[2] * v3.data()[1],
			nv.data()[2] * v3.data()[0] - nv.data()[0] * v3.data()[2],
			nv.data()[0] * v3.data()[1] - nv.data()[1] * v3.data()[0]
		);
	}

	normalize() {
		super.normalize();
	}

	normalized(): Vector3 {
		let norm = super.normalized();
		return new Vector3(norm.data()[0], norm.data()[1], norm.data()[2]);
	}

	gamma2(): Vector3 {
		let tv = new Vector(3, this.data());
		return new Vector3(
			Math.sqrt(tv.at(0)),
			Math.sqrt(tv.at(1)),
			Math.sqrt(tv.at(2))
		);
	}

	tangential(): [Vector3, Vector3] {
		let a = (
			Math.abs(this.y()) > 0 || Math.abs(this.z()) > 0
				? new Vector3(1, 0, 0)
				: new Vector3(0, 1, 0)
		)
			.cross(this)
			.normalized();

		let b = this.cross(a);
		return [a, b];
	}

	toPoint() {
		return new Point3(this.x(), this.y(), this.z());
	}

	clone() {
		return new Vector3(this.x(), this.y(), this.z());
	}

	debug(): string {
		return "[" + this.x() + "," + this.y() + "," + this.z() + "]";
	}
}
