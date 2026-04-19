#!/bin/bash
source .env
sed "s|PINATA_GATEWAY_TOKEN|${PINATA_KEY}|g" gallery.template.js > gallery.js
echo "gallery.js built with Pinata key"
