# Hero
### 一个能让页面切换更自然的组件
### :heartpulse:效果预览

 <img src="https://new.ivypha.com/static/uploads/2023/1/16//bdc20527f121e7e92672c9c0507cb60b.gif"/>

### 在线预览图片 https://new.ivypha.com/static/uploads/2023/1/16//bdc20527f121e7e92672c9c0507cb60b.gif
## 开始使用
### 1.在页面A引入Hero组件和Overlay组件
      
      /*每个有hero页面必须有overlay组件*/
	  import Overlay from "../../uni_modules/ak1118-hero/components/ak1118-hero/Overlay.vue";
     /*屏幕hero屏幕辅助类*/
	  import {ScreenUtil} from "../../uni_modules/ak1118-hero/components/ak1118-hero/js/index.js";
      /*Hero*/
    import Hero from "../uni_modules/ak1118-hero/components/ak1118-hero/ak1118-hero.vue"
 
### 然后使用它们，这是页面A

     <template>
        <view>
            <Overlay></Overlay>
            <!-- hero必须用一个容器包裹起来，并设置他的配对tag和唯一key,radius是圆角，可选。随后传入图片地址，本地或者网络图片都可以 -->
            <view class="wrapper">
              <Hero  :radius="30" tag="testtag" herokey="testkey" imgUrl="/static/logo.png">
                <image class="hero" @click="toTest" src="/static/logo.png"></image>
              </Hero>
	          </view>
        </view>
    </template>
    
### 这是页面B

      <template>
        <view>
            <Overlay></Overlay>
            <!-- Hero组件内部是你真实的dom,hero会使用它来获取你dom的数据信息，然后复制它并在你页面跳转时重绘 -->
            <view class="wrapper">
              <Hero  :radius="30" tag="testtag" herokey="testkey" imgUrl="/static/logo.png">
                <image class="hero" src="/static/logo.png"></image>
              </Hero>
	          </view>
        </view>
    </template>
    
## 注意事项:boom:
#### 1.每个需要使用Hero组件的页面必须要有<Overlay>组件的存在，它本质上是一个悬浮在最顶层的canvas，为hero提供基础渲染。
#### 2.Hero标签内的组件必须有明确的大小宽度
#### 3.使用Hero组件在滚动页面内需要用 ScreenUtil.update(scrollTop)方法设置当前页面滚动数据
#### 4.使用ScreenUtil.setNavBarHeight(navHeight);方法设置页面导航栏高度


