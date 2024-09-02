#!/bin/bash

set -e

trap 'echo -e "\033[31m✖ An error occurred. Exiting...\033[0m"; exit 1;' ERR


DATABASE_URL='postgresql://pets:pets@localhost:5555/pets?schema=public' pnpm prisma migrate reset -f
DATABASE_URL='postgresql://pets:pets@localhost:5555/pets?schema=public' pnpm prisma migrate dev

echo -e "\033[32m✔ Test Database migrated\033[0m"
