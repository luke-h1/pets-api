FROM node:20.11.0-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

FROM base AS builder

ARG GIT_SHA
ENV GIT_SHA=$GIT_SHA

ARG DEPLOYED_AT
ENV DEPLOYED_AT=$DEPLOYED_AT

ARG DEPLOYED_BY
ENV DEPLOYED_BY=$DEPLOYED_BY

COPY .npmrc .
COPY package.json .
COPY pnpm-lock.yaml .
COPY pnpm-workspace.yaml .
COPY ./apps/api ./apps/api
COPY tsconfig.json ./tsconfig.json

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm --filter=@pets/api... --ignore-scripts --frozen-lockfile install

RUN pnpm --filter=@pets/api db:generate
RUN pnpm --filter=@pets/api build

FROM base AS runner

COPY --from=builder /app/.npmrc .
COPY --from=builder /app/package.json .
COPY --from=builder /app/pnpm-lock.yaml .
COPY --from=builder /app/pnpm-workspace.yaml .
COPY --from=builder /app/tsconfig.json .
COPY --from=builder /app/apps/api ./apps/api/

RUN corepack enable

WORKDIR /app/apps/api

RUN ls -lha 

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm --filter=@pets/api... --prod --ignore-scripts --frozen-lockfile install

RUN pnpm db:generate

ENV NODE_ENV=production
ENV TZ=Europe/London

USER node
CMD ["pnpm", "start"]
