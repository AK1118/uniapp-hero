import RadiusRect from "../js/RadiusRect.js";
import Rect from "../js/Rect.js";
import AnimationState from "../js/AnimationState.js";
import Curves from "../js/Curves.js";
import MathUtils from "../js/MathUtils.js";

export default /*补间动画类*/
class RectTween {
	begin;
	end;
	duration;
	tweenRect;
	t = 0;
	startTime = null;
	callback;
	animationState;
	curve;
	constructor({
		begin,
		end,
		duration,
		rect,
		curve,
	}) {
		this.begin = begin;
		this.end = end;
		this.duration = duration || 300;
		this.tweenRect = rect;
		this.curve=curve;
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
		const t =this.curve.transformInternal(this.t)// Curves.bezier(0, .5, 1, this.t);
		this.tweenRect.width = MathUtils.lerp(this.begin.width, this.end.width, t);
		this.tweenRect.height = MathUtils.lerp(this.begin.height, this.end.height, t);
		this.tweenRect.x = Curves.bezier(this.begin.x, this.end.x, this.end.x, t) - (this
			.tweenRect.width >>
			1) >> 0;
		this.tweenRect.y = ~~Curves.bezier(this.begin.y, this.end.y, this.end.y, t) - (this.tweenRect.height >>
			1) >> 0;
		if (this.begin.constructor.name == "RadiusRect" && this.end.constructor.name == "RadiusRect" && this
			.tweenRect.constructor.name == "RadiusRect") {
			this.tweenRect.radius = MathUtils.relu((MathUtils.lerp(this.begin.radius || 0, this.end.radius || 0,
				t) >> 0));
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
