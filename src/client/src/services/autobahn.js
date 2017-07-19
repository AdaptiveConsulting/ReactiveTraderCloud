import autobahn from 'autobahn'

const url = "web-demo.adaptivecluster.com"
const realm = 'com.weareadaptive.reactivetrader';

const useSecure = location.protocol === 'https:';
const securePort = 8000;
const defaultPort = 8080;

const connection = new autobahn.Connection({
    realm,
    use_es6_promises: true,
    max_retries: -1, // unlimited retries,
    transports: [
        {
            type: 'websocket',
            url: useSecure ? `wss://${url}:${securePort}/ws` : `ws://${url}:${defaultPort}/ws`
        },
        {
            type: 'longpoll',
            url: useSecure ? `https://${url}:${securePort}/lp` : `http://${url}:${defaultPort}/lp`
        }
    ]
});

export default connection;
