FROM public.ecr.aws/lts/ubuntu:20.04_stable

ARG DEBIAN_FRONTEND=noninteractive

## install things needed to run openscad (xvfb is an important one)
RUN apt-get update -qq
# double check this below, I'm not sure we need inkscape etc
RUN apt-get -y -qq install software-properties-common dirmngr apt-transport-https lsb-release ca-certificates xvfb imagemagick unzip inkscape
RUN apt-get install -y curl wget
RUN touch /etc/apt/sources.list.d/openscad.list
RUN echo "deb https://download.opensuse.org/repositories/home:/t-paul/xUbuntu_20.04/ ./" >> /etc/apt/sources.list.d/openscad.list
RUN wget -qO - https://files.openscad.org/OBS-Repository-Key.pub | apt-key add -
RUN apt-get update -qq
RUN apt-get install -y openscad-nightly

# install node14, see comment at the to of node14source_setup.sh
ADD common/node14source_setup.sh /nodesource_setup.sh
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
ADD common/aws-lambda-rie /usr/local/bin/aws-lambda-rie
# ADD https://github.com/aws/aws-lambda-runtime-interface-emulator/releases/download/v1.0/aws-lambda-rie /usr/local/bin/aws-lambda-rie
RUN ["chmod", "+x", "/usr/local/bin/aws-lambda-rie"]

WORKDIR /var/task/
COPY openscad/package*.json /var/task/
RUN npm install

# Install OpenSCAD libraries
# It's experimental, so only adding latest Round-Anything for now
RUN echo "OPENSCADPATH=/var/task/openscad" >>/etc/profile && \
  wget -P /var/task/openscad/ https://github.com/Irev-Dev/Round-Anything/archive/refs/tags/1.0.4.zip && \
  unzip /var/task/openscad/1.0.4
# Add our own theming (based on DeepOcean with a different "background" and "opencsg-face-back")
COPY openscad/cadhubtheme.json /usr/share/openscad-nightly/color-schemes/render/

RUN echo "cadhub-concat-split" > /var/task/cadhub-concat-split

COPY openscad/*.js /var/task/
COPY common/*.js /var/common/
COPY common/entrypoint.sh /entrypoint.sh
RUN ["chmod", "+x", "/entrypoint.sh"]

ENTRYPOINT ["sh", "/entrypoint.sh"]
CMD [ "openscad.render" ]
