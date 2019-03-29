<template>
  <div style="background-color:#ebebeb;width:100%;height:555px;">
	<!-- 我的收藏 -->
	<div>
		<div style='width:100%;flex-direction:row; display:flex;float:left;background-color:#fff;margin-top:15px;padding-top:7px;padding-bottom:7px;'>
		  <div style='width:70px;height:70px;padding-left:15px;'>
		  	<img :src="user.avatarUrl" class="avatar">
		  </div>
		  <div style='margin-left:10px;color:#000;font-size: 20px;line-height:70px;text-align:center;height:70px;'>
		    <p v-if="logined">{{user.nickName}}</p>
		    <button open-type="getUserInfo" class="login-btn"
					v-if="canIUse&&!logined" 
					@getuserinfo="getUserInfo2"
			>点击登录</button>
		  </div>
		</div>
	</div>
	<div style='width:100%;flex-direction:row; display:flex;float:left;flex:1;background-color:#fff;margin-top:15px;padding-top:10px;padding-bottom:10px;' @click="goCollect">
	<div style='align-items:center;height:20px;'>
	  <image style='width:20px;height:20px;padding-left:25px;' src='/static/images/my_collect.png'></image>
	</div>
	<div>
	  <text style='padding-left:15px;color:#000;font-size: 16px;'>我的收藏</text>
	</div>
	</div>
	<!-- 缓存大小 -->
	<div style='width:100%;flex-direction:row; display:flex;float:left;flex:1;background-color:#fff;margin-top:15px;padding-top:10px;padding-bottom:10px;'>
	<div style='align-items:center;height:20px;'>
	  <image style='width:20px;height:20px;padding-left:25px;' src='/static/images/my_cache.png'></image>
	</div>
	<div>
	  <text style='padding-left:15px;color:#000;font-size: 16px;'>缓存大小</text>
	</div>
	<div style='flex:1;height:20px;padding-right:15px;'>
	  <text style='float: right;color:#cbcbcb;font-size: 14px;'>545454</text>
	</div>
	</div>
	<!-- 清除缓存 -->
	<div style='width:100%;flex-direction:row; display:flex;float:left;flex:1;background-color:#fff;margin-top:15px;padding-top:10px;padding-bottom:10px;'>
	<div style='align-items:center;height:20px;'>
	  <image style='width:20px;height:20px;padding-left:25px;' src='/static/images/my_clean_cache.png'></image>
	</div>
	<div>
	  <text style='padding-left:15px;color:#000;font-size: 16px;'>清空缓存</text>
	</div>
	<div style='flex:1;height:20px;padding-right:15px;'>
	  <text bindtap="cleancache" style='float: right;color:#cbcbcb;font-size: 14px;'>点击可清除</text>
	</div>
	</div>
	<!-- 版本信息 -->
	<div style='width:100%;flex-direction:row; display:flex;float:left;flex:1;background-color:#fff;margin-top:15px;padding-top:10px;padding-bottom:10px;'>
	<div style='align-items:center;height:20px;'>
	  <image style='width:20px;height:20px;padding-left:25px;' src='/static/images/my_version.png'></image>
	</div>
	<div>
	  <text style='padding-left:15px;color:#000;font-size: 16px;'>版本信息</text>
	</div>
	<div style='flex:1;height:20px;padding-right:15px;'>
	  <text style='float: right;color:#cbcbcb;font-size: 14px;'>v0.0.388</text>
	</div>
	</div>
	<!-- 关于 -->
	<div style='width:100%;flex-direction:row; display:flex;float:left;flex:1;background-color:#fff;margin-top:15px;padding-top:10px;padding-bottom:10px;'>
	<div style='align-items:center;height:20px;'>
	  <image style='width:20px;height:20px;padding-left:25px;' src='/static/images/my_about.png'></image>
	</div>
	<div>
	  <text style='padding-left:15px;color:#000;font-size: 16px;'>关于</text>
	</div>
	</div>
	</div>
  </div>
</template>

<script>
import qcloud from 'wafer2-client-sdk'
import config from '@/config'
import {showToast2} from '@/util'
export default {
	data () {
		return {
			user:{
		        avatarUrl: '/static/images/unlogin.png',
		        nickName: '点击登录'
			},
			logined:false,
			canIUse: wx.canIUse('button.open-type.getUserInfo')
		}
	},
	mounted: function() {
		if(wx.getStorageSync('userinfo')){
			this.user = wx.getStorageSync('userinfo')
			this.logined = true
		}
		//this.getSetting()
	},
	/*onLoad(){
		if(wx.getStorageSync('userinfo')){
			this.user = wx.getStorageSync('userinfo')
			this.logined = true
		}
	},*/
  	methods: {
  		/*getUserInfo2(e) {
			//console.log(e.detail.userInfo)
		    if (e.mp.detail.rawData){
		      //用户按了允许授权按钮
		      //console.log(e.mp.detail.userInfo);
		      this.user = e.mp.detail.userInfo
		       wx.setStorageSync('userinfo', e.mp.detail.userInfo)
		      this.logined = true
		    } else {
		      //用户按了拒绝按钮
		      console.log('拒绝按钮');
		    }
		},*/
		/*getSetting(){
			let that = this
		    wx.getSetting({
		        success: function(res){
		          if (res.authSetting['scope.userInfo']) {
		            wx.getUserInfo({
		              success: function(res) {
		                //console.log(res.userInfo)
		                //用户已经授权过
		                that.user = res.userInfo
		                that.logined  = true
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
	  	getUserInfo2() {
	    	console.log('请求获取用户id')
	    	const self = this
        	qcloud.setLoginUrl(config.loginUrl)
	        qcloud.login({
	          success: function (userinfo) {
	            qcloud.request({
	              url: config.userUrl,
	              login: true,
	              success (userRes) {
	                showToast2('登录成功')
	                console.log(userRes.data.data)
	                wx.setStorageSync('userinfo', userRes.data.data)
	                self.user = userRes.data.data
	                self.logined = true
	              }
	            })
	          }
		  	})
	    },
	    goCollect() {
	    	if(wx.getStorageSync('userinfo')){
				wx.navigateTo({
			      url: '../newscollect/main',
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
	    	}
    	}
	}
	/*onShow () {
	    //console.log(123)
	    let userinfo = wx.getStorageSync('userinfo')
	    // console.log([userinfo])
	    if (userinfo) {
	      this.userinfo = userinfo
	    }else {
	    	console.log('无用户信息')
	    }
	    // console.log(this.userinfo)
	}*/
}
</script>

<style scoped>
.avatar {
	height: 100%;
	width: 100%;
	border-radius: 3px;
}
.login-btn {
	height: 70px;
	line-height: 70px;
	border:#fff;
	background-color: #fff;
}
</style>
