<template>
  <div>
    <div class="video-container">
      <div class="video-header">
        <p class="video-header-text">{{videoid.title}}</p>
        <p class="video-time-text">{{videoid.publishDateStr}}<span v-if="location1">&nbsp&nbsp&nbsp&nbsp {{videoid.location}}</span></p>
        <img src="/static/images/nocollect.png" class="collect-icon" @click="collectNew" v-if="!collected">
        <img src="/static/images/collect.png" class="collect-icon" v-else @click="collectNew">
        <img src="/static/images/text.png" class="comment-icon" @click="showEdit">
      </div>
      <div class="video-des" v-if="description1">{{videoid.description}}</div>
      <div class="video-content">
         <txv-video :vid="videoid.id" :playerid="videoid.id" :autoplay="true">
         </txv-video>
      </div>
    </div>
    <!--评论区块-->
    <div class="detail-comments">
      <div class="detail-commments-head">
        <span class="detail-commments-title">最新评论</span>
      </div>
      <div class="detail-comments-container" v-if="commensList.length" v-for="(item,index) in commensList" :key="index">
        <div class="detail-comments-img">
          <img :src="item.avatarUrl" class="detail-comments-icon">
        </div>
        <div class="detail-comments-text">
          <p class="detail-comments-text-title">{{item.nickName}}</p>
          <p class="detail-comments-text-content">{{item.comment}}</p>
        </div>
      </div>
      <div class="nocomment" v-if="!commensList.length">
        暂无评论
      </div>
    </div>
    <div class="shadow" v-show="showshadow" @click="closeshadow">
    </div>
    <div class="comment-container" v-show="shadowedit">
      <div class="comment-header">
        <span class="back-new" @click="closeshadow">返回</span>
      </div>
      <div class="text-are">
          <textarea
            placeholder="请输入评论"
            placeholder-style="color:grey;font-size:35rpx;"
            maxlength="100"
            v-model="value"
          />
      </div>
      <button class="commit-btn" v-if="logined" @click="commit"
      >提交</button>
      <button class="commit-btn" v-else
            open-type="getUserInfo"
            @getuserinfo="getUserInfo2"
      >点击登录</button>
    </div>
  </div> 
</template>

<script>
import {get,showLoading,showToast,post,showToast2} from '@/util'
import qcloud from 'wafer2-client-sdk'
import config from '@/config'
export default {
  data () {
    return {
      videoid:{},
      shadowedit:false,
      showshadow:false,
      value:'',
      logined:false,
      description1:true,
      location1:true,
      commensList:[],
      userinfo:'',
      collected:false
    }
  },
  onLoad(options) {
    this.videoid = options
    if(options.description == 'null') {
      this.description1 = false
    }
    if(options.location == 'null') {
      this.location1 = false
    }
    console.log(this.videoid)
    if(wx.getStorageSync('userinfo')) {
      this.logined = true
      this.userinfo = wx.getStorageSync('userinfo')
      this.hascollected()
    }
    this.getComments()
  },
  mounted(){
    this.getVideoList()
  },
  methods: {
    showEdit() {
      this.shadowedit = true
      this.showshadow = true
    },
    closeshadow() {
      if(this.value){
        let that = this
        wx.showModal({
          title: '提示',
          content: '评论将不被保存，确定返回？',
          success(res) {
            if (res.confirm) {
              //console.log('用户点击确定')
              that.value = ''
              that.shadowedit = false
              that.showshadow = false
            } else if (res.cancel) {
              //console.log('用户点击取消')
              return
            }
          }
        }) 
      }else {
        this.shadowedit = false
        this.showshadow = false
      }

    },
    commit() {
      let that = this
      console.log(this.value)
      if(this.value == ''){
        showToast('请输入评论')
      }else{
        wx.showModal({
          title: '提示',
          content: '确定要提交评论？',
          success(res) {
            if (res.confirm) {
                //console.log('提交评论')
                that.addComment(that.value)
            } else if (res.cancel) {
              return
            }
          }
        })        
      }
    },
    getUserInfo2(e) {
      const self = this
      qcloud.setLoginUrl(config.loginUrl)
      qcloud.login({
        success: function (userinfo) {
          qcloud.request({
            url: config.userUrl,
            login: true,
            success (userRes) {
              console.log(userRes.data.data)
              wx.setStorageSync('userinfo', userRes.data.data)
              self.userinfo = userRes.data.data
              self.logined = true
              self.commit()
            }
          })
        }
      })
    },
    async addComment (comment) {
        if (!comment) {
          return
        }
        // 评论内容 新闻id 用户的openid
        const data = {
          openid: this.userinfo.openId,
          newid: this.videoid.id,
          comment,
          nickName:this.userinfo.nickName,
          avatarUrl:this.userinfo.avatarUrl,
        }
        try {
          await post(config.addComment, data)
          showToast2('评论成功')
          this.value = ''
          this.closeshadow()
          this.commensList = this.commensList.concat(data)
        } catch (e) {
          showToast('评论失败')
        }
      },
      async getComments () {
        try {
         const commensList =  await get(config.getcomments,{
            newid:this.videoid.id
          })
         this.commensList = commensList.data
         console.log(this.commensList)
        }catch(e) {
          console.log(e)
        }
      },
      collectNew() {
        console.log('collect')
        if (wx.getStorageSync('userinfo')) {
          if(!this.collected){
            //调用函数hascollect,进行收藏
            this.hascollect()
          }else{
            //用户点击取消收藏步骤：弹出框选择是否确定取消收藏 是：执行取消；否：什么也不做
            console.log('delcollect')
            let that = this
            wx.showModal({
              title: '提示',
              content: '取消收藏该新闻？',
              success(res) {
                if (res.confirm) {
                  //用户点击确定 执行删除操作，调用delcollect
                  that.delcollect()
                } else if (res.cancel) {
                  return
                }
              }
            }) 
            
          }
        }else {
          showToast('请前往“我的”页面登录')
        }
      },
      async collectMethod() {
        // 向后端传递 openid,collectid,title,isvideo
        const data = {
          openid: this.userinfo.openId,
          collectid: this.videoid.id,
          title:this.videoid.title,
          isvideo:1,
        }
        try {
          await post(config.addcollect, data)
          showToast2('收藏成功')
        } catch (e) {
          showToast('收藏失败')
        }
      },
      //后端hascollect接口传入collectID,返回的数据判断是否已存在该条新闻（视频）,避免重复收藏
      async hascollect() {
        console.log(this.videoid.id)
        const data = {
          collectid: this.videoid.id,
        }
        try {
          const list = await get(config.hascollect, data)
          //console.log(list.data.length)
          //若list.data.length == 0,则返回0
          //否则返回1
          if(list.data.length == 0) {
            this.collectMethod()
            this.collected = true
          }else {
            showToast('该条新闻以被收藏过')
          }
        } catch (e) {
          showToast('收藏失败')
        }
      },
      //页面进入时判断是否被收藏，用于改变收藏图标状态
      async hascollected() {
      const data = {
          collectid: this.videoid.id,
        }
        try {
          const list = await get(config.hascollect, data)
          //console.log(list.data.length)
          //若list.data.length == 0,则返回0
          //否则返回1
          if(list.data.length > 0) {
            this.collected = true
          }else {
            this.collected = false
          }
        } catch (e) {
          showToast('请刷新')
        }
      },
      //想后端接口delcollect传递需要删除的新闻id
      async delcollect() {
        const data = {
          collectid: this.videoid.id,
        }
        try {
           await post(config.delcollect, data)
           this.collected = false
           showToast('取消收藏成功')
        }catch(e) {
           showToast('取消收藏失败')
        }
      }
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
  margin-right: 200rpx;
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
.detail-comments {
  width: 100%;
}
.detail-commments-head {
  height: 75rpx;
  width: 100%;
  color: #999;
  font-family:Microsoft YaHe;
  font-size: 30rpx;
  background-color: #F5F5F5;
}
.detail-commments-title {
  margin: 0 25rpx;
  height: 75rpx;
  line-height: 75rpx;
}
.detail-comments-container {
  min-height: 160rpx;
  width: 100%;
  display: flex;
}
.detail-comments-img {
  height: 100%;
  width: 160rpx;
  text-align: center;
}
.detail-comments-text {
  flex: 1;
  border-bottom: 1px solid grey;
}
.detail-comments-icon {
  height: 60rpx;
  width: 60rpx;
  border-radius: 50%;
  margin-top: 25rpx;
}
.detail-comments-text-title {
  margin-top: 20rpx;
  font-family:Microsoft YaHe;
  font-size: 25rpx;
}
.detail-comments-text-content {
  margin-top: 40rpx;
  margin-right: 45rpx;
  font-family:Microsoft YaHe;
  font-size: 30rpx;
}
.detail-imgs {
  height: 150px;
  width: 100%;
  margin-bottom: 30rpx;
}
.swiper-container {
  height: 100%;
  width: 100%;
  margin-bottom: 30rpx;
  margin-left:25rpx;
}
.swiper-item-container {
  height: 100%;
  width: 100%;
}
.u-img-slide {
  height: 100%;
  width: 93%;
}
.shadow {
  position: fixed;
  top:0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background-color: rgba(0,0,0,0.6);
}
.comment-container {
  position: fixed;
  top:60%;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 101;
  background-color: #fff;
}
.comment-header {
  margin-top: 10px;
  height: 50rpx;
  width: 100%;
}
.back-new {
  height: 50rpx;
  line-height: 50rpx;
  margin-right: 35rpx;
  float: right;
  font-size: 30rpx;
  font-weight: 600;
}
.text-are {
  height: 30%;
  width: 100%;
  margin-top: 50rpx;
  margin-left: 25rpx;
}
.commit-btn {
  position: fixed;
  bottom: 25rpx;
  left:25rpx;
  right:25rpx;
  color: #fff;
  background-color: #32CD32;
}
.nocomment {
  width: 100%;
  text-align: center;
}
</style>
