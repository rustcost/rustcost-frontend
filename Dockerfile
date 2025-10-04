FROM node:24-alpine3.21 AS build

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN yarn install --frozen-lockfile

COPY . .

ARG VITE_BACKEND_URL=http://127.0.0.1:5000
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

RUN yarn build && find /app/dist -name "*.map" -delete

FROM nginx:1.29.1-alpine AS serve

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Fix permissions for non-root nginx
RUN mkdir -p /var/cache/nginx /var/run /var/log/nginx /run \
    && chown -R nginx:nginx /var/cache/nginx /var/run /var/log/nginx /run

USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
