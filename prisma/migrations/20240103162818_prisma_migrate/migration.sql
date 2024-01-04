-- AlterTable
ALTER TABLE "User" ADD COLUMN "mobile" TEXT;

-- CreateTable
CREATE TABLE "Orders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" DATETIME NOT NULL,
    "house" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "pin" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    CONSTRAINT "Orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
