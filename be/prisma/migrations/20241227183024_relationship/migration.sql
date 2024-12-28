-- CreateTable
CREATE TABLE "User" (
    "userid" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userid")
);

-- CreateTable
CREATE TABLE "objects" (
    "objectId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cost_price" INTEGER NOT NULL,
    "selling_price" INTEGER NOT NULL,
    "images" TEXT[],

    CONSTRAINT "objects_pkey" PRIMARY KEY ("objectId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
