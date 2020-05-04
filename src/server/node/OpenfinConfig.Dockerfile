FROM node:alpine
WORKDIR "/app"
COPY . .
WORKDIR "/app/openfin-config"
RUN npm ci
RUN npm run build
CMD ["npm", "run", "start"]
