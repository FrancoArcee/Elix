#!/bin/sh
set -e

echo "⏳ Waiting for PostgreSQL..."
until npx prisma db push > /dev/null 2>&1; do
  echo "  Database not ready, retrying in 2s..."
  sleep 2
done

echo "✅ Database ready & schema synced."

echo "🌱 Seeding database..."
npm run prisma:seed

echo "🚀 Starting dev server..."
exec npm run dev
