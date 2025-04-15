
#!/bin/bash
set -e

echo "==== DEBUGGING INFO ===="
echo "Current directory structure:"
find . -type f -name "*.ts" | sort
echo "========================"

echo "Checking for index.ts files:"
find . -name "index.ts" | sort
echo "========================"

echo "Building TypeScript again to be sure:"
npx tsc --project tsconfig.json
echo "Build output files:"
find ./dist -type f | sort
echo "========================"

echo "Waiting for database to be ready..."
sleep 5

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting application..."
if [ -f "dist/index.js" ]; then
  npm start
else
  echo "ERROR: dist/index.js not found. Looking for alternatives..."
  find ./dist -name "*.js" | head -n 1 | xargs node
fi