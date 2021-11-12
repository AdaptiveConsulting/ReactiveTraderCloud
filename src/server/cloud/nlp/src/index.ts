import type {HttpFunction} from '@google-cloud/functions-framework/build/src/functions';
import {v1 as uuid} from 'uuid';
import DialogFlow from '@google-cloud/dialogflow';

const PROJECT_ID = 'adaptive-trader';

const sessionClient = new DialogFlow.SessionsClient();

const createRequest = (text: string) => {
  const sessionId = uuid();
  const sessionPath = sessionClient.projectAgentSessionPath(
    PROJECT_ID,
    sessionId
  );

  return {
    session: sessionPath,
    queryInput: {
      text: {
        text,
        languageCode: 'en-US',
      },
    },
  };
};

export const nlp: HttpFunction = async (req, res) => {
  const {term} = req.query;

  if (!term) {
    res.status(400).send(new Error("Missing 'term' parameter"));
  }

  const request = createRequest(term as string);
  const result = await sessionClient.detectIntent(request);

  res.set('Access-Control-Allow-Origin', '*');
  res.json(result);
};
