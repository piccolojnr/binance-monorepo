# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ---- deps: install workspace dependencies ----
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/admin/package.json apps/admin/package.json
COPY packages/db/package.json packages/db/package.json
RUN pnpm install --frozen-lockfile --ignore-scripts

# ---- build: generate prisma client and build the app ----
FROM deps AS build
COPY . .
RUN pnpm --filter @binance/db build
# placeholder so `next build` has a datasource url; real one is injected at runtime
ARG DATABASE_URL=postgresql://postgres:postgres@localhost:5432/binance
ENV DATABASE_URL=$DATABASE_URL
RUN pnpm --filter admin build

# ---- runner ----
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app /app
EXPOSE 3000
WORKDIR /app/apps/admin
CMD ["pnpm", "start"]