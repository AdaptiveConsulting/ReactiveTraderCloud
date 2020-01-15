import http from 'http'
import { getConfig } from './config'

http
  .createServer(function(_request, response) {
    response.writeHead(200, {
      'Content-Type': 'text/json',
      'Access-Control-Allow-Origin': '*',
    })

    const config = getConfig()
    response.write(JSON.stringify(config))
    response.end()
  })
  .listen('8080')
