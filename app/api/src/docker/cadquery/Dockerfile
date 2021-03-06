FROM public.ecr.aws/lts/ubuntu:20.04_stable

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update -qq
RUN apt-get -y -qq install software-properties-common dirmngr apt-transport-https lsb-release ca-certificates xvfb
RUN apt-get update -qq
RUN apt-get install -y wget

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
COPY cadquery/package*.json /var/task/
RUN npm install


# Get the distribution copy of cq-cli
RUN apt-get install -y libglew2.1
RUN wget https://github.com/CadQuery/cq-cli/releases/download/v2.2-beta.2/cq-cli-Linux-x86_64.zip
# Comment the entry above out and uncomment the one below to revert to the stable release
# RUN wget https://github.com/CadQuery/cq-cli/releases/download/v2.1.0/cq-cli-Linux-x86_64.zip
RUN unzip cq-cli-Linux-x86_64.zip

RUN chmod +x cq-cli/cq-cli

COPY cadquery/*.js /var/task/
COPY common/*.js /var/common/
COPY common/entrypoint.sh /entrypoint.sh
RUN ["chmod", "+x", "/entrypoint.sh"]
ENTRYPOINT ["sh", "/entrypoint.sh"]
CMD [ "cadquery.stl" ]
