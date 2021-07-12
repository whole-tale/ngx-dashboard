#!/bin/sh
envsubst < /usr/share/nginx/html/assets/env.template.json > /usr/share/nginx/html/assets/env.json && exec nginx -g 'daemon off;'
