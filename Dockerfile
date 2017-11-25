FROM node:9-alpine

RUN mkdir /app
WORKDIR /app
COPY ./files/package.json /app
RUN npm install

COPY ./files /app

EXPOSE 4321

CMD ["npm", "start"]
