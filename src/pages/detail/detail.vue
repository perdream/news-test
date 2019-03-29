<template>
  <div>
    <div class="detail-title-container">
      <p class="detail-title-content">{{detail.title}}</p>
      <p class="detail-title-tf">{{detail.posterScreenName}} <span>{{detail.publishDateStr}}</span></p>
      <img src="/static/images/nocollect.png" class="detail-icon-collect" @click="collectNew" v-if="!collected">
      <img src="/static/images/collect.png" class="detail-icon-collect" v-else @click="collectNew">
      <img src="/static/images/text.png" class="detail-icon-comment" @click="showEdit">
    </div>
    <div class="detail-imgs">
      <swiper class='swiper-container' autoplay='true' interval='5000' duration='1000' circular='true'>
        <swiper-item v-for="(item1,index) in detail.imageUrls" :key="index" class="swiper-item-container">
          <image :src='item1' class='u-img-slide' mode='aspectFill'></image>
        </swiper-item>
      </swiper>
    </div>
    <div class="detail-content">
      <div class="detail-content-text">
        <wxParse :content="article" v-if="article"/>
      </div>
    </div>
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
      <button class="commit-btn" @click="commit" v-if="logined"
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
import wxParse from 'mpvue-wxparse'
export default {
  //"https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTK8FZb9g3Lc24k5mkzwbhgiayfFN5DDHOCOfHsyEhRJCSumYmSv7HGPtN1MCwH0b64FdEIfIAvdTRg/132"
  //
  //https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTK8FZb9g3Lc24k5mkzwbhgiayfFN5DDHOCOfHsyEhRJCSumYmSv7HGPtN1
  data () {
    return {
    	newid:'',
      detail:'',
      article:'',
      shadowedit:false,
      showshadow:false,
      value:'',
      logined:false,
      userinfo:'',
      commensList:[],
      collected:false
    }
  },
  onLoad(options) {
  	this.newid = options.newid
    showLoading('加载中')
  	console.log(wx.getStorageSync('userinfo'))
    if(wx.getStorageSync('userinfo')) {
      this.logined = true
      this.userinfo = wx.getStorageSync('userinfo')
      this.hascollected()
    }
  	this.getNewDetail()
    //页面加载获取该条新闻的评论
    this.getComments()
  },

  methods: {
  	async getNewDetail() {
  		let detail = await get(config.newsUrl,{
  			id:this.newid,
        apikey:config.apikey
  		})
      this.detail = detail.data[0]
      this.article = this.detail.html
  		//console.log(this.detail)
  	},
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
              //将评论插入数据库（openid、newid、messge）
                //console.log('提交评论')
                that.addComment(that.value)
            } else if (res.cancel) {
              return
            }
          }
        })        
      }
    },
    //getUserInfo2(e) {
      //console.log(e.detail.userInfo)
       // if (e.mp.detail.rawData){
          //用户按了允许授权按钮
          //console.log(e.mp.detail.userInfo);
           //wx.setStorageSync('userinfo', e.mp.detail.userInfo)
           //this.logined = true
           //this.commit()
        //} else {
          //用户按了拒绝按钮
         // console.log('拒绝按钮');
        //}
    //},
    getUserInfo2() {
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
        console.log(this.userinfo.openId)
        if (!comment) {
          return
        }
        // 评论内容 新闻id 用户的openid
        const data = {
          openid: this.userinfo.openId,
          newid: this.newid,
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
            newid:this.newid
          })
         this.commensList = commensList.data
         console.log(this.commensList)
        }catch(e) {
          console.log(e)
        }
      },
      collectNew() {
        //console.log('collect')
        if (wx.getStorageSync('userinfo')) {
          if(!this.collected){
            //调用函数hascollect,进行收藏
            this.hascollect()
          }else{
            //用户点击取消收藏步骤：弹出框选择是否确定取消收藏 是：执行取消；否：什么也不做
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
          collectid: this.newid,
          title:this.detail.title,
          isvideo:0,
        }
        try {
          await post(config.addcollect, data)
          showToast2('收藏成功')
        } catch (e) {
          showToast('收藏失败')
        }
      },
      //页面进入时判断是否被收藏，用于改变收藏图标状态
      async hascollected() {
      const data = {
          collectid: this.newid,
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
      //后端hascollect接口传入collectID,返回的数据判断是否已存在该条新闻（视频）,避免重复收藏
      async hascollect() {
        //console.log(this.newid)
        const data = {
          collectid: this.newid,
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
      //想后端接口delcollect传递需要删除的新闻id
      async delcollect() {
        const data = {
          collectid: this.newid,
        }
        try {
           await post(config.delcollect, data)
           this.collected = false
           showToast('取消收藏成功')
        }catch(e) {
           showToast('取消收藏失败')
        }
      }
    /*getSetting(){
      let that = this
        wx.getSetting({
          success: function(res){
            if (res.authSetting['scope.userInfo']) {
              wx.getUserInfo({
                success: function(res) {
                  console.log(res.userInfo)
                  //用户已经授权过
                  wx.setStorageSync('userinfo', e.mp.detail.userInfo)
                  console.log('用户已经授权过')
                }
              })
            }else{
              console.log('用户还未授权过')
            }
          }
        })
      },*/
  },
  components:{
    wxParse
  },
  onUnload(){
      this.newid =''
      this.detail= ''
      this.article =''
  }
}
</script>

<style scoped>
.detail-title-container {
  height: 140px;
  width: 100%;
}
.detail-title-content {
  margin: 25rpx;
  font-family:Microsoft YaHe;
  font-size: 50rpx;
  letter-spacing: 1.5px;
}
.detail-title-tf {
  margin: 25rpx;
  font-family:Microsoft YaHe;
  font-size: 30rpx;
  color: grey;
}
.detail-icon-collect {
  position: absolute;
  top: 170rpx;
  right: 50rpx;
  height: 50rpx;
  width: 50rpx;
}
.detail-icon-comment {
  position: absolute;
  top: 170rpx;
  right: 130rpx;
  height: 50rpx;
  width: 50rpx;
}
.detail-content {
  margin-bottom: 50rpx;
  margin-right: 25rpx;
  margin-left: 25rpx;
}
.detail-content-text {
  font-family:Microsoft YaHe;
  font-size: 35rpx;
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
  z-index: 2;
  background-color: rgba(0,0,0,0.6);
}
.comment-container {
  position: fixed;
  top:60%;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
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
/*编辑页面窗口动画*/
/*.showparams-enter-active{
  animation: pa .5s ease-in-out;
}
.showparams-enter{
  animation: pa .3s ease-in-out;
}
.showparams-leave-active {
  animation: pa .5s ease-in-out reverse;
}
@keyframes pa {
  0% {
    transform:translate(0px, 100%);
  }
  100% {
    transform:translate(0px, 0);
  }
}*/
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
