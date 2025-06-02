/*
  Warnings:

  - Added the required column `billingAddress` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billingCity` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billingFirstName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billingLastName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billingPostalCode` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderNumber" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "billingFirstName" TEXT NOT NULL,
    "billingLastName" TEXT NOT NULL,
    "billingAddress" TEXT NOT NULL,
    "billingCity" TEXT NOT NULL,
    "billingPostalCode" TEXT NOT NULL,
    "deliveryFirstName" TEXT,
    "deliveryLastName" TEXT,
    "deliveryAddress" TEXT,
    "deliveryCity" TEXT,
    "deliveryPostalCode" TEXT,
    "useDifferentDelivery" BOOLEAN NOT NULL DEFAULT false,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "total" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "deliveryMethod" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "note" TEXT,
    "trackingNumber" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Order" ("address", "city", "createdAt", "customerEmail", "customerName", "customerPhone", "deliveryMethod", "firstName", "id", "items", "lastName", "note", "orderNumber", "paymentMethod", "postalCode", "status", "total", "trackingNumber", "updatedAt") SELECT "address", "city", "createdAt", "customerEmail", "customerName", "customerPhone", "deliveryMethod", "firstName", "id", "items", "lastName", "note", "orderNumber", "paymentMethod", "postalCode", "status", "total", "trackingNumber", "updatedAt" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
