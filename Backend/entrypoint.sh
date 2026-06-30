#!/bin/sh
set -e

echo "[startup] Running migrations..."
python manage.py migrate --noinput

echo "[startup] Seeding data (60 000 keywords + 90 days metrics + annotations)..."
echo "[startup] This takes ~60 s on first boot. Subsequent restarts skip this step."
python manage.py seed_data --skip-if-exists

echo "[startup] All done. Starting application..."
exec "$@"
