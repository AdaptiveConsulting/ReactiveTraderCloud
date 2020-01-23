import Koa from 'koa'
import { getConfig } from './config'
import json from 'koa-json'

const app = new Koa()

// Pretty-print JSON responses
app.use(json())

const pathRegex = /\/(?<type>\w+)(\.json)?$/
const hostRegex = /^\w+-(?<env>\w+)\.\w+\.\w+$/

app.use(async (ctx, next) => {
  if (ctx.accepts('application/json') !== 'application/json') {
    return next()
  }

  const { hostname, path } = ctx

  const pathCapture = path.match(pathRegex)
  const hostCapture = hostname.match(hostRegex)

  if (pathCapture === null || typeof pathCapture.groups === 'undefined') {
    return next()
  }

  const env = hostCapture?.groups?.env
  const { type } = pathCapture.groups

  ctx.body = getConfig(type, env)
})

app.listen(8080)
