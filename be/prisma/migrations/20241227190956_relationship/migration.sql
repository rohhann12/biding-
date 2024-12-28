-- AlterTable
ALTER TABLE "objects" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "cost_price" DROP NOT NULL,
ALTER COLUMN "selling_price" DROP NOT NULL;
