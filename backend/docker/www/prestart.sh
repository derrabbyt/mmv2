#!/usr/bin/env bash

echo "FastAPI Prestart Script Running"


if [ ! -z "$IS_DEV" ]; then
  DB_HOST=$(python -c "from urllib.parse import urlparse; print(urlparse('${DATABASE_URL}').hostname)")
  DB_PORT=$(python -c "from urllib.parse import urlparse; print(urlparse('${DATABASE_URL}').port or 5432)")  
  if [ ! -z "$DB_HOST" ]; then
    while ! nc -z ${DB_HOST} ${DB_PORT}; do
      echo "${DATABASE_URL}"
      echo "Waiting for postgres to be available at host '${DB_HOST}:${DB_PORT}'"
      sleep 1
done
  fi
fi

echo "Run Database Migrations"
python -m alembic upgrade head


if [ ! -z "$CREATE_TEST_DATA" ]; then
  echo "Creating test data..."
  python -m backend.cli test-data
fi

