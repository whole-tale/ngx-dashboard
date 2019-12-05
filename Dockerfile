# Docker image for WT production build.
#
# Build: docker build -t bodom0015/ng-dashboard:wt -f Dockerfile .
# Usage: docker run --rm -it bodom0015/ng-dashboard:wt
#
# Optionally: mount in -v /path/to/src/wt-ng-dash/dist:/usr/share/nginx/html/
#   for live updates during development
#

# Perform build in the "nodebuild" container
FROM bodom0015/ng as nodebuild
WORKDIR /srv/app/

# Install dependencies
COPY package.json yarn.lock ./
RUN $YARN install --network-timeout=360000 && \
    $YARN cache clean

# Perform an Angular production build
COPY . ./
RUN $NG build --prod

# Copy built artifacts from "nodebuild" to nginx
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=nodebuild /srv/app/dist/* /usr/share/nginx/html/
