-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "verify" BOOLEAN NOT NULL DEFAULT false,
    "otp" TEXT,
    "vlidTime" TIMESTAMP(3),
    "totalPublicListings" INTEGER NOT NULL DEFAULT 0,
    "totalBookings" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "phoneNumber" TEXT,
    "isPhoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "phoneOtp" TEXT,
    "phoneValidTime" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" VARCHAR(500) NOT NULL,
    "userId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nights" INTEGER NOT NULL,
    "order_id" TEXT,
    "receipt" TEXT,
    "pricePerNight" DECIMAL(10,2) NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "paymentType" TEXT,
    "userId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "adharLast4" TEXT,
    "bookingId" TEXT NOT NULL,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "from" TIMESTAMP(3),
    "to" TIMESTAMP(3),
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_bookingId_key" ON "Transaction"("bookingId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guest" ADD CONSTRAINT "Guest_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
