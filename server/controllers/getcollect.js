const {mysql} = require('../qcloud')

module.exports = async (ctx) => {
    const {openid} = ctx.request.query
    console.log(openid)
    try{
      await mysql('collections').select('collections.*').where('openid',openid).then(res => {
        ctx.state.data = res;
      })
    }catch(e) {
    ctx.state = {
      code:-1,
      data:{
        msg:'查询失败'+e.sqlMessage
      }
    }
  }
}
