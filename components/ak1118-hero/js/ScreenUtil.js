export default class ScreenUtil {
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