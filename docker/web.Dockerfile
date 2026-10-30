# syntax=docker/dockerfile:1
# Build context: repo root.
FROM node:22-slim AS base
ENV PNPM_HOME=/pnpm PATH=/pnpm:$PATH
RUN corepack enable
WORKDIR /repo

FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/ui/package.json packages/ui/package.json
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm install --frozen-lockfile --filter @selfplan/web... --ignore-scripts

# Dev: source is bind-mounted by docker-compose, nuxt dev reloads.
FROM deps AS dev
COPY apps/web apps/web
COPY packages/ui packages/ui
RUN pnpm --filter @selfplan/web exec nuxt prepare
WORKDIR /repo/apps/web
ENV HOST=0.0.0.0
CMD ["pnpm", "dev"]

FROM dev AS build
WORKDIR /repo
RUN pnpm --filter @selfplan/web build

FROM node:22-slim AS prod
# npm, npx a corepack se za běhu nepoužívají; bez nich je menší útočná plocha a méně nálezů ve skenerech.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack \
  /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000
WORKDIR /app
COPY --from=build /repo/apps/web/.output ./.output
USER node
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
