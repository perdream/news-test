const {mysql} = require('../qcloud')

module.exports = async (ctx) => {
    const {newid} = ctx.request.query
    let comments
    try{
      await mysql('comments').select('comments.*').where('newid',newid).then(res => {
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
