FROM node:11.10-alpine as builder
WORKDIR '/app'
COPY ./package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm run storybook:build

FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/storybook/build /usr/share/nginx/html
RUN mkdir /usr/share/nginx/html/storyhtml
RUN cp /usr/share/nginx/html/index.html /usr/share/nginx/html/storyhtml/index.html
COPY --from=builder /app/build /usr/share/nginx/html