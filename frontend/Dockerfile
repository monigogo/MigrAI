FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine-slim
RUN echo "server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files \$uri \$uri/ /index.html; \
    } \
    location /api/ { \
        proxy_pass \${# ===== ETAPA 1: Construcción =====
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* bun.lockb* ./
RUN npm install
COPY . .
RUN npm run build

# ===== ETAPA 2: Servidor =====
FROM nginx:alpine-slim

RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
    location /api/ { \
        proxy_pass https://migrai.sliplane.app/api/; \
        proxy_set_header Host migrai.sliplane.app; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_buffering off; \
        proxy_cache off; \
    } \
}' > /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]}; \
        proxy_set_header Host \$host; \
        proxy_set_header X-Real-IP \$remote_addr; \
        proxy_buffering off; \
        proxy_cache off; \
    } \
}" > /etc/nginx/conf.d/default.conf.template

COPY nginx-start.sh /nginx-start.sh
RUN chmod +x /nginx-start.sh

COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["/nginx-start.sh"]
