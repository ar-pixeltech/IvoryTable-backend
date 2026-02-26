/*
  Warnings:

  - The `paymentMethod` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `price` on the `OrderItem` table. All the data in the column will be lost.
  - Added the required column `closeAt` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discountAmount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subTotal` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxAmount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipAmount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPrice` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('RESTAURANT', 'RETAILER', 'FURNITURE', 'SALON', 'SANITARY', 'OTHER');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('DINE_IN', 'TAKEAWAY', 'DILIVERY', 'RETAIL');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('DRAFT', 'PLACED', 'IN_PROGRESS', 'READY', 'COMPLETED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PARTIAL', 'PAID');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'UPI', 'CARD');

-- CreateEnum
CREATE TYPE "OrderItemStatus" AS ENUM ('PLACED', 'IN_PROGRESS', 'SERVED', 'CANCELLED', 'REFUNDED');

-- AlterTable
ALTER TABLE "MenuCategory" ADD COLUMN     "parentId" TEXT;

-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "costPrice" DOUBLE PRECISION,
ADD COLUMN     "icon" TEXT,
ADD COLUMN     "taxRate" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "closeAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "discountAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "isRefunded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "orderType" "OrderType" NOT NULL DEFAULT 'DINE_IN',
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "refundAmount" DOUBLE PRECISION,
ADD COLUMN     "refundReason" TEXT,
ADD COLUMN     "refundedAt" TIMESTAMP(3),
ADD COLUMN     "subTotal" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "tableId" TEXT,
ADD COLUMN     "taxAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "tipAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'CASH',
DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "price",
ADD COLUMN     "isRefunded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "refundAmount" DOUBLE PRECISION,
ADD COLUMN     "refundReason" TEXT,
ADD COLUMN     "refundedAt" TIMESTAMP(3),
ADD COLUMN     "status" "OrderItemStatus" NOT NULL DEFAULT 'PLACED',
ADD COLUMN     "unitPrice" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "StoreSettings" ADD COLUMN     "currency" TEXT DEFAULT 'INR',
ADD COLUMN     "fssaiNumber" TEXT,
ADD COLUMN     "logoURL" TEXT,
ADD COLUMN     "timezone" TEXT DEFAULT 'Asia/Kolkata';

-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "businessType" "BusinessType";

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "sku" TEXT,
    "barcode" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "color" TEXT,
    "size" TEXT,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Table" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "vendorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Table_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MenuCategory" ADD CONSTRAINT "MenuCategory_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "MenuCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Table" ADD CONSTRAINT "Table_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table"("id") ON DELETE SET NULL ON UPDATE CASCADE;
