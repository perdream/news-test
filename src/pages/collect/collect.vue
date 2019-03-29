<template>
  <div>
    <div class="video-container" v-for="(item,index) in videoList" :key="index" @click="goToVideo(item)">
    	<div class="video-header">
    		<p class="video-header-text">{{item.title}}</p>
        <p class="video-time-text">{{item.publishDateStr}}<span v-if="item.location">&nbsp&nbsp&nbsp&nbsp {{item.location}}</span></p>
    	</div>
      <div class="video-des" v-if="item.description">{{item.description}}</div>
      <div class="video-content">
         <!--<txv-video vid="y14304897dq" playerid="y14304897dq">
         </txv-video>-->
         <img :src="item.coverUrl" class="cover-img" v-if="item.coverUrl">
         <img src="/static/images/test.jpg" class="cover-img" v-else>
         <img src="/static/images/video_mid.png" class="video-play">
      </div>
    </div>

    <!--测试-->
    <!--<div class="video-container" @click="goToVideo(videoList2.url)">
      <div class="video-header">
        <p class="video-header-text">{{videoList2.title}}</p>
        <p class="video-time-text">{{videoList2.publishDateStr}}<span v-if="videoList2.location">&nbsp&nbsp&nbsp&nbsp {{videoList2.location}}</span></p>
      </div>
      <div class="video-des" v-if="videoList2.description">{{videoList2.description}}</div>
      <div class="video-content">-->
         <!--<txv-video vid="y14304897dq" playerid="y14304897dq">
         </txv-video>-->
         <!--<img :src="videoList2.coverUrl" class="cover-img" v-if="videoList2.coverUrl">
         <img src="/static/images/test.jpg" class="cover-img" v-else>
         <img src="/static/images/video_mid.png" class="video-play">
      </div>
    </div>-->
  </div> 
</template>

<script>
import {get,showLoading,hideLoading,showToast,showToast2} from '@/util'
import config from '@/config'
export default {
  //http://api01.idataapi.cn:8000/video/tencentvideo?kw=%E6%96%B0%E9%97%BB&apikey=k3eek8dPW8FSM3R2naIh3Qg3jgLGsOZPqJ7ytUrWbEh0psAmTy8ByHL9Y3L31Cii
  //http://api01.idataapi.cn:8000/video/tencentvideo?kw=%E6%96%B0%E9%97%BB&apikey=k3eek8dPW8FSM3R2naIh3Qg3jgLGsOZPqJ7ytUrWbEh0psAmTy8ByHL9Y3L31Cii&pageToken=
  data () {
    return {
      pageToken:'',
      videoList:[],
      /*videoList2:{
        title:'中国外交部：希望美方摒弃“零和”思维',
        id: "y14304897dq",
        publishDateStr: "2019-01-29T16:00:00",
        location: "国内",
        coverUrl: "https://puui.qpic.cn/qqvideo_ori/0/y14304897dq_496_280/0",
        description:'《新闻当事人》是湖南卫视2012年推出的全国第一档80后青年发声新闻节目，节目核心调查记者群全都是80后。以新闻当事人为核心，以事件各相关人、围观者为话题支撑，关注社会群体心理需求、现实困境、焦点话题，引发观众共鸣。'
      }*/
    }
  },
  mounted(){
    showLoading('正在加载')
    this.getVideoList()
  },
  methods: {
    async getVideoList() {
      let list = await get(config.videoUrl,{
          kw:'新闻',
          apikey:config.apikey,
      })
      if(list.hasNext == true){
        this.pageToken = list.pageToken 
      }else {
        this.pageToken = -10000;
      }
      this.videoList = this.videoList.concat(list.data)
      hideLoading()
    },
    async getVideoList2() {
      let list = await get(config.videoUrl,{
          kw:'新闻',
          apikey:config.apikey,
          pageToken:this.pageToken
      })
      if(list.hasNext == true){
        this.pageToken = list.pageToken 
      }else {
        this.pageToken = -10000;
      }
      this.videoList = this.videoList.concat(list.data)
      hideLoading()
      showToast2('加载成功')
    },
    goToVideo(item) {
      console.log('go to video detail')
      wx.navigateTo({
          url: '../video/main?id=' + item.id + '&title=' + item.title + '&publishDateStr=' + item.publishDateStr + '&location=' + item.location + '&description=' + item.description,
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
  onReachBottom () {
    showLoading('正在加载更多')
    this.getVideoList2()
  },

}
</script>

<style scoped>
.video-container {
	width: 100%;
  position: relative;
  margin-top: 10px;
  border-bottom: 1px solid grey;
}
.video-header {
	width: 100%;
	min-height: 57px;
}
.video-header-text {
  min-height: 20px;
  line-height: 19px;
  margin-left: 30rpx;
  margin-top: 10rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  margin-right: 30rpx;
}
.video-time-text {
  width:100%;
  margin-left: 30rpx;
  margin-top: 16px;
  font-size: 25rpx;
}
.collect-icon {
  position: absolute;
  top: 35rpx;
  right: 40rpx;
  height: 50rpx;
  width: 50rpx;
}
.comment-icon {
  position: absolute;
  top: 35rpx;
  right: 120rpx;
  height: 50rpx;
  width: 50rpx;
}
.video-des {
  min-height: 100rpx;
  margin-left: 30rpx;
  font-family:Microsoft YaHe;
  margin-right: 30rpx;
  text-align: justify;
  margin-top: 30rpx;
}
.video-content {
  height: 200px;
  margin:0 30rpx;
  margin-bottom: 10px;
  position: relative;
  margin-top: 50rpx;
}
.cover-img {
  height:100%;
  width: 100%;
}
.video-play {
  height: 70rpx;
  width: 70rpx;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -35rpx;
  margin-top: -35rpx;
}
</style>
