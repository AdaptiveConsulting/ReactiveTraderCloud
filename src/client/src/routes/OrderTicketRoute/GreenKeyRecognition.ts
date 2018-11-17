/* GreenKey Sample Phrases
 
  test: (1)
  transcript: netflix twenty five at two million for r b c
  product: Netflix 25
  quantity: 2M
  client: RBC

  test: (2)
  transcript: verizon twenty two at five million for barclays
  product: Verizon 22
  quantity: 5M
  client: Barclays

  test: (3)
  transcript: apple twenty three at ten million for j p
  product: Apple 23
  quantity: 10M
  client: JP

  test: (4)
  transcript: snap twenty four at eight million for jeffries
  product: Snap 24
  quantity: 8M
  client: Jeffries

  test: (5)
  transcript: tesla twenty at one million for b n y
  product: Tesla 20
  quantity: 1M
  client: BNY

  test: (6)
  transcript: tesla twenty four at two and a half million for b n y
  product: Tesla 24
  quantity: 2.5M
  client: BNY

*/

export const interval = 160

export interface WebSocketProps {
  serviceURI?: string
  contentType?: string
}

interface SocketConfig {
  serviceURI?: string
  contentType?: string
  onclose?: (event: CloseEvent) => void
  onerror?: (event: Event) => void
  onmessage?: (event: MessageEvent) => void
  onopen?: (event: Event) => void
}

export function createWebSocket(config: SocketConfig = {}): WebSocket {
  config = {
    serviceURI: process.env.REACT_APP_GREENKEY_URL || 'ws://localhost:8888/client/ws/speech',
    contentType: 'audio/webm',
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
      if (config.onopen) {
        config.onopen(event)
      }
    },
    onclose(event: CloseEvent) {
      if (config.onclose) {
        config.onclose(event)
      }
    },
    onerror(event: Event) {
      if (config.onerror) {
        config.onerror(event)
      }
    },
  })
}

export type Intents = Array<{ entities: any[]; label: string; probability: number }>

export interface Result {
  intents: string[]
  is_quote: boolean
  num_quotes: number
  quote_confidence: number
  interpreted_quote: InterpretedQuote
  final: boolean
  result?: {
    final: boolean
    hypothesis: any[]
    intents: Intents
  }
}

export interface InterpretedQuote {
  instrumentId: any
  imString: string
  product: string
  terms: string[]
  ask2: string
  int: string
  bid: string
  ask: string
  bid2: string
  currency: null | string
  lf: string
  forward: null | string
  hedge: {
    roduct: string
    price: string
    state: false
    quantity: string
  }
  quantity: {
    ask: string
    bid: string
  }
  structure: string
  strike: string
}
