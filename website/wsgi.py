"""
WSGI config for website project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'website.settings')

application = get_wsgi_application()
app = get_wsgi_application()

from whitenoise import WhiteNoise
from pathlib import Path

# Point this to your MEDIA_ROOT
BASE_DIR = Path(__file__).resolve().parent.parent
MEDIA_ROOT = BASE_DIR / "media"

# Wrap Django with WhiteNoise, serving media/ URLs directly
application = WhiteNoise(
    app,
    root=str(MEDIA_ROOT),
    prefix="media/"
)