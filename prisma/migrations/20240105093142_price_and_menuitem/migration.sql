/*
  Warnings:

  - Made the column `price` on table `MenuItem` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MenuItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL,
    "category" TEXT NOT NULL,
    "price" INTEGER NOT NULL
);
INSERT INTO "new_MenuItem" ("available", "category", "description", "id", "image", "name", "price") SELECT "available", "category", "description", "id", "image", "name", "price" FROM "MenuItem";
DROP TABLE "MenuItem";
ALTER TABLE "new_MenuItem" RENAME TO "MenuItem";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
