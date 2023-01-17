 export default class MathUtils{
	 static lerp(min, max, t) {
 		return min + (max - min) * t;
 	 }
	 static relu(x){
		 return Math.max(0,x);
	 }
 }