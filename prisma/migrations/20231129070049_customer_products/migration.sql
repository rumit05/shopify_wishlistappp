/*
  Warnings:

  - You are about to drop the `procustomer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "procustomer";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "procustomers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerid" TEXT NOT NULL,
    "customename" TEXT NOT NULL,
    "productids" TEXT NOT NULL,
    "productname" TEXT NOT NULL,
    "productImage" TEXT NOT NULL,
    "productalt" TEXT NOT NULL,
    "productcount" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
