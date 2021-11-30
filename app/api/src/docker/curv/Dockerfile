FROM public.ecr.aws/lts/ubuntu:20.04_stable

ARG DEBIAN_FRONTEND=noninteractive


RUN apt-get update --fix-missing -qq
RUN apt-get update --fix-missing && apt-get -y -qq install software-properties-common dirmngr apt-transport-https lsb-release ca-certificates xvfb

RUN apt-get update -qq

RUN apt-get -y -qq install git \
    software-properties-common \
    xvfb unzip maim clang cmake \
    git-core libboost-all-dev \
    libopenexr-dev libtbb-dev \
    libglm-dev libpng-dev \
    libeigen3-dev dbus-x11 \
    libxcursor-dev libxinerama-dev \
    libxrandr-dev libglu1-mesa-dev \
    libgles2-mesa-dev libgl1-mesa-dev \
    libxi-dev

# Use commit to make sure build is reproduceable
RUN git clone --recursive https://github.com/curv3d/curv && \
    cd curv && \
    git checkout b849eb57fba121f9f218dc065dc1f5ebc619836d && \
    make && make install

# install node14, see comment at the top of node14source_setup.sh
ADD src/docker/common/node14source_setup.sh /nodesource_setup.sh
RUN ["chmod", "+x", "/nodesource_setup.sh"]
RUN bash nodesource_setup.sh
RUN apt-get install -y nodejs

# Install aws-lambda-cpp build dependencies, this is for the post install script in aws-lambda-ric (in package.json)
RUN apt-get update && \
    apt-get install -y \
    g++ \
    make \
    cmake \
    unzip \
    automake autoconf libtool \
    libcurl4-openssl-dev

# Add the lambda emulator for local dev, (see entrypoint.sh for where it's used),
# I have the file locally (gitignored) to speed up build times (as it downloads everytime),
# but you can use the http version of the below ADD command or download it yourself from that url.
ADD src/docker/common/aws-lambda-rie /usr/local/bin/aws-lambda-rie
# ADD https://github.com/aws/aws-lambda-runtime-interface-emulator/releases/download/v1.0/aws-lambda-rie /usr/local/bin/aws-lambda-rie
RUN ["chmod", "+x", "/usr/local/bin/aws-lambda-rie"]

WORKDIR /var/task/
COPY package*.json /var/task/
RUN npm install
RUN npm install aws-lambda-ric@1.0.0

RUN echo "cadhub-concat-split" > /var/task/cadhub-concat-split

# using built javascript from dist
# run `yarn rw build` before bulding this image
COPY dist/docker/curv/* /var/task/js/
COPY dist/docker/common/* /var/task/common/
COPY src/docker/common/entrypoint.sh /entrypoint.sh
RUN ["chmod", "+x", "/entrypoint.sh"]

ENTRYPOINT ["sh", "/entrypoint.sh"]
CMD [ "js/curv.preview" ]
