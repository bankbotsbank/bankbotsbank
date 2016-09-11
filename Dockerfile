# https://hub.docker.com/_/node/
FROM node:6.5

# Updating ubuntu packages
RUN apt-get update

# Installing the packages needed to run Nightmare
RUN apt-get install -y \
  xvfb \
  x11-xkb-utils \
  xfonts-100dpi \
  xfonts-75dpi \
  xfonts-scalable \
  xfonts-cyrillic \
  x11-apps \
  clang \
  libdbus-1-dev \
  libgtk2.0-dev \
  libnotify-dev \
  libgnome-keyring-dev \
  libgconf2-dev \
  libasound2-dev \
  libcap-dev \
  libcups2-dev \
  libxtst-dev \
  libxss1 \
  libnss3-dev \
  gcc-multilib \
  g++-multilib

ENV DEBUG="nightmare"

# Add current directory to /app
# https://docs.docker.com/engine/reference/builder/#add
ADD . /app

# Set current working directory as /app
WORKDIR /app

RUN npm install
RUN npm run build

# Required by AWS Beanstalk
# http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_docker_image.html#create_deploy_docker_image_dockerfile
# https://docs.docker.com/engine/reference/builder/#expose
EXPOSE 5000

CMD ["/bin/sh", "-c", "/usr/bin/xvfb-run --server-args=\"-screen 0 1024x768x24\" npm run start"]
