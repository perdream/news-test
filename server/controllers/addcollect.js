const {mysql} = require('../qcloud')

module.exports = async (ctx) => {
	const {openid,collectid,title,isvideo} = ctx.request.body
	console.log(openid+collectid+title)
	let time = new Date()
	try {
		await mysql('collections').insert({time,openid,collectid,title,isvideo})
		ctx.state.data = {
			msg:'success'
		} 
	}catch(e) {
		ctx.state = {
			code:-1,
			data:{
				msg:'添加失败'+e.sqlMessage
			}
		}
	}
}