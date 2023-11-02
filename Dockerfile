FROM node:18-alpine


WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
COPY . .
EXPOSE 5000

RUN npm run build
RUN npx prisma generate
RUN npx prisma migrate deploy
CMD [ "npm", "start" ]
