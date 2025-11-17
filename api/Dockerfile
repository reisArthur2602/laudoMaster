FROM node:24-alpine

WORKDIR /app

RUN apk add --no-cache openssl postgresql-client

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod +x .docker/entrypoint.sh

CMD [".docker/entrypoint.sh"]
