FROM node:8.9.4-alpine

RUN npm install -g pm2
WORKDIR /app

ADD ./package.json .
RUN npm install --production

ADD ./dist ./dist
ADD ./pm2.json .

CMD ["pm2-runtime", "start", "pm2.json"]