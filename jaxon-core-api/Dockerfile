# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm using corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma/

# Install dependencies
RUN pnpm install

# Copy source (assuming src will exist or creating a dummy if needed)
COPY . .

# Generate Prisma client
RUN pnpm prisma generate

# Final stage
FROM node:20-alpine

WORKDIR /app

# Install pnpm in final stage
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy built assets and necessary files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml* ./
COPY --from=builder /app/prisma ./prisma/
COPY --from=builder /app ./

EXPOSE 3001

# Command to start the app (adjust based on entry point)
CMD ["pnpm", "run", "dev"]
