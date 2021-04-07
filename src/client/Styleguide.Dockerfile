FROM node:14 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --no-optional

COPY . .
RUN PUBLIC_URL=/styleguide npm run build

FROM nginx:1.19.9
COPY --from=builder /app/build /usr/share/nginx/html/styleguide
