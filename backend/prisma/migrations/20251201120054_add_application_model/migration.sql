/*
  Warnings:

  - You are about to drop the column `budget` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `visibility` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `Proposal` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Proposal" DROP CONSTRAINT "Proposal_freelancer_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Proposal" DROP CONSTRAINT "Proposal_project_id_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "budget",
DROP COLUMN "category",
DROP COLUMN "visibility",
ADD COLUMN     "budget_max" DECIMAL(12,2),
ADD COLUMN     "budget_min" DECIMAL(12,2),
ADD COLUMN     "deadline" TIMESTAMP(3),
ADD COLUMN     "skills" TEXT;

-- DropTable
DROP TABLE "public"."Proposal";

-- CreateTable
CREATE TABLE "Application" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "freelancer_id" INTEGER NOT NULL,
    "cover_letter" TEXT,
    "bid_amount" DECIMAL(12,2),
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Application_project_id_idx" ON "Application"("project_id");

-- CreateIndex
CREATE INDEX "Application_freelancer_id_idx" ON "Application"("freelancer_id");

-- CreateIndex
CREATE UNIQUE INDEX "Application_project_id_freelancer_id_key" ON "Application"("project_id", "freelancer_id");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_freelancer_id_fkey" FOREIGN KEY ("freelancer_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
