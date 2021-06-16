#!/usr/bin/env sh

# Do NOT run this script in your development directory.

# build backend
npm i
npx tsc

# build frontend
cd frontend
npm i
npm run build
cd ..

# add frontend to static server
rm -rf public
cp -r frontend/build public

