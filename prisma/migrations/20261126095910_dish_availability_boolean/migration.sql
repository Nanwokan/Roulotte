/*
  Warnings:

  - You are about to alter the column `available` on the `Dish` table. The data in that column could be lost. The data in that column will be cast from `String` to `Boolean`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Dish" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priceCents" REAL NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "stock" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    CONSTRAINT "Dish_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Dish" ("available", "categoryId", "description", "id", "imageUrl", "name", "priceCents", "stock") SELECT "available", "categoryId", "description", "id", "imageUrl", "name", "priceCents", "stock" FROM "Dish";
DROP TABLE "Dish";
ALTER TABLE "new_Dish" RENAME TO "Dish";
CREATE UNIQUE INDEX "Dish_name_key" ON "Dish"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
