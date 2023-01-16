<template>
	<view>
		<view ref="hero" id="hero" :style="{opacity:displayView?1:0}">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	import HeroManager, {
		Hero
	} from "./js/index.js";
	const heroManager = HeroManager.getInstance();
	let isExis = -1;
	heroManager.setDuration(500);
	export default {
		components: {

		},
		props: {
			tag: {
				type: [String, Number],
				default: '',
			},
			herokey: {
				type: [String, Number],
				default: '',
			},
			radius: {
				type: [Number],
				default: 0,
			},
			imgUrl: {
				type: [String],
				default: '',
			}
		},
		created() {
			/*查找hero是否存在，如果不存在返回-1，存在返回hero对象*/
			isExis = heroManager.findHeroByKeyAndTag(this.herokey, this.tag);
			if (isExis == -1) {
				/*查找里面是否有自己对象，如果有就共享image数据，不请求,还有查询是否存在，因为是初始化，所以在==-1时候执行 */
				const otherHero = heroManager._findHeroByKey(this.tag);
				if (otherHero) {
					this.img = otherHero.image;
					return;
				}
				/*如果没有和自己配对的就请求下载图片*/
				if (this.imgUrl)
					this.init(
						this.imgUrl,
						).then(res => {
						this.initHero();
					});
			} else {
				this.img = isExis.image;
			}
		},
		mounted() {
			if (this.img) this.initHero();
		},
		data() {
			return {
				displayView: true,
				img: null,
				isExis: null,
				displayCanvas: false,
			};
		},
		methods: {
			async init(imageUrl) {
				const imgData = await this.fetchImage(imageUrl);
				this.img = imgData;
				return imgData;
			},
			async initHero() {
				if (isExis != -1) {
					isExis.vm = this;
					heroManager.run(isExis, {
						onFinished: () => {
							this.displayView = true;
							this.displayCanvas = false;
						}
					});
					return;
				} else {
					const hero = await heroManager.addHero({
						tag: this.tag,
						key: this.herokey,
						vm: this,
						radius: this.radius,
						onFinished: () => {
							this.displayView = true;
							this.displayCanvas = false;
						},
					});
					hero.image = this.img;
					heroManager.run(hero, {
						onFinished: () => {
							this.displayView = true;
							this.displayCanvas = false;
						}
					});
				}
			},
			fetchImage(url) {
				return new Promise((resolve, reject) => {
					uni.downloadFile({
						url,
						success(res) {
							resolve(res.tempFilePath);
						}
					});
				});
			}
		},
	}
</script>

<style scoped>

</style>
