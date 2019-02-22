const autobahn = require('autobahn');

const realm = 'com.weareadaptive.reactivetrader'
const defaultPort = 80
const url = 'localhost'
const connection =  new autobahn.Connection({
    realm,
    use_es6_promises: true,
    max_retries: -1, // unlimited retries,
    transports: [
      {
        type: 'websocket',
        url:`ws://${url}:${defaultPort}/ws`,
      }
    ],
  })

  connection.onopen=session=>{
    console.log('sdjflsfosiefjj')
  }
  connection.open();