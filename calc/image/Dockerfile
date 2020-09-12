FROM python:3.8
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt update -y
RUN apt install -y mecab
RUN apt install libmecab-dev
RUN apt install -y mecab-ipadic-utf8
RUN apt install sudo
RUN apt install swig

RUN useradd -m -g sudo -b /home -s /bin/bash ubuntu -p ubuntu

#sudo git clone https://github.com/neologd/mecab-ipadic-neologd.git
#sudo ./mecab-ipadic-neologd/bin/install-mecab-ipadic-neologd
#pip install mecab-python3
#export MECABRC=/etc/mecabrc
ENV MECABRC "/etc/mecabrc"

WORKDIR /var/www
