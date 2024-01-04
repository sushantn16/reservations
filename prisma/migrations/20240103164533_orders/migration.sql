/*
  Warnings:

  - You are about to drop the column `city` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `house` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `pin` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `Orders` table. All the data in the column will be lost.
  - Added the required column `compeleted` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Menu" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "Address" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "house" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "pin" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Orders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mobile" TEXT NOT NULL,
    "order" TEXT NOT NULL,
    "compeleted" BOOLEAN NOT NULL,
    CONSTRAINT "Orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Orders" ("createdAt", "id", "mobile", "userId") SELECT "createdAt", "id", "mobile", "userId" FROM "Orders";
DROP TABLE "Orders";
ALTER TABLE "new_Orders" RENAME TO "Orders";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
