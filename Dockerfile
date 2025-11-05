# Use Node.js 18 Alpine as base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies using npm
COPY package.json ./
RUN npm install

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy package files and install dependencies using npm
COPY package.json ./
RUN npm install

# Copy source code
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Set placeholder environment variables for build
ENV BRAINTREE_ENVIRONMENT=sandbox
ENV BRAINTREE_MERCHANT_ID=placeholder
ENV BRAINTREE_PUBLIC_KEY=placeholder
ENV BRAINTREE_PRIVATE_KEY=placeholder
ENV NEXT_PUBLIC_FIREBASE_API_KEY=placeholder
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=placeholder
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=placeholder
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=placeholder
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=placeholder
ENV NEXT_PUBLIC_FIREBASE_APP_ID=placeholder
ENV FIREBASE_ADMIN_PROJECT_ID=placeholder
ENV FIREBASE_ADMIN_CLIENT_EMAIL=placeholder
ENV FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKB\nxhXctbdgZATkr+iFutbao3NiLQlFV/Wy2Ka1VeAy9BzNuuGidjwBmUtKHJHHhm2P\nxnHk2xgz5jMjqh5c8WbcTnMwqTskdGIFvuAiUrNMrW3EnuPiKhSRrLrRpnEt19dX\n1FaFGABjy+E05r5ryAi9sn5Xe2cjdcz6+fHGxwxBBTkecVD6lpVdkTrjfOE6A5y\nQABHi62IWtdQbz/nEFBH4aBHjL1t7+6qqyO+Fw+SE2A5V5YzQdLFuBuORlgLrV\nxAS98JI0bVSdduiz5B+0+tmsixlxT333+hmzjWgYwVn/eYBHAHLLlpwXxw9RJh\nAgMBAAECggEBALc2lQQKs+7uZFdUBJXvVzQrAqLa1ceHu/ik+X/tD5erpLRIBWuJ\n3WoCtDRgQQzuji5l4/0N2f4YjHqtyE04aToRX/I7Q8+gVBzBZSxJq4c0rCZfug\nxmb71jqhzgiKa+TLhoVnU2+b+o/aJESYhLEF7hJ3xse8Kr7ijg9N/lAFZ6LcLa\nDEmsmAjPiCxXsR5AvXKOkdSlcCcHK6k8s+Eal9dzHc6fBj13FV/bnxF+KCRE+h\nI0x1ZnkWkuNLWPcHisIon1K+8Z/PvukSvvkiTbXfWJdAiDn34aaLxMVuTE949s\ndDY4xnVHMiMNjNlvFV8lyyBNKF+EVtN+6TOwVVECgYEA7t6iryqVgsDvuQrTmKR\nOQ4IdQ0yxR3q7d31TyBSo316vIP+tmFpwhVLN60L/P0pfg4PigFAoAm34cZhOaF\nM2pBj0lJIKKC4QpQoFHxdRR6x7+gE+q/H6Ci+K/wAi+nb2hi/nEpHBH+3xtRd\nxdXTBfsjLyyTEUih6rCuXw0CgYEAyq8aoSiB1+6g49otQjvpbFqidqmylNP4OVs\nHHufRxyOz3OG8lkqTDmFM6if7+CesiKVfSNcaTEBhyucUwRCYTlHxAoGBAOjb\nSMXGYuhb+Qf8BVdCWnHTlAacgCRXwh+W5meNtdAoGBAQoS2eD5u8r+OyHzAz\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8c\n-----END PRIVATE KEY-----"

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the public folder
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Copy startup script
COPY --chown=nextjs:nodejs start.sh ./start.sh
RUN chmod +x start.sh

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Run the application with startup script
CMD ["./start.sh"]