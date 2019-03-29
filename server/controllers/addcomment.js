const {mysql} = require('../qcloud')

module.exports = async (ctx) => {
	const {openid,newid,comment,nickName,avatarUrl} = ctx.request.body
	console.log(openid+newid+comment)
	let time = new Date()
	try {
		await mysql('comments').insert({time,openid,newid,comment,nickName,avatarUrl})
		ctx.state.data = {
			msg:'success'
		} 
	}catch(e) {
		ctx.state = {
			code:-1,
			data:{
				msg:'评论失败'+e.sqlMessage
			}
		}
	}
}