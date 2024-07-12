FROM python:3

ENV PYTHONUNBUFFERED=1

WORKDIR /django

RUN pip install --upgrade pip
RUN apt-get update && apt-get install -y netcat-openbsd

COPY ./requirements.txt /django/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /django/

COPY ./script.sh /django/script.sh
RUN chmod +x /django/script.sh

EXPOSE 8000

CMD ["sh", "/django/script.sh"]