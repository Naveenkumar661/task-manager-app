#!/usr/bin/env bash
pip install pymysql django djangorestframework djangorestframework-simplejwt django-cors-headers python-decouple gunicorn
python manage.py migrate
python manage.py collectstatic --noinput
