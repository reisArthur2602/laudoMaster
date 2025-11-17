#!/bin/sh
set -e

echo "⏳ Aguardando o Postgres iniciar..."
until pg_isready -h db -U postgres > /dev/null 2>&1; do
  sleep 1
done

echo "✅ Postgres está pronto!"

echo "📦 Rodando Migrations..."
npx prisma generate
npx prisma migrate deploy
npx prisma db seed

echo "⚡ Gerando Build..."
npm run build

echo "🚀 Iniciando aplicação..."
npm run start
