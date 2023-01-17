export default /*补间动画状态*/
class AnimationState {
	static forward = Symbol.for("forward");
	static stop = Symbol.for("stop");
	static reserve = Symbol.for("reserve")
	static finished = Symbol.for("finished");
}
