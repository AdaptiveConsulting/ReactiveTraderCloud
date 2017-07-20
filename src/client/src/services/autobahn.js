import autobahn from 'autobahn';
import Rx from 'rxjs/Rx';

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

connection.onopen = (session, details) => {
  const refRaw$ = topicSubscribe(session, 'reference')
  
  const refConnected$ = refRaw$
    .filter(el => el.event === 'connection')
    .pluck('topic')

  const reference$ = refRaw$
    .filter(el => el.event === 'message')
  

  const status$ = topicSubscribe(session, 'status')
    .filter(el => el.event === 'message')
    .pluck('response');

  
  const priceList$ = status$
    .filter(el => el.Type === 'reference')
    .pluck('Instance')
    .distinct()
    .combineLatest(refConnected$, (instance, topic) => ({ instance, topic }))
    .flatMap(({instance, topic}) => {
      const remoteProcedure = instance + '.' + 'getCurrencyPairUpdatesStream';
      return RPC(session, remoteProcedure, {}, topic);
    })

  const priceSubRaw$ = reference$
    .pluck('response')
    .flatMap(({Updates}) => Rx.Observable.from(Updates))
    .flatMap(() => topicSubscribe(session, 'pricing'))

  const priceSubConnected$ = priceSubRaw$
    .filter(el => el.event === 'connection')
    .pluck('topic')

  const priceUpdates$ = status$
    .filter(el => el.Type === 'pricing')
    .pluck('Instance')
    .distinct()
    .combineLatest(priceSubConnected$, (instance, topic) => ({ instance, topic }))
    .flatMap(({instance, topic}) => {
      const remoteProcedure = instance + '.' + 'getPriceUpdates';
      return RPC(session, remoteProcedure, { symbol: 'EURUSD' }, topic);
    });

  
  const priceSubMessages$ = priceSubRaw$
    .filter(el => el.event === 'message')

  priceList$.subscribe((response) => {
    console.log('$$$', response);
  });

  priceUpdates$.subscribe((response) => {
    console.log('$$$', response);
  });

  priceSubMessages$.subscribe((response) => {
    console.log('Price update', response);
  });
};

  let currencyPair = '';

  function topicSubscribe(session, topicName) {
    let topic = topicName === 'status' ? 'status' : `topic_${topicName}_` + (Math.random() * Math.pow(36, 8) << 0).toString(36);

    return Rx.Observable.create(o => {

      session.subscribe(topic, response => {
        const reponseObj = response[0];
        o.next({ event: 'message', topic, response: reponseObj }); //onmessage
      }).then((sub) => {
        o.next({ event: 'connection', topic, sub });// on connectiom
      }, (error) => {
        o.error(error);
      });
    });

  }

  /**
   * wraps a RPC up as an observable stream
   * @param remoteProcedure
   * @param payload
   * @param replyTo
   * @returns {Observable}
   */
  function RPC(session, remoteProcedure, payload, replyTo = '') {

    console.log(session, remoteProcedure, payload, replyTo);

    return Rx.Observable.create(o => {
      // _log.debug(`Doing a RPC to [${remoteProcedure}]. Is connected [${_this._isConnected}]`);

      //const disposables = new Rx.CompositeDisposable();
      
      const isDisposed = false;
      const dto = [{
        replyTo,
        Username: 'NGA', // TODO: use fake users list
        payload
      }];

      session.call(remoteProcedure, dto).then(
        result => {
          if (!isDisposed) {
            console.log('----', result);
            o.next(result);
            o.complete();
          } else {
            _log.verbose(`Ignoring response for remoteProcedure [${remoteProcedure}] as stream disposed`);
          }
        },
        error => {
          if (!isDisposed) {
            o.error(error);
          } else {
            _log.error(`Ignoring error for remoteProcedure [${remoteProcedure}] as stream disposed.`, error);
          }
        }
      );

      // TODO: use RX 5 subscription instead of disposables
      // disposables.add(Rx.Disposable.create(() => {
      //   isDisposed = true;
      // }));

      // return disposables;
    });
  }

export default connection;
