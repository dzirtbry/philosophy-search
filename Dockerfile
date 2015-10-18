FROM ubuntu:15.10

MAINTAINER dzirtbry@gmail.com

RUN apt-get update && \
    apt-get install -y python

ADD . app

