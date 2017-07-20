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
  subscribe(session, 'status');
  // subscribe(session, 'status');
  // subscribe(session, 'status');
  // subscribe(session, 'status');
  // subscribe(session, 'status');

  subscribe(session, 'reference');
  subscribe(session, 'blotter');
  subscribe(session, 'analytics');
  subscribe(session, 'pricing');
};
// getPriceUpdates topic_pricing_owdkrb
// getPriceUpdates topic_pricing_xxf4mv
// getPriceUpdates topic_pricing_-xk3033
// getPriceUpdates topic_pricing_3mzhcm
// getPriceUpdates topic_pricing_cuf4y9
// getPriceUpdates topic_pricing_2povb0
// getPriceUpdates topic_pricing_-fe6psb
// getPriceUpdates topic_pricing_kpnk84
// getPriceUpdates topic_pricing_cx2eww

  const ulgyMap = {};
  let currencyPair = '';

  function subscribe(session, topicName) {
    let topic = topicName === 'status' ? 'status' : `topic_${topicName}_` + (Math.random() * Math.pow(36, 8) << 0).toString(36);
    ulgyMap[topicName] = topic;

    session.subscribe(topic, response => {
      const reponseObj = response[0];
      console.log('RESPONSE ', topic, ulgyMap[reponseObj.Type], response[0]);

      if(reponseObj.Updates) {
        currencyPair = reponseObj.Updates[0].CurrencyPair.Symbol;
      } else if (reponseObj.Type === 'pricing') {
        let remoteProcedure = reponseObj.Instance + '.' + 'getPriceUpdates';
        const obs = requestResponse(session, remoteProcedure, {}, ulgyMap[reponseObj.Type]);        
      } else if (reponseObj.Type === 'reference') {
        let remoteProcedure = reponseObj.Instance + '.' + 'getCurrencyPairUpdatesStream';
        const obs = requestResponse(session, remoteProcedure, {}, ulgyMap[reponseObj.Type]);
        obs.subscribe((data) => {
          console.warn(data);
        });
      }
    }).then((sub) => {
      console.log('Subscription started ', sub);

      // subscription succeeded, subscription is an instance of autobahn.Subscription
      // _log.verbose(`subscription acked on topic [${topic}]`);
      // subscription = sub;
    }, (error) => {
      // subscription failed, error is an instance of autobahn.Error
      throw new Error(error);
    });

  }

  /**
   * wraps a RPC up as an observable stream
   * @param remoteProcedure
   * @param payload
   * @param replyTo
   * @returns {Observable}
   */
  function requestResponse(session, remoteProcedure, payload, replyTo = '') {
    return Rx.Observable.create(o => {
      // _log.debug(`Doing a RPC to [${remoteProcedure}]. Is connected [${_this._isConnected}]`);

      //const disposables = new Rx.CompositeDisposable();
      
      const isDisposed = false;
      const dto = [{
        replyTo,
        Username: 'asadasdsd', // TODO: use fake users list
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
