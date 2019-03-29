<template>
	<div class="totle-container">
    <div class="swiper-tab">
	  <div :class="{ 'tab-item':isA, 'on':currentTab==0}" data-current="0" @click="swichNav">{{text[0]}}</div>
	  <div :class="{ 'tab-item':isA, 'on':currentTab==1}" data-current="1" @click="swichNav">{{text[1]}}</div>
	  <div :class="{ 'tab-item':isA, 'on':currentTab==2}" data-current="2" @click="swichNav">{{text[2]}}</div>
	  <div :class="{ 'tab-item':isA, 'on':currentTab==3}" data-current="3" @click="swichNav">{{text[3]}}</div>
	  <div :class="{ 'tab-item':isA, 'on':currentTab==4}" data-current="4" @click="swichNav">{{text[4]}}</div>
	</div>
	<swiper :current="currentTab" duration="300" @change="hange" class="swiper-container">
		<!--头条-->
	  	<swiper-item>
	  		<scroll-view scroll-y="true" style="height:1020rpx" @scrolltolower="refresh">
	     		<div class="news-tab" v-for="(item,index) in resultdata" :key="index" @click="goDetail(item)">
	     			<img :src="item.imageUrls[0]" class="img" v-if="item.imageUrls[0]">
	     			<img src="/static/images/test.jpg" class="img" v-else>
	     			<div class="content">
	     				<p class="content-title">{{item.title}}</p>
	     				<p class="content-from">{{item.posterScreenName}}<img src="/static/images/text.png" class="comments">0</p>
	     			</div>
	     		</div>
	     	</scroll-view>
	  </swiper-item>
	  <!--娱乐-->
	   <swiper-item>
		   	<scroll-view scroll-y="true" style="height:1020rpx" @scrolltolower="refresh1">
			   	<div class="news-tab" v-for="(item,index) in resultdata1" :key="index" @click="goDetail(item)">
		 			<img :src="item.imageUrls[0]" class="img" v-if="item.imageUrls[0]">
		 			<img src="/static/images/test.jpg" class="img" v-else>
		 			<div class="content">
		 				<p class="content-title">{{item.title}}</p>
		 				<p class="content-from">{{item.posterScreenName}}<img src="/static/images/text.png" class="comments">0</p>
		 			</div>
			    </div>
		    </scroll-view>
	  </swiper-item>
	  <!--财经-->
	  <swiper-item>
	    <scroll-view scroll-y="true" style="height:1020rpx" @scrolltolower="refresh2">
		   	<div class="news-tab" v-for="(item,index) in resultdata2" :key="index" @click="goDetail(item)"> 
	 			<img :src="item.imageUrls[0]" class="img" v-if="item.imageUrls[0]">
	 			<img src="/static/images/test.jpg" class="img" v-else>
	 			<div class="content">
	 				<p class="content-title">{{item.title}}</p>
	 				<p class="content-from">{{item.posterScreenName}}<img src="/static/images/text.png" class="comments">0</p>
	 			</div>
		    </div>
	    </scroll-view>
	  </swiper-item>
	  <!--军事-->
	  <swiper-item>
	    <scroll-view scroll-y="true" style="height:1020rpx" @scrolltolower="refresh3">
		   	<div class="news-tab" v-for="(item,index) in resultdata3" :key="index" @click="goDetail(item)">
	 			<img :src="item.imageUrls[0]" class="img" v-if="item.imageUrls[0]">
	 			<img src="/static/images/test.jpg" class="img" v-else>
	 			<div class="content">
	 				<p class="content-title">{{item.title}}</p>
	 				<p class="content-from">{{item.posterScreenName}}<img src="/static/images/text.png" class="comments">0</p>
	 			</div>
		    </div>
	    </scroll-view>
	  </swiper-item>
	  <!--体育-->
	  <swiper-item>
	    <scroll-view scroll-y="true" style="height:1020rpx" @scrolltolower="refresh4">
		   	<div class="news-tab" v-for="(item,index) in resultdata4" :key="index" @click="goDetail(item)">
	 			<img :src="item.imageUrls[0]" class="img" v-if="item.imageUrls[0]">
	 			<img src="/static/images/test.jpg" class="img" v-else>
	 			<div class="content">
	 				<p class="content-title">{{item.title}}</p>
	 				<p class="content-from">{{item.posterScreenName}}<img src="/static/images/text.png" class="comments">0</p>
	 			</div>
		    </div>
	    </scroll-view>
	  </swiper-item>
	</swiper>
	<!--显示新闻详情-->
	<!--<div class="news-container">-->
		<!--返回按键-->
		<!--<div class="back-wx">
			
		</div>
	</div>-->
	</div>
</template>

<script>
import {get,showLoading,hideLoading,showToast,showToast2} from '@/util'
import config from '@/config'
export default {
  data () {
    return {
    	currentTab:0,
    	isA:true,
    	winHeight: 0,
    	scroll:true,
    	resultdata:[],
    	resultdata1:[],
    	resultdata2:[],
    	resultdata3:[],
    	resultdata4:[],
    	text:['头条','娱乐','财经','社会','体育'],
    	pageToken:1,
    	pageToken1:1,
    	pageToken2:1,
    	pageToken3:1,
    	pageToken4:1,
    }
  },
  components:{
  },
  created() {
  	
  	//console.log(this.text[this.currentTab]);
  	//页面初始化时加载数据
  	this.getHotList();
  },
  methods: {
  	swichNav: function(e) {
	    
	    var that = this
	    if (this.currentTab === e.target.dataset.current) {
	      return false
	    } else {
	    	this.currentTab = e.target.dataset.current
	    	console.log(this.text[this.currentTab])
	    }
  	},
  	hange(e) {
	    console.log("走这里bindChange")
	    var that = this;
	    var pageNo = e.target.current;
	    if (this.currentTab === pageNo) {
	      return false;
	    } else {
	    	this.currentTab = pageNo;
	      //防止切换页面时重复请求数据，继续使用之前数据
	      if (pageNo == 0) {
	        if (that.resultdata.length > 0) {
	          return;
	        }else {
	        	this.getHotList()
	        	//hideLoading()
	        }
	      } else if (pageNo == 1) {
	        if (that.resultdata1.length > 0) {
	          return;
	        }else{
	        	this.getYuleList()
	        }
	      } else if (pageNo == 2) {
	        if (that.resultdata2.length > 0) {
	          return;
	        }else {
	        	this.getEcList()
	        }
	      } else if (pageNo == 3) {
	        if (that.resultdata3.length > 0) {
	          return;
	        }else {
	        	this.getJunList()
	        }
	      }else if (pageNo == 4) {
	      	if (that.resultdata4.length > 0) {
	      		return;
	      	}else {
	      		this.getPeList();
	      	}
	      }
	    }
  	},
  	async getHotList() {
  		if (this.resultdata.length == 0) {
  			showLoading('加载中')
  		}else {
  			showLoading('加载更多')
  		}
  		if(this.pageToken == -10000){
  			hideLoading()
  			showToast('无更多数据')
  		}else {
		  	const list = await get(config.newsUrl,{
		  		kw:'热门',
		  		apikey:config.apikey,
		  		pageToken:this.pageToken
		  	});
		  	//console.log(list.data);
		  	if(list.hasNext == true){
		  		this.pageToken = list.pageToken 
		  	}else {
		  		this.pageToken = -10000
		  	}
		  	if(this.resultdata.length>0){
				showToast2('加载成功')
		  	}
		  	this.resultdata = this.resultdata.concat(list.data)
		  	console.log(this.pageToken);
		  	//console.log(list.pageToken);
  		}
	  	//console.log(this.resultdata)
  	},
  	async getYuleList() {
  		if (this.resultdata1.length == 0) {
  			showLoading('加载中')
  		}else {
  			showLoading('加载更多')
  		}
  		if(this.pageToken1 == -10000){
  			hideLoading()
  			showToast('无更多数据')
  		}else {
		  	const list = await get(config.newsUrl,{
		  		kw:'娱乐',
		  		apikey:config.apikey,
		  		pageToken:this.pageToken1
		  	});
		  	//console.log(list.data);
		  	if(list.hasNext == true){
		  		this.pageToken1 = list.pageToken 
		  	}else {
		  		this.pageToken1 = -10000;
		  	}
		  	if(this.resultdata1.length>0){
				showToast2('加载成功')
		  	}
		  	this.resultdata1 = this.resultdata1.concat(list.data)
		  	console.log(this.pageToken1);
		  	//console.log(list.pageToken);
  		}
  	},
  	async getPeList() {
		if (this.resultdata4.length == 0) {
  			showLoading('加载中')
  		}else {
  			showLoading('加载更多')
  		}
  		if(this.pageToken4 == -10000){
  			showToast('无更多数据')
  		}else {
		  	const list = await get(config.newsUrl,{
		  		kw:'体育',
		  		apikey:config.apikey,
		  		pageToken:this.pageToken4
		  	});
		  	//console.log(list.data);
		  	if(list.hasNext == true){
		  		this.pageToken4 = list.pageToken 
		  	}else {
		  		this.pageToken4 = -10000;
		  	}
		  	if(this.resultdata4.length>0){
				showToast2('加载成功')
		  	}
		  	this.resultdata4 = this.resultdata4.concat(list.data)
		  	//console.log(this.pageToken);
		  	//console.log(list.pageToken);
  		}
  	},
  	async getEcList() {
		if (this.resultdata2.length == 0) {
  			showLoading('加载中')
  		}else {
  			showLoading('加载更多')
  		}
  		if(this.pageToken2 == -10000){
  			showToast('无更多数据')
  		}else {
		  	const list = await get(config.newsUrl,{
		  		kw:'经济',
		  		apikey:config.apikey,
		  		pageToken:this.pageToken2
		  	});
		  	//console.log(list.data);
		  	if(list.hasNext == true){
		  		this.pageToken2 = list.pageToken 
		  	}else {
		  		this.pageToken2 = -10000;
		  	}
		  	if(this.resultdata2.length>0){
				showToast2('加载成功')
		  	}
		  	this.resultdata2 = this.resultdata2.concat(list.data)
		  	//console.log(this.pageToken);
		  	//console.log(list.pageToken);
  		}
  	},
  	async getJunList() {
		if (this.resultdata3.length == 0) {
  			showLoading('加载中')
  		}else {
  			showLoading('加载更多')
  		}
  		if(this.pageToken3 == -10000){
  			showToast('无更多数据')
  		}else {
		  	const list = await get(config.newsUrl,{
		  		kw:'经济',
		  		apikey:config.apikey,
		  		pageToken:this.pageToken3
		  	});
		  	//console.log(list.data);
		  	if(list.hasNext == true){
		  		this.pageToken3 = list.pageToken 
		  	}else {
		  		this.pageToken3 = -10000;
		  	}
		  	if(this.resultdata3.length>0){
				showToast2('加载成功')
		  	}
		  	this.resultdata3 = this.resultdata3.concat(list.data)
		  	//console.log(this.pageToken);
		  	//console.log(list.pageToken);
  		}
  	},
  	refresh() {
  		//console.log('走refresh');
  		if(this.pageToken == -10000){
  			return
  		}
  		this.getHotList()
  	},
  	refresh1() {
  		//showLoading()
  		//console.log('refresh');
  		if(this.pageToken1 == -10000){
  			return
  		}
  		this.getYuleList()
  	},
  	refresh2() {
  		//showLoading()
  		//console.log('refresh');
  		if(this.pageToken2 == -10000){
  			return
  		}
  		this.getEcList()
  	},
  	refresh3() {
  		//showLoading()
  		//console.log('refresh');
  		if(this.pageToken3 == -10000){
  			return
  		}
  		this.getJunList()
  	},
  	refresh4() {
  		//showLoading()
  		//console.log('refresh');
  		if(this.pageToken4 == -10000){
  			return
  		}  		
  		this.getPeList(this.pageToken4)
  	},
  	goDetail(item) {
  		console.log(item.id)
		wx.navigateTo({
		      url: '../detail/main?newid=' + item.id,
		      success: function(res) {
		        // success
		        console.log("跳转成功")
		      },
		      fail: function() {
		        // fail
		        console.log("跳转失败")
		      },
		      complete: function() {
		        // complete
		        console.log("跳转行为结束，未知成功失败")
		      }
	  	})
	},
  },
  	/*created () {

	    let res = wx.getSystemInfoSync();
	    let boxHeight = res.windowHeight - 50;
	    this.styles.height = boxHeight;
	    console.log(boxHeight);
	}*/
}
</script>

<style scoped>
.totle-container {
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
}
.main-page {
  display: flex;
  flex-direction: column;
}

.listview {
  /* background: #f5d; */
  /* padding-top: 10rpx;
  padding-bottom: 10rpx; */
}

.item {
  width: 100%;
  justify-content: left;
  text-align: left;
  font-size: 15px;
}

.imageall {
  flex-direction: column;
  margin-left: 20rpx;
  margin-right: 20rpx;
}

.flex-wrp {
  display: flex;
}

.split-line {
  height: 10px;
}
.split-line-text {
  background: #ebebeb ;
  height: 1px;
  margin-top: 7px;
}
.swiper-tab {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 40px;
  text-align: center;
  line-height: 30px;
  /* border-bottom: 0.5px solid #999; */
  display: flex;
  justify-content: center;
  background: #f9f9f9;
}
/* 正常的颜色 */
.tab-item {
  flex: 1;
  font-size: 30rpx;
  display: inline-block;
  color: #000;
  padding: 10rpx;
}
/* 选中的颜色 */
.on {
  color: red;
  border-bottom: 2px solid red;
}
.container {
  height: 100%;
  padding-top:10rpx;
  padding-left: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: .5px solid grey;
} 
.news-tab {
	height: 200rpx;
	width: 100%;
	display: flex;
}
.img {
	height:180rpx;
	width: 200rpx;
	margin:10rpx;
}
.content {
	flex: 1;
	position: relative;
}
.content-title {
	margin-left: 20rpx;
	margin-top: 10rpx;
	margin-right: 20rpx;
	color: #000;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
	font-family:Microsoft YaHe;
	font-size: 35rpx;
	letter-spacing: 2rpx;
}

.content-from {
	margin-left: 20rpx;
	color: #666;
	width: auto;
	font-size: 25rpx;
	position: absolute;
	bottom: 0;
}
.comments {
	height: 30rpx;
	width: 30rpx;
	margin-left: 20rpx;
	margin-right: 15rpx;
}
.swiper-container {
	height: 100%;
	width: 100%;
	margin-top: 40px;
}
.swiper2 {
	flex: 1;
}
::-webkit-scrollbar {
    width: 0;
    height: 0;
    color: transparent;
}
.news-container {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 100;
	background-color: rgba(0,0,0,0.8);
}
.back-wx {
	height: 20px;
	width: 100%;
	background-color: pink;
}
.webview {
	height: 200px;
	width: 100%;
}
</style>
