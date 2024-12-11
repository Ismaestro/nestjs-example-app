FROM node:22 AS builder

WORKDIR /app

COPY package*.json .npmrc ./
COPY prisma ./prisma/

RUN npm ci --only=production

COPY . .

RUN npm run build

FROM node:22 AS runtime

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]
