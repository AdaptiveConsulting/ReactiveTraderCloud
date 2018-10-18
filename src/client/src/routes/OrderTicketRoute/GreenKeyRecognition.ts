/* GreenKey Endpoints
 *
 * /dynamic/recognize
 * curl  -T ./quote_detection.mp3  "http://localhost:8783/client/dynamic/recognize"
 * 
 * ws://localhost:8783/client/ws/speech?content-type=audio/x-raw,+layout=(string)interleaved,+rate=(int)44100,+format=(string)S16LE,+channels=(int)1
 * 
 * 
 * Example phrase: dec eighteen schatz sixty four and a half offered
 */

export const interval = 160

export interface WebSocketProps {
  serviceURI?: string
  contentType?: string
}

export function createWebSocket(config: any = {}): WebSocket {
  config = {
    // serviceURI: process.env.REACT_APP_GREENKEY_URL || 'ws://localhost:8888/client/ws/speech',
    serviceURI: 'ws://localhost:8888/client/ws/speech',
    contentType: 'audio/webm;codecs=opus',
    ...config,
  }

  const url = `${config.serviceURI}?content-type=${config.contentType}`
  const socket = new WebSocket(url)
  const close = socket.close.bind(socket)

  return Object.assign(socket, {
    ...config,
    close() {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send('EOS')
      }

      return close()
    },
    onmessage(event: MessageEvent) {
      if (config.onmessage) {
        config.onmessage(event)
      }
    },
    onopen(event: Event) {
      // console.log('onopen', event)
      if (config.onopen) {
        config.onopen(event)
      }
    },
    onclose(event: CloseEvent) {
      // console.log('onclose', event)
      if (config.onclose) {
        config.onclose(event)
      }
    },
    onerror(event: Event) {
      console.log('onerror', event)
      if (config.onerror) {
        config.onerror(event)
      }
    },
  })
}

/*
  {
    intents: [] as string[],
    is_quote: true,
    num_quotes: 1,
    quote_confidence: 99.33031461009725,
    interpreted_quote: {
        instrumentId: {},
        imString: '64.5 / 18',
        product: '',
        terms: [],
        ask2: '',
        int: '',
        bid: '64.5',
        ask: '18',
        bid2: '',
        currency: null as null | string,
        lf: '',
        forward: null as null | string,
        hedge: {
        product: '',
        price: '',
        state: false,
        quantity: '',
        },
        quantity: {
        ask: '',
        bid: '',
        },
        structure: '',
        strike: '',
    } as InterpretedQuote,
    final: true,
  }
 */

export interface Result {
  intents: string[]
  is_quote: boolean
  num_quotes: number
  quote_confidence: number
  interpreted_quote: InterpretedQuote
  final: boolean
}

export interface InterpretedQuote {
  instrumentId: any
  // imString: '64.5 / 18'
  imString: string
  product: string
  terms: string[]
  // ask2: ''
  ask2: string
  // int: ''
  int: string
  // bid: '64.5'
  bid: string
  // ask: '18'
  ask: string
  // bid2: ''
  bid2: string
  currency: null | string
  // lf: ''
  lf: string
  forward: null | string
  hedge: {
    //   product: ''
    product: string
    //   price: ''
    price: string
    state: false
    //   quantity: ''
    quantity: string
  }
  quantity: {
    //   ask: ''
    ask: string
    //   bid: ''
    bid: string
  }
  // structure: ''
  structure: string
  // strike: '',
  strike: string
}
