FROM matching_calc_image:0.1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt update -y

RUN mkdir -p /var/www
ENV MECABRC "/etc/mecabrc"
COPY ./requirements.txt /var/www
RUN pip install -r /var/www/requirements.txt

WORKDIR /var/www
ENV PYTHONPATH "/var/www:${PYTHONPATH}"

CMD ["gunicorn", "matching_app:app", "--config", "/var/www/matching_app/gunicorn.py" ]