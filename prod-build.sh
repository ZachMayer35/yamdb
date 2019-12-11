#!/bin/bash
set -ev
cd ./YAMDBUI
npm run build
npm run test:ci
cd ../
cp -r ./YAMDBUI/build ./ui
