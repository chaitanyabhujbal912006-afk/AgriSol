FROM node:20-alpine AS base

# Install dependencies for sharp (image processing)
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    vips-dev

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
FROM base AS deps
RUN npm ci --only=production

# Development stage
FROM base AS development
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]

# Production stage
FROM base AS production
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Create logs directory
RUN mkdir -p logs locales

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S agrisol -u 1001
RUN chown -R agrisol:nodejs /app
USER agrisol

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:5000/health || exit 1

CMD ["node", "src/app.js"]
