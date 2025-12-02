-- AlterTable
ALTER TABLE "User" ADD COLUMN     "aboutOrg" TEXT,
ADD COLUMN     "age" INTEGER,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "experience" INTEGER,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "organization" TEXT,
ADD COLUMN     "portfolio_url" TEXT,
ADD COLUMN     "skills" TEXT;

-- CreateTable
CREATE TABLE "Proposal" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "freelancer_id" INTEGER NOT NULL,
    "cover_letter" TEXT,
    "bid" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'pending',

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_freelancer_id_fkey" FOREIGN KEY ("freelancer_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
