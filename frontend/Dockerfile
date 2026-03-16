# ---------------------------------------------------------
# FRONTEND DOCKERFILE
# Compila con Vite y sirve con Nginx.
# ---------------------------------------------------------

# ===== ETAPA 1: Construcción (Build) =====
FROM node:20-alpine AS builder

WORKDIR /app

# Archivos de caché
COPY package.json package-lock.json* bun.lockb* ./

RUN npm install

# Copiar el resto del código
COPY . .

# Usamos la variable de entorno para inyectarla en Vite durante el build

RUN npm run build

# ===== ETAPA 2: Servidor (Producción) =====
FROM nginx:alpine-slim

# Configuracion Nginx para SPA (React Router support) y Proxy inverso
# Para evitar problemas de CORS, dirigimos las peticiones /api al backend
RUN echo "server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files \$uri \$uri/ /index.html; \
    } \
    location /api/ { \
        proxy_pass http://backend:8000; \
        proxy_set_header Host \$host; \
        proxy_set_header X-Real-IP \$remote_addr; \
        proxy_buffering off; \
        proxy_cache off; \
    } \
}" > /etc/nginx/conf.d/default.conf

# Copiar el build de Vite
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
