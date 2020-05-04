FROM node:alpine
WORKDIR "/app"
COPY . .
WORKDIR "/app/shared"
RUN npm install
WORKDIR "/app/priceHistory"
RUN npm ci
RUN npm run build
CMD ["npm", "run", "start"]
