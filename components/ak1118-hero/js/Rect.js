  /*矩形类*/
export default class Rect {
 	width;
 	height;
 	x;
 	y;
 	constructor({
 		x,
 		y,
 		width,
 		height
 	}) {
 		this.width = width || 0;
 		this.height = height || 0;
 		this.x = x || 0;
 		this.y = y || 0;
 	}
 	toJson() {
 		return {
 			width: this.width,
 			height: this.height,
 			x: this.x,
 			y: this.y,
 		}
 	}
 	copy() {
 		return new RectFactory().getRect(this.toJson())
 	}
 }