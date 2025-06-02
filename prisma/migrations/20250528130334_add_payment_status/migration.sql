/*
  Warnings:

  - You are about to drop the column `paymentStatus` on the `Product` table. All the data in the column will be lost.

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
    "paymentStatus" TEXT NOT NULL DEFAULT 'unpaid',
    "deliveryMethod" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "note" TEXT,
    "trackingNumber" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Order" ("address", "billingAddress", "billingCity", "billingFirstName", "billingLastName", "billingPostalCode", "city", "createdAt", "customerEmail", "customerName", "customerPhone", "deliveryAddress", "deliveryCity", "deliveryFirstName", "deliveryLastName", "deliveryMethod", "deliveryPostalCode", "firstName", "id", "items", "lastName", "note", "orderNumber", "paymentMethod", "postalCode", "status", "total", "trackingNumber", "updatedAt", "useDifferentDelivery") SELECT "address", "billingAddress", "billingCity", "billingFirstName", "billingLastName", "billingPostalCode", "city", "createdAt", "customerEmail", "customerName", "customerPhone", "deliveryAddress", "deliveryCity", "deliveryFirstName", "deliveryLastName", "deliveryMethod", "deliveryPostalCode", "firstName", "id", "items", "lastName", "note", "orderNumber", "paymentMethod", "postalCode", "status", "total", "trackingNumber", "updatedAt", "useDifferentDelivery" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameCs" TEXT NOT NULL,
    "slug" TEXT,
    "description" TEXT,
    "detailDescription" TEXT,
    "price" DECIMAL NOT NULL,
    "regularPrice" DECIMAL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT,
    "categoryId" TEXT,
    "brand" TEXT,
    "warranty" TEXT,
    "averageRating" REAL NOT NULL DEFAULT 0,
    "totalRatings" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("averageRating", "brand", "categoryId", "createdAt", "description", "detailDescription", "id", "image", "name", "nameCs", "price", "regularPrice", "slug", "stock", "totalRatings", "updatedAt", "warranty") SELECT "averageRating", "brand", "categoryId", "createdAt", "description", "detailDescription", "id", "image", "name", "nameCs", "price", "regularPrice", "slug", "stock", "totalRatings", "updatedAt", "warranty" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
