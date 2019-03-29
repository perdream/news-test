// 需要用到的配置项

const host = 'http://localhost:5757'
//新闻url
const news = 'http://api01.idataapi.cn:8000/news/toutiao'
const video = 'http://api01.idataapi.cn:8000/video/tencentvideo'
//const news = '45454545'

//idata apikey
const id = '自己的idata apikey'

const config = {
  host,
  loginUrl: `${host}/weapp/login`,
  userUrl: `${host}/weapp/user`,
  addComment:`${host}/weapp/addcomment`,
  getcomments:`${host}/weapp/getcomments`,
  addcollect:`${host}/weapp/addcollect`,
  getcollect:`${host}/weapp/getcollect`,
  hascollect:`${host}/weapp/hascollect`,
  delcollect:`${host}/weapp/delcollect`,
  videoUrl:video,
  newsUrl: news,
  apikey:id
}
export default config