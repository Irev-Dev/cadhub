-- CreateTable
CREATE TABLE "SocialCard" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "url" TEXT,
    "outOfDate" BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SocialCard_projectId_unique" ON "SocialCard"("projectId");

-- AddForeignKey
ALTER TABLE "SocialCard" ADD FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
