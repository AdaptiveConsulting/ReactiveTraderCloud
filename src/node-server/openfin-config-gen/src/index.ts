import Koa from 'koa'
import { getConfig } from './config'

const app = new Koa()

app.use(async ctx => {
  ctx.body = getConfig()
})

app.listen(8080)
