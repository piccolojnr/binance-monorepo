# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ---- deps: install workspace dependencies ----
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/page/package.json apps/page/package.json
COPY packages/db/package.json packages/db/package.json
RUN pnpm install --frozen-lockfile --ignore-scripts

# ---- build: generate prisma client and build the app ----
FROM deps AS build
COPY . .
RUN pnpm --filter @binance/db build
# placeholder so `next build` has a datasource url; real one is injected at runtime
ARG DATABASE_URL=postgresql://postgres:postgres@localhost:5432/binance
ENV DATABASE_URL=$DATABASE_URL
# branding is inlined at build time — must be set when building a per-platform image
ARG NEXT_PUBLIC_PLATFORM=binance
ENV NEXT_PUBLIC_PLATFORM=$NEXT_PUBLIC_PLATFORM
RUN pnpm --filter page build

# ---- runner ----
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app /app
EXPOSE 3000
WORKDIR /app/apps/page
CMD ["pnpm", "start"]