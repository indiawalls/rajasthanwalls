# Multi-Stage Production Dockerfile for Next.js (Standalone Mode)
FROM node:20-alpine AS base
WORKDIR /app

# Step 1: Dependencies installation stage
FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# Step 2: Build stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments for public env variables (inlined into client bundle)
ARG NEXT_PUBLIC_SITE_URL=https://rajasthanwall.com
ARG NEXT_PUBLIC_IMAGES=https://rajasthanwall.com/images
ARG NEXT_PUBLIC_WHATSAPP_NUMBER=919950711475

ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_IMAGES=$NEXT_PUBLIC_IMAGES
ENV NEXT_PUBLIC_WHATSAPP_NUMBER=$NEXT_PUBLIC_WHATSAPP_NUMBER
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Disable strict ESLint failure during docker build to ensure reliable build
RUN npm run build

# Step 3: Minimal production runner stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy static assets and standalone build output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
