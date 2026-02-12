FROM node:20-bullseye-slim AS build

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

# Install dependencies
COPY package*.json ./
RUN npm install --silent

# Build
COPY . .
RUN npm run build

FROM nginx:stable-alpine

# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Use a custom nginx config to enable SPA fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
