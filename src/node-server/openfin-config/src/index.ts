import Koa from 'koa'
import { getConfig } from './config'
import json from 'koa-json'

const app = new Koa()

// Pretty-print JSON responses
app.use(json())

const pathCapture = /\/(?<type>\w+)\/(?<env>\w+)(\.json)?$/

app.use(async (ctx, next) => {
  if (ctx.accepts('application/json') !== 'application/json') {
    return next()
  }

  const capture = ctx.path.match(pathCapture)

  if (capture === null || typeof capture.groups === 'undefined') {
    return next()
  }

  const { type, env } = capture.groups
  ctx.body = getConfig(type, env)
})

app.listen(8080)
