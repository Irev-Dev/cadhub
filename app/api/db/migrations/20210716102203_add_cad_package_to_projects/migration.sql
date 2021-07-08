-- CreateEnum
CREATE TYPE "CadPackage" AS ENUM ('openscad', 'cadquery');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "cadPackage" "CadPackage" NOT NULL DEFAULT E'openscad';
