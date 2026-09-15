#!/bin/sh
set -e

echo "⏳ Syncing database schema..."
npx prisma db push --skip-generate --accept-data-loss

echo "🌱 Seeding database..."
npx prisma db seed

echo "🚀 Starting dev server..."
exec npm run dev
