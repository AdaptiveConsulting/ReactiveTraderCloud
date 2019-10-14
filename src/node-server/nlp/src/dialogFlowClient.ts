import uuid from "uuid/v1";
import DialogFlow from "dialogflow";

const PROJECT_ID = "adaptive-trader";
const SESSION_ID = uuid();

const sessionClient = new DialogFlow.SessionsClient();
const sessionPath = sessionClient.sessionPath(PROJECT_ID, SESSION_ID);

const createRequest = (text: string) => ({
  session: sessionPath,
  queryInput: {
    text: {
      text,
      languageCode: "en-US"
    }
  }
});

export const detectIntent = (text: string) => {
  const request = createRequest(text);
  return sessionClient.detectIntent(request);
};
