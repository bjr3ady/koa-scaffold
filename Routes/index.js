const Router = require('koa-router')
const globalConfig = require('../globalConfig.json')
const {
	UserController,
	ArchiveController
} = require('../Controllers')
const Auth = require('./authProvider')

let apiRouter = function (server) {
	let r = new Router()
	return {
		router: r
			.get('/info', ctx => {
				ctx.body = `${globalConfig.APP_NAME}`
			})
			.post('/api/TestToken', async ctx => {
				let req = ctx.request.body
				let uid = req.id
				let token = req.token
				let url = req.url
				if (url && token && uid) {
					ctx.body = await Auth.GenerateBearerToken(uid, token, url)
					return
				}
				ctx.status = 400
			})
			/******************************** Archive *************************************/
			.post('/api/Archive', async ctx => {
				if (await Auth.IsAdminRequest(ctx)) {
					if (await Auth.CheckAdminAuth(ctx)) {
						ctx.body = await ArchiveController.Upload(ctx)
					}
				} else {
					if (await Auth.CheckAuth(ctx)) {
						ctx.body = await ArchiveController.Upload(ctx)
					}
				}
			})
			.del('/api/Archive', async ctx => {
				if (await Auth.IsAdminRequest(ctx)) {
					if (await Auth.CheckAdminAuth(ctx)) {
						ctx.body = await ArchiveController.Delete(ctx)
					}
				} else {
					if (await Auth.CheckAuth(ctx)) {
						ctx.body = await ArchiveController.Delete(ctx)
					}
				}
			})
			/******************************** User *************************************/
			.get('/api/User/HasUser/Mobile/:mobile', async ctx => {
				ctx.body = await UserController.HasUser(ctx)
			})
			.get('/api/User/Id/:id', async ctx => {
				if (await Auth.IsAdminRequest(ctx)) {
					if (await Auth.CheckAdminAuth(ctx))
						ctx.body = await UserController.FindUserById(ctx)
				} else {
					if (await Auth.CheckAuth(ctx))
						if (ctx.params.id === await Auth.SplitUidFromHeader(ctx)) {
							ctx.body = await UserController.FindUserById(ctx)
						} else {
							ctx.status = 400
							ctx.body = 'Not allowed'
						}
				}
			})
			.get('/api/User/All', async ctx => {
				if (await Auth.IsAdminRequest(ctx)) {
					if (await Auth.CheckAdminAuth(ctx))
						ctx.body = await UserController.AllUsers(ctx)
				}
			})
			.post('/api/User/PreRegister', async ctx => {
				ctx.body = await UserController.PreRegister(ctx)
			})
			.post('/api/User/Register', async ctx => {
				ctx.body = await UserController.Register(ctx)
			})
			.post('/api/User/PreLogin', async ctx => {
				ctx.body = await UserController.PreLogin(ctx)
			})
			.post('/api/User/Login', async ctx => {
				ctx.body = await UserController.LoginByMobileWithSmsCode(ctx)
			})
			.post('/api/User/Login/ByPassword', async ctx => {
				ctx.body = await UserController.LoginByPassword(ctx)
			})
			.post('/api/User/CheckToken', async ctx => {
				ctx.body = await UserController.CheckToken(ctx)
			})
			.put('/api/User/Password/:mobile', async ctx => {
				if (!await Auth.IsAdminRequest(ctx)) {
					ctx.body = await UserController.UpdateUserPasswordWithSMSAuth(ctx)
				}
			})
			.put('/api/User/Password/ByAdmin/:id', async ctx => {
				if (await Auth.IsAdminRequest(ctx)) {
					if (await Auth.CheckAdminAuth(ctx)) {
						ctx.body = await UserController.UpdateUserPassword(ctx)
					}
				}
			})
			.del('/api/User/Id/:id', async ctx => {
				if (await Auth.IsAdminRequest(ctx)) {
					if (await Auth.CheckAdminAuth(ctx)) {
						ctx.body = await UserController.DeleteUser(ctx)
					}
				}
			})
		}
}
module.exports = apiRouter