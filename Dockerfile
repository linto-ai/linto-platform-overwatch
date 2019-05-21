FROM node

WORKDIR /usr/src/app/linto-overwatch

COPY . /usr/src/app/linto-overwatch

RUN npm install

CMD ["node", "index.js"]