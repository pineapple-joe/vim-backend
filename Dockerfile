FROM node:18.18.0-alpine

WORKDIR /home/docker
COPY . .

RUN npm run build

EXPOSE 8080
CMD [ "node", "index.js" ]
