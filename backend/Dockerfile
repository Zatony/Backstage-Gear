# Multi-stage Dockerfile for backend
# Builder: install deps and compile TypeScript
FROM node:18-bullseye-slim AS builder
WORKDIR /usr/src/app

# copy package manifests first for efficient caching
COPY package.json package-lock.json* ./

# install dev deps (typescript) to build
# prefer `npm ci` for reproducible installs when lockfile exists,
# fall back to `npm install` for environments without a lockfile
RUN if [ -f package-lock.json ]; then \
			npm ci --ignore-scripts; \
		else \
			npm install --ignore-scripts; \
		fi

# copy source and build
COPY . .
RUN npm run build

# Runtime image: only production deps + compiled output
FROM node:18-bullseye-slim AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production

# copy compiled JS and package manifests
COPY --from=builder /usr/src/app/lib ./lib
COPY --from=builder /usr/src/app/package.json ./

# install only production deps (skip lifecycle scripts so build scripts don't run in runner)
RUN npm install --only=production --silent --ignore-scripts

# default port (can be overridden with --env)
EXPOSE 3000

# run the compiled server
CMD ["node", "lib/app/server.js"]