FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
RUN npm ci

COPY . .
ARG DATABASE_DIRECT_URL=postgresql://placeholder:placeholder@placeholder/placeholder
ENV DATABASE_DIRECT_URL=${DATABASE_DIRECT_URL}
RUN npx prisma generate
RUN npm run build


FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma


EXPOSE 3001

CMD ["node", "dist/index.js"]






