# Dockerfile
FROM python:3.11-slim

# 1. System deps
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      build-essential \
      libjpeg-dev \
      libfreetype6-dev \
 && rm -rf /var/lib/apt/lists/*

# 2. Create app directory
WORKDIR /app

# 3. Copy requirements + install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copy code
COPY . .

# ───────────────────────────────────────────────────
# 5. Set dummy env-vars so collectstatic won’t crash
ENV SECRET_KEY="buildtime-secret" \
    FASTAPI_URL="http://localhost" \
    DEBUG="False" \
    ALLOWED_HOSTS="*"
# ───────────────────────────────────────────────────

# 6. Collect static files (for WhiteNoise)
RUN python manage.py collectstatic --noinput

# 7. Expose and run
EXPOSE 8000
CMD ["gunicorn", "website.wsgi:application", "--bind", "0.0.0.0:8000"]
