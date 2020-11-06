FROM node:12.19.0-alpine3.9
RUN mkdir /app
ADD . /app
WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install -g nodemon
RUN npm install -g jison
COPY . .
CMD [ "npm", "start" ]