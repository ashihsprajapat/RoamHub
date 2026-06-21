-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "listingAddress" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "listingImage" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "listingTitle" TEXT NOT NULL DEFAULT '';
