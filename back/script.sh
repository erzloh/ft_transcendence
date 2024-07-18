#!/bin/sh

echo "wait for database to setup..."
while ! nc -z db 5432; do
	sleep 1
done

sleep 5

python transcendence/manage.py makemigrations
python transcendence/manage.py migrate

echo "Starting server..."
python transcendence/manage.py runserver 0.0.0.0:8000