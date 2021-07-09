#!/bin/bash
echo 'Cleaning repo...';
rm -r node_modules yarn.lock ./frontend/yarn.lock ./frontend/node_modules;

echo 'Reinstalling dependencies...';
yarn && yarn --cwd ./frontend;

echo 'Running tests...';
yarn run test && yarn --cwd ./frontend run test;

echo 'Compiling application...';
yarn run tsc;

echo 'Deploying application...';
yarn run watch;
