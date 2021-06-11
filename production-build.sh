#!/usr/bin/env sh

# Do NOT run this script in your development directory.

# build backend
npm i
npx tsc

# build frontend
cd frontend
yarn install
yarn build
cd ..

# add frontend to static server
rm -rf public
cp -r frontend/build public

