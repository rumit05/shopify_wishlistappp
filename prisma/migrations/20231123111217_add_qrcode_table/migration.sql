/*
  Warnings:

  - You are about to drop the `productselect` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "productselect";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "procustomer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customername" TEXT NOT NULL,
    "customerid" TEXT NOT NULL,
    "productname" TEXT NOT NULL,
    "productcount" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
