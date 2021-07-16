#!/usr/bin/env sh

# Do NOT run this script in your development directory.

# build backend
yarn install
npx tsc

# build frontend
cd frontend
yarn install
yarn run build
cd ..

# add frontend to static server
rm -rf public
cp -r frontend/build public

