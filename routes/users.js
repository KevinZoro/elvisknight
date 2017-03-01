'use strict';
const router = require('koa-router')();
let User = require('../model/user');

router.get('/', function (ctx, next) {
  	ctx.body = 'this is a users response!';
});

router.post('/New',async (ctx,next)=>{
	console.log(ctx.request.body);
	let user = new User();
	let info = await user.CreateUser(ctx.request.body).catch(err=>{
		console.log(err);
		return new Promise(resolve=>resolve(err.message?JSON.parse(err.message):err));
	});
	ctx.body = {
		info:info
	}
})

router.put('/Update',async (ctx,next)=>{
	let body = ctx.request.body;
	console.log(body);
	let user = new User();
	let updateInfo = body.updateInfo;
	let email = body.Email;
	console.log(updateInfo);
	let data = await user.UpdateUserInfo(updateInfo,email)
	ctx.body = {
		info:data
	}
})

module.exports = router;
