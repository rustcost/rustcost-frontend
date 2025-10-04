# ----------- Build Stage -----------
FROM node:24-alpine3.21 AS build

WORKDIR /app

# Install deps (including devDependencies for build)
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN yarn install --frozen-lockfile

# Copy source
COPY . .

ARG VITE_BACKEND_URL=http://localhost:5000
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# Build Vite project and remove source maps
RUN yarn build && find /app/dist -name "*.map" -delete

# ----------- Serve Stage -----------
FROM nginx:1.29.1-alpine AS serve

# Remove default html
RUN rm -rf /usr/share/nginx/html/*

# Copy built frontend from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy your custom nginx.conf (SPA + gzip + security headers + proxy)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Pre-create cache dirs and set ownership for nginx user
RUN mkdir -p /var/cache/nginx /var/run /var/log/nginx \
    && chown -R nginx:nginx /var/cache/nginx /var/run /var/log/nginx

# Run as non-root (nginx user exists by default)
USER nginx

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
