FROM node:alpine
WORKDIR "/app"
COPY shared shared
COPY price-history price-history
COPY tsconfig-base.json .
WORKDIR "/app/shared"
RUN npm install
WORKDIR "/app/price-history"
RUN npm install
RUN npm run build
CMD ["npm", "run", "start"]
