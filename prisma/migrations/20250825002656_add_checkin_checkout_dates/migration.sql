/*
  Warnings:

  - Added the required column `checkInDate` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checkOutDate` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "checkInDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "checkOutDate" TIMESTAMP(3) NOT NULL;
