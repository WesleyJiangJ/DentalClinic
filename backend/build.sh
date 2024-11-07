#!/usr/bin/env bash
# Exit on error
set -o errexit
export DJANGO_SETTINGS_MODULE='DentalClinic.settings'

# Check for changes into static files
echo "Checking static files..."
if [ "$(find ./static -type f | wc -l)" -gt 0 ]; then
    echo "Running collectstatic..."
    python manage.py collectstatic --no-input
else
    echo "No static files to compile."
fi

# Run makemigrations only if there are changes to the models
echo "Checking changes in the models..."
if python manage.py makemigrations --dry-run | grep -q 'Migrations for'; then
    echo "Running makemigrations..."
    python manage.py makemigrations
else
    echo "No changes in the models."
fi

# Run makemigrations for the 'api' application only if necessary
echo "Checking changes in the 'api' app."
if python manage.py makemigrations api --dry-run | grep -q 'Migrations for'; then
    echo "Running makemigrations to api..."
    python manage.py makemigrations api
else
    echo "No changes in 'api' app."
fi

# Check for pending migrations
echo "Checking pending migrations..."
if python manage.py showmigrations | grep -q '\[ \]'; then
    echo "Running migrations..."
    python manage.py migrate --no-input
else
    echo "No migrations pending."
fi

# Create superuser if it doesn't exist (using environment variables)
python -c "
import os
import django
from django.contrib.auth import get_user_model

# Configura Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'DentalClinic.settings')
django.setup()

from django.contrib.auth.models import Group

User = get_user_model()
username = os.getenv('SUPERUSER_USERNAME', 'admin@example.com')
password = os.getenv('SUPERUSER_PASSWORD', 'admin')
email = os.getenv('SUPERUSER_EMAIL', 'admin@example.com')

# Create the user only if it doesn't exist
if not User.objects.filter(username=username).exists():
    user = User.objects.create_superuser(username=username, password=password, email=email)
    group, _ = Group.objects.get_or_create(name='PersonalGroup')
    user.groups.add(group)
    print(f'Superuser {username} added to PersonalGroup')
    print('Superuser created')
else:
    print('Superuser already exists')
"

python manage.py runserver 0.0.0.0:8000