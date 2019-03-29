// 使用到的工具函数库
import config from './config'//引入常用的配置文件

// http get工具函数 获取数据
export function get (url, data) {
  return request(url, 'GET', data)
}
export function post (url, data) {
  return request(url, 'POST', data)
}

//具体请求数据的函数，调用wx.request接口
function request (url, method, data, header = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      data,
      method,
      header,
      url:url,
      success: function (res) {
        hideLoading ()
        resolve(res.data)
      }
    })
  })
}

export function showModal (title, content) {
  wx.showModal({
    title,
    content,
    showCancel: true
  })
}
export function showSuccess (text) {
  wx.showToast({
    title: text,
    icon: 'success'
  })
}

export function showLoading (title) {
  wx.showLoading({
    title,
  })
}
export function hideLoading () {
  wx.hideLoading();
}

export function showToast (title) {
  wx.showToast({
    title,
    icon:'none',
    duration: 2000
  })
}
export function showToast2 (title) {
  wx.showToast({
    title,
    duration: 2000
  })
}
