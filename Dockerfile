# Base
FROM node:10-alpine AS base
WORKDIR /usr/src/app
RUN chown node:node /usr/src/app
USER node
COPY --chown=node:node package.json package-lock.json ./

# Development
FROM base AS development
USER root
RUN apk add --no-cache git
RUN apk add --no-cache parallel
USER node
RUN npm install

# Prod builder
FROM base AS prod_builder
COPY --chown=node:node . .
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
RUN npm run build

# Production
FROM base AS production
COPY --chown=node:node . .
COPY --chown=node:node --from=prod_builder /usr/src/app/build ./build
