/*
  Warnings:

  - You are about to drop the column `bookingId` on the `Transaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transactionId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transactionId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_bookingId_fkey";

-- DropIndex
DROP INDEX "Transaction_bookingId_key";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "transactionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "bookingId";

-- CreateIndex
CREATE UNIQUE INDEX "Booking_transactionId_key" ON "Booking"("transactionId");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
