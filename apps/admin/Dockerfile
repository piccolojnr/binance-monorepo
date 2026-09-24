# syntax=docker/dockerfile:1

# ---- deps: install workspace dependencies ----
FROM oven/bun:1.4.2 AS deps
WORKDIR /app
COPY package.json bun.lock ./
COPY apps/admin/package.json apps/admin/package.json
COPY packages/db/package.json packages/db/package.json
RUN bun install --frozen-lockfile --ignore-scripts

# ---- build: generate prisma client and build the app ----
FROM deps AS build
COPY . .
RUN bun --filter @binance/db build
# placeholder so `next build` has a datasource url; real one is injected at runtime
ARG DATABASE_URL=postgresql://postgres:postgres@localhost:5432/binance
ENV DATABASE_URL=$DATABASE_URL
RUN bun --filter admin build

# ---- runner ----
FROM oven/bun:1.4.2 AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app /app
EXPOSE 3000
WORKDIR /app/apps/admin
CMD ["bun", "run", "start"]
