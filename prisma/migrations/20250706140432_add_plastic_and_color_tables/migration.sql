/*
  Warnings:

  - You are about to drop the column `color` on the `PrintRequest` table. All the data in the column will be lost.
  - You are about to drop the column `plasticType` on the `PrintRequest` table. All the data in the column will be lost.
  - Added the required column `colorId` to the `PrintRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plasticTypeId` to the `PrintRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PrintRequest" DROP COLUMN "color",
DROP COLUMN "plasticType",
ADD COLUMN     "colorId" TEXT NOT NULL,
ADD COLUMN     "plasticTypeId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "PlasticType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "inStock" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PlasticType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Color" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hex" TEXT,
    "inStock" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Color_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlasticType_name_key" ON "PlasticType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Color_name_key" ON "Color"("name");

-- AddForeignKey
ALTER TABLE "PrintRequest" ADD CONSTRAINT "PrintRequest_plasticTypeId_fkey" FOREIGN KEY ("plasticTypeId") REFERENCES "PlasticType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrintRequest" ADD CONSTRAINT "PrintRequest_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
