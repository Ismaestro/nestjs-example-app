/*
  Warnings:

  - You are about to drop the column `authorId` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - Added the required column `public` to the `Hero` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Hero" DROP CONSTRAINT "Hero_authorId_fkey";

-- AlterTable
ALTER TABLE "Hero" DROP COLUMN "authorId",
DROP COLUMN "published",
ADD COLUMN     "public" BOOLEAN NOT NULL,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role";

-- DropEnum
DROP TYPE "Role";

-- AddForeignKey
ALTER TABLE "Hero" ADD CONSTRAINT "Hero_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
