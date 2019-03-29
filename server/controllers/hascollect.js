const {mysql} = require('../qcloud')

module.exports = async (ctx) => {
    const {collectid} = ctx.request.query
    console.log(collectid)
    try{
      await mysql('collections').select('collections.*').where('collectid',collectid).then(res => {
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
