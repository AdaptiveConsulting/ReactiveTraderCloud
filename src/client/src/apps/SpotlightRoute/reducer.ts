import { DetectIntentResponse } from 'dialogflow'

type State = {
  request: string
  response: DetectIntentResponse
  contacting: boolean
  readonly history: string[]
  historyPosition: number
}

type Action =
  | {
      type: 'SET_REQUEST'
      request: string
    }
  | {
      type: 'SEND_REQUEST'
      request: string
    }
  | {
      type: 'RECEIVE_RESPONSE'
      response: DetectIntentResponse
    }
  | {
      type: 'HISTORY_PREVIOUS'
    }
  | {
      type: 'HISTORY_NEXT'
    }

const HISTORY_SIZE = 20

export const initialState: State = {
  request: '',
  response: null,
  contacting: false,
  history: [],
  historyPosition: -1,
}

export function reducer(currentState: State, action: Action): State {
  switch (action.type) {
    case 'SET_REQUEST':
      return {
        ...currentState,
        request: action.request,
      }

    case 'SEND_REQUEST':
      return {
        ...currentState,
        contacting: true,
        history: [
          action.request,
          ...currentState.history
            .filter(request => request !== action.request)
            .slice(0, HISTORY_SIZE),
        ],
        historyPosition: -1,
      }

    case 'RECEIVE_RESPONSE':
      return {
        ...currentState,
        contacting: false,
        response: action.response,
      }

    case 'HISTORY_PREVIOUS':
      if (currentState.historyPosition < currentState.history.length - 1) {
        const historyPosition = currentState.historyPosition + 1
        return {
          ...currentState,
          historyPosition,
          request: currentState.history[historyPosition],
        }
      }
      return currentState

    case 'HISTORY_NEXT':
      if (currentState.historyPosition >= 0 && currentState.history.length > 0) {
        const historyPosition = currentState.historyPosition - 1
        return {
          ...currentState,
          historyPosition,
          request: historyPosition > 0 ? currentState.history[historyPosition] : '',
        }
      }
      return currentState

    default:
      return currentState
  }
}
