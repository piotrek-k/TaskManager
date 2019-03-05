FROM node:10.15

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /usr/src/app/package.json
RUN npm install
RUN npm install -g @angular/cli@7.1
# peer dependecies
# RUN npm install jquery@1.9.1
# RUN npm install popper.js@^1.14.7
# RUN npm install @angular/common@>=6.0.0
# RUN npm install @angular/core@>=6.0.0
# RUN npm install rxjs@^6.0.0
# RUN npm install ajv@^6.9.1

COPY . /usr/src/app

# start app
CMD ng serve --host 0.0.0.0