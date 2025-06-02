-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameCs" TEXT NOT NULL,
    "slug" TEXT,
    "description" TEXT,
    "detailDescription" TEXT,
    "price" DECIMAL NOT NULL,
    "regularPrice" DECIMAL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'unpaid',
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
