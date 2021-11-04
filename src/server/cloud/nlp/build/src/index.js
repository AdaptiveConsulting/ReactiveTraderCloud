"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nlp = void 0;
const uuid_1 = require("uuid");
const dialogflow_1 = require("@google-cloud/dialogflow");
const PROJECT_ID = 'adaptive-trader';
const sessionClient = new dialogflow_1.default.SessionsClient();
const createRequest = (text) => {
    const sessionId = (0, uuid_1.v1)();
    const sessionPath = sessionClient.projectAgentSessionPath(PROJECT_ID, sessionId);
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
const nlp = async (req, res) => {
    const { term } = req.query;
    if (!term) {
        res.status(400).send(new Error("Missing 'term' parameter"));
    }
    const request = createRequest(term);
    const result = await sessionClient.detectIntent(request);
    res.set('Access-Control-Allow-Origin', '*');
    res.json(result);
};
exports.nlp = nlp;
//# sourceMappingURL=index.js.map