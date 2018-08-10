FROM        __NODE_CONTAINER__
MAINTAINER  weareadaptive <thibault@weareadaptive.com>

COPY        client/package.json client/package.json

WORKDIR     /client

RUN         npm install

COPY        client /client

ENTRYPOINT  ["npm", "run", "build"]
# ENTRYPOINT  npm install && npm test && npm run deploy:prod
