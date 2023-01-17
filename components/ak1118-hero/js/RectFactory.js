import Rect from "../js/Rect.js";
import RadiusRect from "../js/RadiusRect.js";
export default class RectFactory {
	getRect(args) {
		return new Rect(args)
	}
	getRadiusRect(args, radius) {
		return new RadiusRect(args, radius);
	}
}
