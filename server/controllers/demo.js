const { mysql } = require('../qcloud')
module.exports = async (ctx, next) => {
    // 通过 Koa 中间件进行登录之后
    // 登录信息会被存储到 ctx.state.$wxInfo
    // 具体查看
    //ctx.state.data = "你好 小程序后台"
	await mysql('books').select('books.*').then(res => {
      ctx.state.data = res;
    })
}