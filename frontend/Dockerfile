# ===== ETAPA 1: Construcción =====
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# ===== ETAPA 2: Servidor =====
FROM nginx:alpine-slim

# Generamos la configuración proxy adecuada para despliegues como Render/Sliplane
RUN echo "server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files \$uri \$uri/ /index.html; \
    } \
    location /api/ { \
        proxy_pass \${BACKEND_URL}; \
        proxy_ssl_server_name on; \
        proxy_set_header X-Real-IP \$remote_addr; \
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for; \
    } \
}" > /etc/nginx/conf.d/default.conf.template

COPY nginx-start.sh /nginx-start.sh
RUN chmod +x /nginx-start.sh

COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["/nginx-start.sh"]
