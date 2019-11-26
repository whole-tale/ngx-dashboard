# Perform build in the "nodebuild" container
FROM node:carbon as nodebuild
RUN npm install -g yarn @angular/cli@7
WORKDIR /srv/app/

# Raise NodeJS memory limit and install dependencies with the higher limit
COPY package.json yarn.lock ./
ARG MEM_LIMIT=2048
RUN node --max_old_space_size=$MEM_LIMIT /usr/local/bin/yarn install --network-timeout=360000 && \
    node --max_old_space_size=$MEM_LIMIT /usr/local/bin/yarn cache clean

# Perform an Angular production build with the higher memory limit
COPY . ./
#RUN ng build --prod
RUN node --max_old_space_size=$MEM_LIMIT ./node_modules/@angular/cli/bin/ng build --prod

# Copy built artifacts from "nodebuild" to nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=nodebuild /srv/app/dist/* /usr/share/nginx/html/
