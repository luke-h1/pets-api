#!/bin/bash

echo "what name should the migration be?"
read -r RESP

if [ -z "$RESP" ]; then
  echo "migration name is required"
  exit 1
fi

./node_modules/.bin/typeorm migration:generate -n $RESP
