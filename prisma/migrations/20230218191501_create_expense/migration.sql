-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('YEARLY', 'DAILY', 'MONTHLY', 'ONETIME');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('GENERAL');

-- CreateTable
CREATE TABLE "Expense" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "frequency" "Frequency" NOT NULL DEFAULT 'ONETIME',
    "description" TEXT NOT NULL,
    "payee" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "businessId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "category" "Category" NOT NULL DEFAULT 'GENERAL',
    "memo" TEXT,
    "amortized" BOOLEAN NOT NULL DEFAULT false,
    "currency" VARCHAR(3) NOT NULL,
    "imageUrl" TEXT,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
