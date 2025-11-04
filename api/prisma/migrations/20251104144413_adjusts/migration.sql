/*
  Warnings:

  - You are about to drop the column `signature` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `branchId` on the `Equipment` table. All the data in the column will be lost.
  - You are about to drop the column `branchId` on the `Study` table. All the data in the column will be lost.
  - You are about to drop the `AuditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Branch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Report` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[idMedico]` on the table `Doctor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idMedico` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doctorId` to the `Study` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."AuditLog" DROP CONSTRAINT "AuditLog_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Branch" DROP CONSTRAINT "Branch_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Doctor" DROP CONSTRAINT "Doctor_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Equipment" DROP CONSTRAINT "Equipment_branchId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Report" DROP CONSTRAINT "Report_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Report" DROP CONSTRAINT "Report_studyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Study" DROP CONSTRAINT "Study_branchId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Subscription" DROP CONSTRAINT "Subscription_organizationId_fkey";

-- DropIndex
DROP INDEX "public"."Doctor_userId_key";

-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "signature",
DROP COLUMN "userId",
ADD COLUMN     "idMedico" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "organizationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Equipment" DROP COLUMN "branchId";

-- AlterTable
ALTER TABLE "Study" DROP COLUMN "branchId",
ADD COLUMN     "doctorId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."AuditLog";

-- DropTable
DROP TABLE "public"."Branch";

-- DropTable
DROP TABLE "public"."Report";

-- DropTable
DROP TABLE "public"."Subscription";

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_idMedico_key" ON "Doctor"("idMedico");

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Study" ADD CONSTRAINT "Study_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
