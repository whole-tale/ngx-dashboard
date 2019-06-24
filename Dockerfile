# Perform build in the "nodebuild" container
FROM node:carbon as nodebuild
RUN npm install -g yarn @angular/cli@7
WORKDIR /srv/app/
COPY package.json yarn.lock ./
RUN yarn install && yarn cache clean
COPY . ./
RUN ng build --prod

# Copy build artifacts from nodebuild
FROM nginx:alpine
COPY --from=nodebuild /srv/app/dist/* /usr/share/nginx/html/
# << Customize production nginx config here >>
