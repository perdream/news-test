<template>
  <div>
    <div class="item-container" v-for="(item,index) in collections" v-if="collections.length" :key="index" @click="goDetail(item)">
      <p class="item-title">{{item.title}}</p>
      <p class="item-time">{{item.time}}</p>
      <img src="/static/images/video.png" class="item-icon" v-if="item.isvideo == 1">
      <img src="/static/images/pic.png" class="item-icon" v-else>
    </div>
    <div class="item-no" v-if="!collections.length">
      暂时没有收藏，快去添加吧~
    </div>
  </div> 
</template>

<script>
import {get,showLoading,showToast,post,showToast2} from '@/util'
import config from '@/config'
export default {
  data () {
    return {
      collections:[]
    }
  },
  mounted(){
    //console.log('收藏')
    this.getCollections()
  },
  onShow() {
    this.getCollections()
  },
  methods: {
    async getCollections() {
      let user = wx.getStorageSync('userinfo')
      console.log(user)
        try {
         const collections =  await get(config.getcollect,{
            openid:user.openId
          })
         this.collections = collections.data
         console.log(this.collections)
        }catch(e) {
          console.log(e)
        }
    },
    //获取新闻信息和跳转到响应页面
    async goDetail(item) {
      if(item.isvideo == 1){
        const list = await get(config.videoUrl,{
          apikey:config.apikey,
          id:item.collectid
        });
        if(list.data == ''){
          showToast('此新闻已不存在')
          return
        }
        this.goToVideo(list.data[0])
      }else {
        const list2 = await get(config.newsUrl,{
          apikey:config.apikey,
          id:item.collectid
        });
        if(list2.data == ''){
          showToast('此新闻已不存在')
          return
        }
        this.goNewDetail(item.collectid)
      }
     
    },
    goToVideo(item) {
      console.log(item+'5666666666666666666')
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
    goNewDetail(item) {
      wx.navigateTo({
          url: '../detail/main?newid=' + item,
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

}
</script>

<style scoped>
.item-container {
  position: relative;
  min-height: 110rpx;
  width: 100%;
  margin-top: 15rpx;
  border-bottom: 1px solid #333;
}
.item-title {
  min-height: 60rpx;
  font-size: 30rpx;
  margin-left:10rpx;
  margin-right:60rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font-family:Microsoft YaHe;
}
.item-time {
  font-family:Microsoft YaHe;
  font-size: 30rpx;
  color: grey;
  margin-bottom: 5rpx;
  height: 30rpx;
  line-height: 30rpx;
  margin-left: 15rpx;
}
.item-no {
  width: 100%;
  text-align: center;
  margin-top: 50%;
}
.item-icon {
  position: absolute;
  top: 50%;
  right: 10%;
  height: 60rpx;
  width: 60rpx;
  margin-top: -30rpx;
}
</style>
