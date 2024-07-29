FROM node:22-alpine3.18

COPY . /app

WORKDIR /app

RUN npm install

CMD [ "node", "index.js" ]

