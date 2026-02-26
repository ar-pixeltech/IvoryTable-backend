FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate
RUN npx prisma migrate deploy || true

EXPOSE 3000

CMD ["node","index.js"]