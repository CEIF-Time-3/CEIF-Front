# --- Estágio Base ---
FROM node:22-alpine AS base

WORKDIR /app
RUN apk add --no-cache libc6-compat

# --- Estágio Builder ---
FROM base AS builder
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build

# --- Estágio Development (Para rodar na sua máquina) ---
FROM base AS development
ENV NODE_ENV=development
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
CMD ["npm", "run", "dev"]

# --- Estágio Production Otimizado (Standalone) ---
FROM base AS production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs


RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

ENV HOSTNAME="0.0.0.0" 

CMD ["node", "server.js"]