import ScreenUtil from "../js/ScreenUtil.js";
import Rect from "../js/Rect.js";
import RadiusRect from "../js/RadiusRect.js";
import RectFactory from "../js/RectFactory.js";
import AnimationState from "../js/AnimationState.js";
import RectTween from "../js/RectTween.js";
import Hero from "../js/Hero.js";
import ViewCanvas from "../js/ViewCanvas.js";
import Curves from "./Curves.js";

class HeroConfig {
	static curve = Curves.easeIn;
	static duration=500;
}

class HeroManager {
	heroList = [];
	newFromHero = null;
	newToHero = null;
	viewCanvas;
	_duration=HeroConfig.duration;
	tween;
	canvasMountedCallback = null;
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
		if (typeof(uni) != "undefined") {
			/*uniapp路由返回拦截*/
			uni.addInterceptor('navigateBack', {
				/*!!!在新页面重新渲染之前调用的该函数*/
				success: (e) => {
					/*与Overlay组件交互代码*/
					new Promise((resolve, reject) => {
						if (this.newFromHero != null) {
							this.canvasMountedCallback = resolve;
						}
					}).then(() => {
						/*必须要在页面渲染完毕后调用该函数，依赖页面的Canvas*/
						this.onRouteChange(this.newFromHero.tag);
					})
				}
			});
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
			otherHero.hideView();
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
			curve: HeroConfig.curve,
		});

		this.tween.Listener((rect) => {
			this.viewCanvas.update(rect, fromHero.image);
			if (this.tween.animationState == AnimationState.finished) {
				toHero.showView();
				//this.viewCanvas.clean();
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
