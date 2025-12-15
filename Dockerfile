FROM node:20-alpine

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci

COPY prisma ./prisma

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL:-"mysql://user:password@localhost:3306/db"}

RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]
