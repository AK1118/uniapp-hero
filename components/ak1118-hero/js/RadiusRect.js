import Rect from "../js/Rect.js";
import RectFactory from "../js/RectFactory.js";
export default class RadiusRect extends Rect {
	radius = 0;
	constructor(args, radius) {
		super(args);
		this.radius = radius || 0;
	}
	copy() {
		return new RectFactory().getRadiusRect(this.toJson(), this.radius)
	}
}
