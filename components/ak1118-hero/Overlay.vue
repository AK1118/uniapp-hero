<template>
	<canvas canvas-id="ak-overlay-canvas" id="ak-overlay-canvas" :style="test?testStyle:''"></canvas>
</template>

<script>
	import HeroManager from "./js/index.js";
	const heroManager = HeroManager.getInstance();
	export default{
		props:{
			test:{
				type:Boolean,
				default:false,
				ces:null,
			}
		},
		mounted() {
			
		},
		methods:{
			/*需要用户在onShow内调用该函数*/
			display(){
				if(heroManager.canvasMountedCallback!=null){
					heroManager.canvasMountedCallback();
				}
			}
		},
		data(){
			return {
				testStyle:"background-color: rgba(36,192,0,.3);",
			};
		},
	}
</script>

<style scoped>
	#ak-overlay-canvas{
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0rpx;
		left: 0rpx;
		/* background-color: rgba(36,192,0,.3); */
		pointer-events: none;
		z-index: 999999;
	}
</style>