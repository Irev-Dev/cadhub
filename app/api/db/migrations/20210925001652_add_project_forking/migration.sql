-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "forkedFromId" TEXT;

-- AddForeignKey
ALTER TABLE "Project" ADD FOREIGN KEY ("forkedFromId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
