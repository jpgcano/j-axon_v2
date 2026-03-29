# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm using corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy source
COPY . .

# Build Next.js app
RUN pnpm build

# Final stage
FROM node:20-alpine

WORKDIR /app

# Copy built assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml* ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./

EXPOSE 3000

# Install pnpm in final stage
RUN corepack enable && corepack prepare pnpm@latest --activate

# Command to start the app
CMD ["pnpm", "start"]
