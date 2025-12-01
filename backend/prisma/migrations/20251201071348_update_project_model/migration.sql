/*
  Warnings:

  - You are about to drop the column `budget_max` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `budget_min` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `deadline` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "budget_max",
DROP COLUMN "budget_min",
DROP COLUMN "deadline",
DROP COLUMN "skills",
ADD COLUMN     "budget" INTEGER,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "visibility" TEXT DEFAULT 'public';
