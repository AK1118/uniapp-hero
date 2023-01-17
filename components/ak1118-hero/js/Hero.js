export default class Hero {
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
