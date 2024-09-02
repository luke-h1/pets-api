#!/bin/bash
DATABASE_URL='postgresql://pets:pets@localhost:5555/pets?schema=public' pnpm prisma db execute --file=./prisma/reset.sql --schema ./prisma/schema/schema.prisma 