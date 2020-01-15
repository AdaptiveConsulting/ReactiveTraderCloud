import Koa from 'koa'
import { getConfig } from './config'

const app = new Koa()

app.use(async ctx => {
  const { type, env } = ctx.query
  ctx.body = getConfig(type, env)
})

app.listen(8080)
