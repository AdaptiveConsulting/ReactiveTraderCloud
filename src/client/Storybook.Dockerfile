FROM node:14 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --no-optional

COPY . .
RUN npx build-storybook -c .storybook -o storybook -s storybook

FROM nginx:1.19.9
COPY --from=builder /app/storybook /usr/share/nginx/html/storybook
COPY --from=builder /app/public/static /usr/share/nginx/html/static
