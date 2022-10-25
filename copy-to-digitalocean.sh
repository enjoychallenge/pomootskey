#!/usr/bin/env bash

rsync -Pav --delete --exclude '*.map' ./out/ root@165.227.153.67:/var/www/pomootskey.enjoychallenge.tech/
