/*
  Warnings:

  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Part` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PartReaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_partId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Part" DROP CONSTRAINT "Part_userId_fkey";

-- DropForeignKey
ALTER TABLE "PartReaction" DROP CONSTRAINT "PartReaction_partId_fkey";

-- DropForeignKey
ALTER TABLE "PartReaction" DROP CONSTRAINT "PartReaction_userId_fkey";

-- DropTable
DROP TABLE "Comment";

-- DropTable
DROP TABLE "Part";

-- DropTable
DROP TABLE "PartReaction";
