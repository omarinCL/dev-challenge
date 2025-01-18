FROM node:23.6.0-alpine

LABEL maintainer="Israel Vallejos"
LABEL version="1.0"
LABEL description="Logistics API for delivery schedules"

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY tsconfig.json ./

COPY src/ src/

RUN npm install typescript && npm run build

RUN mkdir -p dist/resources/database && \
    cp -r src/resources/database/* dist/resources/database/

RUN npm prune --production && \
    rm -rf node_modules/typescript

EXPOSE 3000

ENV NODE_ENV=production

CMD [ "node", "dist/app.js" ]