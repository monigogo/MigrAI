#!/bin/sh
export BACKEND_URL=${BACKEND_URL:-"https://migrai.sliplane.app/"}
envsubst '${BACKEND_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
exec nginx -g "daemon off;"
