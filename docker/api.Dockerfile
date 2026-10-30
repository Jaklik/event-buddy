# syntax=docker/dockerfile:1
# Build context: repo root.
FROM node:22-slim AS base
ENV PNPM_HOME=/pnpm PATH=/pnpm:$PATH
RUN corepack enable && apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /repo

FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json apps/api/package.json
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm install --frozen-lockfile --filter @selfplan/api... --ignore-scripts

# Dev: source is bind-mounted by docker-compose, nest --watch reloads.
FROM deps AS dev
COPY apps/api apps/api
RUN pnpm --filter @selfplan/api exec prisma generate
WORKDIR /repo/apps/api
CMD ["pnpm", "dev"]

FROM dev AS build
WORKDIR /repo
RUN pnpm --filter @selfplan/api build \
  && pnpm --filter @selfplan/api deploy --legacy --prod /out \
  && cd /out && node_modules/.bin/prisma generate

FROM node:22-slim AS prod
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
# npm, npx a corepack se za běhu nepoužívají; bez nich je menší útočná plocha a méně nálezů ve skenerech.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack \
  /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /out/node_modules ./node_modules
COPY --from=build /out/package.json ./
COPY --from=build /repo/apps/api/dist ./dist
COPY --from=build /repo/apps/api/prisma ./prisma
USER node
EXPOSE 4000
CMD ["node", "dist/main.js"]
