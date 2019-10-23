FROM node:alpine
WORKDIR "/app"
COPY shared shared
COPY nlp nlp
COPY tsconfig-base.json .
WORKDIR "/app/shared"
RUN npm install
WORKDIR "/app/nlp"
RUN npm install
RUN npm run build
CMD ["npm", "run", "start"]
