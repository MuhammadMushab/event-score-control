FROM node:20-alpine

WORKDIR /usr/src/app

COPY . .

EXPOSE 25666

CMD ["node", "server.js"]
