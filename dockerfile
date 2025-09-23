# -----------------------------
# Stage 1: Builder
# -----------------------------
FROM node:20-alpine AS builder

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /app

# Copy package files for caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy all source code and local .env
COPY . .
COPY .env .env

# Build Next.js app (next.config.ts will be compiled automatically)
RUN pnpm build

# -----------------------------
# Stage 2: Production Runner
# -----------------------------
FROM node:20-alpine AS runner

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /app

# Copy only production dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Copy build output from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copy .env to runner so environment variables are available at runtime
COPY --from=builder /app/.env .env

# Expose Next.js port
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production

# Start Next.js
CMD ["pnpm", "start"]

