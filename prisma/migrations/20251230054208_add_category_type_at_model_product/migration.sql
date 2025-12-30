-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('FOOD', 'DRINK');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "categoryType" "CategoryType" NOT NULL DEFAULT 'FOOD',
ADD COLUMN     "imageUrl" TEXT;
