/*
  Warnings:

  - You are about to drop the column `nights` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `pricePerNight` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `receipt` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `TotalNights` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pernightCharge` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "TotalNights" INTEGER NOT NULL,
ADD COLUMN     "pernightCharge" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "nights",
DROP COLUMN "pricePerNight",
DROP COLUMN "receipt";
