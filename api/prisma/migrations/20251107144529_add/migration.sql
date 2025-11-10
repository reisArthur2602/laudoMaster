-- CreateEnum
CREATE TYPE "StudyType" AS ENUM ('EXTERNAL', 'ORTHANC');

-- AlterTable
ALTER TABLE "Study" ADD COLUMN     "type" "StudyType" NOT NULL DEFAULT 'ORTHANC';
