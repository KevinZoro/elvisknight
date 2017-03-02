'use strict';
const router = require('koa-router')();
const User = require('../model/user');
const user = new User();

/**
 * @api {get} /users index
 * @apiName GetUser
 * @apiGroup User
 *
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.get('/', function (ctx, next) {
	console.log(ctx.session);
  	ctx.body = 'this is a users response!';
});

router.post('/SignUp',async (ctx,next)=>{
	console.log(ctx.request.body);
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
	let updateInfo = body.updateInfo;
	let email = body.Email;
	console.log(updateInfo);
	let data = await user.UpdateUserInfo(updateInfo,email)
	ctx.body = data
})

/**
 * @api {post} /users/Login Login
 * @apiName UserLogin
 * @apiGroup User
 *
 * @apiParam {String} Email user's email
 * @apiParam {String} Passwd user's password
 * 
 * @apiSuccess {Number} code errorcode
 * @apiSuccess {String} message  message
 * @apiSuccess {Object} info other infomations
 */
router.post('/Login',async (ctx,next)=>{
	let body = ctx.request.body;
	let data = await user.Login(body.Email,body.Passwd).then(result=>{
		ctx.session.user = result;
		return new Promise(resolve=>resolve(result));
	}).catch(err=>{
		return new Promise(resolve=>resolve(err.message?JSON.parse(err.message):err));
	})
	ctx.body = data
})

module.exports = router;
