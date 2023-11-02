FROM node:18-alpine


WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
COPY . .
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=development
ENV PORT=3000

RUN npm run build
RUN npx prisma generate
CMD [ "npm", "start" ]
