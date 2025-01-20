FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

RUN npm run clean && npm run build

ARG PORT=3000
ENV PORT=${PORT}

CMD ["npm", "start"]

EXPOSE ${PORT}
