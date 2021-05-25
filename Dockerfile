# Docker image for WT production build.
#
# Build: docker build -t bodom0015/ng-dashboard:wt -f Dockerfile .
# Usage: docker run --rm -it bodom0015/ng-dashboard:wt
#
# Optionally: mount in -v /path/to/src/wt-ng-dash/dist:/usr/share/nginx/html/
#   for live updates during development
#

# Perform build in the "nodebuild" container
FROM node:fermium as nodebuild
WORKDIR /srv/app/
ARG NODE_OPTIONS=--max-old-space-size=4096
ARG TIMEOUT=360000

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --network-timeout=${TIMEOUT} && \
    yarn cache clean

# Perform an Angular production build
COPY . ./
RUN ./node_modules/@angular/cli/bin/ng build --prod --no-aot --build-optimizer false

# Copy built artifacts from "nodebuild" to nginx
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=nodebuild /srv/app/dist/* /usr/share/nginx/html/
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
