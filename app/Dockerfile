FROM python:3.8
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt update -y
#RUN apt install -y gunicorn
#RUN apt install -y python-gevent

RUN mkdir -p /var/www
COPY ./requirements.txt /var/www
RUN pip install -r /var/www/requirements.txt

COPY ./flask_app.py /var/www
COPY ./gunicorn.py /var/www
#EXPOSE 9876

WORKDIR /var/www

CMD ["gunicorn", "flask_app:app", "--config", "/var/www/gunicorn.py" ]