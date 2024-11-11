FROM node:22-alpine3.19 AS deps
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

FROM node:22-alpine3.19 AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml svelte.config.js vite.config.ts tsconfig.json ./
RUN pnpm install --frozen-lockfile

COPY . .

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
