FROM ubuntu:15.10

MAINTAINER "dzirtbry" dzirtbry@gmail.com

RUN apt-get update

RUN apt-get install -y tar \
                   git \
                   curl \
                   nano \
                   wget \
                   dialog \
                   net-tools \
                   build-essential

RUN apt-get install -y python python-dev python-distribute python-pip

# Libs required for xlml
RUN apt-get install -y libxslt-dev libxml2-dev zlib1g-dev

ADD . /app

WORKDIR /app

RUN pip install -r requirements.txt

EXPOSE 5000

ENTRYPOINT ["python", "app.py"]


