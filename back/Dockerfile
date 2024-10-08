FROM python:3.12

ENV PYTHONUNBUFFERED=1

WORKDIR /back

RUN pip install --upgrade pip
RUN apt-get update && apt-get install -y netcat-openbsd

COPY ./requirements.txt /back/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /back

COPY ./script.sh /back/script.sh
RUN chmod +x /back/script.sh

EXPOSE 8000

CMD ["sh", "/back/script.sh"]