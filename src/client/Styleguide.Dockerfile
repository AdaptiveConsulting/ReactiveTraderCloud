FROM node:14 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --no-optional

COPY . .
RUN npm run build

FROM nginx:1.19.9
COPY --from=builder /app/build /usr/share/nginx/html/styleguide
COPY --from=builder /app/build/static /usr/share/nginx/html/static
