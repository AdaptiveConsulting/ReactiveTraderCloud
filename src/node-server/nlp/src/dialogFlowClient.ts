import uuid from "uuid/v1"
import DialogFlow from "dialogflow"

const PROJECT_ID = "adaptive-trader"

const sessionClient = new DialogFlow.SessionsClient()

const createRequest = (text: string) => {
  const sessionId = uuid()
  const sessionPath = sessionClient.sessionPath(PROJECT_ID, sessionId)

  return {
    session: sessionPath,
    queryInput: {
      text: {
        text,
        languageCode: "en-US"
      }
    }
  }
}

export const detectIntent = (text: string) => {
  const request = createRequest(text)
  return sessionClient.detectIntent(request)
}
