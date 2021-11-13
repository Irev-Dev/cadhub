-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectReaction" DROP CONSTRAINT "ProjectReaction_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectReaction" DROP CONSTRAINT "ProjectReaction_userId_fkey";

-- DropForeignKey
ALTER TABLE "SocialCard" DROP CONSTRAINT "SocialCard_projectId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectAccessRequest" DROP CONSTRAINT "SubjectAccessRequest_userId_fkey";

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialCard" ADD CONSTRAINT "SocialCard_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectReaction" ADD CONSTRAINT "ProjectReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectReaction" ADD CONSTRAINT "ProjectReaction_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectAccessRequest" ADD CONSTRAINT "SubjectAccessRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "Project.title_userId_unique" RENAME TO "Project_title_userId_key";

-- RenameIndex
ALTER INDEX "ProjectReaction.emote_userId_projectId_unique" RENAME TO "ProjectReaction_emote_userId_projectId_key";

-- RenameIndex
ALTER INDEX "SocialCard.projectId_unique" RENAME TO "SocialCard_projectId_key";

-- RenameIndex
ALTER INDEX "User.email_unique" RENAME TO "User_email_key";

-- RenameIndex
ALTER INDEX "User.userName_unique" RENAME TO "User_userName_key";
