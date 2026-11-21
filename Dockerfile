# syntax=docker/dockerfile:1
FROM node:26.13.0-alpine3.24 AS base
WORKDIR /app
ENV npm_config_store_dir=/pnpm/store
RUN npm install -g pnpm@12.18.0
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

# prod and full installs run in parallel under BuildKit
FROM base AS deps
RUN --mount=type=cache,target=/pnpm/store \
    pnpm install --prod --frozen-lockfile

FROM base AS builder
RUN --mount=type=cache,target=/pnpm/store \
    pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM node:26.13.0-alpine3.24 AS runner
WORKDIR /app
ENV NODE_ENV=production

# --chown avoids a second full copy of node_modules that `chown -R` would create
COPY --chown=node:node --from=deps /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/build ./build
COPY --chown=node:node --from=builder /app/package.json ./package.json

USER node
EXPOSE 3000
CMD ["node", "build"]
