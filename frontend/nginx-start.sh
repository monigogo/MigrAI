#!/bin/sh
export BACKEND_URL=${BACKEND_URL:-"http://127.0.0.1"}
# Normaliza BACKEND_URL: sin slash final y sin sufijos /api o /api/v1.
export BACKEND_URL=$(echo "$BACKEND_URL" | sed -E 's:/*$::; s:/api/v1$::; s:/api$::')

envsubst '${BACKEND_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
exec nginx -g "daemon off;"
