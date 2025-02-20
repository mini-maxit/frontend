FROM node:22-alpine3.19 AS deps
WORKDIR /app

RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

FROM node:22-alpine3.19 AS builder
WORKDIR /app

RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
# Install ALL dependencies (including dev dependencies) for building
RUN pnpm install --frozen-lockfile

# Copy config files
COPY svelte.config.js vite.config.ts tsconfig.json ./

# Copy source files
COPY project.inlang ./project.inlang
COPY messages ./messages
COPY src ./src
COPY static ./static
COPY .env.example .env

RUN pnpm run build

FROM node:22-alpine3.19 AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 sveltekit

COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json

COPY --from=deps /app/node_modules ./node_modules

RUN chown -R sveltekit:nodejs /app
USER sveltekit

EXPOSE 3000
ENV NODE_ENV=production

CMD ["node", "build"]