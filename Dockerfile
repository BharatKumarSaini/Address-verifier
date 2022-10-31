FROM node:16.15.0
ENV NODE_ENV=development
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install --development
RUN node server.js
CMD [ "node", "dist/server.js" ]