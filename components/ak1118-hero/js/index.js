class ScreenUtil {
 	static width = 0;
 	static height = 0;
 	static offsetY = 0;
 	static navBarHeight = 0;
 	static update(offset) {
 		ScreenUtil.offsetY = offset;
 	}
	static setNavBarHeight(height){
		ScreenUtil.navBarHeight=height;
	}
 }
 /*矩形类*/
 class Rect {
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
 class RadiusRect extends Rect {
 	radius = 0;
 	constructor(args, radius) {
 		super(args);
 		this.radius = radius || 0;
 	}
 	copy() {
 		return new RectFactory().getRadiusRect(this.toJson(), this.radius)
 	}
 }
 class RectFactory {
 	getRect(args) {
 		return new Rect(args)
 	}
 	getRadiusRect(args, radius) {
 		return new RadiusRect(args, radius);
 	}
 }
 /*补间动画状态*/
 class AnimationState {
 	static forward = Symbol.for("forward");
 	static stop = Symbol.for("stop");
 	static reserve = Symbol.for("reserve")
 	static finished = Symbol.for("finished");
 }
 /*补间动画类*/
 class RectTween {
 	begin;
 	end;
 	duration;
 	tweenRect;
 	t = 0;
 	startTime = null;
 	callback;
 	animationState;
 	constructor({
 		begin,
 		end,
 		duration,
 		rect,
 	}) {
 		this.begin = begin;
 		this.end = end;
 		this.duration = duration || 300;
 		this.tweenRect = rect;
 		this._init();
 	}
 	_init() {
 		if (this.tweenRect.constructor.name == "RadiusRect")
 			this.tweenRect = new RadiusRect({}, 0);
 		else this.tweenRect = new Rect({});
 	}
 	Listener(callback) {
 		this.callback = callback;
 	}
 	_notify() {
 		const t = Curves.bezier(0, 0.9, 1, this.t);
 		this.tweenRect.width = this.lerp(this.begin.width, this.end.width, t);
 		this.tweenRect.height = this.lerp(this.begin.height, this.end.height, t);
 		this.tweenRect.x =Curves.bezier(this.begin.x, this.end.x, this.end.x, t) - (this
 			.tweenRect.width >>
 			1)>>0;
 		this.tweenRect.y = ~~Curves.bezier(this.begin.y, this.end.y, this.end.y, t) - (this.tweenRect.height >>
 			1)>>0;
 		if (this.begin.constructor.name == "RadiusRect" && this.end.constructor.name == "RadiusRect" && this
 			.tweenRect.constructor.name == "RadiusRect") {
 			this.tweenRect.radius = this.lerp(this.begin.radius||0, this.end.radius||0, t)>>0;
 		}
 		this.callback(this.tweenRect);
 	}
 	forward() {
 		this.animationState = AnimationState.forward;
 		this.startTime = new Date().getTime();
 		this.update();
 	}
 	reserve() {
 		this.animationState = AnimationState.reserve;
 		this.startTime = new Date().getTime();
 		this.update(true)
 	}
 	lerp(min, max, t) {
 		return min + (max - min) * t;
 	}
 	update(reserve) {
 		const animationEngine = requestAnimationFrame || function(fun) {
 			return setTimeout(fun, 1000 / 60)
 		}
 		animationEngine(
 			() => {
 				if (this.animationState == AnimationState.finished) return;
 				const range = ((new Date().getTime() - this.startTime) / this.duration);
 				if (!reserve)
 					this.t = range > 1 ? 1 : range;
 				else
 					this.t = 1 - range < 0 ? 0 : 1 - range;

 				if (this.t < 1.0) {
					this.update(reserve);
					this._notify();
 				}
 				if (this.t == 1) {
 					this.animationState = AnimationState.finished;
 					this._notify();
 				}
 				if (this.t == 0) {
 					this.animationState = AnimationState.finished;
 					this._notify();
 				}
 			}
 		);
 	}
 }

 class Curves {
 	static bezier(p0, p1, p2, t) {
 		const k = 1 - t;
 		return k * k * p0 + 2 * k * t * p1 + t * t * p2;
 	}
 }
 class Hero {
 	//hero成对才有用
 	tag = "";
 	//唯一key
 	key;
 	/*原始大小位置，不会变*/
 	preRect;
 	/*可变大小位置*/
 	rect;
 	/*图片*/
 	image;
 	/*vue实例*/
 	vm;

 	onFinished;
 	constructor({
 		tag,
 		key,
 		vm,
 		onFinished,
 	}) {
 		this.tag = tag;
 		this.key = key;
 		this.vm = vm;
 		this.onFinished = onFinished;
 	}
 	/*Function 回调隐藏*/
 	hideView() {
 		if (this.vm) {
 			this.vm.displayView = false;
 		}
 	}
 	showView() {
 		if (this.vm) {
 			this.vm.displayView = true;
 		}
 	}
 	setRect(rect) {
 		this.preRect = rect;
 		this.rect = this.preRect.copy();
 	}
 	reset() {
 		this.setRect(this.preRect);
 	}
 }
 export {
 	Hero,
 	ScreenUtil,
 }
 class ViewCanvas {
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
 class HeroManager {
 	heroList = []; //new Set();
 	newFromHero = null;
 	newToHero = null;
 	viewCanvas;
 	_duration;
 	tween;
 	rectFactory = new RectFactory();
 	/*单例模式*/
 	static hero = null;
 	static getInstance() {
 		if (HeroManager.hero == null) {
 			HeroManager.hero = new HeroManager();
 		}
 		return HeroManager.hero;
 	}
 	setDuration(duration) {
 		this._duration = duration || 400;
 	}
 	constructor() {
 		this.init();
 		if (typeof(window) != "undefined") {
 			window.onhashchange = () => {
 				if (this.newFromHero != null) this.onRouteChange(this.newFromHero.tag);
 			}
 			return;
 		}
 		if (typeof(wx) != "undefined") {

 		}
 	}
 	init() {
 		if (typeof(uni) != "undefined") {
 			const {
 				screenHeight,
 				screenWidth
 			} = uni.getWindowInfo();
 			ScreenUtil.width = screenWidth;
 			ScreenUtil.height = screenHeight;
 		} else if (typeof(window) != "undefined") {
 			ScreenUtil.width = window.innerWidth;
 			ScreenUtil.height = window.innerHeight;
 		}
 	}
 	/**
 	 * @description 页面切换时
 	 * @param {Object} callback
 	 */
 	onRouteChange(key) {
 		let hero = this._findHeroByKey(key);
 		if (hero) {
 			const otherHero = this._findOtherOne(hero);
 			otherHero.vm.displayCanvas = true;
 			this.viewCanvas.update(otherHero.rect, otherHero.image);
 			this.run(otherHero, {})
 		}
 	}
 	run(_hero, {
 		onFinished
 	}) {
 		this.viewCanvas = new ViewCanvas();
 		const fromHero = this._findOtherOne(_hero);
 		if (!fromHero) return;
 		const toHero = _hero;
 		toHero.hideView();
		
 		fromHero.reset();
 		toHero.reset();

 		const begin = fromHero.rect;
 		const end = toHero.rect;


 		begin.x += begin.width >> 1;
 		begin.y += begin.height >> 1;
 		begin.y += ScreenUtil.navBarHeight;
 		end.x += end.width >> 1;
 		end.y += end.height >> 1;
 		end.y += ScreenUtil.navBarHeight;

 		const windowOffsetY = ScreenUtil.offsetY;

 		if (begin.y > ScreenUtil.height) {
 			begin.y -= windowOffsetY;
 		}

 		if (end.y > ScreenUtil.height) {
 			end.y -= windowOffsetY;
 		}

 		if (this.tween) {
 			/*在上一次动画执行时执行另外一个动画，上一个动画完成*/
 			if (this.tween.animationState != AnimationState.finished) {
				this.newFromHero.showView();
 				this.viewCanvas.clean();
 				if (onFinished) onFinished();
 			}
 		}
		
		/*进入新页面时new一个新的canvas对象*/
		this.newFromHero = fromHero;
		this.newToHero = toHero;
		
 		this.tween = new RectTween({
 			begin: begin,
 			end: end,
 			duration: this._duration,
 			rect: fromHero.rect,
 		});

 		this.tween.Listener((rect) => {
 			this.viewCanvas.update(rect, fromHero.image);
 			if (this.tween.animationState == AnimationState.finished) {
 				toHero.showView();
 				this.viewCanvas.clean();
 				if (onFinished) onFinished();
 				toHero.onFinished();
 			}
 		})

 		this.tween.forward();
 	}
 	/*创建Hero对象*/
 	async addHero(arg) {
 		const findNdx = this.heroList.findIndex(item => {
 			return item.key == arg.key && item.tag == arg.tag;
 		})
 		let _hero;
 		if (findNdx != -1) {
 			_hero = this.heroList[findNdx];
 			_hero.vm = arg.vm;
 			return _hero;
 		} else {
 			_hero = new Hero(arg);
 		}

 		/*获取dom节点的矩形信息*/
 		const rect = await this._getBoundingRect(_hero.vm);
 		if (!rect) return;

 		/*创建虚拟rect*/
 		let vRect;
 		if (typeof(arg.radius) == 'number') {
 			vRect = this.rectFactory.getRadiusRect(rect, arg.radius);
 		} else {
 			vRect = this.rectFactory.getRect(rect);
 		}
 		_hero.setRect(vRect);

 		this.heroList.push(_hero);
 		return _hero;
 	}


 	/**
 	 * @description 寻找另外一个hero
 	 * @param {Object} hero
 	 * 
 	 */
 	_findOtherOne(hero) {
 		let otherHero;
 		this.heroList.forEach(item => {
 			if (item.tag == hero.tag && item.key != hero.key) {
 				otherHero = item;
 			}
 		})
 		return otherHero;
 	}
 	_findHeroByKey(tag) {
 		let otherHero;
 		this.heroList.forEach(item => {
 			if (item.tag == tag) {
 				otherHero = item;
 			}
 		})
 		return otherHero;
 	}
 	findHeroByKeyAndTag(key, tag) {
 		const _heroNdx = this.heroList.findIndex(item => {
 			return item.key == key && item.tag == tag;
 		});
 		if (_heroNdx != -1) return this.heroList[_heroNdx];
 		return _heroNdx;
 	}
 	_getWrapperState() {
 		return getComputedStyle(document.querySelector(".wrapper")).getPropertyValue('display');
 	}
 	_getBoundingRect(vm) {
 		return new Promise((resolve, reject) => {
 			uni.createSelectorQuery().in(vm).select("#hero").boundingClientRect((data) => {
 				data.x = data.left;
 				data.y = data.top;
 				resolve(data);
 			}).exec();
 		})
 	}
 }

 export default HeroManager;
