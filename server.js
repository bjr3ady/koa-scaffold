const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const Static = require('koa-static')
const cors = require('koa-cors')
const path = require('path')
const mongoose = require('mongoose')
const globalConfig = require('./globalConfig.json')
const server = new Koa()

/****************************Mongoose DB*******************************/
mongoose.Promise = global.Promise
const { EntityInitializer } = require('./Entities')
EntityInitializer.initialize()
console.log('Mongo db connected.')

/****************************Web API*******************************/
let ApiRouter = require('./Routes')
let apiRouter = new ApiRouter(server)
let port = globalConfig.PORT

server.use(cors({
  origin: '*',
  optionsSuccessStatus: 200
}))
server.use(Static(path.join(__dirname, './www')))
server.use(bodyParser())
server.use(apiRouter.router.routes())
	.use(apiRouter.router.allowedMethods())
server.listen(port)
console.log(`${globalConfig.APP_NAME} listening on ${port}...`)