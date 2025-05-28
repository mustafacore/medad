"""
WSGI config for website project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""
import os
from pathlib import Path
from django.core.wsgi import get_wsgi_application
from whitenoise import WhiteNoise

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'website.settings')

# 1. Get the Django WSGI app
application = get_wsgi_application()

# 2. Configure WhiteNoise to serve /media/ from your MEDIA_ROOT
BASE_DIR = Path(__file__).resolve().parent.parent
MEDIA_ROOT = BASE_DIR / 'media'

application = WhiteNoise(
    application,
    root=str(MEDIA_ROOT),
    prefix='media/'
)
