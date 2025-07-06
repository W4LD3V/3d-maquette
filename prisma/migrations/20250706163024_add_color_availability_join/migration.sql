/*
  Warnings:

  - You are about to drop the column `inStock` on the `Color` table. All the data in the column will be lost.
  - You are about to drop the column `inStock` on the `PlasticType` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Color" DROP COLUMN "inStock";

-- AlterTable
ALTER TABLE "PlasticType" DROP COLUMN "inStock";

-- CreateTable
CREATE TABLE "PlasticColorAvailability" (
    "id" TEXT NOT NULL,
    "plasticTypeId" TEXT NOT NULL,
    "colorId" TEXT NOT NULL,
    "inStock" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PlasticColorAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlasticColorAvailability_plasticTypeId_colorId_key" ON "PlasticColorAvailability"("plasticTypeId", "colorId");

-- AddForeignKey
ALTER TABLE "PlasticColorAvailability" ADD CONSTRAINT "PlasticColorAvailability_plasticTypeId_fkey" FOREIGN KEY ("plasticTypeId") REFERENCES "PlasticType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlasticColorAvailability" ADD CONSTRAINT "PlasticColorAvailability_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
