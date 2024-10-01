#!/usr/bin/env bash
# Exit on error
set -o errexit
export DJANGO_SETTINGS_MODULE='DentalClinic.settings'

pip install -r requirements.txt
pip install --upgrade pip
python manage.py collectstatic --no-input
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate

# Create superuser if it doesn't exist (using environment variables)
python -c "
import os
import django
from django.contrib.auth import get_user_model

# Configura Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'DentalClinic.settings')
django.setup()

User = get_user_model()
username = os.getenv('SUPERUSER_USERNAME', 'admin@example.com')
password = os.getenv('SUPERUSER_PASSWORD', 'admin')
email = os.getenv('SUPERUSER_EMAIL', 'admin@example.com')

# Create the user only if it doesn't exist
if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, password=password, email=email)
    print('Superuser created')
else:
    print('Superuser already exists')
"