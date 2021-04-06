FROM node:14 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --no-optional

COPY . .
RUN npm run storybook:build 

FROM nginx:1.19.9
COPY --from=builder /app/storybook/build /usr/share/nginx/html
COPY --from=builder /app/public/static /usr/share/nginx/html/static
