#!/bin/sh
export BACKEND_URL=${BACKEND_URL:-"http://127.0.0.1"}
# Eliminar cualquier barra diagonal al final de la URL para no romper Nginx proxy_pass
export BACKEND_URL=$(echo "$BACKEND_URL" | sed 's:/*$::')

envsubst '${BACKEND_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
exec nginx -g "daemon off;"
