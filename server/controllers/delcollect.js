const {mysql} = require('../qcloud')

module.exports = async (ctx) => {
    const {collectid} = ctx.request.body
    console.log(collectid)
    try{
      await mysql('collections').del().where('collectid',collectid).then(res => {
        ctx.state.data = {
          msg:'删除成功'
        };
      })
    }catch(e) {
      ctx.state = {
        code:-1,
        data:{
          msg:'删除失败'+e.sqlMessage
        }
      }
  }
}
