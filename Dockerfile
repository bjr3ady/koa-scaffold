FROM node:7.6.0
RUN npm install pm2 -g --registry=https://registry.npm.taobao.org
RUN mkdir -p /usr/service
COPY ./package.json /usr/service/
RUN cd /usr/service && npm install --registry=https://registry.npm.taobao.org
COPY . /usr/service
EXPOSE 3002
CMD pm2 start /usr/service/server.js --no-daemon