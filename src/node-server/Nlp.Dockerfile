FROM node:alpine
WORKDIR "/app"
COPY . .
WORKDIR "/app/shared"
RUN npm install
WORKDIR "/app/nlp"
RUN npm install
CMD ["npm", "run", "start:dev"]
