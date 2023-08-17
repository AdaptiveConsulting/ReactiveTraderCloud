import DialogueFlow from 'dialogflow'
import { from, Observable } from 'rxjs'
import { map, mergeMap } from 'rxjs/operators'
import { SymphonyClient } from 'symphony'
import { Message } from 'symphony-api-client-node'
import uuid from 'uuid'

interface DFResultWithOriginalMessage {
  originalMessage: Message
  intentResponse: DialogueFlow.DetectIntentResponse
}

export interface IntentNumberParameter {
  numberValue: number
}

export interface IntentStringParameter {
  stringValue: string
}

const projectId = 'adaptive-trader'
const sessionId = uuid.v4()
const sessionClient = new DialogueFlow.SessionsClient()
const sessionPath = sessionClient.sessionPath(projectId, sessionId)

export function createNlpStream(symphony: SymphonyClient) {
  const createNLPRequest = (text: string) => ({
    session: sessionPath,
    queryInput: {
      text: {
        text,
        languageCode: 'en-US',
      },
    },
  })

  const intentsFromDF$: Observable<DFResultWithOriginalMessage> = symphony
    .dataEvents$()
    .pipe(
      mergeMap(originalMessage =>
        from(sessionClient.detectIntent(createNLPRequest(originalMessage.messageText))).pipe(
          map(x => ({ originalMessage, intentResponse: x[0] }))
        )
      )
    )

  return {
    intentsFromDF$,
  }
}

export type NLPServices = ReturnType<typeof createNlpStream>
