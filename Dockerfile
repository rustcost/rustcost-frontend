# ----------- Build Stage -----------
FROM node:20.17.0-alpine AS build

WORKDIR /app

# Install dependencies (better caching)
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

# Copy source (excluding unnecessary files via .dockerignore)
COPY . .

# Build Vite project and remove source maps
RUN yarn build && find /app/dist -name "*.map" -delete

# ----------- Serve Stage -----------
FROM nginx:1.27.2-alpine AS serve

# Copy built frontend from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Run as non-root user
USER nginx

# Expose port
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]