export default class ViewCanvas {
 	_canvas = null;
 	_paint = null;
 	_type;
 	_canvasId = "ak-overlay-canvas";
 	constructor() {
 		if (!this.type) this.type = this.checkPlatfrom();
 		if (this.type == "wx") {

 		} else if (this.type == "h5") {
 			this._canvas = document.querySelector("#" + this._canvasId);
 			this._canvas.width = ScreenUtil.width;
 			this._canvas.height = ScreenUtil.height;
 			this._paint = this._canvas.getCotext("2d");
 		} else if (this.type == "uniapp") {
 			this._paint = uni.createCanvasContext(this._canvasId);
 		}
 		this.init();
 	}
 	getCanvasAndPaint() {
 		return {
 			canvas: this._canvas,
 			_paint: this._paint,
 		}
 	}
 	setCanvasAndPaint({
 		canvas,
 		paint
 	}) {
 		this._canvas = canvas;
 		this._paint = paint;
 		this._init();
 	}
 	init() {
 		this._paint.strokeStyle = "rgba(0,0,0,0)";
 		// <canvas canvas-id="myCanvas" id="myCanvas"></canvas>
 	}
 	checkPlatfrom() {
 		if (typeof(uni) != "undefined") return "uniapp";
 		if (typeof(window) != "undefined") return "h5";
 		if (typeof(wx) != "undefined") return "wx";
 	}
 	clean() {
 		this._paint.draw()
 	}
 	drawRadiusRect(radiusRect) {
 		try {
 			const r = radiusRect;
 			this._paint.moveTo(r.x, r.y + r.radius);
 			this._paint.arcTo(r.x, r.y + r.height, r.x + r.width, r.y + r.height, r.radius);
 			this._paint.arcTo(r.x + r.width, r.y + r.height, r.x + r.width, r.y, r.radius);
 			this._paint.arcTo(r.x + r.width, r.y, r.x, r.y, r.radius);
 			this._paint.arcTo(r.x, r.y, r.x, r.y + r.height, r.radius);
 		} catch (e) {
 			throw Error("报错")
 			//TODO handle the exception
 		}
 	}
 	update(rect, image) {
 		if (!image) {
 			throw Error("图片异常")
 		}
 		//this._paint.fillRect(rect.x,rect.y,rect.width,rect.height);
 		if (rect.constructor.name == "RadiusRect") {
 			this._paint.save();
 			this.drawRadiusRect(rect);
 			this._paint.strokeStyle = "rgba(0,0,0,0)";
 			this._paint.stroke();
 			this._paint.clip()
 		}
 		this._paint.drawImage(image, rect.x, rect.y, rect.width, rect.height);
 		this._paint.restore();
 		this._paint.draw();
 	}
 }