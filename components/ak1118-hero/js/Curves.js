class Cubic {
	_cubicErrorBound = 0.001;
	constructor(a, b, c, d) {
		this.a = a;
		this.b = b;
		this.c = c;
		this.d = d;
	}
	_evaluateCubic(a, b, m) {
		return 3 * a * (1 - m) * (1 - m) * m +
			3 * b * (1 - m) * m * m +
			m * m * m;
	}
	transformInternal(t) {
		let start = 0.0;
		let end = 1.0;
		let i = 0;
		while (i++ < 1000) {
			let midpoint = (start + end) * .5;
			let estimate = this._evaluateCubic(this.a, this.c, midpoint);
			if (Math.abs((t - estimate)) < this._cubicErrorBound)
				return this._evaluateCubic(this.b, this.d, midpoint);
			if (estimate < t)
				start = midpoint;
			else
				end = midpoint;
		}
	}
}

export default class Curves {
	static ease = new Cubic(0.25, 0.1, 0.25, 1.0);
	static easeIn = new Cubic(0.42, 0.0, 1.0, 1.0);
	static fastLinearToSlowEaseIn = new Cubic(0.18, 1.0, 0.04, 1.0);
	static easeInToLinear = new Cubic(0.67, 0.03, 0.65, 0.09);
	static easeInSine = new Cubic(0.47, 0.0, 0.745, 0.715);
	static easeInQuad =new Cubic(0.55, 0.085, 0.68, 0.53);
	static easeOut =new Cubic(0.0, 0.0, 0.58, 1.0);
	static easeInBack =new Cubic(0.6, -0.28, 0.735, 0.045);
	static bezier(p0, p1, p2, t) {
		const k = 1 - t;
		return k * k * p0 + 2 * k * t * p1 + t * t * p2;
	}
}
