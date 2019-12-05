# Perform build in the "nodebuild" container
FROM node:carbon as nodebuild
RUN npm install -g yarn @angular/cli@7
WORKDIR /srv/app/

# Raise NodeJS memory limit and build up some helpers
ARG MEM_LIMIT=2048
ENV NODE="node --max_old_space_size=$MEM_LIMIT" \
    YARN="$NODE /usr/local/bin/yarn" \
    NG="$NODE ./node_modules/@angular/cli/bin/ng"

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
