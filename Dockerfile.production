FROM node:20.11.0-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

FROM base AS builder

COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm --frozen-lockfile --ignore-scripts install

RUN pnpm db:generate
RUN pnpm build

FROM base AS runner

COPY --from=builder /app /app

WORKDIR /app

RUN corepack enable

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm --prod --ignore-scripts --frozen-lockfile install

RUN apk add --no-cache bash tzdata git make clang

ENV NODE_ENV=production

EXPOSE 8000

RUN chown -R node /app

RUN pnpm db:generate

USER node 

CMD ["pnpm", "run", "start:prod"]
