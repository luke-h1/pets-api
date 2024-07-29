/*
  Warnings:

  - You are about to drop the `_PetToTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tags` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `species` to the `Pet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_PetToTag" DROP CONSTRAINT "_PetToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_PetToTag" DROP CONSTRAINT "_PetToTag_B_fkey";

-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "species" TEXT NOT NULL,
ADD COLUMN     "tags" TEXT[];

-- DropTable
DROP TABLE "_PetToTag";

-- DropTable
DROP TABLE "tags";
